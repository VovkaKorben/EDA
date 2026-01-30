import React, { useRef, useEffect } from 'react';
import { dpr } from '../helpers/utils.js';
// Константы вынесены вверх для удобства настройки сетки
const logicalWidth = 300;
const logicalHeight = 300;

const SchemaCanvas = () => {
  const canvasRef = useRef(null);

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

    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      style={{
        border: '2px solid #333',
        background: '#fff',
        cursor: 'crosshair'
      }}
    />


  );
};

export default SchemaCanvas;