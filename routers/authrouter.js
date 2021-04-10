const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
//const cors = require('cors');
dotenv.config();
//To use env file
authRouter.post('/signup',async (req,res)=>{
    
    try{
        console.log("resgistration");
        const invalid = {};
        if(req.body.username.length<4){
            invalid['username'] = 'Invalid username';
        }
        if(req.body.password.length<8){
            invalid['password'] = 'password size should be 8 characters';
        }
        if (invalid['username'] || invalid['password']){
            return res.json(invalid);
        }
        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //username check
        console.log(hashedPassword);
        console.log(req.body.username)
        const name_exists = await pool.query("SELECT EXISTS(SELECT * FROM users WHERE username=$1)",[req.body.username]);
        console.log(name_exists)
        if(name_exists.rows[0]){
            return res.json({
                'error':'username already exists'
            })
        }
        const email_exists = await pool.query("SELECT EXISTS(SELECT * FROM users WHERE email=$1)",[req.body.email]);

        if(email.rows[0]){
            return res.json({
                'error':'Email id already exists'
            })
        }
        console.log(req.body.username," ",req.body.email,"  ",hashedPassword," ",hashedPassword.length);
        const register = await pool.query("INSERT INTO users(username,email,password,balance) VALUES($1,$2,$3,$4) RETURNING *",
        [req.body.username, 
        req.body.email,
        hashedPassword,0]);
        console.log(register);     
        return res.json({'success':'successfully sign up'});
    }catch(e){
        res.status(201);
    }

})

authRouter.post('/signin', async (req, res) => {
    const user = await pool.query("SELECT * FROM users WHERE email=$1",[req.body.email]);
    if (user.rows.length == 0) return res.status(400).send("email not exist");
    const password_check = await bcrypt.compare(req.body.password, user.rows[0].password);
    console.log(user);    
    if(!password_check) return res.status(200).send("Invalid password");
    const token =  jwt.sign({'id':user.rows[0].id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
})

module.exports = authRouter;