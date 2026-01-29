import React, { useRef, useEffect } from 'react';


const elems =
    ['1', '2', '3', '4']

const LibraryItem = ({ draw, label }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // 1. Очистка перед перерисовкой
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. Настройка масштаба и центра (0,0 в центре канваса)
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Тут вызывается твой парсер для строки draw
        // Например: parseMyGCode(draw, ctx);

        ctx.restore();
    }, [draw]); // Перерисовывать, если изменилась строка отрисовки

    return (
        <div className="library-item">
            <canvas ref={canvasRef} width="50" height="50" />
            <div className='label'>12</div>
        </div>

    );

}

const Library = () => {
    return (
        <div id="library">
            {elems.map((e) => {
                return <LibraryItem key={e} />

            })


            }
            {/* <canvas /> */}
        </div>

    );
};
export default Library;