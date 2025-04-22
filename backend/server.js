// 📦 Imports & Setup
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Stripe from 'stripe';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(cors());
app.use(express.json());

// 📁 Upload
const upload = multer({ dest: 'uploads/' });

// 🔐 Admin Auth Middleware
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Dashboard"');
    return res.status(401).send('Authentifizierung erforderlich');
  }
  const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
  const isAllowed = (process.env.ADMIN_USERS || '').split('|').some(entry => {
    const [u, p] = entry.split(':');
    return u === user && p === pass;
  });
  return isAllowed ? next() : res.status(403).send('Zugriff verweigert');
};

// 📬 Kontaktformular
app.post("/api/contact", (req, res) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("application/json")) {
    express.json()(req, res, () => handleContact(req, res));
  } else {
    upload.single("image")(req, res, () => handleContact(req, res));
  }
});

const handleContact = async (req, res) => {
  const { licensePlate, message, email } = req.body;
  const image = req.file;
  if (!licensePlate || !message) return res.status(400).json({ success: false, error: "Kennzeichen und Nachricht sind Pflicht!" });

  const html = `<p>${message}</p><p>Von: ${email || 'unbekannt'} – Fahrzeug: ${licensePlate}</p>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.SUPPORT_MAIL || process.env.EMAIL_USER,
    subject: `📩 QRCONTACT - Neue Nachricht zu ${licensePlate}`,
    html,
    attachments: image ? [{ filename: image.originalname, path: image.path }] : [],
  });

  if (email) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "📨 QRCONTACT - Deine Nachricht wurde übermittelt",
      html: `<p>Du hast folgende Nachricht gesendet:</p>${html}`,
    });
  }
  res.json({ success: true });
};

// 🧾 Admin Backup Route
app.get('/api/admin/backups', basicAuth, (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'backups', 'backup.json'), 'utf-8');
    res.json({ success: true, entries: JSON.parse(data) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Fehler beim Laden der Backups' });
  }
});

// 💳 STRIPE-Zahlung
app.post('/api/pay', async (req, res) => {
  const { email, licensePlate } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `QR-Code für ${licensePlate}` },
          unit_amount: 199,
        },
        quantity: 1,
      }],
      metadata: { email, licensePlate },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Stripe-Fehler' });
  }
});

// ✅ Bestellung Fulfillment
app.post('/api/fulfill-order', async (req, res) => {
  const { session_id } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const email = session.customer_email;
    const licensePlate = session.metadata.licensePlate;
    await sendQrMail(email, licensePlate);
    res.json({ success: true, email, licensePlate });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Fehler beim Fulfillment' });
  }
});

// 📤 QR-Mail mit Anhang
const sendQrMail = async (email, licensePlate) => {
  const qrUrl = `${process.env.FRONTEND_URL}/contact/${licensePlate}`;
  const qrImageBuffer = await QRCode.toBuffer(qrUrl);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([270, 170]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0, 0, 0);
  const blue = rgb(0.26, 0.46, 0.96);

  page.drawRectangle({ x: 0, y: 140, width: 270, height: 30, color: black });
  page.drawText('qrcontact', { x: 50, y: 148, size: 14, font: bold, color: blue });
  page.drawImage(await pdfDoc.embedPng(qrImageBuffer), { x: 90, y: 40, width: 90, height: 90 });
  page.drawText('Scannen für anonyme Kontaktaufnahme', { x: 30, y: 25, size: 10, font, color: rgb(0.5, 0.5, 0.5) });

  const pdfBytes = await pdfDoc.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: '🎉 Dein QRContact ist bereit!',
    html: `<p>Scanne oder drucke deinen Code aus:</p><p><a href="${qrUrl}">${qrUrl}</a></p>`,
    attachments: [
      { filename: `qr-${licensePlate}.png`, content: qrImageBuffer, cid: 'qrcode' },
      { filename: `qr-${licensePlate}.pdf`, content: pdfBytes },
    ],
  });

  const backupDir = path.join(__dirname, 'backups');
  const backupPath = path.join(backupDir, 'backup.json');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
  const backupData = fs.existsSync(backupPath) ? JSON.parse(fs.readFileSync(backupPath, 'utf-8')) : [];
  backupData.push({ timestamp: new Date().toISOString(), email, licensePlate });
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
};

// 🚀 Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Backend läuft auf http://localhost:${PORT}`));
