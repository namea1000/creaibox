if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {};
}
try {
  const pdfParse = require("pdf-parse");
  console.log("Loaded pdf-parse successfully!");
} catch (e) {
  console.error(e);
}
