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
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id,role.title FROM employee JOIN role ON employee.role_id = role.id`
    db.query(sql, (err,result) => {
        console.table(result)
        start()
    })
}

function viewEmployeeByManager() {
    db.query(`SELECT * FROM employee`, (err,employeeResults) => {
        const employees = employeeResults.map(employee => {
            return employee.first_name + " " + employee.last_name;
        });
        inquirer.prompt({
            name: "employeeName",
            type: "list",
            message: "Who manager want to choose",
            choices: employees
        }).then(answer => {
            let managerID;
            for(var i = 0; i < employeeResults.length; i++) {
                if(answer.employeeName === (employeeResults[i].first_name + " " + employeeResults[i].last_name)) {
                    managerID = employeeResults[i].id;
                };
            }
            db.query(`SELECT employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id WHERE employee.manager_id = ?`, managerID, (err,result) => {
                console.table(result);
            });
        })  
    })
};

function viewEmployeeByDepartment() {
    const sql = `SELECT * FROM department`
    db.query(sql, (err,results) => {
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "Which department you want to view",
            choices: results
        })
        // find id of department
            .then(answer => {
                for(result of results) {
                    if(result.name === answer.department) {
                        console.log(result.id)
                        db.query(`SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON role.department_id = department.id WHERE department.id = ?`, result.id, (err,result) => {
                            console.table(result);
                        })
                    }
                }
                start()
            })
    })

}

function addDepartment() {
    inquirer.prompt({
        name: "departmentName",
        type: "input",
        message: "What is department's name:"
    })
    .then( answer => {
        const sql = `INSERT INTO department (name) VALUES (?)`
        db.query(sql, answer.departmentName, (err,result) => {
            console.log("Success!");
            start();
        })
    })
}

function addRole() {
    db.query("SELECT * FROM department", (err,results) => {
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of the role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of the role?"
            },
            {
                name: "departmentName",
                type: "list",
                message: "Which department will add this role?",
                choices: results
            },
        ])
        .then( answer => {
            // find id department 
            results.forEach(result => {
                if(result.name === answer.departmentName) {
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answer.title, answer.salary, result.id]);
                    console.log("Success!");
                    start();
                }
            })
        })
    })
}

function addEmployee() {
    db.query(`SELECT * FROM role`, (err,roleResults) => {
        const roles = roleResults.map(role => {
            return role.title
        });
        db.query(`SELECT * FROM employee`, (err, employeeResults) => {
            const employees = ['None']
            employeeResults.map(employee => {
                return employees.push(employee.first_name + " " + employee.last_name);
            })
            inquirer.prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "what is the employee's first name"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "what is the employee's last name"
                },
                {
                    name: "roleTitle",
                    type: "list",
                    message: "What is the employee's role",
                    choices: roles
                },
                {
                    name: "manager",
                    type: "list",
                    message: "what is the emloyee's manager",
                    choices: employees
                }
            ])
            .then( answer => {
                // find role id when match role title
                var role_id;
                for( var i = 0; i < roleResults.length; i++) {
                    if(answer.roleTitle === roleResults[i].title) {
                        role_id = roleResults[i].id
                    }
                }
                // find manager id when match with chosen employee name
                let managerID;
                for( var i = 0; i < employeeResults.length; i++) {
                    if(answer.manager === (employeeResults[i].first_name+ " " + employeeResults[i].last_name)) {
                        managerID = employeeResults[i].id
                        // if choose none for manager's name is set manager id to null
                    } else if (answer.manager === `None`) {
                        managerID = null
                    }
                }
                
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (?, ?, ?, ?)`, [answer.first_name, answer.last_name, role_id, managerID])
                console.log(" \n Success! \n");
                start()
            })
        })
    })
}

function updateEmployeeManager() {
    db.query(`SELECT * FROM employee`, (err,employeeResults) => {
        let employees = employeeResults.map(employee => {
            return employee.first_name + " " + employee.last_name
        })
        
        inquirer.prompt(
            {
                name: "employeeName",
                type: "list",
                message: "which emoloyee you want to choose",
                choices: employees
            }  
        ).then(answer => {
            // find emloyee ID
            let emloyeeID;
            for(var i = 0; i < employeeResults.length; i++) {
                if(answer.employeeName === employees[i]) {
                    emloyeeID = employeeResults[i].id;
                }
            }
            let answerEmployee = answer;
            // find employee Name do not chosen 
            let managers = employees.filter( e => {
                if(e !== answerEmployee.employeeName){
                    return e
                }
            })
            managers.push("None")
            inquirer.prompt(
                    {
                    name: "managerName",
                    type: "list",
                    message: "which manager you want to choose for selected employee",
                    choices: managers
                }
            )
            .then(answer => {
                let managerID
                for(var i = 0; i < employeeResults.length; i++) {
                    if(answer.managerName === employees[i]) {
                        managerID = employeeResults[i].id
                    } else if(answer.managerName === "None") {
                        managerID = null;
                    }
                }
                
                db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [managerID,emloyeeID]);
                console.log("\n Success \n");
                start()
            })
        })
    })
}

function updateEmployeeRole() {
    db.query(`SELECT * FROM employee`, (err,employeeResults) => {
        let employees = employeeResults.map(employee => {
            return employee.first_name + " " + employee.last_name;
        })
        db.query(`SELECT * FROM role`, (err, roleResults) => {
            let roles = roleResults.map(role => {
                return role.title;
            })
            inquirer.prompt([
                {
                    name: "employeeName",
                    type: "list",
                    message: "which employee you want to choose?",
                    choices: employees
                },
                {
                    name: "roleTitle",
                    type: "list",
                    message: "Which role title you want to select?",
                    choices: roles
                }
            ])
            .then(answer => {
                let emloyeeID;
                for(var i = 0; i < employeeResults.length; i++) {
                    if(answer.employeeName === employees[i]) {
                        emloyeeID = employeeResults[i].id
                    }
                }
                let roleID;
                for(var i = 0; i < roleResults.length; i++) {
                    if( answer.roleTitle === roles[i]) {
                        roleID = roleResults[i].id
                    }
                }
                db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [roleID, emloyeeID]);
                console.log("\n Success \n");
                start()
            })
        })
    })
};

function deleteRole() {
    db.query(`SELECT * FROM role`, (err,results) => {
        // put role.title into arr
        var roleResults = []
        results.forEach(result => {
            roleResults.push(result.title)
        })
        inquirer.prompt({
            name: "role",
            type: "list",
            message: "Which role you want to delete?",
            choices: roleResults
        })
        // Delete ROle
        .then(answer => {
            db.query(`DELETE FROM role WHERE title = ?`, answer.role)
            console.log("Success")
            start()
        })
    })
}