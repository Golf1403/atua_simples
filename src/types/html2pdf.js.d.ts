declare module 'html2pdf.js' {
  interface Html2Pdf {
    set(options: any): Html2Pdf;
    from(source: HTMLElement | string): Html2Pdf;
    save(filename?: string): void;
  }

  const html2pdf: () => Html2Pdf;

  export = html2pdf;
}
