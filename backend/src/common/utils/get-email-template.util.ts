export const getEmailTemplate = (title: string, subtitle: string, content: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f9; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; }
        .header { background-color: #1e293b; padding: 20px; text-align: center; color: white; }
        .logo { max-width: 150px; }
        .content { padding: 30px; color: #334155; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="cid:logoEmpresa" alt="Logo de la Empresa" class="logo">
          <h1>${title}</h1>
          <p>${subtitle}</p>
        </div>
        <div class="content">
          ${content.replace(/\n/g, '<br>')}
        </div>
      </div>
    </body>
    </html>
  `
}
