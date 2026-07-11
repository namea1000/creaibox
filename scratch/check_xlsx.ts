import * as XLSX from "xlsx";
import path from "path";

const xlsxPath = path.resolve(process.cwd(), "bgm_music_style_prompt.xlsx");
const workbook = XLSX.readFile(xlsxPath);
const sheetName = "장르";
const worksheet = workbook.Sheets[sheetName];
const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

console.log("SheetName:", sheetName);
console.log("Total rows found:", rawRows.length);
if (rawRows.length > 0) {
  console.log("First 3 rows structure:");
  console.log(JSON.stringify(rawRows.slice(0, 3), null, 2));
}
