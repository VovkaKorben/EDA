import React, { useRef, useEffect } from 'react';


const buttonsCodes = [
    { id: 1, caption: 'load', ico: '' },
    { id: 2, caption: 'clear', ico: '' }
]

const ControlButton = ({ text, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="control-button">
            {text}
        </div>
    );
}

const Controls = ({ onAction }) => {
    return (
        <div id="control_panel">
            {buttonsCodes.map((e) => {
                return <ControlButton
                    key={e.id}
                    text={e.caption}
                    ico={e.ico}
                    onClick={() => onAction(e.id)}

                />

            })


            }


        </div>

    );
};
export default Controls;