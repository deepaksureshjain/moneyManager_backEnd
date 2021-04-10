CREATE DATABASE money_manager;


CREATE TABLE users(
    id INT SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR() NOT NULL,
    token VARCHAR(40)
);


CREATE TABLE income(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
    i_time TIME NOT NULL,
    amount FLOAT NOT NULL,
    category VARCHAR(30) NOT NULL,
    i_description VARCHAR(60) NOT NULL,
    week_id INT NOT NULL,
    FOREIGN KEY(week_id) REFERENCES weekly_income(id) ON DELETE CASCADE,
    i_date VARCHAR(2) NOT NULL,
    month VARCHAR(2) NOT NULL,
    year VARCHAR(4) NOT NULL
);


CREATE TABLE weekly_income(
    id INT AUTO INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE set CASCADE,
    amount FLOAT NOT NULL,
    week VARCHAR(20) NOT NULL,
);


CREATE TABLE monthly_income(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    month VARCHAR(12) NOT NULL 
);

CREATE TABLE expense(
    id SERIAL PRIMARY KEY,
    user_id INT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    e_time TIME NOT NULL,
    category VARCHAR(30) NOT NULL,
    e_description VARCHAR(60) NOT NULL,
    week_id INT NOT NULL,
    FOREIGN KEY(week_id) REFERENCES weekly_expense(id) ON DELETE CASCADE,
    e_date VARCHAR(2) NOT NULL,
    month VARCHAR(2) NOT NULL,
    year VARCHAR(4) NOT NULL
)

CREATE TABLE weekly_expense(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    week VARCHAR(20) NOT NULL,
);

CREATE TABLE montly_expense(
    id INT AUTO INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    month VARCHAR(3) NOT NULL
);