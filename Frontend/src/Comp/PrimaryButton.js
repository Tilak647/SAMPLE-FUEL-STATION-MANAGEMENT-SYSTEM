import React from "react";

function PrimaryButton({
    text,
    icon,
    onClick
}){

    return(

        <button
            className="btn btn-primary-ui"
            onClick={onClick}
        >
            {icon}

            <span className="ms-2">

                {text}

            </span>

        </button>

    );

}

export default PrimaryButton;