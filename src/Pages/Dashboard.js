function Dashboard() {
    return (
    <div>

        <h2>Dashboard</h2>

        <div className="row">

        <div className="col-md-3">
            <div className="card text-center">
            <div className="card-body">
                <h3>5000 L</h3>
                <p>Petrol Stock</p>
            </div>
            </div>
        </div>

        <div className="col-md-3">
            <div className="card text-center">
            <div className="card-body">
                <h3>3000 L</h3>
                <p>Diesel Stock</p>
            </div>
            </div>
        </div>

        <div className="col-md-3">
            <div className="card text-center">
            <div className="card-body">
                <h3>₹50,000</h3>
                <p>Today's Sales</p>
            </div>
            </div>
        </div>

        <div className="col-md-3">
            <div className="card text-center">
            <div className="card-body">
                <h3>12</h3>
                <p>Employees</p>
            </div>
            </div>
        </div>

        </div>

    </div>
);
}

export default Dashboard;