import React, { useRef, useEffect } from 'react';
import { drawElement, getWH } from '../helpers/geo.js';
const elemSize = 50;
const elemMargin = 5;





const LibraryItem = ({ elem }) => {
    const canvasRef = useRef(null);

    // draw principial
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');



        ctx.clearRect(0, 0, elemSize, elemSize);
        drawElement(elem, 3, { x: elemSize / 2, y: elemSize / 2 }, ctx);

    }, [elem]);

    // store elem in drag object
    const handleDragStart = (e) => {
        e.dataTransfer.setData('compData', JSON.stringify(elem));
        e.dataTransfer.effectAllowed = 'move';
    };
    return (
        <div
            draggable="true"
            onDragStart={handleDragStart}
            className="library-item"
            style={{ '--element-width': `${elemSize}px`, '--element-height': `${elemSize}px` }}
        >
            <canvas ref={canvasRef} width={elemSize} height={elemSize} />
            <div className='label'>{elem.name}</div>
        </div>

    );

}

const Library = ({ elems }) => {


    return (
        <div id="library">
            {elems.map((elem) => {
                return <LibraryItem
                    key={elem.id}
                    elem={elem}

                />
            })


            }
        </div>

    );
};
export default Library;