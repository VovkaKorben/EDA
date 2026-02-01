import { useRef, useEffect } from 'react';
import { drawElement } from '../helpers/geo.js';
const elemSize = 50;
const elemMargin = 5;





const LibraryItem = ({ elem }) => {
    const canvasRef = useRef(null);

    // draw principial
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, elemSize, elemSize);

        const toDraw = {
            ...elem,
            pos: {
                x: elemSize / 2,
                y: elemSize / 2
            },
            zoom: 2,
            rotate: 0,
        };

        drawElement(toDraw, ctx);

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
// //{elems.map((elem) => {
const Library = ({ elems }) => {


    return (
        <div id="library">
            {Object.values(elems).map((elem) => {

                return <LibraryItem
                    key={elem.type_id}
                    elem={elem}

                />
            })


            }
        </div>

    );
};
export default Library;