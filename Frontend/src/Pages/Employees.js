import { useState, useEffect } from "react";
import axios from "axios";
import "../Style/Employees.css";

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState({
    name: "",
    phone: "",
    position: "",
    salary: ""
});
    const handleChange = (e) => {
    setEmployee({
        ...employee,
        [e.target.name]: e.target.value
    });
};
    const fetchEmployees = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/employees");
        setEmployees(response.data);
    } catch (error) {
        console.log(error);
    }
};
    useEffect(() => {
    fetchEmployees();
}, []);
    const addEmployee = async () => {
    if (
        employee.name === "" ||
        employee.phone === "" ||
        employee.position === "" ||
        employee.salary === ""
    ) {
        alert("Please fill all fields");
        return;
    }
    try {
        await axios.post(
            "http://localhost:8080/api/employees",
            employee
        );
        alert("Employee Added Successfully");
        setEmployee({
            name: "",
            phone: "",
            position: "",
            salary: ""
        });
        fetchEmployees();
    } catch (error) {
        console.log(error);
        alert("Error adding employee");
    }
};
    const deleteEmployee = async(id)=>{
    try{
        await axios.delete(
            `http://localhost:8080/api/employees/${id}`
        );

        fetchEmployees();
    }
    catch(error){

        console.log(error);

    }
}
    return (
    <div className="employee-page">
        <div className="content-box"></div>
        <h2 className="page-title mb-4">
    👨 Employee Management
</h2>

<p className="text-muted mb-4">
    Manage your fuel station employees efficiently.
</p>
<div className="row mb-4">

    <div className="col-md-3 mb-3">
        <div className="card stat-card bg-primary">
            <h6>Total Employees</h6>
            <h2>{employees.length}</h2>
        </div>
    </div>

    <div className="col-md-3 mb-3">
        <div className="card stat-card bg-success">
            <h6>Managers</h6>
            <h2>
                {
                    employees.filter(emp =>
                        emp.position?.toLowerCase() === "manager"
                    ).length
                }
            </h2>
        </div>
    </div>

    <div className="col-md-3 mb-3">
        <div className="card stat-card bg-warning">
            <h6>Operators</h6>
            <h2>
                {
                    employees.filter(emp =>
                        emp.position?.toLowerCase() === "operator"
                    ).length
                }
            </h2>
        </div>
    </div>

    <div className="col-md-3 mb-3">
        <div className="card stat-card bg-danger">
            <h6>Average Salary</h6>
            <h2>
                ₹
                {
                    employees.length > 0
                        ? Math.round(
                            employees.reduce(
                                (sum, emp) =>
                                    sum + Number(emp.salary),
                                0
                            ) / employees.length
                        )
                        : 0
                }
            </h2>
        </div>
    </div>

</div>
        <div className="card form-card">
            <h4 className="mb-4">
        ➕ Add New Employee
    </h4>

        <input
            className="form-control mb-2"
            type="text"
            name="name"
            placeholder="Employee Name"
            value={employee.name}
            onChange={handleChange}
        />
        <input
            className="form-control mb-2"
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={employee.phone}
            onChange={handleChange}
        />
        <input
            className="form-control mb-2"
            type="text"
            name="position"
            placeholder="Position"
            value={employee.position}
            onChange={handleChange}
        />
        <input
            className="form-control mb-2"
            type="number"
            name="salary"
            placeholder="Salary"
            value={employee.salary}
            onChange={handleChange}
        />
        <input
            type="text"
            className="form-control mb-3"
            placeholder="Search Employee"
        />
        <button
            className="btn btn-success"
            onClick={addEmployee}
        >
            Add Employee
        </button>
        </div>
        <table className="table table-hover">
        <thead>
            <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {employees.map((emp) => (
            <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.phone}</td>
                <td>{emp.position}</td>
                <td>₹{emp.salary}</td>
                <td>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteEmployee(emp.id)}
                >
                    Delete
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
);
}

export default Employees;