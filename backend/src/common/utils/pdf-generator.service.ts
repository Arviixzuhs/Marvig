import { Injectable } from '@nestjs/common'
import { jsPDF } from 'jspdf'
import { getFormattedDateTime } from './getFormattedDateTime'

/**
 * Shared service with PDF layout helpers (header, footer, summary box,
 * currency/date formatters). Injectable so any module can use it.
 */
@Injectable()
export class PdfGeneratorService {
  readonly BRAND_COLOR: [number, number, number] = [15, 23, 42] // slate-900 (Deep, elegant)
  readonly ACCENT_COLOR: [number, number, number] = [79, 70, 229] // Indigo-600 (Vibrant brand color)
  readonly LIGHT_COLOR: [number, number, number] = [248, 250, 252] // slate-50
  readonly TEXT_MUTED: [number, number, number] = [100, 116, 139] // slate-500
  readonly BORDER_COLOR: [number, number, number] = [226, 232, 240] // slate-200 (Clean, visible borders)

  formatCurrency(amount: number = 0): string {
    return amount.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    })
  }

  /**
   * Genera un encabezado limpio y asimétrico sobre fondo blanco con acento de marca.
   */
  addPdfHeader(doc: jsPDF, title: string, subtitle: string): void {
    const pageW = doc.internal.pageSize.getWidth()

    // --- ACCENT BAR: Franja decorativa superior en color Indigo ---
    doc.setFillColor(...this.ACCENT_COLOR)
    doc.rect(0, 0, pageW, 4.5, 'F')

    // --- LADO IZQUIERDO: Branding de la aplicación ---
    // Pequeño logo minimalista (un rectángulo vertical en Accent Color)
    doc.setFillColor(...this.ACCENT_COLOR)
    doc.roundedRect(14, 11, 4, 10, 0.5, 0.5, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(...this.BRAND_COLOR)
    doc.text('MARVIG', 21, 18.5)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...this.TEXT_MUTED)
    doc.text('Sistema de Gestión', 21, 23.5)

    // --- LADO DERECHO: Metadatos del Reporte ---
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.setTextColor(...this.BRAND_COLOR)
    doc.text(title, pageW - 14, 18.5, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...this.TEXT_MUTED)
    doc.text(subtitle, pageW - 14, 23.5, { align: 'right' })

    // Línea divisoria minimalista y delgada
    doc.setDrawColor(...this.BORDER_COLOR)
    doc.setLineWidth(0.5)
    doc.line(14, 28, pageW - 14, 28)
  }

  /**
   * Footer minimalista integrado al final de las páginas sin bloques toscos.
   */
  addPdfFooter(doc: jsPDF): void {
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    const totalPages = (doc as any).internal.getNumberOfPages()

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)

      doc.setDrawColor(...this.BORDER_COLOR)
      doc.setLineWidth(0.4)
      doc.line(14, pageH - 12, pageW - 14, pageH - 12)

      doc.setTextColor(...this.TEXT_MUTED)
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Generado el ${getFormattedDateTime({ value: new Date() })
        } | Servidor Corporativo Marvig`,
        14,
        pageH - 6,
      )
      doc.text(`Página ${i} de ${totalPages} `, pageW - 14, pageH - 6, { align: 'right' })
    }
  }

  /**
   * Caja de KPI en formato de tarjetas individuales con bordes y barra de acento izquierdo.
   * @returns La siguiente posición Y disponible.
   */
  addSummaryBox(doc: jsPDF, items: { label: string; value: string }[], startY: number): number {
    const pageW = doc.internal.pageSize.getWidth()
    const margin = 14
    const totalWidth = pageW - margin * 2
    const gap = 4 // Espaciado entre tarjetas
    const totalGapWidth = gap * (items.length - 1)
    const itemW = (totalWidth - totalGapWidth) / items.length
    const height = 18

    items.forEach((item, i) => {
      const cardX = margin + i * (itemW + gap)

      // Dibujar fondo de tarjeta
      doc.setFillColor(...this.LIGHT_COLOR)
      doc.roundedRect(cardX, startY, itemW, height, 1, 1, 'F')

      // Dibujar borde sutil
      doc.setDrawColor(...this.BORDER_COLOR)
      doc.setLineWidth(0.4)
      doc.roundedRect(cardX, startY, itemW, height, 1, 1, 'D')

      // Dibujar barra de acento izquierdo
      doc.setFillColor(...this.ACCENT_COLOR)
      doc.roundedRect(cardX, startY, 2.5, height, 0.5, 0.5, 'F')

      const textX = cardX + 6.5

      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...this.TEXT_MUTED)
      doc.text(item.label.toUpperCase(), textX, startY + 5.5)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...this.BRAND_COLOR)
      doc.text(item.value, textX, startY + 13)
    })

    return startY + height + 5
  }
}
