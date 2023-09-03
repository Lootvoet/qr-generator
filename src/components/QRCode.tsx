import React, { useCallback, useEffect, useRef } from 'react';
import { generateQrCode, getImageAsync } from './utils/qrCode';
import { drawImage, drawQRCode } from './utils/drawing.ts';

export enum QRStyle {
  Normal = 'Normal',
  Dots = 'Dots',
  Rounded = 'Rounded',
}

interface QRCodeProps {
  value: string;
  size: number;
  backgroundColor: string;
  foregroundColor: string;
  style: QRStyle;
  imageSource?: string;
  imageWidth?: number;
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  size,
  backgroundColor,
  foregroundColor,
  style,
  imageSource,
  imageWidth,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawCanvas = useCallback(async (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, size, size);

    const qrCode = generateQrCode(value);

    let imageHeight = 0;

    if (imageSource && imageWidth) {
      try {
        const imageMetaData = await getImageAsync(imageSource);
        const aspectRatio =  imageMetaData.width / imageWidth;
        imageHeight = imageMetaData.height / aspectRatio
      } catch (error) {
        console.error(error);
      }
    }

    drawQRCode({
      qrCode,
      qrSize: size,
      context,
      style,
      backgroundColor: backgroundColor,
      foregroundColor: foregroundColor,
      imageWidth,
      imageHeight
    });

    if (imageSource && imageWidth) {
      drawImage({
        src: imageSource,
        context, qrSize:
        size,
        imageWidth,
        imageHeight,
        color: backgroundColor
      });
    }
  }, [value, size, backgroundColor, foregroundColor, style, imageSource, imageWidth]);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        drawCanvas(context);
      }
    }
  }, [value, size, backgroundColor, foregroundColor, style, imageSource, imageWidth]);

  return <canvas ref={canvasRef} width={size} height={size}></canvas>;
};

export default QRCode;
