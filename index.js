require('dotenv').config();

const fs = require("fs/promises");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid"); 
const browseWorkouts = require("./data/workoutData");
const { client } = require('./dbConfig');


const fitnessGoalRouter = express.Router();
const progressTrackingRouter = express.Router();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}))

//app.use("/user", userRouter)
app.use("/fitnessGoals", fitnessGoalRouter);
app.use("/progressTracking", progressTrackingRouter);


let goals = []
let progress = []
let createWorkouts = []
let register = []
let login = []

// gets all registered
app.get("/users/register", (req, res) => {
    res.json(register);
}); 

// gets all users that can login
app.get("/users/login", (req, res) => {
    res.json(login);
}); 

// inserts new user into DB
app.post("/users/register", async (req, res) => {
    let { email, password } = req.body;

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const result = await client.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        const newUser = result.rows[0];
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
}); 

// gets existing users in DB with their passwords
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Compare provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json('Invalid credentials');
        }
        
        // Creates JWT token if credentials match
        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        // sends token to client
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



// API route to get all workout plans from browse workouts
app.get("/api/workouts", (req, res) => {
    res.json(browseWorkouts);
});

// get workout plan by ID
app.get('/api/workouts/:id', (req, res) => {
    const workout = browseWorkouts.find(w => w.id === parseInt(req.params.id));
    if (!workout) return res.status(404).send('Workout plan not found');
    res.json(workout);
});


// get all goals
app.get("/api/goals", (req, res) => {
    res.json(goals);
});

// create new goal
app.post('/api/goals', (req, res) => {
    const { goalType, target, timeline } = req.body;
    
    const newGoal = {
        id: uuid(),
        goalType,
        target, 
        timeline,
    };
    goals.push(newGoal);
    res.status(201).json(newGoal);
});

// get goal by ID
app.get('/api/goals/:id', (req, res) => {
    const goal = goals.find(w => w.id === req.params.id);
    if (!goal) return res.status(404).send('Goal not found!');
    res.json(goal);
});

// update goal
app.put('/api/goals/:id', (req, res) => {
    const goal = goals.find(w => w.id === req.params.id);
    if (!goal) return res.status(404).send('Goal not found!');

    const { goalType, target, timeline } = req.body;
    goal.goalType = goalType || goal.goalType;
    goal.target = target || goal.target;
    goal.timeline = timeline || goal.timeline;

    res.json(goal);
});

// delete workout
app.delete('/api/goals/:id', (req, res) => {
    const goalIdx = goals.findIndex(w => w.id === req.params.id);
    if (goalIdx === -1) return res.status(404).send('Goal not found!');

    goals.splice(goalIdx, 1);
    res.status(204).send();
});


// gets all progress
app.get("/api/trackprogress", (req, res) => {
    res.json(progress);
});

// creates new progress
app.post('/api/trackprogress', (req, res) => {
    const { date, weight, bodyMeasurements, notes } = req.body;
    const newProgress = {
        id: uuid(),
        date,
        weight, 
        bodyMeasurements,
        notes
    };
    progress.push(newProgress);
    res.status(201).json(newProgress);
});

// gets progress by ID
app.get('/api/trackprogress/:id', (req, res) => {
    const trackProgress = progress.find(w => w.id === req.params.id);
    if (!trackProgress) return res.status(404).send('Progress not found!');
    res.json(trackProgress);
});


// update progress
app.put('/api/trackprogress/:id', (req, res) => {
    const trackProgress = progress.find(w => w.id === req.params.id);
    if (!trackProgress) return res.status(404).send('Progress not found!');

    const { date, weight, bodyMeasurements, notes } = req.body;
    trackProgress.date = date || trackProgress.date;
    trackProgress.weight = weight || trackProgress.weight;
    trackProgress.bodyMeasurements = bodyMeasurements || trackProgress.bodyMeasurements;
    trackProgress.notes = notes || trackProgress.notes

    res.json(trackProgress);
});

// delete progress
app.delete('/api/trackprogress/:id', (req, res) => {
    const progressIdx = progress.findIndex(w => w.id === req.params.id);
    if (progressIdx === -1) return res.status(404).send('Progress not found!');

    progress.splice(progressIdx, 1);
    res.status(204).send();
});


// grabs all created workouts
app.get("/api/createWorkout", (req, res) => {
    res.json(createWorkouts);
});

// create new workout
app.post('/api/createWorkout', async (req, res) => {
    const { plan, type, muscle, equipment, difficulty, instructions } = req.body;
    const newWorkout = {
        id: uuid(),
        plan,
        type, 
        muscle,
        equipment, 
        difficulty, 
        instructions,
    };
    createWorkouts.push(newWorkout);
    res.status(201).json(newWorkout);
});

// get workout plan by ID
app.get('/api/createWorkout/:id', (req, res) => {
    const workout = createWorkouts.find(w => w.id === req.params.id);
    if (!workout) return res.status(404).send('Workout plan not found!');
    res.json(workout);
});

// update created workout plans
app.put('/api/createWorkout/:id', (req, res) => {
    const workout = createWorkouts.find(w => w.id === req.params.id);
    if (!workout) return res.status(404).send('Workout plan not found!');

    const { plan, type, muscle, equipment, difficulty, instructions } = req.body;
    workout.plan = plan || workout.plan;
    workout.type = type || workout.type;
    workout.muscle = muscle || workout.muscle;
    workout.equipment = equipment || workout.equipment;
    workout.difficulty = difficulty || workout.difficulty;
    workout.instructions = instructions || workout.instructions;

    res.json(workout);
});

// delete workout
app.delete('/api/createWorkout/:id', (req, res) => {
    const workoutIdx = createWorkouts.findIndex(w => w.id === req.params.id);
    if (workoutIdx === -1) return res.status(404).send('Workout plan not found!');

    createWorkouts.splice(workoutIdx, 1);
    res.status(204).send();
});


// get all users (login)
//app.get("/api/login", (req, res) => {
    //res.json(login);
//});

// create new account
//app.post('/api/login', async (req, res) => {
    //const { email, password } = req.body;
    
    // Hash password before saving
    //const salt = await bcrypt.genSalt(10);
    //const hashedPassword = await bcrypt.hash(password, salt)

    //const newUser = {
        //id: uuid(),
        //email,
        //password: hashedPassword,
    //};
    //login.push(newUser);
    //res.status(201).json(newUser);
//});
    
// get workout plan by IDß
//app.get('/api/login/:id', (req, res) => {
    //const user = login.find(w => w.id === req.params.id);
    //if (!user) return res.status(404).send('Account not found!');
    //res.json(user);
//});


app.listen(PORT, () => console.log("API on the loose!"));