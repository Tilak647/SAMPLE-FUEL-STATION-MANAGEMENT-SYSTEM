import React from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar({ placeholder, value, onChange }) {

    return (

        <div className="input-group mb-4">

            <span className="input-group-text bg-white">
                <FaSearch />
            </span>

            <input
                type="text"
                className="form-control input-ui"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />

        </div>

    );

}

export default SearchBar;