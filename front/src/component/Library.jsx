import React, { useRef, useEffect } from 'react';
import { getWH } from '../helpers/geo.js';
const elemSize = 100;
const elemMargin = 5;

const parseDraw = (elem, ctx) => {
    // console.log(draw);
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const [pw, ph] = getWH(elem.bounds);
    // console.log(pw, ph);
    const z = Math.min((elemSize - elemMargin * 2) / pw, (elemSize - elemMargin * 2) / ph);
    // console.log(z);

    for (const prim of elem.turtle) {

        ctx.beginPath();
        switch (prim.code) {
            case 'R': {// rectangle
                let [x, y, w, h] = prim.params;
                x = Math.round(x * z) + 0.5;
                y = Math.round(y * z) + 0.5;
                w = Math.round(w * z);
                h = Math.round(h * z);
                ctx.rect(x, y, w, h);
                ctx.stroke();
            } break;
            case 'L': {// line
                let [x, y, x2, y2] = prim.params;
                x = Math.round(x * z) + 0.5;
                y = Math.round(y * z) + 0.5;
                x2 = Math.round(x2 * z) + 0.5;
                y2 = Math.round(y2 * z) + 0.5;

                ctx.moveTo(x, y);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            } break;
            case 'C': {// circle
                let [x, y, r] = prim.params;
                x = Math.round(x * z) + 0.5;
                y = Math.round(y * z) + 0.5;
                r = Math.round(r * z);

                ctx.arc(x, y, r, 0, 2 * Math.PI);
                ctx.stroke();
            } break;
            case 'P': {// polyline
                const paramsLen = prim.params.length;
                for (let p = 0; p < paramsLen; p += 2) {
                    let [x, y] = prim.params.slice(p, p + 2);
                    x = Math.round(x * z) + 0.5;
                    y = Math.round(y * z) + 0.5;
                    if (p === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }

                }

                // check if params count is odd, get last
                let style = 0;
                if (paramsLen % 2) {
                    style = prim.params[paramsLen - 1];
                }
                switch (style) {
                    case 0: ctx.stroke(); break; // 0 polyline
                    case 1: ctx.closePath(); ctx.stroke(); break;// 1 polygon
                    case 2: ctx.closePath(); ctx.fill(); break;  // 2 filled polygon
                }

            } break;
        }
    }


}




const LibraryItem = ({ elem }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // 1. Очистка перед перерисовкой
        ctx.clearRect(0, 0, elemSize, elemSize);

        // 2. Настройка масштаба и центра (0,0 в центре канваса)
        ctx.save();
        ctx.translate(elemSize / 2, elemSize / 2);

        parseDraw(elem, ctx);
        // Тут вызывается твой парсер для строки turtle
        // Например: parseMyGCode(turtle, ctx);

        ctx.restore();
    }, [elem]); // Перерисовывать, если изменилась строка отрисовки

    return (
        <div
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