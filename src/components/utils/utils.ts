import QRCode from '../lib/QRCode.ts';
import { ErrorCorrectLevel } from '../lib/errorCorrectLevel.ts';

export const generateQrCode = (data: string) : QRCode => {
  const qr = new QRCode(-1, ErrorCorrectLevel.H);
  qr.addData(data);
  qr.make();

  return qr;
};