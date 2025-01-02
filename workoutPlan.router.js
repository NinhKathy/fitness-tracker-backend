const express = require('express');
const workoutPlanRouter = express.Router();
const { WorkoutPlan } = require('../models/workoutPlan.model');
//const { authenticateTrainer } = require("../middleware/TrainerAuth")

// Create a new workout plan
workoutPlanRouter.post('/createPlan',authenticateTrainer, async (req, res) => {
  try {
    //const trainerId=req.trainerId
    const {planName,goal,duration,description}=req.body
    const workoutPlan = new WorkoutPlan({planName,goal,duration,description,trainerId});
    const savedWorkoutPlan = await workoutPlan.save();
    res.status(201).json(savedWorkoutPlan);
  } catch (error) {
    res.status(400).json({ error: 'Error creating workout plan' });
  }
});

// Get all workout plans
workoutPlanRouter.get('/workoutPlans', async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find();
    res.json(workoutPlans);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching workout plans' });
  }
});



module.exports = { workoutPlanRouter };