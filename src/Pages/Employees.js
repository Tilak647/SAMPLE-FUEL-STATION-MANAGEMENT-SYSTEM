import { useState } from "react";

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

    const addEmployee = () => {
    if (
        employee.name === "" ||
        employee.phone === "" ||
        employee.position === "" ||
        employee.salary === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    setEmployees([
        ...employees,
        {
        id: Date.now(),
        ...employee
        }
    ]);

    setEmployee({
        name: "",
        phone: "",
        position: "",
        salary: ""
    });
};

    const deleteEmployee = (id) => {
    setEmployees(
        employees.filter((emp) => emp.id !== id)
    );
};

    return (
    <div className="container mt-4">
        <h2>Employee Management</h2>

        <div className="card p-3 mb-4">
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

        <button
            className="btn btn-success"
            onClick={addEmployee}
        >
            Add Employee
        </button>
        </div>

        <table className="table table-bordered">
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