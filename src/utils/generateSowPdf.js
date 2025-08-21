// src/utils/generateSowPdf.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { languagesLine, formatUSD } from './sowHelpers';

export function generateSowPdf(state) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const M = { l: 54, r: 54, t: 64, b: 64 };
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentWidth = pageW - M.l - M.r;
  let y = M.t;

  const needPage = (gap = 14) => y + gap > pageH - M.b;
  const addText = (
    txt,
    { size = 11, bold = false, gap = 14, color = [0, 0, 0] } = {}
  ) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = Array.isArray(txt) ? txt : [txt];
    lines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, contentWidth);
      wrapped.forEach((w) => {
        if (needPage(gap)) {
          doc.addPage();
          y = M.t;
        }
        doc.text(w, M.l, y);
        y += gap;
      });
    });
  };
  const addKV = (label, value, opts = {}) => {
    const gap = opts.gap || 14;
    const size = opts.size || 11;
    const contIndent = 24;
    const lbl = String(label);
    const val = String(value ?? '');
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    const labelWidth = doc.getTextWidth(lbl + ' ');
    const firstLineWidth = Math.max(10, contentWidth - labelWidth);
    const chunks = doc.splitTextToSize(val, firstLineWidth);

    chunks.forEach((chunk, i) => {
      if (needPage(gap)) {
        doc.addPage();
        y = M.t;
      }
      if (i === 0) {
        doc.setFont('helvetica', 'bold');
        doc.text(lbl, M.l, y);
        doc.setFont('helvetica', 'normal');
        doc.text(chunk, M.l + labelWidth, y);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.text(chunk, M.l + contIndent, y);
      }
      y += gap;
    });
  };

  // Title
  addText('Statement of Work (SOW)', { size: 18, bold: true, gap: 22 });
  y += 14;

  // Preamble
  addText(
    state.preamble ||
      'This Statement of Work (“SOW”) is made pursuant to the Master Services Agreement (“Agreement”) dated 00 MON 2025, between Inc. (“Company”) and Inc. (“Contractor”).'
  );

  // 1. Project Information
  y += 6;
  addText('1. PROJECT INFORMATION', { bold: true });
  addKV('1.1 Project Name:', state.projectName || '');
  addKV('1.2 Project Summary:', state.projectSummary || '');

  // 2. Scope
  y += 6;
  addText('2. SCOPE OF WORK', { bold: true });
  addKV(
    '2.1 Description of Services:',
    state.descriptionOfServices ?? state.services ?? ''
  );
  addKV('2.2 Deliverables:', state.deliverables || '');

  // 3. Schedule
  y += 6;
  addText('3. SCHEDULE', { bold: true });
  addKV('3.1 Start Date:', state.startDate || '');
  addKV('3.2 Completion Date:', state.completionDate || '');
  addKV('3.3 Milestones (if any):', state.milestones || '');

  // 4. Compensation
  y += 6;
  addText('4. COMPENSATION', { bold: true });
  // NOTE: "Total Cost (USD)" from right panel is mapped to "4.1 Total Fee"
  addKV('4.1 Total Fee:', formatUSD(state.totalCostUSD ?? 0));
  addKV('4.2 Payment Terms:', state.paymentTerms || '');

  // 5. Requirements
  y += 6;
  addText('5. WORK REQUIREMENTS', { bold: true });
  addKV('5.1 Tools/Materials:', state.materials || '');

  // 6. Contacts
  y += 6;
  addText('6. PRIMARY CONTACT FOR THIS PROJECT', { bold: true });
  addKV('6.1 Company Representative:', state.companyRep || '');
  addKV('6.2 Contractor Representative:', state.contractorRep || '');

  // Witness + table
  y += 10;
  addText(
    state.witnessText ||
      'IN WITNESS WHEREOF, the parties have executed this Statement of Work as of the dates set forth.'
  );
  autoTable(doc, {
    startY: y + 6,
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 11,
      cellPadding: 2,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: contentWidth / 2 - 6 },
      1: { cellWidth: contentWidth / 2 - 6 }
    },
    head: [['COMPANY', 'INDEPENDENT CONTRACTOR']],
    body: [
      [
        `[_______________________] Date: [_____]\nName\nTitle`,
        `[_______________________] Date: [_____]\nName\nTitle`
      ]
    ]
  });

  // Footer per page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const left = 'Related to Statement of Work to Master Services Agreement';
    const right = `Page ${i} of ${pageCount}`;
    doc.text(left, M.l, pageH - 24);
    const rw = doc.getTextWidth(right);
    doc.text(right, pageW - M.r - rw, pageH - 24);
  }

  // Filename
  const dateStamp = new Date().toISOString().slice(0, 10);
  const safeTitle = (state.projectName || 'Untitled').replace(/[^\w.-]+/g, '_');
  doc.save(`GNP-SOW_${safeTitle}_${dateStamp}.pdf`);
}
