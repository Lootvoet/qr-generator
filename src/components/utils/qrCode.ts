import QRCode from '../lib/QRCode';
import { ErrorCorrectLevel } from '../lib/errorCorrectLevel';

export const generateQrCode = (data: string) : QRCode => {
  const qr = new QRCode(-1, ErrorCorrectLevel.H);
  qr.addData(data);
  qr.make();

  return qr;
};

export const getImageAsync: (url: string) => Promise<HTMLImageElement> = (url) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  });
}