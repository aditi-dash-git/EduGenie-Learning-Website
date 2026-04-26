import fs from 'fs/promises';
// fs- file system is used to read the pdf file from storage
import { createRequire } from "module";


// imports the pdf-parse library 
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
// pdf-parse extracts text content from a pdf file.




/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<{text: string, numPages: number}>}
 */


export const extractTextFromPDF = async (filePath) => {
  try {

    //it reads the pdf file from server stores it in dataBuffer
    const dataBuffer = await fs.readFile(filePath);


    // sends the PDF Buffer into "pdf-parse" and it reads the pdf, extracts the text, extracts metadata, and counts pages
    const data = await pdf(dataBuffer);

    // pdf-parse returns the following
    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};