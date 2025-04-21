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

// E-Mail-Template = E-MAIL FÜR KAUF

const emailTemplate = `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #f4f4f7; padding: 40px;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    
    <div style="background: #111827; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
        qr<span style="color: #3b82f6;">contact</span>
      </h1>
    </div>

    <div style="padding: 32px;">
      <h2 style="color: #111827;">🎉 Dein QRContact ist bereit!</h2>
      <p style="color: #4b5563;">Hallo!</p>
      <p style="color: #4b5563;">
        Danke für deinen Kauf. Hier ist dein persönlicher QR-Code für das Kennzeichen
        <strong style="color: #111827;">{{LICENSE_PLATE}}</strong>:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <img src="cid:qrcode" alt="QR-Code" style="max-width: 200px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />
      </div>

      <p style="color: #4b5563;">Scanne oder drucke ihn aus. Der Link führt zu:</p>
      <p style="text-align: center;">
        <a href="{{QR_URL}}" style="color: #3b82f6; text-decoration: none;">{{QR_URL}}</a>
      </p>

      <p style="margin-top: 40px; color: #4b5563;">Viel Freude wünscht dir 🎁<br><strong style="color: #111827;">– Dein QRContact Team</strong></p>
    </div>

    <div style="background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af;">
      © 2025 qrcontact.de – Alle Rechte vorbehalten.
    </div>
  </div>
</div>
`;
const sendQrMail = async (email, licensePlate) => {
  try {
    const qrUrl = `https://qrcontact.de/contact/${licensePlate}`;
    const qrImageBuffer = await QRCode.toBuffer(qrUrl);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([270, 170]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const black = rgb(0, 0, 0);
    const blue = rgb(0.26, 0.46, 0.96);
    const gray = rgb(0.5, 0.5, 0.5);
    const lightGray = rgb(0.8, 0.8, 0.8);

    page.drawRectangle({ x: 0, y: 140, width: 270, height: 30, color: black });
    page.drawText("#", { x: 16, y: 148, size: 14, font: boldFont, color: blue });
    page.drawText("qr", { x: 36, y: 148, size: 14, font: boldFont, color: rgb(1, 1, 1) });
    page.drawText("contact", { x: 50, y: 148, size: 14, font: boldFont, color: blue });

    const qrImage = await pdfDoc.embedPng(qrImageBuffer);
    const qrSize = 90;
    page.drawImage(qrImage, {
      x: (270 - qrSize) / 2,
      y: 40,
      width: qrSize,
      height: qrSize,
    });

    const description = "Scannen für anonyme Kontaktaufnahme des Besitzers";
    const footer = "Erstellt mit qrcontact.de";

    page.drawText(description, {
      x: (270 - font.widthOfTextAtSize(description, 10)) / 2,
      y: 25,
      size: 10,
      font,
      color: gray,
    });

    page.drawText(footer, {
      x: (270 - font.widthOfTextAtSize(footer, 8)) / 2,
      y: 12,
      size: 8,
      font,
      color: lightGray,
    });

    const cutLineColor = rgb(0.7, 0.7, 0.7);
    const lineWidth = 0.4;

    page.drawLine({ start: { x: 30, y: 0 }, end: { x: 30, y: 170 }, thickness: lineWidth, color: cutLineColor, opacity: 0.7 });
    page.drawLine({ start: { x: 240, y: 0 }, end: { x: 240, y: 170 }, thickness: lineWidth, color: cutLineColor, opacity: 0.7 });
    page.drawLine({ start: { x: 0, y: 150 }, end: { x: 270, y: 150 }, thickness: lineWidth, color: cutLineColor, opacity: 0.7 });
    page.drawLine({ start: { x: 0, y: 20 }, end: { x: 270, y: 20 }, thickness: lineWidth, color: cutLineColor, opacity: 0.7 });

    const pdfBytes = await pdfDoc.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎉 Dein QRContact ist bereit!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <div style="background: #111827; padding: 16px 24px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
            <span style="font-size: 22px; font-weight: bold; color: #3B82F6;">▦</span>
            <span style="font-size: 22px; font-weight: bold; color: white;">qr</span>
            <span style="font-size: 22px; font-weight: bold; color: #3B82F6;">contact</span>
          </div>
          <div style="padding: 24px; background: white; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">🎉 Dein QRContact ist bereit!</h2>
            <p style="font-size: 15px;">Danke für deinen Kauf. Hier ist dein persönlicher QR-Code für das Kennzeichen <strong>${licensePlate}</strong>:</p>
            <p><img src="cid:qrcode" alt="QR Code" style="margin: 20px 0; width: 160px;" /></p>
            <p style="font-size: 13px;">Scanne oder drucke ihn aus. Der Link führt zu:</p>
            <p style="font-size: 13px;"><a href="${qrUrl}">${qrUrl}</a></p>
            <p style="font-size: 13px;">Viel Freude wünscht dir 💝 <br/>– Dein QRContact Team</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `qr-${licensePlate}.png`,
          content: qrImageBuffer,
          cid: "qrcode",
        },
        {
          filename: `qr-${licensePlate}.pdf`,
          content: pdfBytes,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ E-Mail mit QR-Code gesendet an:", email);

    // 📁 Backup
    const backupDir = path.join(__dirname, "backups");
    const backupPath = path.join(backupDir, "backup.json");

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupData = fs.existsSync(backupPath)
      ? JSON.parse(fs.readFileSync(backupPath, "utf-8"))
      : [];

    backupData.push({
      timestamp: new Date().toISOString(),
      email,
      licensePlate,
    });

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log("✅ Backup gespeichert für:", email);

  } catch (error) {
    console.error("❌ Fehler beim Senden der E-Mail oder Speichern:", error);
    throw error;
  }
};

// 🔽 Pfad-Utilities für ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🚀 Express App
const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Basic Auth Middleware
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Dashboard"');
    return res.status(401).send('Authentifizierung erforderlich');
  }

  const base64 = auth.split(' ')[1];
  const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');
  const allowedUsers = process.env.ADMIN_USERS?.split('|') || [];

  const isValid = allowedUsers.some((entry) => {
    const [allowedUser, allowedPass] = entry.split(':');
    return user === allowedUser && pass === allowedPass;
  });

  if (isValid) {
    next();
  } else {
    return res.status(403).send('Zugriff verweigert');
  }
};

const upload = multer({ dest: 'uploads/' });

// 📩 Kontaktformular – erkennt JSON oder FormData automatisch
app.use(express.json()); // 💡 Muss VOR dem Route-Handler aufgerufen werden!

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
  const isSupport = licensePlate === "SUPPORT";
  const timestamp = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unbekannt";

  if (!licensePlate || !message) {
    return res.status(400).json({ success: false, error: "Kennzeichen und Nachricht sind Pflicht!" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const baseWrapper = (title, content) => `
      <div style="font-family: 'Segoe UI', sans-serif; background: #f9fafb; padding: 40px 0;">
        <div style="max-width: 580px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
          <div style="background: #111827; padding: 24px;">
            <h1 style="margin: 0; font-size: 22px; color: white; font-weight: bold;">
              <span style="color: #3B82F6;">▦</span> qr<span style="color: #3B82F6;">contact</span>
            </h1>
          </div>
          <div style="padding: 28px; color: #111;">
            <h2 style="margin-top: 0;">${title}</h2>
            ${content}
          </div>
          <div style="background: #f3f4f6; padding: 20px; font-size: 12px; color: #888; text-align: center;">
            Diese Nachricht wurde automatisch über <a href="https://qrcontact.de" style="color:#3B82F6; text-decoration: none;">qrcontact.de</a> versendet.
            <br />
            Bei Fragen erreichst du uns unter <a href="mailto:${process.env.SUPPORT_MAIL}" style="color:#3B82F6;">${process.env.SUPPORT_MAIL}</a>.
            <br /><br />
            &copy; ${new Date().getFullYear()} QRContact – Alle Rechte vorbehalten.
          </div>
        </div>
      </div>
    `;

    // 📬 Mail an Support/Fahrzeugbesitzer
    const supportContent = `
      <p style="margin-bottom: 16px;">Es wurde eine neue ${isSupport ? "Support-Anfrage" : "Fahrzeugnachricht"} gesendet:</p>
      <blockquote style="background: #f3f4f6; padding: 16px; border-left: 4px solid #3B82F6; border-radius: 8px; font-size: 15px;">
        ${message}
      </blockquote>
      <p><strong>Typ:</strong> ${isSupport ? "Support" : "Kontakt"}</p>
      <p><strong>Absender:</strong> ${email || "Nicht angegeben"}</p>
      <p><strong>IP-Adresse:</strong> ${ip}</p>
      <p><strong>Zeit:</strong> ${timestamp}</p>
      ${!isSupport ? `<p><strong>Fahrzeug:</strong> ${licensePlate}</strong></p>` : ""}
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.SUPPORT_MAIL || process.env.EMAIL_USER,
      subject: isSupport
        ? "📩 QRCONTACT - Neue Support-Anfrage"
        : `📩 QRCONTACT - Neue Nachricht zu ${licensePlate}`,
      html: baseWrapper(
        isSupport ? "📬 Neue Support-Anfrage" : `📬 Neue Nachricht zu ${licensePlate}`,
        supportContent
      ),
      attachments: image ? [{ filename: image.originalname, path: image.path }] : [],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Nachricht versendet an Support/Fahrzeugbesitzer");

    // 📧 Bestätigungsmail an Absender
    if (email) {
      const confirmationContent = `
        <p style="margin-bottom: 16px; font-size: 15px;">
          ${
            isSupport
              ? "Wir haben deine Support-Nachricht erhalten und melden uns schnellstmöglich."
              : `Du hast dem Fahrzeug mit dem Kennzeichen <strong style="color:#3B82F6;">${licensePlate}</strong> folgende Nachricht gesendet:`
          }
        </p>
        <blockquote style="background: #f3f4f6; padding: 16px; border-left: 4px solid #3B82F6; border-radius: 8px; font-size: 15px;">
          ${message}
        </blockquote>
        <p>– Dein QRContact Team</p>
      `;

      const confirmation = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: isSupport
          ? "📨 QRCONTACT Support – Wir haben deine Nachricht erhalten"
          : "📨 QRCONTACT - Deine Nachricht wurde übermittelt",
        html: baseWrapper(
          isSupport ? "✅ Wir haben deine Nachricht erhalten" : "✅ Deine Nachricht wurde erfolgreich gesendet",
          confirmationContent
        ),
      };

      await transporter.sendMail(confirmation);
      console.log("📬 Bestätigung an Absender gesendet:", email);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Fehler beim Senden:", err);
    return res.status(500).json({ success: false, error: "Fehler beim Senden" });
  }
};

// 🔐 Admin Backup Route
app.get('/api/admin/backups', basicAuth, (req, res) => {
  try {
    const backupPath = path.join(__dirname, 'backups', 'backup.json');
    const data = fs.readFileSync(backupPath, 'utf-8');
    const rawEntries = JSON.parse(data);

    const entries = rawEntries.map((entry) => ({
      timestamp: entry.timestamp || new Date().toISOString(),
      email: entry.email || 'unbekannt',
      licensePlate: entry.licensePlate || 'unbekannt',
    }));

    res.json({ success: true, entries });
  } catch (error) {
    console.error('❌ Fehler beim Laden der Admin-Backups:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Lesen der Datei' });
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
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `QR-Code für ${licensePlate}`,
            },
            unit_amount: 199, // 💶 1,99€ in Cent
          },
          quantity: 1,
        },
      ],
      metadata: {
        licensePlate,
        email,
      },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/`,
    });

    console.log("✅ Stripe-Session erstellt:", session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe Fehler:", error);
    res.status(500).json({ error: "Stripe-Fehler beim Erstellen der Zahlung" });
  }
});

app.post("/api/fulfill-order", async (req, res) => {
  const { session_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const email = session.customer_email;
    const licensePlate = session.metadata.licensePlate;

    // 🔁 Nutze hier deinen bestehenden Mailversand (copy von /api/send-email)
    // oder rufe einfach deine sendEmailLogik(email, licensePlate) auf

    // Beispiel:
    await sendQrMail(email, licensePlate); // 🔧 Extrahiere deine Logik in eine Funktion

    res.json({
      success: true,
      email,
      licensePlate,
    });
  } catch (err) {
    console.error("❌ Fehler beim Fulfillen:", err);
    res.status(500).json({ success: false, error: "Fehler beim Fulfillment" });
  }
});

// 📤 E-Mail mit QR-Code + PDF
app.post('/api/send-email', async (req, res) => {
  const { email, licensePlate } = req.body;

  if (!email || !licensePlate) {
    return res.status(400).json({ success: false, error: "E-Mail und Kennzeichen sind erforderlich." });
  }

  try {
    const qrUrl = `https://qrcontact.de/contact/${licensePlate}`;
    const qrImageBuffer = await QRCode.toBuffer(qrUrl);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([270, 170]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const black = rgb(0, 0, 0);
    const blue = rgb(0.26, 0.46, 0.96);
    const gray = rgb(0.5, 0.5, 0.5);
    const lightGray = rgb(0.8, 0.8, 0.8);

    // Header
    page.drawRectangle({ x: 0, y: 140, width: 270, height: 30, color: black });
    page.drawText("#", { x: 16, y: 148, size: 14, font: boldFont, color: blue });
    page.drawText("qr", { x: 36, y: 148, size: 14, font: boldFont, color: rgb(1, 1, 1) });
    page.drawText("contact", { x: 50, y: 148, size: 14, font: boldFont, color: blue });

    // QR-Code zentriert
    const qrImage = await pdfDoc.embedPng(qrImageBuffer);
    const qrSize = 90;
    page.drawImage(qrImage, {
      x: (270 - qrSize) / 2,
      y: 40,
      width: qrSize,
      height: qrSize,
    });

 // Text
const description = "Scannen für anonyme Kontaktaufnahme des Besitzers";
const footer = "Erstellt mit qrcontact.de";

page.drawText(description, {
  x: (270 - font.widthOfTextAtSize(description, 10)) / 2,
  y: 25,
  size: 10,
  font,
  color: gray,
});

page.drawText(footer, {
  x: (270 - font.widthOfTextAtSize(footer, 8)) / 2,
  y: 12,
  size: 8,
  font,
  color: lightGray,
});

    const pdfBytes = await pdfDoc.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✂️ Schnittlinien vom A4-Rand bis zur Karte (parallele Linien)
const cutLineColor = rgb(0.7, 0.7, 0.7);
const lineWidth = 0.4;

// Links
page.drawLine({
  start: { x: 30, y: 0 },
  end: { x: 30, y: 170 },
  thickness: lineWidth,
  color: cutLineColor,
  opacity: 0.7,
});

// Rechts
page.drawLine({
  start: { x: 240, y: 0 },
  end: { x: 240, y: 170 },
  thickness: lineWidth,
  color: cutLineColor,
  opacity: 0.7,
});

// Oben
page.drawLine({
  start: { x: 0, y: 150 },
  end: { x: 270, y: 150 },
  thickness: lineWidth,
  color: cutLineColor,
  opacity: 0.7,
});

// Unten
page.drawLine({
  start: { x: 0, y: 20 },
  end: { x: 270, y: 20 },
  thickness: lineWidth,
  color: cutLineColor,
  opacity: 0.7,
});

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎉 Dein QRContact ist bereit!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <div style="background: #111827; padding: 16px 24px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
            <span style="font-size: 22px; font-weight: bold; color: #3B82F6;">▦</span>
            <span style="font-size: 22px; font-weight: bold; color: white;">qr</span>
            <span style="font-size: 22px; font-weight: bold; color: #3B82F6;">contact</span>
          </div>
          <div style="padding: 24px; background: white; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">🎉 Dein QRContact ist bereit!</h2>
            <p style="font-size: 15px;">Danke für deinen Kauf. Hier ist dein persönlicher QR-Code für das Kennzeichen <strong>${licensePlate}</strong>:</p>
            <p><img src="cid:qrcode" alt="QR Code" style="margin: 20px 0; width: 160px;" /></p>
            <p style="font-size: 13px;">Scanne oder drucke ihn aus. Der Link führt zu:</p>
            <p style="font-size: 13px;"><a href="${qrUrl}">${qrUrl}</a></p>
            <p style="font-size: 13px;">Viel Freude wünscht dir 💝 <br/>– Dein QRContact Team</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `qr-${licensePlate}.png`,
          content: qrImageBuffer,
          cid: "qrcode",
        },
        {
          filename: `qr-${licensePlate}.pdf`,
          content: pdfBytes,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ E-Mail mit QR-Code gesendet an:", email);

    // 📁 Backup schreiben
    const backupDir = path.join(__dirname, "backups");
    const backupPath = path.join(backupDir, "backup.json");

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupData = fs.existsSync(backupPath)
      ? JSON.parse(fs.readFileSync(backupPath, "utf-8"))
      : [];

    backupData.push({
      timestamp: new Date().toISOString(),
      email,
      licensePlate,
    });

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log("✅ Backup gespeichert für:", email);

    res.json({ success: true });

  } catch (error) {
    console.error("❌ Fehler beim Senden der QR-Mail oder Speichern:", error);
    res.status(500).json({ success: false, error: "Fehler beim Senden der E-Mail oder Backup" });
  }
});

// 🚀 Server starten
const PORT = process.env.PORT || 5001;
app.get('/', (req, res) => {
  res.send('🎉 QRContact Backend läuft! Die API ist bereit unter /api');
});
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});