import React, { useRef, useEffect, useState, useCallback } from 'react';
import { dpr } from '../helpers/utils.js';
import { clamp } from '../helpers/geo.js';
// Константы вынесены вверх для удобства настройки сетки
const logicalWidth = 300;
const logicalHeight = 300;
const zoomLevels = [1, 2, 4, 8, 16, 32];

const SchemaCanvas = ({ elements,onElementDropped }) => {
    const canvasRef = useRef(null);
    const [view, setView] = useState(() => {
        const saved = localStorage.getItem('view');
        return saved ? JSON.parse(saved) : { zoomIndex: 2, x: 0, y: 0 };
    });
    const drawAll = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // 1. Чистим холст перед каждым кадром
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const zoom = zoomLevels[view.zoomIndex];

        // 2. Проходим по всем элементам на схеме
        elements.forEach(elem => {
            // Вычисляем экранную позицию центра элемента:
            // x_screen = x_world * zoom + view.x
            const screenPos = {
                x: elem.x * zoom + view.x,
                y: elem.y * zoom + view.y
            };

            // Твоя универсальная процедура рисования (уже с save/restore внутри)
            drawElement(elem, zoom, screenPos, ctx);
        });

        // Тут позже добавим рисование сетки и проводов
    }, [view, elements]); // Пересоздаем функцию только если изменился зум, позиция или массив элементов
    // ResizeObserver
    useEffect(() => {
        drawAll();
    }, [drawAll]);

    // ДОБАВИТЬ: Следим за размером и убираем "мыло"
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeObserver = new ResizeObserver(() => {
            // 1. Берем размеры, которые нарисовал нам ГРИД (из CSS)
            const { clientWidth, clientHeight } = canvas;

            // 2. Устанавливаем внутреннее разрешение холста
            // Если хочешь идеальную четкость на 4K (Retina), умножай на window.devicePixelRatio
            canvas.width = clientWidth;
            canvas.height = clientHeight;

            // ВАЖНО: При изменении размера канвас самоочищается.
            // Если у тебя уже есть функция отрисовки, вызывай её здесь:
            // requestAnimationFrame(drawAll);
        });

        resizeObserver.observe(canvas);

        // Не забываем прибраться за собой
        return () => resizeObserver.disconnect();
    }, []); // Пустой массив, запускаем один раз при монтировании


    // ZOOM

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
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        // Настройка физического разрешения (буфера)
        canvas.width = logicalWidth * dpr;
        canvas.height = logicalHeight * dpr;

        // Настройка визуального размера
        canvas.style.width = `${logicalWidth}px`;
        canvas.style.height = `${logicalHeight}px`;

        // Масштабируем контекст, чтобы координаты G-кода были независимы от экрана
        ctx.scale(dpr, dpr);

        // Тестовая рамка рабочей области
        ctx.strokeStyle = '#ddd';
        ctx.strokeRect(0, 0, logicalWidth, logicalHeight);
    }, []);

    const drawCircle = (ctx, x, y, r = 5) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
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
        <div
            className="schema-canvas"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onWheel={handleWheel}
        >
            <canvas
                ref={canvasRef}
                // onMouseDown={onWheel}
                style={{
                    border: '2px solid #333',
                    background: '#fff',
                    cursor: 'crosshair'
                }}
            />
        </div >

    );
};

export default SchemaCanvas;