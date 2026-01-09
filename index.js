require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

// 1. IMPORTANTE: Parche para forzar IPv4 y evitar Timeouts en Render
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Verificación de variables al iniciar
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("⚠️ Faltan variables de entorno");
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Opciones extra de seguridad para la nube
  tls: {
    rejectUnauthorized: false
  }
});

app.post('/send-email', (req, res) => {
  console.log("📩 Solicitud recibida..."); // Chismoso 1
  
  const { name, email, message } = req.body;

  const mailOptions = {
    from: `Portafolio <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `Mensaje de ${name}`,
    html: `<p>Nombre: ${name}</p><p>Email: ${email}</p><p>Mensaje: ${message}</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error Nodemailer:", error); // Chismoso 2
      return res.status(500).json({ error: error.message });
    }
    console.log('✅ Enviado:', info.response);
    res.status(200).json({ message: 'Éxito' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});