const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./routers/authrouter');
const income = require('./routers/income');
const expenseRouter = require('./routers/expense');
const transactions = require('./routers/transactions');

app.use(cors());

app.use(express.json());

app.use('/users',authRouter);
app.use('/user/income',income);
app.use('/user/expense',expenseRouter);
app.use('/transactions',transactions);

app.listen('8080',()=>{
    console.log("Server is running...");
})


