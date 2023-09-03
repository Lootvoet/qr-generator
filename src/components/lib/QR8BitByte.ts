import { QRMode } from './qrMode';

interface BufferType {
  put: (data: number, bitLength: number) => void;
}

class QR8BitByte {
  mode: QRMode;
  data: string;

  constructor(data: string) {
    this.mode = QRMode.MODE_8BIT_BYTE;
    this.data = data;
  }

  getLength(): number {
    return this.data.length;
  }

  write(buffer: BufferType): void {
    for (let i = 0; i < this.data.length; i++) {
      // not JIS ...
      buffer.put(this.data.charCodeAt(i), 8);
    }
  }
}

export default QR8BitByte;
