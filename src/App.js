import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Comp/Navbar";

import Dashboard from "./Pages/Dashboard";
import FuelInventory from "./Pages/FuelInventory";
import Sales from "./Pages/Sales";
import Employees from "./Pages/Employees";
import Reports from "./Pages/Reports";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fuel" element={<FuelInventory />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;