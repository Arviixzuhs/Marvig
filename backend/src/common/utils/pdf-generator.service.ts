import { Injectable } from '@nestjs/common'
import { jsPDF } from 'jspdf'

/**
 * Shared service with PDF layout helpers (header, footer, summary box,
 * currency/date formatters). Injectable so any module can use it.
 */
@Injectable()
export class PdfGeneratorService {
  readonly BRAND_COLOR: [number, number, number] = [30, 41, 59]      // slate-800
  readonly ACCENT_COLOR: [number, number, number] = [148, 163, 184]  // slate-400
  readonly LIGHT_COLOR: [number, number, number] = [248, 250, 252]   // slate-50
  readonly TEXT_MUTED: [number, number, number] = [100, 116, 139]    // slate-500
  readonly BORDER_COLOR: [number, number, number] = [241, 245, 249]  // slate-100

  formatCurrency(amount: number = 0): string {
    return amount.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    })
  }

  formatDate(dateStr?: string | Date | null): string {
    if (!dateStr) return '—'
    try {
      const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch {
      return String(dateStr)
    }
  }

  /**
   * Genera un encabezado limpio y asimétrico sobre fondo blanco.
   */
  addPdfHeader(doc: jsPDF, title: string, subtitle: string): void {
    const pageW = doc.internal.pageSize.getWidth()

    // --- LADO IZQUIERDO: Branding de la aplicación ---
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(...this.BRAND_COLOR)
    doc.text('MARVIG', 14, 18)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...this.ACCENT_COLOR)
    doc.text('Sistema de Gestión', 14, 24)

    // --- LADO DERECHO: Metadatos del Reporte ---
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(15, 23, 42) // Slate 900
    doc.text(title, pageW - 14, 18, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...this.TEXT_MUTED)
    doc.text(subtitle, pageW - 14, 24, { align: 'right' })

    // Línea divisoria minimalista y delgada
    doc.setDrawColor(...this.BORDER_COLOR)
    doc.setLineWidth(0.5)
    doc.line(14, 30, pageW - 14, 30)
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
      doc.text(`Generado el ${this.formatDate(new Date())} | Servidor Corporativo Marvig`, 14, pageH - 6)
      doc.text(`Página ${i} de ${totalPages}`, pageW - 14, pageH - 6, { align: 'right' })
    }
  }

  /**
   * Caja de KPI en formato de panel plano sin bordes negros,
   * simulando una interfaz web moderna.
   * @returns La siguiente posición Y disponible.
   */
  addSummaryBox(doc: jsPDF, items: { label: string; value: string }[], startY: number): number {
    const pageW = doc.internal.pageSize.getWidth()
    const margin = 14
    const totalWidth = pageW - margin * 2
    const itemW = totalWidth / items.length

    doc.setFillColor(...this.LIGHT_COLOR)
    doc.roundedRect(margin, startY, totalWidth, 22, 1.5, 1.5, 'F')

    items.forEach((item, i) => {
      const x = margin + i * itemW + itemW / 2

      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...this.TEXT_MUTED)
      doc.text(item.label.toUpperCase(), x, startY + 7, { align: 'center' })

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...this.BRAND_COLOR)
      doc.text(item.value, x, startY + 16, { align: 'center' })
    })

    return startY + 28
  }
}
