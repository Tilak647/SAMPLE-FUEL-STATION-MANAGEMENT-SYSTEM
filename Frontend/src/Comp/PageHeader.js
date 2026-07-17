import React from "react";

function PageHeader({ title, subtitle }) {
    return (
        <div className="mb-4">
            <h2
                style={{
                    fontWeight: "700",
                    color: "#1E293B"
                }}
            >
                {title}
            </h2>

            <p
                style={{
                    color: "#64748B",
                    marginTop: "8px"
                }}
            >
                {subtitle}
            </p>
        </div>
    );
}

export default PageHeader;