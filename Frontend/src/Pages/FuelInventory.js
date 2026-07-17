import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import PageHeader from "../Comp/PageHeader";
import "../Style/EnterpriseTheme.css";
import { FaGasPump, FaOilCan, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function FuelInventory() {
    const [fuelType, setFuelType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [supplier, setSupplier] = useState("");
    const [search, setSearch] = useState("");
    const [fuelList, setFuelList] = useState([]);
    const [editId, setEditId] = useState(null);

    const MAX_CAPACITY = 10000; // Mock max capacity for percentage

    useEffect(() => {
        fetchFuel();
    }, []);

    const fetchFuel = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/fuel");
            setFuelList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        if (!fuelType || !quantity || !price || !supplier) {
            alert("Please fill all fields");
            return;
        }

        try {
            if (editId) {
                await axios.put(`http://localhost:8080/api/fuel/${editId}`, {
                    fuelType,
                    quantity,
                    pricePerLiter: price,
                    supplier
                });
                alert("Fuel Updated Successfully");
                setEditId(null);
            } else {
                await axios.post("http://localhost:8080/api/fuel", {
                    fuelType,
                    quantity,
                    pricePerLiter: price,
                    supplier
                });
                alert("Fuel Added Successfully");
            }
            setFuelType("");
            setQuantity("");
            setPrice("");
            setSupplier("");
            fetchFuel();
        } catch (error) {
            console.error(error);
            alert("Error while saving fuel");
        }
    };

    const deleteFuel = async (id) => {
        if(window.confirm("Are you sure you want to delete this record?")) {
            try {
                await axios.delete(`http://localhost:8080/api/fuel/${id}`);
                fetchFuel();
            } catch (error) {
                console.error(error);
                alert("Unable to delete fuel");
            }
        }
    };

    const editFuel = (fuel) => {
        setEditId(fuel.id);
        setFuelType(fuel.fuelType);
        setQuantity(fuel.quantity);
        setPrice(fuel.pricePerLiter);
        setSupplier(fuel.supplier);
    };

    const filteredFuel = fuelList.filter((fuel) =>
        fuel.fuelType?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPetrol = fuelList.filter(f => f.fuelType.toLowerCase() === 'petrol').reduce((acc, curr) => acc + curr.quantity, 0);
    const totalDiesel = fuelList.filter(f => f.fuelType.toLowerCase() === 'diesel').reduce((acc, curr) => acc + curr.quantity, 0);
    
    const petrolPct = Math.min((totalPetrol / MAX_CAPACITY) * 100, 100).toFixed(1);
    const dieselPct = Math.min((totalDiesel / MAX_CAPACITY) * 100, 100).toFixed(1);

    return (
        <div className="container-fluid mt-4 px-4">
            <PageHeader
                title="⛽ Fuel Inventory & Analytics"
                subtitle="Manage stock levels, supplier details, and monitor refill predictions."
            />

            {/* Analytics Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="text-white mb-0"><FaOilCan className="text-warning me-2"/> Petrol Stock</h5>
                            {totalPetrol < 2000 ? <span className="badge badge-warning">Low Stock</span> : <span className="badge badge-success">Optimal</span>}
                        </div>
                        <h2 className="text-white mb-2">{totalPetrol} L <span className="fs-5 text-muted">/ {MAX_CAPACITY} L</span></h2>
                        <div className="progress bg-dark mb-3" style={{ height: '10px' }}>
                            <div className={`progress-bar ${totalPetrol < 2000 ? 'bg-warning' : 'bg-success'}`} role="progressbar" style={{ width: `${petrolPct}%` }}></div>
                        </div>
                        <div className="d-flex justify-content-between text-muted small">
                            <span>Stock: {petrolPct}%</span>
                            <span>Refill Prediction: {totalPetrol < 2000 ? 'Immediate' : 'Next Week'}</span>
                        </div>
                    </motion.div>
                </div>
                
                <div className="col-md-6">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="text-white mb-0"><FaGasPump className="text-primary me-2"/> Diesel Stock</h5>
                            {totalDiesel < 2000 ? <span className="badge badge-warning">Low Stock</span> : <span className="badge badge-success">Optimal</span>}
                        </div>
                        <h2 className="text-white mb-2">{totalDiesel} L <span className="fs-5 text-muted">/ {MAX_CAPACITY} L</span></h2>
                        <div className="progress bg-dark mb-3" style={{ height: '10px' }}>
                            <div className={`progress-bar ${totalDiesel < 2000 ? 'bg-warning' : 'bg-primary'}`} role="progressbar" style={{ width: `${dieselPct}%` }}></div>
                        </div>
                        <div className="d-flex justify-content-between text-muted small">
                            <span>Stock: {dieselPct}%</span>
                            <span>Refill Prediction: {totalDiesel < 2000 ? 'Immediate' : 'In 12 Days'}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="row g-4">
                {/* Add/Edit Form */}
                <div className="col-md-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4 h-100">
                        <h5 className="text-white mb-4">{editId ? "Update Fuel Record" : "Add New Fuel"}</h5>
                        
                        <div className="mb-3">
                            <select className="form-select bg-dark text-white border-secondary" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                                <option value="">Select Fuel Type</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                            </select>
                        </div>
                        
                        <div className="mb-3">
                            <input type="number" className="form-control bg-dark text-white border-secondary" placeholder="Quantity (Liters)" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </div>
                        
                        <div className="mb-3">
                            <input type="number" className="form-control bg-dark text-white border-secondary" placeholder="Price Per Liter (₹)" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        
                        <div className="mb-4">
                            <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Supplier Name" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
                        </div>
                        
                        <button className={`btn w-100 ${editId ? 'btn-warning' : 'btn-primary'}`} onClick={handleSubmit}>
                            {editId ? "Update Record" : "Save Record"}
                        </button>
                        {editId && (
                            <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => { setEditId(null); setFuelType(""); setQuantity(""); setPrice(""); setSupplier(""); }}>
                                Cancel Edit
                            </button>
                        )}
                    </motion.div>
                </div>

                {/* Data Table */}
                <div className="col-md-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="text-white mb-0">Inventory Logs</h5>
                            <input type="text" className="form-control bg-dark text-white border-secondary w-auto" placeholder="Search by type..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        
                        <div className="table-responsive">
                            <table className="enterprise-table">
                                <thead>
                                    <tr>
                                        <th>Fuel Type</th>
                                        <th>Quantity</th>
                                        <th>Price/L</th>
                                        <th>Supplier</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFuel.length > 0 ? (
                                        filteredFuel.map((fuel) => (
                                            <tr key={fuel.id}>
                                                <td>
                                                    <span className={`badge ${fuel.fuelType.toLowerCase() === 'petrol' ? 'badge-warning' : 'badge-primary'}`}>
                                                        {fuel.fuelType}
                                                    </span>
                                                </td>
                                                <td className="text-white">{fuel.quantity} L</td>
                                                <td className="text-success fw-bold">₹{fuel.pricePerLiter}</td>
                                                <td className="text-muted">{fuel.supplier}</td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => editFuel(fuel)}>
                                                        <FaEdit />
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteFuel(fuel.id)}>
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">No Fuel Records Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default FuelInventory;