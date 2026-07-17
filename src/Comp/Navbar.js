import { Link } from "react-router-dom";

function Navbar() {
    return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">

        <div className="container">

        <Link className="navbar-brand" to="/">
            Fuel Station System
        </Link>

        <div>
            <Link className="btn btn-outline-light me-2" to="/">
            Dashboard
            </Link>

            <Link className="btn btn-outline-light me-2" to="/fuel">
            Fuel
            </Link>

            <Link className="btn btn-outline-light me-2" to="/sales">
            Sales
            </Link>

            <Link className="btn btn-outline-light me-2" to="/employees">
            Employees
            </Link>

            <Link className="btn btn-outline-light" to="/reports">
            Reports
            </Link>

        </div>

        </div>

    </nav>
);
}

export default Navbar;