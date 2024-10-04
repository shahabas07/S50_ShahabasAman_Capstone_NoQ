import React, { useState } from "react";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function QR({ serviceCategory, serviceName }) {
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const copyToClipboard = () => {
    const linkToCopy = window.location.href;
    navigator.clipboard.writeText(linkToCopy);
  };

  const downloadQR = () => {
    const container = document.getElementById("qr-code-container");

    html2canvas(container).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      pdf.setFontSize(18);
      const pageWidth = pdf.internal.pageSize.getWidth();

      const serviceNameText = `Service Provider: ${typeof serviceName === 'object' ? JSON.stringify(serviceName) : serviceName}`;
      const serviceCategoryText = `Service Category: ${typeof serviceCategory === 'object' ? JSON.stringify(serviceCategory) : serviceCategory}`;

      pdf.text(serviceNameText, pageWidth / 2, 30, { align: "center" });
      pdf.text(serviceCategoryText, pageWidth / 2, 40, { align: "center" });

      pdf.addImage(imageData, "PNG", 60, 50, 90, 90);

      pdf.setFontSize(12);
      pdf.text("Scan the QR code to book your slot", pageWidth / 2, 160, { align: "center" });
      pdf.text("Thank you for choosing our service!", pageWidth / 2, 180, { align: "center" });

      pdf.save("SlotBookingQRCode.pdf");

      setPdfGenerated(true);
    });
  };

  return (
    <div className="relative m-10 ">
      <div id="qr-code-container" className="flex justify-center mt-20">
        <QRCode value={window.location.href} size={356} />
      </div>

      <div className="flex justify-between mt-5">
        <button
          onClick={copyToClipboard}
          className="mr-4 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-full shadow-lg focus:outline-none focus:shadow-outline transform transition-transform duration-300 hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 16 16"
            className="inline-block"
          >
            <path
              fill="currentColor"
              d="M4.00029246,4.08524952 L4,10.5 C4,11.8254834 5.03153594,12.9100387 6.33562431,12.9946823 L6.5,13 L10.9143985,13.000703 C10.7082819,13.5829319 10.1528467,14 9.5,14 L6,14 C4.34314575,14 3,12.6568542 3,11 L3,5.5 C3,4.84678131 3.41754351,4.29108512 4.00029246,4.08524952 Z M11.5,2 C12.3284271,2 13,2.67157288 13,3.5 L13,10.5 C13,11.3284271 12.3284271,12 11.5,12 L6.5,12 C5.67157288,12 5,11.3284271 5,10.5 L5,3.5 C5,2.67157288 5.67157288,2 6.5,2 L11.5,2 Z M11.5,3 L6.5,3 C6.22385763,3 6,3.22385763 6,3.5 L6,10.5 C6,10.7761424 6.22385763,11 6.5,11 L11.5,11 C11.7761424,11 12,10.7761424 12,10.5 L12,3.5 C12,3.22385763 11.7761424,3 11.5,3 Z"
            ></path>
          </svg>
        </button>

        <button
          onClick={downloadQR}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 font-bold rounded-full shadow-lg focus:outline-none focus:shadow-outline transform transition-transform duration-300 hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            className="inline-block"
          >
            <g
              fill="none"
              fill-rule="evenodd"
              stroke="currentColor"
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
        <p className="text-green-600 mt-3">PDF generated successfully!</p>
      )}
    </div>
  );
}

export default QR;
