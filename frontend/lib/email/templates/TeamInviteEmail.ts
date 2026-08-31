export function generateTeamInviteEmail(token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/verify?token=${token}`;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Activación de Cuenta de Equipo | Minerva Alcaraz</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #E5DBD6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#E5DBD6" style="width: 100%; max-width: 100%; min-width: 100%;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #2C3729; border: 1px solid rgba(203, 182, 123, 0.3);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 40px 20px; border-bottom: 1px solid rgba(203, 182, 123, 0.2);">
                  <img src="https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/logo.png" alt="Minerva Alcaraz Joyería" width="150" style="display: block; max-width: 150px; height: auto;" />
                  <p style="margin: 20px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #8E9A8B;">
                    Gestión de Equipo ERP
                  </p>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td align="center" style="padding: 50px 30px;">
                  <h1 style="margin: 0 0 20px 0; font-size: 24px; color: #CBB67B; font-weight: normal; letter-spacing: 0.1em; text-transform: uppercase;">
                    Verificación de Cuenta
                  </h1>
                  
                  <p style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.6; color: #E5DBD6; font-weight: 300;">
                    Se ha solicitado la creación de una cuenta de equipo administrativa asociada a este correo electrónico. Para proteger la integridad del Atelier, por favor verifica tu identidad y establece tu contraseña de acceso.
                  </p>
                  
                  <!-- Button -->
                  <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" style="border-radius: 2px;" bgcolor="#CBB67B">
                        <a href="${verifyUrl}" target="_blank" style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; color: #2C3729; text-decoration: none; padding: 18px 30px; display: inline-block;">
                          Verificar y Activar Cuenta
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 40px 0 0 0; font-size: 12px; line-height: 1.5; color: #8E9A8B; font-weight: 300;">
                    Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br/>
                    <a href="${verifyUrl}" style="color: #CBB67B; text-decoration: underline; word-break: break-all; margin-top: 10px; display: inline-block;">
                      ${verifyUrl}
                    </a>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 30px 20px; background-color: #1F271D; border-top: 1px solid rgba(203, 182, 123, 0.2);">
                  <p style="margin: 0; font-size: 10px; color: #8E9A8B; text-transform: uppercase; letter-spacing: 0.1em; line-height: 1.5;">
                    Minerva Alcaraz Joyería<br/>
                    El Ritual de la Eternidad
                  </p>
                  <p style="margin: 15px 0 0 0; font-size: 9px; color: rgba(142, 154, 139, 0.6);">
                    Este enlace expirará en 24 horas.<br/>
                    Si no solicitaste esta cuenta, puedes ignorar este correo de forma segura.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
