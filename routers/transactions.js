const express = require('express');
const Router = express.Router();
const pool = require('../db')
const verify = require('../verifyToken');
const week_date = require('../week_month');

Router.get('/dailytransactions', verify, async (req, res) =>{
    const {sun,sat} = week_date.week()
    const now = new Date();
    const year = now.getFullYear();
    //console.log(year); 
    try{
        
        const this_week = await pool.query("SELECT * FROM weekly_income WHERE user_id=$1 and week=$2 and month=$3 and year=$4",[req.user.id,`${sun}-${sat}`,now.getMonth(),year]);        
        const week_exp = await pool.query("SELECT * FROM weekly_expense WHERE user_id=$1 and week=$2 and month=$3 and year=$4", [req.user.id, `${sun}-${sat}`,now.getMonth(),year]);
        if (this_week.rows.length!==0){
            const income_trans = await pool.query("SELECT i_date,amount,i_description FROM income WHERE user_id=$1 and week_id=$2 and month=$3 and year=$4",[req.user.id,this_week.rows[0].id,now.getMonth(),year]);
            const expense_trans = await pool.query("SELECT e_date,amount,e_description FROM expense WHERE user_id=$1 and week_id=$2 and month=$3 and year=$4",[req.user.id,week_exp.rows[0].id,now.getMonth(),year]);
            return res.json({
                'income': income_trans.rows,
                'expenses': expense_trans.rows
            })
        }
        else{
            return res.send({'income':[0.00],'expense':[0.00]});
        }
    }catch(e){
        res.send(e.message);
    }    
})

Router.get('/weeklytransactions', verify, async(req, res) =>{
    const now = new Date();
    const year = now.getFullYear();
    const weekly_income = await pool.query("SELECT * from weekly_income WHERE user_id=$1 and month=$2 and year=$3",[req.user.id,now.getMonth(),year]);
    const weekly_expense = await pool.query("SELECT * FROM weekly_expense WHERE user_id=$1 and month=$2 and year=$3",[req.user.id,now.getMonth(),year]);
    const response = {};
    if (weekly_income.rows.length !== 0){
        response["weekly_income"] = weekly_income.rows
    }
    else {
        response["weekly_income"] = weekly_income.rows
    }
    if (weekly_expense.rows.length !== 0){
        response["weekly_expense"] = weekly_expense.rows
    }
    else{
        response["weekly_expense"] = weekly_expense.rows
    }
    return res.json({
        'response':response
    })
})  

Router.get('/monthtransactions', verify, async(req, res) =>{
    const now = new Date();

    const year = now.getFullYear();
    const response = {};
    const monthly_income = await pool.query("SELECT * FROM monthly_income WHERE user_id=$1 and year=$2",[req.user.id,year]);
    const monthly_expense = await pool.query("SELECT * FROM monthly_expense WHERE user_id=$1 and year=$2",[req.user.id,year]);
   
    if (monthly_income.rows.length !== 0){
        response["monthly_in"] = monthly_income.rows;
    }
    else{
        response["monthly_in"] = [0];
    }
    if (monthly_expense.rows.length !== 0){
        response["monthly_exp"] = monthly_expense.rows;
    }
    else{
        response["monthly_exp"] = [0];
    }
    return res.json(response);
})
module.exports = Router;