import React, { useRef, useEffect } from 'react';
import { prettify } from '../helpers/debug.js';



const ElementsList = ({ elements }) => {
    return (
        <React.Fragment>

            {elements.map((e) => {
                return <div
                    key={e.id}
                    className='elements-list'
                >
                  {prettify(e)}

                </div>

            })


            }
        </React.Fragment>



    );
};
export default ElementsList;

// <div id="control_panel">
// </div>