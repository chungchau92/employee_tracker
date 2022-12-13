const inquirer = require('inquirer');

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
        "Delete Role",
        "Delete Employee",
        "view bubget of Department",
        "Quit"
    ]
}

