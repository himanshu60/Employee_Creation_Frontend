const employeeForm = document.getElementById("employeeForm");
const employeeTable = document.getElementById("employeeTable");
const baseurl = "http://localhost:3000";
const deployurl = "https://employee-creation.onrender.com";

function createEmployee(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const title = document.getElementById("title").value;
  const department = document.getElementById("department").value;
  const salary = document.getElementById("salary").value;

  const employeeData = {
    name,
    title,
    department,
    annual_salary: parseFloat(salary), // Convert to a number
  };

  // Send a POST request to create an employee
  fetch(`${deployurl}/api/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeeData),
  })
    .then((response) => response.json())
    .then((newEmployee) => {
      alert("Employee Added Sucessfully");
      // Clear the form
      employeeForm.reset();
      // Refresh the employee table
      displayEmployees();
    })
    .catch((error) => console.error("Error creating employee:", error));
}

function updateEmployee(id, newData) {
  // Send a PUT request to update an employee
  fetch(`${deployurl}/api/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  })
    .then((response) => response.json())
    .then((updatedEmployee) => {
      alert("Employee data updated Sucessfully");
      // Refresh the employee table
      displayEmployees();
    })
    .catch((error) => console.error("Error updating employee:", error));
}

function deleteEmployee(id) {
  // Send a DELETE request to delete an employee
  fetch(`${deployurl}/api/employees/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((deletedEmployee) => {
      alert("Employee data deleted Sucessfully");
      // Refresh the employee table
      displayEmployees();
    })
    .catch((error) => console.error("Error deleting employee:", error));
}

function displayEmployees() {
  // Fetch all employees
  fetch(`${deployurl}/api/employees`)
    .then((response) => response.json())
    .then((employees) => {
      // Clear the table body
      employeeTable.querySelector("tbody").innerHTML = "";

      // Populate the table with employee data
      employees.forEach((employee) => {
        if (!employee.isDeleted) {
          const row = `
            <tr>
              <td>${employee.name}</td>
              <td>${employee.title}</td>
              <td>${employee.department}</td>
              <td>${employee.annual_salary}</td>
              <td>
                <button onclick="editEmployee('${employee._id}', '${employee.name}', '${employee.title}', '${employee.department}', '${employee.annual_salary}')">Edit</button>
                <button onclick="deleteEmployee('${employee._id}')">Delete</button>
              </td>
            </tr>
          `;
          employeeTable
            .querySelector("tbody")
            .insertAdjacentHTML("beforeend", row);
        }
      });
    })
    .catch((error) => console.error("Error fetching employees:", error));
}

function editEmployee(id, name, title, department, salary) {
  // Pre-fill the form with employee data for editing
  document.getElementById("name").value = name;
  document.getElementById("title").value = title;
  document.getElementById("department").value = department;
  document.getElementById("salary").value = salary;

  // Attach a click event to the submit button for updating an employee
  employeeForm.removeEventListener("submit", createEmployee);
  employeeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const newData = {
      name: document.getElementById("name").value,
      title: document.getElementById("title").value,
      department: document.getElementById("department").value,
      annual_salary: parseFloat(document.getElementById("salary").value),
    };
    updateEmployee(id, newData);
    // Reset the form and attach the createEmployee function again
    employeeForm.reset();
    employeeForm.removeEventListener("submit", updateEmployee);
    employeeForm.addEventListener("submit", createEmployee);
  });
}

// Attach the createEmployee function to the form submit event
employeeForm.addEventListener("submit", createEmployee);

// Display employees on page load
displayEmployees();
