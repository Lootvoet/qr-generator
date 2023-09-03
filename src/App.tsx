import React from 'react'
import QRCode, { QRStyle } from './components/QRCode';

const App: React.FC = () => {
  return (
    <div>
      <h1>Custom QR Code Generatxor</h1>
      <QRCode
        value="https://www.easyserve.be"
        size={600}
        backgroundColor="#FFFFFF"
        foregroundColor="#0F3D9C"
        style={QRStyle.Rounded}
        imageSource="https://imageupload.io/ib/pm8dikxeoNHptD0_1693744010.png"
        imageWidth={350}
      />
    </div>
  );
};

export default App
