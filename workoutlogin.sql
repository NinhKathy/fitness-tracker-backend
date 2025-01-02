-- in terminal:
-- psql < workoutlogin.sql
-- psql workoutlogin

DROP DATABASE IF EXISTS workoutlogin;

CREATE DATABASE workoutlogin;

\c workoutlogin;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);

INSERT INTO users
    (name, email, password)
VALUES
    ('sara', 'sara@gmail.com', 'hashedpassword'),
    ('phil', 'phil@gmail.com', 'hashedpassword');