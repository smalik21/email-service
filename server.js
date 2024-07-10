const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const dotenv = require("dotenv");
const cors = require('cors');

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 3001;

app.post('/send-email/:recipientEmail', upload.none(), async (req, res) => {
  try {
    const formData = req.body;
    const recipientEmail = req.params.recipientEmail;

    const pageTitle = formData.pageTitle || 'Unknown Page';
    const pageUrl = formData.pageUrl || 'Unknown URL';

    if (!recipientEmail) {
      return res.status(400).json({ message: 'Recipient email is required' });
    }

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      // Configure your email service here
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Create HTML content
    const htmlContent = `
      <html>
        <head>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h2>Form Submission</h2>
          <p><strong>Submitted from:</strong> ${pageTitle}</p>
          <p><strong>Page URL:</strong> ${pageUrl}</p>
          <table>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
            ${Object.entries(formData)
        .filter(([key]) => !['pageTitle', 'pageUrl'].includes(key))
        .map(([key, value]) => `
                <tr>
                  <td>${key}</td>
                  <td>${value}</td>
                </tr>
              `).join('')}
          </table>
        </body>
      </html>
    `;

    // Prepare the email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `Form Submission from ${pageTitle}`,
      html: htmlContent,
      text: `Submitted from: ${pageTitle}\nPage URL: ${pageUrl}\n\n${Object.entries(formData)
        .filter(([key]) => !['pageTitle', 'pageUrl'].includes(key))
        .map(([key, value]) => `${key}: ${value}`).join('\n')}`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Form data sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});