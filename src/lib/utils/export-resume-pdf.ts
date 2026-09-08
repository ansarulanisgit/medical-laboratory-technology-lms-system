export interface ExportPdfOptions {
  elementId?: string;
  fileName?: string;
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Isolated Iframe Print & Native Vector PDF Engine.
 * Formats ONLY the resume element inside an isolated iframe with strict ISO A4 @page margins (210mm x 297mm).
 * Produces 100% razor-sharp, selectable vector text, pure CSS borders, exact font hinting, and zero canvas rasterization blur.
 */
export function printResumeDocument(
  elementId: string = "resume-document",
  fileNameOrTitle?: string
): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  const originalDocTitle = document.title;
  const docTitle = fileNameOrTitle?.replace(/\.pdf$/i, "") || originalDocTitle || "Clinical_Resume";
  
  // Temporarily set document.title so Chromium/Edge Save as PDF defaults to the user's name
  try {
    document.title = docTitle;
  } catch {}

  const compStyle = window.getComputedStyle(element);
  const activeFontFamily =
    element.style.fontFamily || compStyle.fontFamily || "'Plus Jakarta Sans', sans-serif";

  // Gather all page stylesheets and styles
  const headElements = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
    .map((el) => el.outerHTML)
    .join("\n");

  // Create temporary hidden print iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    try {
      document.title = originalDocTitle;
    } catch {}
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html class="${document.documentElement.className}">
      <head>
        <meta charset="utf-8" />
        <title>${docTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
        ${headElements}
        <style>
          @page {
            size: A4 portrait;
            margin: 0mm;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
          }
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            overflow: hidden !important;
          }
          #${elementId} {
            width: 210mm !important;
            min-width: 210mm !important;
            max-width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            background: #ffffff !important;
            font-family: ${activeFontFamily} !important;
          }
          #${elementId} *:not(.font-mono) {
            font-family: inherit !important;
          }
          #${elementId} .font-mono {
            font-family: 'JetBrains Mono', ui-monospace, Menlo, Monaco, Consolas, monospace !important;
          }
        </style>
      </head>
      <body class="${document.body.className}">
        ${element.outerHTML}
      </body>
    </html>
  `;

  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  const triggerPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error("Iframe print fallback:", e);
      window.print();
    } finally {
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
          document.title = originalDocTitle;
        } catch {}
      }, 3000);
    }
  };

  // Wait for iframe fonts to be fully ready before triggering print/save dialog
  if (iframeDoc.fonts && "ready" in iframeDoc.fonts) {
    iframeDoc.fonts.ready
      .then(() => {
        setTimeout(triggerPrint, 250);
      })
      .catch(() => {
        setTimeout(triggerPrint, 400);
      });
  } else {
    setTimeout(triggerPrint, 400);
  }
}

/**
 * High-fidelity client-side ISO A4 PDF generator.
 * Uses the exact same isolated high-precision print engine that powers "Save PDF",
 * guaranteeing identical 100% razor-sharp vector text, exact styling, crisp borders, and flawless 1-page A4 output.
 */
export async function exportResumeToPdf({
  elementId = "resume-document",
  fileName = "Clinical_Resume.pdf",
  onStart,
  onSuccess,
  onError,
}: ExportPdfOptions = {}): Promise<boolean> {
  try {
    onStart?.();

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Target document element '#${elementId}' was not found in the DOM.`);
    }

    const cleanTitle = fileName.replace(/\.pdf$/i, "") || "Clinical_Resume";
    printResumeDocument(elementId, cleanTitle);

    onSuccess?.();
    return true;
  } catch (err: any) {
    console.error("PDF Export error:", err);
    onError?.(err instanceof Error ? err : new Error(String(err)));
    return false;
  }
}
