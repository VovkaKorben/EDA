import React, { useRef, useEffect, useState, useCallback } from 'react';
import { dpr } from '../helpers/utils.js';
import { clamp, drawElement } from '../helpers/geo.js';
const zoomLevels = [1, 2, 4, 8, 16, 32];

const SchemaCanvas = ({ libElements, schemaElements, onElementDropped }) => {
    const canvasRef = useRef(null);
    const [view, setView] = useState(() => {
        const saved = localStorage.getItem('view');
        return saved ? JSON.parse(saved) : { zoomIndex: 2, x: 0, y: 0 };
    });
    const drawAll = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const zoom = zoomLevels[view.zoomIndex];
  console.log('--------------------------------');
        // 2. Проходим по всем элементам на схеме
        schemaElements.forEach(elem => {
            // Вычисляем экранную позицию центра элемента:
            // x_screen = x_world * zoom + view.x
            const pos = {
                x: elem.x * zoom + view.x,
                y: elem.y * zoom + view.y
            };
            const libElement = libElements[elem.type];

            console.log(elem.debug, pos);
            drawElement(libElement, zoom, pos, ctx);
            // Твоя универсальная процедура рисования (уже с save/restore внутри)
            // drawElement(elem, zoom, screenPos, ctx);
        });

        // Тут позже добавим рисование сетки и проводов
    }, [view, libElements, schemaElements]); // Пересоздаем функцию только если изменился зум, позиция или массив элементов

    // ResizeObserver
    useEffect(() => {
        drawAll();
    }, [drawAll]);

    // update canvas size
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const resizeObserver = new ResizeObserver(() => {
            const { clientWidth, clientHeight } = canvas;
            canvas.width = clientWidth * dpr;
            canvas.height = clientHeight * dpr;
        });
        resizeObserver.observe(canvas);
        return () => resizeObserver.disconnect();
    }, []);


    // POS + ZOOM
    useEffect(() => {
        localStorage.setItem('view', JSON.stringify(view));
    }, [view]);
    const handleWheel = (e) => {
        const canvasRect = e.currentTarget.getBoundingClientRect()
        const mousePos = {
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top
        }
        const wheel_dir = Math.sign(e.deltaY);
        setView(prev => {
            const oldZoomIndex = prev.zoomIndex;
            const newZoomIndex = clamp(oldZoomIndex + wheel_dir, 0, zoomLevels.length - 1);
            const ratio = newZoomIndex / oldZoomIndex;
            const new_view = {
                zoomIndex: newZoomIndex,
                x: mousePos.x - (mousePos.x - prev.x) * ratio,
                y: mousePos.y - (mousePos.y - prev.y) * ratio,
            };
            return new_view;
        });
    };





    const handleDragOver = (e) => {
        e.preventDefault(); // РАЗРЕШАЕМ DROP
    };
    const handleDrop = (e) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('compData'));

        // Считаем координаты относительно холста
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Передаём наверх в App информацию: ЧТО и КУДА бросили
        onElementDropped(data, x, y);
    };


    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Точный расчет координат клика относительно логического поля
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'blue';

        // Рисуем компонент (в будущем — берем из localStorage)
        drawCircle(ctx, x, y, 10);

        console.log(`Команда в базу: c(${x.toFixed(0)},${y.toFixed(0)},10)`);
    };

    return (

        <canvas
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onWheel={handleWheel}
            ref={canvasRef}
            // onMouseDown={onWheel}
            style={{
                width: '90%',
                height: '90%',
                display: 'block',
                border: '2px solid #333',
                background: '#fff',
                cursor: 'crosshair'
            }}
        />


    );
};

export default SchemaCanvas;
