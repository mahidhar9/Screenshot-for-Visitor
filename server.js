const { createCanvas, loadImage, registerFont } = require('canvas');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Register the Futura font
registerFont(path.join(__dirname, 'font', 'FuturaStd-Bold.otf'), { family: 'Futura', weight: 'bold' });
registerFont(path.join(__dirname,  'font', 'FuturaStd-Medium.otf'), { family: 'Futura', weight: 'normal' });


// Function to create the image
async function generateInviteImage({ name, passcode, date }) {
    const width = 600;
    const height = 860;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background color
    ctx.fillStyle = '#F9ECDF';
    ctx.fillRect(0, 0, width, height);

    // Referer name
    ctx.fillStyle = '#B21E2B';
    ctx.font = 'bold 40px Futura';
    ctx.textAlign = 'center';
    ctx.fillText(`${name}`, width / 2, 80);

    // Title Text
    ctx.fillStyle = '#5D2D0D';
    ctx.font = 'normal 22px Futura';
    ctx.textAlign = 'center';
    ctx.fillText(`has invited you`, width / 2, 115);

    // Show at gate text
    ctx.fillStyle = '#5D2D0D';
    ctx.font = 'normal 22px Futura';
    ctx.textAlign = 'center';
    ctx.fillText(`Show the QR code or Passcode to the guard at the gate`, width / 2, 142);

    // QR Code generation
    const qrCodeDataUrl = await QRCode.toDataURL(passcode, { width: 200, margin: 1 });
    const qrCodeImage = await loadImage(qrCodeDataUrl);
    ctx.drawImage(qrCodeImage, width / 2 - 100, 170, 200, 200);

    // Divider line
    ctx.fillStyle = '#5D2D0D';
    ctx.font = 'normal 20px Futura';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('---OR---', width / 2, 395);

    // Helper function to draw a rounded rectangle
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Drawing the passcode box with rounded corners
ctx.fillStyle = '#f48fb1';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
drawRoundedRect(ctx, width / 2 - 90, 425, 185, 60, 20); // Adjust '10' for the radius size
ctx.fill();

// Drawing the passcode text
ctx.fillStyle = '#5D2D0D';
ctx.font = 'bold 35px Bookman Old Style';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(passcode, width / 2, 458); // Center the text within the rectangle


    // Date
    ctx.font = 'bold 35px Futura';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(date, width / 2, 540);

    //Address
    ctx.font = 'normal 20px futura';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("Sathya Sai Grama", width / 2, 580);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("Muddenahalli, Chikkaballapur", width / 2, 610);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("Karnataka - 562101", width / 2, 640);

    // Footer with Logo
    const logoImage = await loadImage(path.join(__dirname, 'logo.png')); // Replace with path to your logo
    ctx.drawImage(logoImage, 0, height - 180, 600, 260);

    // Save image to a file or return as response
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('output.png', buffer);
    return buffer;
}

// Example usage
const express = require('express');
const app = express();
app.get('/generate-image', async (req, res) => {
    const { name, passcode, date } = req.query;
    if (!name || !passcode || !date) {
        return res.status(400).send('Missing parameters');
    }
    const imageBuffer = await generateInviteImage({ name, passcode, date});
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
});

app.listen(3000, () => console.log('Server running on port 3000'));
