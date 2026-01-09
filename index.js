// 1. IMPORTACIONES (La "caja de herramientas")
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

// 2. CONFIGURACIÓN INICIAL
const app = express(); // Aquí es donde se define "app"
const PORT = process.env.PORT || 3000;

// Middleware (Permisos y lectura de datos)
app.use(cors());
app.use(express.json());

// 3. CONFIGURACIÓN DEL CORREO (Transporter)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// 4. RUTA DE ENVÍO (Aquí va el diseño bonito)
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  // Validación básica
  if (!name || !email || !message) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  const mailOptions = {
    from: `Portafolio Web <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🚀 Nuevo Proyecto: ${name} te ha contactado`,
    text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f5; padding: 40px 0;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <tr>
                  <td bgcolor="#2563EB" style="padding: 30px 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">¡Nuevo Lead!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: #52525b; font-size: 16px;">Hola, <strong>${name}</strong> te ha enviado un mensaje:</p>
                    <div style="background-color: #f8fafc; border-left: 4px solid #2563EB; padding: 20px; margin: 20px 0;">
                      <p style="margin: 0; color: #3f3f46; font-style: italic;">"${message}"</p>
                    </div>
                    <p style="color: #52525b;">Responder a: <a href="mailto:${email}" style="color: #2563EB;">${email}</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error enviando el correo:', error);
      return res.status(500).json({ message: 'Error enviando el correo' });
    }
    console.log('Correo enviado:', info.response);
    res.status(200).json({ message: 'Correo enviado con éxito' });
  });
});

// 5. INICIAR EL SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});