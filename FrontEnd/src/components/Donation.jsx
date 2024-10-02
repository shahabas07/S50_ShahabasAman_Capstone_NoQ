import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import './styles/Donation.css'; // Import the CSS file

const DonationPage = () => {
    const [amount, setAmount] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [payUrl, setPayUrl] = useState(''); // State to hold the generated pay URL

    useEffect(() => {
        setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    }, []);

    const handleDonate = () => {
        if (!amount) {
            alert('Please enter a donation amount.');
            return;
        }

        // Create a UPI link with your UPI ID and the amount
        const upiId = 'shezilaman@oksbi'; // Your UPI ID
        const transactionId = `Txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`; // Unique transaction ID
        const newPayUrl = `upi://pay?pa=${upiId}&pn=NoQ&tid=${transactionId}&tn=Donation&am=${amount}&cu=INR`;
        setPayUrl(newPayUrl); // Set the generated pay URL
        console.log(newPayUrl)

        // Show the QR code with a small delay for animation
        setTimeout(() => {
            setShowQRCode(true);
        }, 300); // Delay before showing the QR code

        // If on mobile, open the UPI app
        if (isMobile) {
            window.open(newPayUrl, '_blank');
        }
    };

    return (
        <>
            <div><a href="/" className="logo text-black pl-6 fixed">
                NoQ
            </a></div>
            <div className="dotbg flex items-center justify-center h-screen">
                <div className="donation-container w-1/3 h-1/2 ">
                    <h1 className="donation-title">Support NoQ</h1>
                    <p className="donation-description">
                        NoQ is a growing project, and your donations will be incredibly helpful in making it better and expanding our reach.
                    </p>

                    {!showQRCode ? (
                        <div className="donation-input-container">
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
                        </div>
                    ) : (
                        <div className="qr-code-animation">
                            <h2>Scan to Donate</h2>
                            <QRCode value={payUrl} size={256} /> {/* Set QR code size */}
                            <p>Open your UPI app and scan the QR code to complete your donation.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DonationPage;