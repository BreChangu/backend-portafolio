require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend'); // Importamos la librería nueva

const app = express();
const PORT = process.env.PORT || 3000;

// Iniciamos Resend con la llave (que configuraremos en el paso 3)
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'Portafolio <onboarding@resend.dev>',
      to: 'ferchin911@gmail.com', // Tu correo real
      reply_to: email, // <--- EL TRUCO: Al responder, le contestas al cliente
      subject: `🚀 Nuevo Proyecto: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            /* Reset básico para clientes de correo antiguos */
            body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 0;">
            <tr>
              <td align="center">
                
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
                  
                  <tr>
                    <td style="background-color: #09090b; padding: 24px 40px; text-align: center;">
                      <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 600; letter-spacing: 0.5px;">
                        Nuevo Contacto Recibido
                      </h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px;">
                      
                      <p style="color: #52525b; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                        ¡Hola Fernando! Alguien ha visitado tu web y quiere trabajar contigo. Aquí están los detalles:
                      </p>

                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                        <tr>
                          <td width="30%" style="padding-bottom: 12px;">
                            <span style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Nombre</span>
                          </td>
                          <td style="padding-bottom: 12px;">
                            <span style="color: #18181b; font-size: 16px; font-weight: 500;">${name}</span>
                          </td>
                        </tr>
                        <tr>
                          <td width="30%" style="padding-bottom: 12px;">
                            <span style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Email</span>
                          </td>
                          <td style="padding-bottom: 12px;">
                            <a href="mailto:${email}" style="color: #2563EB; font-size: 16px; text-decoration: none; font-weight: 500;">${email}</a>
                          </td>
                        </tr>
                      </table>

                      <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 20px; border-radius: 4px;">
                        <span style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; display: block; margin-bottom: 8px;">Mensaje:</span>
                        <p style="color: #3f3f46; font-size: 15px; line-height: 24px; margin: 0; font-style: italic;">
                          "${message}"
                        </p>
                      </div>

                      <div style="margin-top: 30px; text-align: center;">
                        <p style="font-size: 13px; color: #71717a;">
                          Tip: Simplemente dale a <strong>Responder</strong> en tu Gmail para escribirle a ${name}.
                        </p>
                      </div>

                    </td>
                  </tr>

                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #a1a1aa; font-size: 12px; margin: 0;">
                        Enviado automáticamente desde <strong>Fernando Dev Portfolio</strong>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    console.log('✅ Enviado:', data);
    res.status(200).json({ message: 'Enviado correctamente' });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});