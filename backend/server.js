const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || 'rajputprincesingh536@gmail.com';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const transporter = SMTP_HOST && SMTP_USER && SMTP_PASS
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  : null;

const frontendPath = path.join(__dirname, '..', 'frontend');
const resumePath = path.join(frontendPath, 'resume.pdf');

app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));

app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', backend: true });
});

app.get('/api/resume', (req, res) => {
  if (!fs.existsSync(resumePath)) {
    return res.status(404).json({ error: 'Resume file not found. Add frontend/resume.pdf to make the download available.' });
  }

  return res.download(resumePath, 'Prince-Singh-Resume.pdf', (err) => {
    if (err) {
      console.error('Resume download error:', err);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Unable to download resume at this time.' });
      }
    }
  });
});

app.get('/resume.pdf', (req, res) => {
  if (!fs.existsSync(resumePath)) {
    return res.status(404).json({ error: 'Resume file not found. Add frontend/resume.pdf to make the download available.' });
  }

  return res.download(resumePath, 'Prince-Singh-Resume.pdf', (err) => {
    if (err) {
      console.error('Resume download error:', err);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Unable to download resume at this time.' });
      }
    }
  });
});

app.post('/api/contact', async (req, res) => {
  if (!transporter) {
    return res.status(503).json({
      error: 'Email service is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in backend/.env or your host environment.',
    });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${SMTP_USER}>`,
      to: RECEIVER_EMAIL,
      subject: `[Portfolio Contact] ${subject}`,
      replyTo: email,
      text: `Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`,
    });

    return res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Contact form send error:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
