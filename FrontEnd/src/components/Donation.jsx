// src/DonationPage.js
import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import './styles/Donation.css'; // Import the CSS file

const DonationPage = () => {
    const [amount, setAmount] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [payUrl, setPayUrl] = useState(''); // State to hold the generated pay URL

    const handleDonate = () => {
        if (!amount) {
            alert('Please enter a donation amount.');
            return;
        }

        // Check if the user is on a mobile device
        setIsMobile(/Mobi|Android/i.test(navigator.userAgent));

        // Create a UPI link with your UPI ID and the amount
        const upiId = 'shezilaman@oksbi'; // Your UPI ID
        const transactionId = `TransactionId_${Date.now()}_${Math.floor(Math.random() * 10000)}`; // Unique transaction ID
        const newPayUrl = `upi://pay?pa=${upiId}&pn=NoQ&tid=${transactionId}&tn=Donation&am=${amount}&cu=INR`;
        setPayUrl(newPayUrl); // Set the generated pay URL

        // Show the QR code
        setShowQRCode(true);

        // If on mobile, open the UPI app
        if (isMobile) {
            window.open(newPayUrl, '_blank');
        }
    };

    return (
        <div className="donation-container">
            <h1 className="donation-title">Support NoQ</h1>
            <p className="donation-description">
                NoQ is a growing project, and your donations will be incredibly helpful in making it better and expanding our reach.
            </p>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter donation amount in INR"
                className="donation-input"
            />
            <br />
            <button onClick={handleDonate} className="donate-button">
                Donate
            </button>

            {showQRCode && (
                <div className="qr-code-container">
                    <h2>Scan to Donate</h2>
                    <QRCode value={payUrl} /> {/* Use the dynamic pay URL */}
                    <p>Open your UPI app and scan the QR code to complete your donation.</p>
                </div>
            )}
        </div>
    );
};

export default DonationPage;
