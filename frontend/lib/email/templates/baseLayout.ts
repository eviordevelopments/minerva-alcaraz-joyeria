/**
 * Minerva Alcaraz — Base HTML Email Template Wrapper
 * Brand Design System: Hueso Seda (#E5DBD6), Verde Ébano (#2C3729), Oro Antiguo (#CBB67B)
 * Location: San Miguel de Allende, Guanajuato, México
 */
export function wrapBaseEmailTemplate({
  title,
  preheader,
  contentHtml,
}: {
  title: string;
  preheader?: string;
  contentHtml: string;
}): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Montserrat:wght@200;300;400;500;600&display=swap');

    body {
      margin: 0;
      padding: 0;
      background-color: #E5DBD6;
      font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #2C3729;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #E5DBD6;
      padding: 35px 12px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #2C3729;
      color: #E5DBD6;
      border: 1px solid rgba(203, 182, 123, 0.35);
      box-shadow: 0 16px 40px rgba(0,0,0,0.22);
    }
    .header {
      padding: 42px 20px 32px;
      text-align: center;
      border-bottom: 1px solid rgba(203, 182, 123, 0.25);
      background-color: #2C3729;
    }
    .logo-monogram {
      display: inline-block;
      width: 56px;
      height: 56px;
      line-height: 54px;
      border: 1px solid #CBB67B;
      color: #CBB67B;
      font-size: 22px;
      font-weight: 300;
      letter-spacing: 0.15em;
      text-align: center;
      margin-bottom: 16px;
      font-family: 'Cormorant Garamond', Georgia, serif;
    }
    .logo-title {
      font-size: 26px;
      letter-spacing: 0.38em;
      color: #CBB67B;
      text-transform: uppercase;
      margin: 0;
      font-weight: 300;
      font-family: 'Cormorant Garamond', Georgia, serif;
    }
    .logo-sub {
      font-size: 8px;
      letter-spacing: 0.55em;
      color: #E5DBD6;
      text-transform: uppercase;
      margin-top: 8px;
      opacity: 0.8;
      font-family: 'Montserrat', sans-serif;
      font-weight: 300;
    }
    .content {
      padding: 42px 36px;
      background-color: #2C3729;
      color: #E5DBD6;
      font-family: 'Montserrat', sans-serif;
    }
    .content h2, .content h3, .content .display-text {
      font-family: 'Cormorant Garamond', Georgia, serif;
    }
    .footer {
      padding: 32px;
      text-align: center;
      background-color: #1F271D;
      border-top: 1px solid rgba(203, 182, 123, 0.2);
      font-size: 9px;
      letter-spacing: 0.25em;
      color: #8E9A8B;
      text-transform: uppercase;
      font-family: 'Montserrat', sans-serif;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background-color: #CBB67B;
      color: #2C3729 !important;
      text-decoration: none;
      font-size: 9px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      font-weight: 600;
      margin-top: 24px;
      border: 1px solid #CBB67B;
      font-family: 'Montserrat', sans-serif;
    }
    .gold-divider {
      width: 50px;
      height: 1px;
      background-color: #CBB67B;
      margin: 22px auto;
    }
    /* Responsive adjustment for product grid */
    @media only screen and (max-width: 480px) {
      .content { padding: 30px 20px !important; }
      .product-card { margin-bottom: 20px !important; }
    }
  </style>
</head>
<body>
  ${preheader ? `<div style="display:none;font-size:1px;color:#E5DBD6;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>` : ""}
  
  <div class="wrapper">
    <div class="container">
      
      <!-- HEADER WITH MONOGRAM LOGO -->
      <div class="header">
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center">
              <a href="https://minervaalcarazjoyeria.mx" target="_blank" style="text-decoration:none;">
                <div class="logo-monogram">MA</div>
              </a>
            </td>
          </tr>
        </table>
        <h1 class="logo-title">MINERVA ALCARAZ</h1>
        <div class="logo-sub">Joyería de Autor &amp; Alta Orfebrería</div>
      </div>

      <!-- CONTENT -->
      <div class="content">
        ${contentHtml}
      </div>

      <!-- FOOTER WITH SAN MIGUEL DE ALLENDE LOCATION -->
      <div class="footer">
        <p style="margin:0 0 8px 0; color:#CBB67B; font-weight:bold; font-family:'Cormorant Garamond', Georgia, serif; font-size:13px; letter-spacing:0.2em;">MINERVA ALCARAZ JOYERÍA</p>
        <p style="margin:0 0 12px 0; font-size:8px; text-transform:none; color:#8E9A8B; letter-spacing:0.15em;">San Miguel de Allende, Guanajuato, México · Atelier Privado</p>
        <div style="width:36px; height:1px; background-color:rgba(203, 182, 123, 0.35); margin:14px auto;"></div>
        <p style="margin:0; font-size:8px; opacity:0.6; letter-spacing:0.2em;">© 2026 Minerva Alcaraz. Todos los derechos reservados.</p>
      </div>

    </div>
  </div>
</body>
</html>`;
}
