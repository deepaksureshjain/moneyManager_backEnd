const express = require('express');
const expenseRouter = express.Router();
const pool = require('../db');
const verify = require('../verifyToken');
const date = require('date-and-time');
const week_month = require('../week_month');

expenseRouter.post('/addexpense', verify, async (req, res) =>{
    try{
        const now = new Date();
        const expense_statement = {
            'amount':parseFloat(req.body.amount),
            'user':parseInt(req.user.id),
            'date':date.format(now,'DD/MM/YYYY'),
            'time':date.format(now,'HH:MM'),
            'account':req.body.account,
            'category':req.body.category,
            'description':req.body.description
        }
        //console.log(expense_statement)
        let add_exp = {};
        const this_week = week_month.week();
        const week_date = `${this_week.sun}-${this_week.sat}`;
        const week_exist = await pool.query("SELECT EXISTS(SELECT * FROM weekly_expense WHERE user_id=$1 and week=$2)",
        [req.user.id,week_date]);
        if(week_exist.rows[0].exists){
            const exp_amt = await pool.query("SELECT (amount) FROM weekly_expense WHERE user_id=$1 and week=$2 and month=$3 and year=$4",
            [expense_statement.user,week_date,now.getMonth(),now.getFullYear()]);
            add_exp = await pool.query("UPDATE weekly_expense SET amount=$1 WHERE user_id=$2 and week=$3and month=$4 and year=$5 RETURNING id",
            [(expense_statement.amount+parseFloat(exp_amt.rows[0].amount)),
            expense_statement.user,week_date,now.getMonth(),now.getFullYear()]);
            console.log(add_exp);
        }
        else{
            add_exp = await pool.query(
                "INSERT INTO weekly_expense (user_id,amount,week,month,year) VALUES($1,$2,$3,$4,$5) RETURNING *",
                [
                    expense_statement.user,
                    expense_statement.amount,
                    week_date,
                    now.getMonth(),
                    now.getFullYear()
                ], (err, res) => {
                    console.log(err, res);
                }
            );
        
        }
        const add_expense = await pool.query("INSERT INTO expense (user_id,amount,e_date,e_time,category,e_description,week_id,month,year) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
            [expense_statement.user, expense_statement.amount,
            now.getDate(), expense_statement.time,
            expense_statement.category,
            expense_statement.description,add_exp.rows[0].id,now.getMonth(),now.getFullYear()])
        const this_month = week_month.month();
        const month_exist = await pool.query("SELECT EXISTS(SELECT * FROM monthly_expense where user_id=$1 and month=$2)", [req.user.id, this_month]);
        if (month_exist.rows[0].exists) {
            const cur_amount = await pool.query("SELECT (amount) FROM monthly_expense WHERE user_id=$1 and month=$2", [req.user.id, this_month]);
            const add_monthly_amount = await pool.query("UPDATE monthly_expense SET amount=$1 WHERE user_id=$2 and month=$3",
                [(parseFloat(cur_amount.rows[0].amount) + expense_statement.amount),
                req.user.id, this_month]);
        } else {
            const add_monthly_amount = await pool.query("INSERT INTO monthly_expense (user_id,amount,month) VALUES ($1,$2,$3)",
                [parseInt(req.user.id), expense_statement.amount, this_month]);
        }
        user_bal = await pool.query("SELECT (balance) FROM users WHERE id=$1", [req.user.id]);
        console.log('bal',user_bal);
        if (user_bal.rows[0].balance) {
            add_income = await pool.query("UPDATE users SET balance=$1 where id=$2", [parseFloat(user_bal.rows[0].balance) - expense_statement.amount, req.user.id])
        }
           

        res.json({
            'response': expense_statement
        })

    }
    catch(e){
        console.log(e.message);
    }
})
module.exports = expenseRouter;