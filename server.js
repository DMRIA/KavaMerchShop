const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
};

// Create a transporter
// NOTE: For real sending, you need valid credentials.
// For now, we'll try to use a test account if no env vars are set, or just log if it fails.
// Since the user asked for a specific email, we'll setup the structure.
// If you have a Gmail App Password, you would use it here.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deebs48@gmail.com', // Placeholder - normally from ENV
        pass: 'cpyw jkbl yzpv xqly' // Placeholder
    }
});

http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // API Endpoint for Preorders
    if (req.url === '/api/preorder' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                console.log('Received preorder:', data);

                // Construct Email
                const mailOptions = {
                    from: '"Kava Shop" <noreply@kavashop.com>',
                    to: 'deebs48@gmail.com', // User specified email
                    subject: 'New Preorder: Kalapu Steelers Jacket',
                    text: `
We have received a new preorder!

Item: ${data.jacket}
Size: ${data.size}
Customer Email: ${data.email}
Time: ${new Date().toLocaleString()}
                    `,
                    html: `
                        <h2>New Preorder</h2>
                        <p><strong>Item:</strong> ${data.jacket}</p>
                        <p><strong>Size:</strong> ${data.size}</p>
                        <p><strong>Customer Email:</strong> ${data.email}</p>
                        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                    `
                };

                // Send Email
                try {
                    const info = await transporter.sendMail(mailOptions);
                    console.log('Email sent successfully:', info.messageId);
                } catch (emailError) {
                    console.error('Email send failed:', emailError);
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Preorder received and email processing commenced.' }));

            } catch (error) {
                console.error('Error processing preorder:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server error parsing data.' }));
            }
        });
        return;
    }

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', (error, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}).listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
