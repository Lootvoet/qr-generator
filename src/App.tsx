import React from 'react'
import QRCode, { QRStyle } from './components/QRCode';

const App: React.FC = () => {
  return (
    <div>
      <h1>Custom QR Code Generator</h1>
      <QRCode
        value="https://www.easyserve.be"
        size={300}
        bgColor="#FFFFFF"
        fgColor="#000000"
        style={QRStyle.Rounded}
        centerImageSrc="https://www.kadencewp.com/wp-content/uploads/2020/10/alogo-2.png"
        centerImageSize={90}
      />
    </div>
  );
};

export default App
