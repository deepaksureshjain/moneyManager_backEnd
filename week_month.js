//const date = require('date-and-time');
const now = new Date();
const today = now.getDay();
const today_date = now.getDate();
const tMonth = now.getMonth();
let month_name = "";
function week(){  
    const week_dates = {} 
    switch (today) {
        case 0:
            week_dates["sun"] = today_date;
            week_dates["sat"] = today_date+6;
            break;
        case 1:
            week_dates["sun"] = today_date - 1;
            week_dates["sat"] = today_date + 5;
            break;
        case 2:
            week_dates["sun"] = today_date - 2;
            week_dates["sat"] = today_date + 4;        
            break;
        case 3:
            week_dates["sun"] = today_date - 3;
            week_dates["sat"] = today_date + 3;        
            break;
        case 4:
            week_dates["sun"] = today_date - 4;
            week_dates["sat"] = today_date + 2;        
            break;
        case 5:
            week_dates["sun"] = today_date - 5;
            week_dates["sat"] = today_date + 1;        
            break;
        case 6:
            week_dates["sun"] = today_date - 6;
            week_dates["sat"] = today_date;        
            break;
        default:
            break;
    }
    return(week_dates);
}

function month(){
    switch (tMonth) {
        case 0:
            month_name = 'JAN';  
            break;
        case 1:
            month_name = 'FEB';
            break;
        case 2:
            month_name = 'MAR';
            break;
        case 3:
            month_name = 'APR';
            break;
        case 4:
            month_name = 'MAY';
            break;
        case 5:
            month_name = 'JUN';
            break;
        case 6:
            month_name = 'JUL';
            break;
        case 7:
            month_name = 'AUG';
            break;
        case 8:
            month_name = 'SEP';
            break;
        case 9:
            month_name = 'OCT';
            break;
        case 10:
            month_name = 'NOV';
            break;
        case 11:
            month_name = 'DEC';
            break;
        default:
            break;

    }
    console.log(tMonth)
    return month_name;
}

module.exports = {
    week,
    month
};