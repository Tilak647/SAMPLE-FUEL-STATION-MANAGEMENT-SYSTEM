import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../Comp/PageHeader";
import {
    FaTruck, FaFileInvoice, FaBuilding, FaRobot, FaCheckCircle, FaTimesCircle, FaPlus, FaChartLine
} from "react-icons/fa";
import CountUp from 'react-countup';

function Procurement() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [suppliers, setSuppliers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [aiInsights, setAiInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showAddSupplier, setShowAddSupplier] = useState(false);
    const [newSupplier, setNewSupplier] = useState({ name: '', contactPerson: '', contactNumber: '', address: '', gstNumber: '' });

    const [showAddOrder, setShowAddOrder] = useState(false);
    const [newOrder, setNewOrder] = useState({ supplierId: '', fuelType: 'Petrol', quantityLiters: '', pricePerLiter: '' });

    const [showAddDelivery, setShowAddDelivery] = useState(false);
    const [newDelivery, setNewDelivery] = useState({ purchaseOrderId: '', driverName: '', vehicleNumber: '', litersDelivered: '' });

    useEffect(() => {
        fetchProcurementData();
    }, []);

    const fetchProcurementData = async () => {
        setLoading(true);
        try {
            const [supRes, ordRes, delRes, aiRes] = await Promise.all([
                axios.get("http://localhost:8080/api/suppliers").catch(() => ({ data: [] })),
                axios.get("http://localhost:8080/api/orders").catch(() => ({ data: [] })),
                axios.get("http://localhost:8080/api/deliveries").catch(() => ({ data: [] })),
                axios.get("http://localhost:8080/api/ai/procurement").catch(() => ({ data: null }))
            ]);
            setSuppliers(supRes.data);
            setOrders(ordRes.data);
            setDeliveries(delRes.data);
            setAiInsights(aiRes.data);
        } catch (error) {
            console.error("Error fetching procurement data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSupplier = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/suppliers", newSupplier);
            setShowAddSupplier(false);
            setNewSupplier({ name: '', contactPerson: '', contactNumber: '', address: '', gstNumber: '' });
            fetchProcurementData();
            alert("Supplier added successfully");
        } catch (error) {
            alert("Failed to add supplier");
        }
    };

    const handleAddOrder = async (e) => {
        e.preventDefault();
        try {
            const orderPayload = {
                supplier: { id: parseInt(newOrder.supplierId) },
                fuelType: newOrder.fuelType,
                quantityLiters: parseFloat(newOrder.quantityLiters),
                pricePerLiter: parseFloat(newOrder.pricePerLiter)
            };
            await axios.post("http://localhost:8080/api/orders", orderPayload);
            setShowAddOrder(false);
            setNewOrder({ supplierId: '', fuelType: 'Petrol', quantityLiters: '', pricePerLiter: '' });
            fetchProcurementData();
            alert("Purchase Order created successfully");
        } catch (error) {
            alert("Failed to create order");
        }
    };

    const handleUpdateOrderStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:8080/api/orders/${id}/status?status=${status}`);
            fetchProcurementData();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleAddDelivery = async (e) => {
        e.preventDefault();
        try {
            const deliveryPayload = {
                purchaseOrder: { id: parseInt(newDelivery.purchaseOrderId) },
                driverName: newDelivery.driverName,
                vehicleNumber: newDelivery.vehicleNumber,
                litersDelivered: parseFloat(newDelivery.litersDelivered)
            };
            await axios.post("http://localhost:8080/api/deliveries", deliveryPayload);
            setShowAddDelivery(false);
            setNewDelivery({ purchaseOrderId: '', driverName: '', vehicleNumber: '', litersDelivered: '' });
            fetchProcurementData();
            alert("Tanker delivery recorded and inventory updated!");
        } catch (error) {
            alert("Failed to record delivery");
        }
    };

    if (loading) {
        return <div className="text-center py-5 text-white"><h5>Loading Procurement Module...</h5></div>;
    }

    const totalOrdersCost = orders.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + (o.totalCost || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

    return (
        <div className="container-fluid mt-4 px-4 pb-5">
            <PageHeader title="🚢 Enterprise Procurement" subtitle="Supplier management, purchase orders, and AI-driven supply chain." />

            {/* Tabs */}
            <ul className="nav nav-pills mb-4 gap-2">
                {['dashboard', 'suppliers', 'orders', 'deliveries', 'ai'].map(tab => (
                    <li className="nav-item" key={tab}>
                        <button className={`nav-link text-uppercase fw-bold rounded-pill px-4 ${activeTab === tab ? 'active bg-primary text-white' : 'text-muted glass-card border-0'}`} 
                                onClick={() => setActiveTab(tab)} style={{ fontSize: '12px' }}>
                            {tab === 'dashboard' ? <><FaChartLine className="me-2"/> Dashboard</> :
                             tab === 'suppliers' ? <><FaBuilding className="me-2"/> Suppliers</> :
                             tab === 'orders' ? <><FaFileInvoice className="me-2"/> Purchase Orders</> :
                             tab === 'deliveries' ? <><FaTruck className="me-2"/> Deliveries</> :
                             <><FaRobot className="me-2"/> AI Procurement</>}
                        </button>
                    </li>
                ))}
            </ul>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    
                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="row g-4">
                            <div className="col-md-3">
                                <div className="glass-card p-4 text-center h-100 border-start border-4 border-primary">
                                    <h6 className="text-muted">Total Suppliers</h6>
                                    <h2 className="text-white fw-bold"><CountUp end={suppliers.length} /></h2>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="glass-card p-4 text-center h-100 border-start border-4 border-warning">
                                    <h6 className="text-muted">Pending Orders</h6>
                                    <h2 className="text-warning fw-bold"><CountUp end={pendingOrders} /></h2>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="glass-card p-4 text-center h-100 border-start border-4 border-success">
                                    <h6 className="text-muted">Completed Deliveries</h6>
                                    <h2 className="text-success fw-bold"><CountUp end={deliveries.length} /></h2>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="glass-card p-4 text-center h-100 border-start border-4 border-info">
                                    <h6 className="text-muted">Total Proc. Cost</h6>
                                    <h2 className="text-info fw-bold">Rs.<CountUp end={totalOrdersCost} separator=","/></h2>
                                </div>
                            </div>
                            <div className="col-12 mt-4">
                                <div className="glass-card p-4">
                                    <h5 className="text-white mb-3">AI Procurement Summary</h5>
                                    <p className="text-muted mb-0">{aiInsights?.procurementSummary || "AI insights not available at the moment."}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SUPPLIERS TAB */}
                    {activeTab === 'suppliers' && (
                        <div className="glass-card p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="text-white mb-0">Supplier Management</h5>
                                <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={() => setShowAddSupplier(!showAddSupplier)}>
                                    <FaPlus className="me-2"/> Add Supplier
                                </button>
                            </div>
                            
                            {showAddSupplier && (
                                <form onSubmit={handleAddSupplier} className="bg-dark bg-opacity-50 p-3 rounded mb-4 border border-secondary">
                                    <div className="row g-3">
                                        <div className="col-md-3"><input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Company Name" required value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} /></div>
                                        <div className="col-md-3"><input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Contact Person" required value={newSupplier.contactPerson} onChange={e => setNewSupplier({...newSupplier, contactPerson: e.target.value})} /></div>
                                        <div className="col-md-2"><input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Phone" required value={newSupplier.contactNumber} onChange={e => setNewSupplier({...newSupplier, contactNumber: e.target.value})} /></div>
                                        <div className="col-md-2"><input type="text" className="form-control bg-dark text-white border-secondary" placeholder="GST Number" required value={newSupplier.gstNumber} onChange={e => setNewSupplier({...newSupplier, gstNumber: e.target.value})} /></div>
                                        <div className="col-md-2"><button type="submit" className="btn btn-success w-100">Save</button></div>
                                    </div>
                                </form>
                            )}

                            <div className="table-responsive">
                                <table className="table table-dark table-hover table-sm align-middle" style={{background: 'transparent'}}>
                                    <thead><tr><th>ID</th><th>Supplier</th><th>Contact</th><th>Phone</th><th>GST</th><th>Score</th></tr></thead>
                                    <tbody>
                                        {suppliers.map(s => (
                                            <tr key={s.id}>
                                                <td>{s.id}</td>
                                                <td className="fw-bold">{s.name}</td>
                                                <td>{s.contactPerson}</td>
                                                <td>{s.contactNumber}</td>
                                                <td>{s.gstNumber}</td>
                                                <td><span className="badge bg-success">{s.performanceScore}/100</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* PURCHASE ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <div className="glass-card p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="text-white mb-0">Purchase Orders</h5>
                                <button className="btn btn-warning btn-sm rounded-pill px-3" onClick={() => setShowAddOrder(!showAddOrder)}>
                                    <FaPlus className="me-2"/> Create Order
                                </button>
                            </div>

                            {showAddOrder && (
                                <form onSubmit={handleAddOrder} className="bg-dark bg-opacity-50 p-3 rounded mb-4 border border-secondary">
                                    <div className="row g-3">
                                        <div className="col-md-3">
                                            <select className="form-select bg-dark text-white border-secondary" required value={newOrder.supplierId} onChange={e => setNewOrder({...newOrder, supplierId: e.target.value})}>
                                                <option value="">Select Supplier</option>
                                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <select className="form-select bg-dark text-white border-secondary" value={newOrder.fuelType} onChange={e => setNewOrder({...newOrder, fuelType: e.target.value})}>
                                                <option value="Petrol">Petrol</option>
                                                <option value="Diesel">Diesel</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2"><input type="number" className="form-control bg-dark text-white border-secondary" placeholder="Liters" required value={newOrder.quantityLiters} onChange={e => setNewOrder({...newOrder, quantityLiters: e.target.value})} /></div>
                                        <div className="col-md-2"><input type="number" step="0.01" className="form-control bg-dark text-white border-secondary" placeholder="Price/L" required value={newOrder.pricePerLiter} onChange={e => setNewOrder({...newOrder, pricePerLiter: e.target.value})} /></div>
                                        <div className="col-md-3"><button type="submit" className="btn btn-success w-100">Issue PO</button></div>
                                    </div>
                                </form>
                            )}

                            <div className="table-responsive">
                                <table className="table table-dark table-hover table-sm align-middle" style={{background: 'transparent'}}>
                                    <thead><tr><th>PO#</th><th>Supplier</th><th>Fuel</th><th>Qty (L)</th><th>Total Cost</th><th>Status</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <tr key={o.id}>
                                                <td>#{o.id}</td>
                                                <td>{o.supplier?.name}</td>
                                                <td>{o.fuelType}</td>
                                                <td>{o.quantityLiters}</td>
                                                <td>Rs.{o.totalCost}</td>
                                                <td>
                                                    <span className={`badge bg-${o.status === 'COMPLETED' ? 'success' : o.status === 'APPROVED' ? 'info' : o.status === 'REJECTED' ? 'danger' : 'warning'}`}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {o.status === 'PENDING' && (
                                                        <>
                                                            <button className="btn btn-sm text-success p-1" onClick={() => handleUpdateOrderStatus(o.id, 'APPROVED')}><FaCheckCircle/></button>
                                                            <button className="btn btn-sm text-danger p-1 ms-1" onClick={() => handleUpdateOrderStatus(o.id, 'REJECTED')}><FaTimesCircle/></button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* DELIVERIES TAB */}
                    {activeTab === 'deliveries' && (
                        <div className="glass-card p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="text-white mb-0">Tanker Deliveries</h5>
                                <button className="btn btn-success btn-sm rounded-pill px-3" onClick={() => setShowAddDelivery(!showAddDelivery)}>
                                    <FaTruck className="me-2"/> Log Arrival
                                </button>
                            </div>

                            {showAddDelivery && (
                                <form onSubmit={handleAddDelivery} className="bg-dark bg-opacity-50 p-3 rounded mb-4 border border-secondary">
                                    <div className="row g-3">
                                        <div className="col-md-3">
                                            <select className="form-select bg-dark text-white border-secondary" required value={newDelivery.purchaseOrderId} onChange={e => setNewDelivery({...newDelivery, purchaseOrderId: e.target.value})}>
                                                <option value="">Select Approved PO</option>
                                                {orders.filter(o => o.status === 'APPROVED').map(o => <option key={o.id} value={o.id}>PO #{o.id} - {o.fuelType}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-3"><input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Driver Name" required value={newDelivery.driverName} onChange={e => setNewDelivery({...newDelivery, driverName: e.target.value})} /></div>
                                        <div className="col-md-2"><input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Vehicle No" required value={newDelivery.vehicleNumber} onChange={e => setNewDelivery({...newDelivery, vehicleNumber: e.target.value})} /></div>
                                        <div className="col-md-2"><input type="number" className="form-control bg-dark text-white border-secondary" placeholder="Actual Liters" required value={newDelivery.litersDelivered} onChange={e => setNewDelivery({...newDelivery, litersDelivered: e.target.value})} /></div>
                                        <div className="col-md-2"><button type="submit" className="btn btn-success w-100">Confirm</button></div>
                                    </div>
                                </form>
                            )}

                            <div className="table-responsive">
                                <table className="table table-dark table-hover table-sm align-middle" style={{background: 'transparent'}}>
                                    <thead><tr><th>Delivery#</th><th>PO Link</th><th>Driver</th><th>Vehicle</th><th>Delivered (L)</th><th>Arrival Time</th></tr></thead>
                                    <tbody>
                                        {deliveries.map(d => (
                                            <tr key={d.id}>
                                                <td>#{d.id}</td>
                                                <td>PO #{d.purchaseOrder?.id}</td>
                                                <td>{d.driverName}</td>
                                                <td>{d.vehicleNumber}</td>
                                                <td className="text-success fw-bold">+{d.litersDelivered} L</td>
                                                <td>{new Date(d.arrivalTime).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* AI PROCUREMENT TAB */}
                    {activeTab === 'ai' && (
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="glass-card p-4 h-100 border-start border-4 border-info">
                                    <h5 className="text-white mb-4"><FaRobot className="me-2 text-info"/> Procurement Forecast</h5>
                                    <div className="mb-3">
                                        <small className="text-muted text-uppercase fw-bold">Recommended Supplier</small>
                                        <p className="text-white">{aiInsights?.recommendedSupplier || "Data gathering..."}</p>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted text-uppercase fw-bold">Next Predicted Purchase</small>
                                        <p className="text-white">{aiInsights?.nextPurchaseDate || "Data gathering..."}</p>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted text-uppercase fw-bold">Cost Forecast</small>
                                        <p className="text-white">{aiInsights?.predictedCost || "Data gathering..."}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="glass-card p-4 h-100 border-start border-4 border-warning">
                                    <h5 className="text-white mb-4">Reorder Suggestions</h5>
                                    <div className="mb-3">
                                        <small className="text-muted text-uppercase fw-bold">Petrol Quantities</small>
                                        <p className="text-white">{aiInsights?.suggestedPetrolQuantity || "N/A"}</p>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted text-uppercase fw-bold">Diesel Quantities</small>
                                        <p className="text-white">{aiInsights?.suggestedDieselQuantity || "N/A"}</p>
                                    </div>
                                    <div>
                                        <small className="text-muted text-uppercase fw-bold">Economical Suppliers List</small>
                                        <ul className="text-white small mt-1 ps-3">
                                            {aiInsights?.economicalSuppliers?.map((s, i) => <li key={i}>{s}</li>) || <li>None</li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default Procurement;
