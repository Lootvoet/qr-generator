import { QRStyle } from '../QRCode.tsx';
import QRCode from '../lib/QRCode.ts';

interface DrawQRCodeOptions {
  qrCode: QRCode,
  qrSize: number,
  context: CanvasRenderingContext2D,
  style: QRStyle,
  foregroundColor: string,
  backgroundColor: string,
  imageWidth?: number,
  imageHeight?: number,
}

interface DrawImageOptions {
  src: string,
  context: CanvasRenderingContext2D,
  qrSize: number,
  imageWidth: number,
  imageHeight: number,
  color: string,
}

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

const isNeighborFilled = (x: number, y: number, dx: number, dy: number, modules: (boolean | null)[][]) => {
  return modules[y + dy] && modules[y + dy][x + dx];
};

const overlapsWithImage = (
  qrSize: number,
  cellSize: number,
  cellIndex: number,
  rowIndex: number,
  imageWidth?: number,
  imageHeight?: number
) => {
  if (!imageWidth || !imageHeight) {
    return false;
  }
  const x = cellIndex * cellSize;
  const y = rowIndex * cellSize;
  const centerImageX = (qrSize - imageWidth!) / 2;
  const centerImageY = (qrSize - imageHeight!) / 2;
  return x + cellSize >= centerImageX && x <= centerImageX + imageWidth! &&
    y + cellSize >= centerImageY && y <= centerImageY + imageHeight!;
}

export const drawQRCode = (options: DrawQRCodeOptions) => {
  const {
    qrCode,
    qrSize,
    context,
    style,
    foregroundColor,
    backgroundColor,
    imageWidth,
    imageHeight
  } = options;

  const cellSize = qrSize / qrCode.modules.length;
  const radius = cellSize * 0.6;

  qrCode.modules.forEach((row: (boolean | null)[], rowIndex: number) => {
    row.forEach((cell: boolean | null, cellIndex: number) => {
      const x = cellIndex * cellSize;
      const y = rowIndex * cellSize;

      const overlapsWithCenterImage = overlapsWithImage(qrSize, cellSize, cellIndex, rowIndex, imageWidth, imageHeight);

      context.fillStyle = cell && !overlapsWithCenterImage ? foregroundColor : backgroundColor;
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
}

export const drawImage = (options: DrawImageOptions) => {
  const {
    src,
    context,
    qrSize,
    imageWidth,
    imageHeight,
    color,
  } = options;

  const img = new Image();
  img.src = src;
  img.onload = () => {
    const x = (qrSize - imageWidth!) / 2;
    const y = (qrSize - imageHeight!) / 2;

    context.fillStyle = color;

    drawRoundedRect(context, x, y, imageWidth!, imageHeight!, 5);

    // Draw the center image itself
    context.drawImage(img, x, y, imageWidth, imageHeight);
  };
}