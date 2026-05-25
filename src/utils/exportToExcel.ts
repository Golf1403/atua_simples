import * as XLSX from 'xlsx';

function exportToExcel(tableId: string, fileName: string) {
  const table = document.getElementById(tableId);
  if (!table) {
    console.error(`Tabela com ID ${tableId} não encontrada.`);
    return;
  }

  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Convert the Excel data to a Blob
  // Convert the Excel data to a buffer
  const excelBuffer = XLSX.writeXLSX(wb, { bookType: 'xlsx', type: 'buffer' });

  // Create a Blob from the buffer
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Create a link element and trigger the download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.xlsx`;

  // Append the link to the document and trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
}

export default exportToExcel;
