import React from "react";

function DataTable({ children }) {

    return (

        <div className="table-ui">

            <table className="table table-hover mb-0">

                {children}

            </table>

        </div>

    );

}

export default DataTable;