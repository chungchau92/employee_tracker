const inquirer = require('inquirer');

const mysql = require('mysql2');

const questions = {
    name: "question",
    type: "list",
    message: "What would you like to do",
    choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "View Employee by Manager",
        "View Employee by Department",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Manager",
        "Update Employes Role",
        "Delete Departments",
        "Delete Roles",
        "Delete Employees",
        "view bubget of Department",
        "Quit",
    ]
}



const connection = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "123456789",
        database: "employee_db",
    },
    console.log("connected to the employee_db database")
);

connection.connect( err => {
    if(err) {
        throw err
    } else {
        start();
    }
})


const start = () => {
    inquirer.prompt(questions).then(answer => {
        console.log(answer.question)
    })
}


