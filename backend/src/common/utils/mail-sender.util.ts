import * as nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
import { getEmailTemplate } from './get-email-template.util'

export interface SendEmailDto {
  to: string
  title: string
  subject: string
  subtitle: string
  content: string
}

export interface SendBulkEmailDto extends Omit<SendEmailDto, 'to'> {
  recipients: string[]
}

dotenv.config()
export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  async sendSingleEmail(dto: SendEmailDto): Promise<void> {
    const htmlContent = getEmailTemplate(dto.title, dto.subtitle, dto.content)

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: dto.to,
      subject: dto.subject,
      html: htmlContent,
    }

    try {
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error(`Error enviando email a ${dto.to}:`, error)
      throw error
    }
  }

  async sendBulkEmail(dto: SendBulkEmailDto): Promise<void> {
    const htmlContent = getEmailTemplate(dto.title, dto.subtitle, dto.content)

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      bcc: dto.recipients,
      subject: dto.subject,
      html: htmlContent,
    }

    try {
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error('Error en el envío masivo de emails:', error)
      throw error
    }
  }
}
