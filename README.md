Description: FitTrack is a fitness tracking web application that allows users to register, login, and track their fitness goals, workouts, and progress. The site offers users the ability to create a workout plan, set fitness goals, and track their physical progress over time by recording weight, measurements, and any notes. It also includes a workout database with categorized exercises for different muscle groups, making it easy to find and add workouts to their routines.

The features you implemented:

User Authentication (Signup & Login): Users can register and log in to access personalized features. This ensures data privacy and allows users to save and track their fitness progress. -Exercise Library: The website includes a database of workouts categorized by muscle group, making it way easier for users to find exercises that suit their goals.
Fitness Goal Tracker: Users can create, update, and track their fitness goals. This motivates users by allowing them to monitor their progress toward specific fitness targets.
Workout Plan Creation: Users can create personalized workout plans by selecting exercises from a library of workouts. This provides users with customized workout routines.
Progress Tracking: User can log their physical progress to see trends over time. Being able to document weight and body measurements helps users evaluate the effectiveness of their fitness plans.
These features were chosen because together it allows a user friendly approach to fitness. Being able to combine goal-setting, workout routines, and progress tracking helps users to stay motivated and achieve their fitness objectives.
Tests: located in /tests directory. Using Jest for unit testing the backend API and React Testing Library for frontend conponent tests

to run them: (backend - API testing):
navigate to project directory in terminal
run following command: npm run test: backend (frontend - Component testing):
navigate to /client directory
run following command: npm run test: frontend
Walk through the standard user flow:

Visit homepage: users are greeted with a complimentary outline of the workouts that could be used as a registered user.
Signup or Login: new users can click the “Sign Up” option to create an account by entering their details. Returning user can login providing their email and secure password.
Dashboard: After logging in, users are taken to personalized dashboard where they can:
view current fitness goals
add new goals or edit existing ones
create custom workout plans from workout library
log workout progress
Create Workout Plan: users can browse through the exercise library, filter workouts by muscle group or equipment, and create a workout plan based on their perferences
Track Progress: users can log their progress by inputting weight, body measurements, and notes. The dashboard will show trends in their physical progress over time.
Log Out: users can log out to ensure their account reamins secure
API: This project includes a custom API built using Express.js for handling user authenication, fitness goal tracking, workout management, and progress tracking. API documentation: - User Routes: - POST /users/signup: registers new user - POST /users/login: log in users - Goal Routes: - GET /api/goals: retrieve all users goals - POST /api/goals: create new goals - PUT /api/goals/:id : updates existing goal - DELETE /api/goals/:id : delete a goal - Workout Routes: - GET /api/workouts: gets all workouts - POST /api/workouts: creates new workout - Progress Tracking Routes: - GET /api/progress: gets all progress logs - POST /api/progress: logs a new progress entry - The API is designed to handle CRUD operations. All data is stored in PostgreSQL database, and passwords are securely hashed using bcrypt. - API routes are protected by JWT authenication - API uses CORS for handling requests from thr frontend.

Identify the technology stack used for website:

Frontend:
React.js for building user interface
React Router for handling routing within the app
React Testing Library for frontend component testing
CSS for styling
Backend:
Express.js for building RESTful API
Node.js for server-side Javascript
PostgresSQL for the database
bycrypt for hashing passwords
JWT (jsonwebtoken) for user authenication
Deployment:
Heroku for hosting backend
Netlify for deploying the frontend
Include anything else that is important to share:

Mobile Responsiveness: fully responsive, ensuring experiences on both desktop and mobile devices. Media queries were used to adapt the layout for smaller screens.
Future Features:
Integrating fitness trackers like Fitbit or Google Fit
Social sharing features so users can share progress and achievements online
