import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "../Comp/PageHeader";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFileInvoiceDollar, FaTrash, FaDownload, FaPrint, FaEye } from "react-icons/fa";
import "../Style/EnterpriseTheme.css";

function Sales() {
    const [fuelType, setFuelType] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [liters, setLiters] = useState("");
    const [sales, setSales] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const GST_RATE = 0.18; // 18% GST mock
    const MOCK_PRICE_PER_LITER = { 'Petrol': 100, 'Diesel': 90 }; // Using mock prices for live calculate if not returned by backend immediately

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/sales");
            setSales(response.data);
        } catch (error) {
            console.error("Error fetching sales:", error);
        }
    };

    const handleAddSale = async () => {
        if (!fuelType || !customerName || !liters) {
            alert("Please fill all fields");
            return;
        }

        const newSale = { fuelType, customerName, liters };

        try {
            const response = await axios.post("http://localhost:8080/api/sales", newSale);
            const savedSale = response.data;
            alert("Sale Added Successfully! Generating Invoice...");
            
            fetchSales();
            
            setFuelType("");
            setCustomerName("");
            setLiters("");

            // Show invoice preview
            setSelectedInvoice(savedSale);

        } catch (error) {
            console.error(error);
            alert("Error adding sale");
        }
    };

    const deleteSale = async (id) => {
        if (!window.confirm("Are you sure you want to delete this sale?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/sales/${id}`);
            alert("Sale deleted successfully");
            fetchSales();
        } catch (error) {
            console.error(error);
            alert("Unable to delete sale");
        }
    };

    const calculateTotals = (sale) => {
        // Backend returns `amount` which is the total. We'll derive GST from it for display.
        const total = sale.amount;
        const baseAmount = total / (1 + GST_RATE);
        const gstAmount = total - baseAmount;
        return { baseAmount: baseAmount.toFixed(2), gstAmount: gstAmount.toFixed(2), total: total.toFixed(2) };
    };

    const generatePDF = (sale, action = 'download') => {
        const doc = new jsPDF();
        const { baseAmount, gstAmount, total } = calculateTotals(sale);
        
        doc.setFontSize(22);
        doc.text("Smart Fuel Station", 105, 20, { align: "center" });
        doc.setFontSize(14);
        doc.text("Tax Invoice", 105, 30, { align: "center" });
        
        doc.setFontSize(11);
        doc.text(`Bill No: #${sale.billNo}`, 14, 45);
        doc.text(`Date: ${sale.saleDate ? new Date(sale.saleDate).toLocaleString() : new Date().toLocaleString()}`, 14, 52);
        doc.text(`Customer Name: ${sale.customerName}`, 14, 59);

        doc.autoTable({
            startY: 70,
            head: [['Description', 'Quantity (Liters)', 'Base Amount', 'GST (18%)', 'Total Amount (INR)']],
            body: [
                [sale.fuelType, sale.liters, `Rs ${baseAmount}`, `Rs ${gstAmount}`, `Rs ${total}`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235] }
        });

        doc.text("Thank you for your business!", 105, doc.lastAutoTable.finalY + 20, { align: "center" });

        if (action === 'print') {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        } else {
            doc.save(`Invoice_${sale.billNo}.pdf`);
        }
    };

    // Live calculations for the form
    const currentPrice = fuelType ? MOCK_PRICE_PER_LITER[fuelType] : 0;
    const currentBase = liters ? (liters * currentPrice).toFixed(2) : 0;
    const currentGst = liters ? (liters * currentPrice * GST_RATE).toFixed(2) : 0;
    const currentTotal = liters ? (liters * currentPrice * (1 + GST_RATE)).toFixed(2) : 0;

    return (
        <div className="container-fluid mt-4 px-4">
            <PageHeader
                title="🧾 Point of Sale (POS)"
                subtitle="Process transactions, generate GST invoices, and manage sales records."
            />

            <div className="row g-4">
                {/* Sales Form */}
                <div className="col-md-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4 h-100">
                        <h5 className="text-white mb-4"><FaFileInvoiceDollar className="text-success me-2" /> New Sale</h5>
                        
                        <div className="mb-3">
                            <label className="text-muted small mb-1">Fuel Type</label>
                            <select className="form-select bg-dark text-white border-secondary" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                                <option value="">Select Fuel</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="text-muted small mb-1">Customer Name</label>
                            <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                        </div>

                        <div className="mb-4">
                            <label className="text-muted small mb-1">Quantity (Liters)</label>
                            <input type="number" className="form-control bg-dark text-white border-secondary" placeholder="0.00" value={liters} onChange={(e) => setLiters(e.target.value)} />
                        </div>

                        <div className="p-3 mb-4 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <div className="d-flex justify-content-between mb-2 text-muted small">
                                <span>Base Amount:</span>
                                <span>₹ {currentBase}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2 text-muted small">
                                <span>GST (18%):</span>
                                <span>₹ {currentGst}</span>
                            </div>
                            <hr className="border-secondary my-2" />
                            <div className="d-flex justify-content-between text-white fw-bold">
                                <span>Total Payable:</span>
                                <span>₹ {currentTotal}</span>
                            </div>
                        </div>

                        <button className="btn btn-success w-100 py-2 fw-bold" onClick={handleAddSale}>
                            Complete Sale & Generate Invoice
                        </button>
                    </motion.div>
                </div>

                {/* Sales Records & Invoice Preview */}
                <div className="col-md-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="text-white mb-0">Recent Transactions</h5>
                        </div>
                        
                        <div className="table-responsive" style={{ maxHeight: '400px' }}>
                            <table className="enterprise-table">
                                <thead>
                                    <tr>
                                        <th>Bill No</th>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Fuel</th>
                                        <th>Liters</th>
                                        <th>Total Amt</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.length > 0 ? (
                                        sales.map((sale) => (
                                            <tr key={sale.id}>
                                                <td className="fw-bold text-white">#{sale.billNo}</td>
                                                <td className="text-muted">{sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : 'N/A'}</td>
                                                <td>{sale.customerName}</td>
                                                <td>
                                                    <span className={`badge ${sale.fuelType.toLowerCase() === 'petrol' ? 'badge-warning' : 'badge-primary'}`}>
                                                        {sale.fuelType}
                                                    </span>
                                                </td>
                                                <td className="text-white">{sale.liters} L</td>
                                                <td className="text-success fw-bold">₹{sale.amount}</td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-outline-info me-2" title="Preview Invoice" onClick={() => setSelectedInvoice(sale)}>
                                                        <FaEye />
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => deleteSale(sale.id)}>
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted py-4">No Sales Records Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Invoice Preview Section */}
                    {selectedInvoice && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                            <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-3 mb-3">
                                <div>
                                    <h5 className="text-white mb-1">Invoice Preview</h5>
                                    <small className="text-muted">Bill No: #{selectedInvoice.billNo}</small>
                                </div>
                                <div>
                                    <button className="btn btn-primary me-2" onClick={() => generatePDF(selectedInvoice, 'download')}>
                                        <FaDownload className="me-2"/> Download PDF
                                    </button>
                                    <button className="btn btn-info" onClick={() => generatePDF(selectedInvoice, 'print')}>
                                        <FaPrint className="me-2"/> Print
                                    </button>
                                    <button className="btn btn-outline-secondary ms-2" onClick={() => setSelectedInvoice(null)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                            <div className="bg-white text-dark p-4 rounded shadow-sm">
                                <h3 className="text-center mb-0">Smart Fuel Station</h3>
                                <p className="text-center text-muted mb-4">Tax Invoice</p>
                                
                                <div className="row mb-4">
                                    <div className="col-sm-6">
                                        <strong>Bill To:</strong> {selectedInvoice.customerName}<br/>
                                        <strong>Date:</strong> {selectedInvoice.saleDate ? new Date(selectedInvoice.saleDate).toLocaleString() : new Date().toLocaleString()}
                                    </div>
                                    <div className="col-sm-6 text-end">
                                        <strong>Invoice #:</strong> {selectedInvoice.billNo}
                                    </div>
                                </div>

                                <table className="table table-bordered">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Description</th>
                                            <th>Quantity</th>
                                            <th>Base Amt</th>
                                            <th>GST (18%)</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{selectedInvoice.fuelType} Fuel</td>
                                            <td>{selectedInvoice.liters} L</td>
                                            <td>₹ {calculateTotals(selectedInvoice).baseAmount}</td>
                                            <td>₹ {calculateTotals(selectedInvoice).gstAmount}</td>
                                            <td className="fw-bold">₹ {calculateTotals(selectedInvoice).total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p className="text-center text-muted mt-4 mb-0">Thank you for your business!</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sales;