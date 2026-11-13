/**
 * DreamX Data Export Utility
 * Safely generates RFC 4180 CSV downloads directly in the browser using Blob URLs.
 */

export function exportToCsv<T extends object>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
): void {
  if (!rows || rows.length === 0) {
    const emptyBlob = new Blob(["No records found\r\n"], { type: "text/csv;charset=utf-8;" });
    downloadBlob(emptyBlob, filename);
    return;
  }

  const columns =
    headers ||
    (Object.keys(rows[0]) as Array<keyof T>).map((k) => ({
      key: k,
      label: String(k),
    }));

  const escapeCell = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(",");
  const dataRows = rows.map((row) =>
    columns.map((col) => escapeCell((row as Record<string, unknown>)[col.key as string])).join(",")
  );

  const csvContent = "\uFEFF" + [headerRow, ...dataRows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
