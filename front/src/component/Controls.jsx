import React, { useRef, useEffect } from 'react';


const buttonsCodes =
    ['load','clear'];

const ControlButton = ({ text }) => {
    return (
        <div className="control-button">
            {text}
        </div>

    );
}

const Controls = () => {
    return (
        <div id="control_panel">
            {buttonsCodes.map((e) => {
                return <ControlButton
                    key={e}
                    text={e}
                    ico={e}


                />

            })


            }


        </div>

    );
};
export default Controls;