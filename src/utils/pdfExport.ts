import html2pdf from 'html2pdf.js';

export const exportToPDF = (content: HTMLElement, singlePage: boolean = false) => {
  // Create a clean container for PDF export
  const container = document.createElement('div');
  container.className = 'pdf-export-container';
  container.style.cssText = `
    width: 210mm;
    padding: 20mm;
    background: white;
  `;
  
  // Clone the content
  const clone = content.cloneNode(true) as HTMLElement;
  clone.style.cssText = `
    margin: 0;
    padding: 0;
    border: none;
    box-shadow: none;
    border-radius: 0;
    background: white;
    width: 100%;
  `;
  
  container.appendChild(clone);
  document.body.appendChild(container);

  const options = {
    filename: 'document.pdf',
    margin: 0,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      scrollY: 0,
      windowWidth: container.offsetWidth,
      windowHeight: container.offsetHeight,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
      precision: 16
    },
    pagebreak: {
      mode: singlePage ? ['avoid-all'] : ['css', 'legacy'],
      before: '.page-break'
    }
  };

  return html2pdf()
    .from(container)
    .set(options)
    .save()
    .then(() => {
      document.body.removeChild(container);
    })
    .catch((error) => {
      console.error('PDF export failed:', error);
      document.body.removeChild(container);
      throw error;
    });
};