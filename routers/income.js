const express = require('express');
const Router = express.Router();
const pool = require("../db");
const verify = require('../verifyToken');
const date = require("date-and-time");
const week_month = require("../week_month");
Router.post('/addincome', verify, async (req, res) =>{
    var now = new Date();
    // destructing the reqeust body
    const income_statement = {
        "amount":req.body.amount,
        "user":parseInt(req.user.id),
        "date":date.format(now,'DD/MM/YYYY'),
        "time":date.format(now,'hh:mm A'),
        "account":req.body.account,
        "category":req.body.category,
        "description":req.body.description
    }
    // Storing the statement in income_table
 
    const this_week = week_month.week();
    const week_date = `${this_week.sun}-${this_week.sat}`;
    const week_exist = await pool.query("SELECT EXISTS(SELECT * from weekly_income where user_id=$1 and week=$2)",[req.user.id,week_date]);
    let add_weekly_income ={};
    if(week_exist.rows[0].exists){
        const week_amount = await pool.query(
          "SELECT amount FROM weekly_income WHERE user_id=$1 and week=$2 and month=$3 and year=$4",
          [req.user.id,week_date,now.getMonth(),now.getFullYear()]
        );
        console.log(week_amount,income_statement.amount);
          add_weekly_income = await pool.query(
          "UPDATE weekly_income SET amount=$1 WHERE user_id=$2 and week=$3 and month=$4 and year=$5 RETURNING id ",
          [(parseFloat(income_statement.amount)+parseFloat(week_amount.rows[0].amount)),req.user.id, `${this_week.sun}-${this_week.sat}`,
          now.getMonth(), now.getFullYear()]
          
        );
      
    }else{
        console.log('month',now.getMonth())
        add_weekly_income = await pool.query(
          "INSERT INTO weekly_income (user_id,amount,week,month,year) VALUES($1,$2,$3,$4,$5) RETURNING id",
          [
            req.user.id,
            income_statement.amount,
            `${this_week.sun}-${this_week.sat}`,
            now.getMonth(),
            now.getFullYear()
          ]
        )
        }
          
        

    const income_record = await pool.query(`INSERT INTO income (user_id,i_date,i_time,amount,category,i_description,week_id,year,month)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [income_statement.user, now.getDate(), income_statement.time,
    income_statement.amount, income_statement.category,
    income_statement.description, add_weekly_income.rows[0].id,now.getFullYear(),now.getMonth()], (err, res) => {
      if (err)
        console.log(err);
    })



    //ADDING TO MONTHLY INCOME STATEMENT
    const this_month = week_month.month();
    const month_exist = await pool.query("SELECT EXISTS(SELECT * FROM monthly_income where user_id=$1 and month=$2)",[req.user.id,this_month]);
    if(month_exist.rows[0].exists){
      const cur_amount = await pool.query("SELECT (amount) FROM monthly_income WHERE user_id=$1 and month=$2",[req.user.id,this_month]);
      const add_amount = await pool.query("UPDATE monthly_income SET amount=$1 WHERE user_id=$2 and month=$3",
      [(parseFloat(cur_amount.rows[0].amount)+parseFloat(income_statement.amount)),
      req.user.id,this_month]);
    }else{
      const add_amount = await pool.query("INSERT INTO monthly_income (user_id,amount,month,year) VALUES ($1,$2,$3,$4)",
      [parseInt(req.user.id),parseFloat(income_statement.amount),this_month,now.getFullYear()]);
    }
    user_bal = await pool.query("SELECT balance FROM users WHERE id=$1",[req.user.id]);
    add_income = await pool.query("UPDATE users SET balance=$1 where id=$2", [parseFloat(user_bal.rows[0].balance) + income_statement.amount, req.user.id])
    

    res.json({
      'response': income_record || income_statement
    })
})


Router.get('/:month/:year', async (req, res) =>{
  const month = req.params.month;
  const year =req.params.year;
  if (month.length == 3 && year.length == 4){
    month_results = await pool.query("SELECT * FROM income WHERE month=$1 and year=$2",[month,year]); 
    
  }

})

module.exports = Router;