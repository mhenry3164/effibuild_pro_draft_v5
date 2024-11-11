import PDFDocument from 'pdfkit';
import type { Estimate } from '@/types';

export async function generatePDF(estimate: Estimate): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add company header
      doc.fontSize(20).text('EffiBuild Pro', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text('Estimate', { align: 'center' });
      doc.moveDown();

      // Add estimate details
      doc.fontSize(12);
      doc.text(`Estimate #: ${estimate.id}`);
      doc.text(`Date: ${new Date(estimate.createdAt).toLocaleDateString()}`);
      doc.text(`Project: ${estimate.projectName}`);
      doc.moveDown();

      // Add customer information
      doc.text('Customer Information:');
      doc.text(`Name: ${estimate.customerName}`);
      doc.text(`Email: ${estimate.customerEmail}`);
      doc.text(`Phone: ${estimate.customerPhone}`);
      doc.moveDown();

      // Add materials table
      doc.text('Materials:', { underline: true });
      doc.moveDown();

      const tableTop = doc.y;
      const itemX = 50;
      const descriptionX = 150;
      const quantityX = 280;
      const unitX = 350;
      const priceX = 400;
      const totalX = 480;

      // Add table headers
      doc
        .text('Item', itemX, tableTop)
        .text('Description', descriptionX, tableTop)
        .text('Qty', quantityX, tableTop)
        .text('Unit', unitX, tableTop)
        .text('Price', priceX, tableTop)
        .text('Total', totalX, tableTop);

      doc.moveDown();

      let y = doc.y;

      // Add table rows
      estimate.materials.forEach((material) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        doc
          .text(material.name, itemX, y)
          .text(material.description || '', descriptionX, y)
          .text(material.quantity.toString(), quantityX, y)
          .text(material.unit, unitX, y)
          .text(`$${material.unitPrice.toFixed(2)}`, priceX, y)
          .text(`$${material.totalPrice.toFixed(2)}`, totalX, y);

        y += 20;
      });

      doc.moveDown();
      doc.text(`Total: $${estimate.totalCost.toFixed(2)}`, { align: 'right' });

      // Add notes if any
      if (estimate.notes) {
        doc.moveDown();
        doc.text('Notes:', { underline: true });
        doc.text(estimate.notes);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}