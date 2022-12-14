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
        "Delete Department",
        "Delete Role",
        "Delete Employee",
        "View bubget of Department",
        "Quit",
    ]
}

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "123456789",
        database: "employee_db",
    },
    console.log("connected to the employee_db database")
);

db.connect( err => {
    if(err) {
        throw err
    } else {
        start();
    }
})


const start = () => {
    inquirer.prompt(questions)
    .then(answer => {
        switch(answer.question) {
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View Employee by Manager":
                viewEmployeeByManager();
                break;
            case "View Employee by Department":
                viewEmployeeByDepartment();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "Update Employes Role":
                updateEmployeeRole();
                break;
            case "Delete Department":
                deleteDepartment();
                break;
            case "Delete Role":
                deleteRole();
                break;
            case "Delete Employee":
                deleteEmployee();
                break;
            case "View bubget of Department":
                viewBubgetDepartment();
                break;
            case "Quit":
                process.exit();
        }
    })

}

function viewAllDepartments() {
    const sql = `SELECT * FROM department`
    db.query(sql, (err, result) => {
        console.table(result);
        start()
    })
}

function viewAllRoles() {
    const sql = `SELECT * FROM role`
    db.query(sql, (err,result) => {
        console.table(result)
        start()
    })
}

function viewAllEmployees() {
    const sql = `SELECT * FROM employee`
    db.query(sql, (err,result) => {
        console.table(result)
        start()
    })
}

function viewEmployeeByDepartment() {
    const sql = `SELECT * FROM department`
    db.query(sql, (err,result) => {
        inquirer.prompt({
            name: "Department",
            type: "list",
            message: "Which department you want to view",
            choices: result
        }) 
            .then(answer => {
                db.query(`SELECT employee.first_name, employee.last_name, role.title, role,salary, department.name FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON role.department_id = department.id WHERE department.id = ?`, answer.id, (err,result) => {
                    console.table(result);
                    start()
                })
            })
    })
}