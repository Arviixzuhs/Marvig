export const getEmailTemplate = (title: string, subtitle: string, content: string): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #f4f4f5;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #18181b;
    padding: 24px 12px;
    -webkit-font-smoothing: antialiased;
  }

  .wrapper {
    max-width: 580px;
    margin: 0 auto;
  }

  .container {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e4e4e7;
  }

  /* Header con imagen de fondo u Overlay oscuro para contraste */
  .header {
    background: url("https://res.cloudinary.com/rvf7h1gz/image/upload/v1792372118/bg-image.jpg") center/cover no-repeat #000000;
    color: #ffffff;
    text-align: center;
    padding: 40px 24px 36px 24px;
  }

  .logo {
    max-width: 120px;
    height: auto;
    margin: 0 auto 16px auto;
    display: block;
    border-radius: 4px;
  }

  .title {
    font-size: 22px;
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 8px;
    color: #ffffff;
    letter-spacing: -0.01em;
  }

  .subtitle {
    color: #f4f4f5;
    font-size: 14px;
    font-weight: 400;
    opacity: 0.9;
  }

  .content {
    padding: 28px 24px 20px 24px;
    color: #27272a;
    font-size: 14px;
    line-height: 1.6;
  }

  /* Control de márgenes para párrafos */
  .content p {
    margin-top: 0;
    margin-bottom: 12px;
  }

  .content hr {
    border: 0;
    border-top: 1px solid #e4e4e7;
    margin: 16px 0;
  }

  .content strong {
    color: #000000;
  }

  /* Tarjeta de detalles de reserva */
  .reservation-details {
    background-color: #fafafa;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
  }

  .reservation-details p {
    margin-bottom: 8px;
  }

  .reservation-details p:last-child {
    margin-bottom: 0;
  }

  /* Contenedor y Botón CTA */
  .cta-container {
    text-align: center;
    margin: 24px 0 20px 0;
  }

  .btn-primary {
    display: inline-block;
    background-color: #000000;
    color: #ffffff !important;
    padding: 12px 28px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.2px;
    transition: background-color 0.2s ease;
  }

  .divider {
    height: 1px;
    background-color: #e4e4e7;
  }

  .footer {
    padding: 24px;
    background-color: #fafafa;
    text-align: center;
  }

  .company {
    font-size: 14px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .contact {
    color: #71717a;
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .contact a {
    color: #000000;
    text-decoration: underline;
  }

  .notice {
    font-size: 11px;
    color: #a1a1aa;
    line-height: 1.5;
    max-width: 440px;
    margin: 0 auto;
  }

  .copyright {
    margin-top: 16px;
    font-size: 11px;
    color: #a1a1aa;
  }

  @media only screen and (max-width: 600px) {
    body {
      padding: 12px 6px;
    }
    .content {
      padding: 20px 16px 16px 16px;
    }
    .header {
      padding: 32px 16px 28px 16px;
    }
    .title {
      font-size: 19px;
    }
    .btn-primary {
      display: block;
      width: 100%;
      text-align: center;
    }
  }
</style>
</head>

<body>
<div class="wrapper">
  <div class="container">

    <div class="header">
      <img src="https://res.cloudinary.com/rvf7h1gz/image/upload/v1792372160/logo.jpg" class="logo" alt="Posada Marvig">
      <div class="title">${title}</div>
      <div class="subtitle">${subtitle}</div>
    </div>

    <div class="content">
      ${content}
    </div>

    <div class="divider"></div>

    <div class="footer">
      <div class="company">Posada Marvig</div>
      <div class="contact">
        📧 <a href="mailto:posada.marvig@gmail.com">posada.marvig@gmail.com</a> &nbsp;|&nbsp; 
        🌐 <a href="https://posadamarvig.com" target="_blank">posadamarvig.com</a><br>
        📞 +58 412-6229592
      </div>

      <div class="notice">
        Este es un correo electrónico generado automáticamente. Por favor, no respondas a este mensaje. 
        Si necesitas ayuda, comunícate con nuestro equipo de soporte.
      </div>

      <div class="copyright">
        © ${new Date().getFullYear()} Posada Marvig. Todos los derechos reservados.
      </div>
    </div>

  </div>
</div>
</body>
</html>
`
}
