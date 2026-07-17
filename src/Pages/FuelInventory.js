import { useState } from "react";

function FuelInventory() {

    const [fuelType, setFuelType] = useState("");
    const [quantity, setQuantity] = useState("");

    const handleSubmit = () => {
    alert(
        `Fuel: ${fuelType}\nQuantity: ${quantity}`
    );
};

    return (
    <div>

        <h2>Fuel Inventory</h2>

        <input
        className="form-control mb-2"
        placeholder="Fuel Type"
        value={fuelType}
        onChange={(e)=>setFuelType(e.target.value)}
        />

        <input
        className="form-control mb-2"
        placeholder="Quantity"
        value={quantity}
        onChange={(e)=>setQuantity(e.target.value)}
        />

        <button
        className="btn btn-primary"
        onClick={handleSubmit}
        >
        Add Fuel
        </button>

    </div>
);
}

export default FuelInventory;