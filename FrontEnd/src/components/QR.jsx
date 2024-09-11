import React, { useState } from "react";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function QR() {
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const copyToClipboard = () => {
    const linkToCopy = window.location.href;
    navigator.clipboard.writeText(linkToCopy);
  };

  const downloadQR = () => {
    html2canvas(document.getElementById("qr-code-container")).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imageData, "PNG", 60, 50);
      pdf.save("QRCode.pdf");
      setPdfGenerated(true);
    });
  };

  return (
    <div className="m-10 relative">
      <div id="qr-code-container">
        <QRCode value={window.location.href} size={356} />
      </div>
      <div className="flex justify-between">
        <button
          onClick={copyToClipboard}
          className="mr-4 mt-5 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 16 16"
            id="copy"
          >
            <path
              fill="#212121"
              d="M4.00029246,4.08524952 L4,10.5 C4,11.8254834 5.03153594,12.9100387 6.33562431,12.9946823 L6.5,13 L10.9143985,13.000703 C10.7082819,13.5829319 10.1528467,14 9.5,14 L6,14 C4.34314575,14 3,12.6568542 3,11 L3,5.5 C3,4.84678131 3.41754351,4.29108512 4.00029246,4.08524952 Z M11.5,2 C12.3284271,2 13,2.67157288 13,3.5 L13,10.5 C13,11.3284271 12.3284271,12 11.5,12 L6.5,12 C5.67157288,12 5,11.3284271 5,10.5 L5,3.5 C5,2.67157288 5.67157288,2 6.5,2 L11.5,2 Z M11.5,3 L6.5,3 C6.22385763,3 6,3.22385763 6,3.5 L6,10.5 C6,10.7761424 6.22385763,11 6.5,11 L11.5,11 C11.7761424,11 12,10.7761424 12,10.5 L12,3.5 C12,3.22385763 11.7761424,3 11.5,3 Z"
            ></path>
          </svg>
        </button>
        <button
          onClick={downloadQR}
          className="bg-violet-600 hover:bg-violet-700 text-white  mt-5 px-4 font-bold rounded-full focus:outline-none focus:shadow-outline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            id="download"
            className=" "
          >
            <g
              fill="none"
              fill-rule="evenodd"
              stroke="#000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path d="M1 16v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M6 11l4 4 4-4M10 1v14"></path>
            </g>
          </svg>
        </button>
      </div>
      {pdfGenerated && (
        <p className="text-green-600">PDF generated successfully!</p>
      )}
    </div>
  );
}

export default QR;
