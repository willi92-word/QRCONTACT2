// backend/utils/sendEmail.js

import nodemailer from 'nodemailer';
import qrcode from 'qrcode';
import { jsPDF } from 'jspdf';
import { Readable } from 'stream';

export const sendEmail = async (email, licensePlate) => {
  const qrUrl = `https://qrcontact.de/qrcode/${licensePlate}`;

  // 1. QR-Code PNG als Buffer generieren
  const qrImageBuffer = await qrcode.toBuffer(qrUrl);

  // 2. PDF generieren mit jsPDF
  const doc = new jsPDF();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('QRContact', 105, 30, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Bitte scannen und mich kontaktieren', 105, 120, { align: 'center' });

  const imgBase64 = await qrcode.toDataURL(qrUrl);
  doc.addImage(imgBase64, 'PNG', 80, 40, 50, 50);
  const pdfOutput = Buffer.from(doc.output('arraybuffer'));

  // 3. Nodemailer Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 4. Mail versenden mit HTML und PDF + QR-Anhang
  const mailOptions = {
    from: 'QRContact <no-reply@qrcontact.de>',
    to: email,
    subject: '✅ Dein persönlicher QR-Code',
    html: `
      <body style="margin:0; padding:0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color:#f9f9f9;">
        <table width="100%" cellspacing="0" cellpadding="0" style="padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:white; border-radius:16px; padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                <tr>
                  <td align="center">
                    <h1 style="font-size:24px; font-weight:600; color:#111;">Dein QR-Code ist bereit ✅</h1>
                    <p style="font-size:16px; color:#666;">für das Kennzeichen <strong>${licensePlate}</strong></p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 30px 0;">
                    <img src="cid:qrcodeImage" alt="QR-Code" style="width:140px; height:140px; border-radius:12px; background:#f0f0f0; padding:8px;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${qrUrl}" target="_blank" style="padding:12px 24px; background:#000; color:#fff; font-weight:500; border-radius:8px; text-decoration:none;">
                      QR-Code online öffnen
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:30px; color:#aaa; font-size:12px;">
                    © QRContact – Nur scannen, wenn du helfen willst.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `,
    attachments: [
      {
        filename: `qrcontact-${licensePlate}.pdf`,
        content: pdfOutput,
      },
      {
        filename: 'qr-code.png',
        content: qrImageBuffer,
        cid: 'qrcodeImage', // Das ist der Referenzname im <img src="cid:qrcodeImage">
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};