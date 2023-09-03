import React, { useEffect, useRef } from 'react';
import { generateQrCode } from './utils/utils';

export enum QRStyle {
  Normal = 'Normal',
  Dots = 'Dots',
  Rounded = 'Rounded',
}

interface QRCodeProps {
  value: string;
  size: number;
  bgColor: string;
  fgColor: string;
  style: QRStyle;
  centerImageSrc?: string;
  centerImageSize?: number;
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  size,
  bgColor,
  fgColor,
  style,
  centerImageSrc,
  centerImageSize = 30,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
  };

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, size, size);
        const qrCode = generateQrCode(value);

        const cellSize = size / qrCode.modules.length;
        const radius = cellSize * 0.7;

        const isNeighborFilled = (x: number, y: number, dx: number, dy: number, modules: any[][]) => {
          return modules[y + dy] && modules[y + dy][x + dx];
        };

        qrCode.modules.forEach((row: any[], rowIndex: number) => {
          row.forEach((cell: boolean, cellIndex: number) => {
            context.fillStyle = cell ? fgColor : bgColor;
            const x = cellIndex * cellSize;
            const y = rowIndex * cellSize;
            if (style == QRStyle.Rounded) {
              context.beginPath();

              // Top-left
              if (!isNeighborFilled(cellIndex, rowIndex, -1, 0, qrCode.modules) &&
                !isNeighborFilled(cellIndex, rowIndex, 0, -1, qrCode.modules)) {
                context.moveTo(x, y + radius);
                context.arcTo(x, y, x + radius, y, radius);
              } else {
                context.moveTo(x, y);
              }

              // Top-right
              if (!isNeighborFilled(cellIndex, rowIndex, 1, 0, qrCode.modules) &&
                !isNeighborFilled(cellIndex, rowIndex, 0, -1, qrCode.modules)) {
                context.lineTo(x + cellSize - radius, y);
                context.arcTo(x + cellSize, y, x + cellSize, y + radius, radius);
              } else {
                context.lineTo(x + cellSize, y);
              }

              // Bottom-right
              if (!isNeighborFilled(cellIndex, rowIndex, 1, 0, qrCode.modules) &&
                !isNeighborFilled(cellIndex, rowIndex, 0, 1, qrCode.modules)) {
                context.lineTo(x + cellSize, y + cellSize - radius);
                context.arcTo(x + cellSize, y + cellSize, x + cellSize - radius, y + cellSize, radius);
              } else {
                context.lineTo(x + cellSize, y + cellSize);
              }

              // Bottom-left
              if (!isNeighborFilled(cellIndex, rowIndex, -1, 0, qrCode.modules) &&
                !isNeighborFilled(cellIndex, rowIndex, 0, 1, qrCode.modules)) {
                context.lineTo(x + radius, y + cellSize);
                context.arcTo(x, y + cellSize, x, y + cellSize - radius, radius);
              } else {
                context.lineTo(x, y + cellSize);
              }

              context.closePath();
              context.fill();
            } else if (style == QRStyle.Dots) {
              context.beginPath();
              context.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, Math.PI * 2, true);
              context.closePath();
              context.fill();
            } else {
              context.fillRect(x, y, cellSize, cellSize);
            }
          });
        });

        // Draw center image if exists
        if (centerImageSrc) {
          const img = new Image();
          img.src = centerImageSrc;
          img.onload = () => {
            // Draw semi-transparent, rounded background for center image
            const x = (size - centerImageSize!) / 2;
            const y = (size - centerImageSize!) / 2;

            context.globalAlpha = 0.9; // Set opacity level (0 to 1)
            context.fillStyle = bgColor; // White background

            drawRoundedRect(context, x, y, centerImageSize!, centerImageSize!, 5);

            context.globalAlpha = 1; // Reset opacity to fully opaque

            // Draw the center image itself
            context.drawImage(img, x, y, centerImageSize!, centerImageSize!);
          };

        }
      }
    }
  }, [value, size, bgColor, fgColor, style, centerImageSrc, centerImageSize]);

  return <canvas ref={canvasRef} width={size} height={size}></canvas>;
};

export default QRCode;
