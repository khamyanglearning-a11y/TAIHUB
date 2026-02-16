
/**
 * GOOGLE APPS SCRIPT CODE (Paste this in your Google Sheet Apps Script):
 * ----------------------------------------------------------------------
 * 
 * function doGet() {
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *   var data = sheet.getDataRange().getValues();
 *   if (data.length < 2) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
 *   
 *   var headers = data[0];
 *   var json = [];
 *   for (var i = 1; i < data.length; i++) {
 *     var obj = {};
 *     for (var j = 0; j < headers.length; j++) {
 *       obj[headers[j]] = data[i][j];
 *     }
 *     json.push(obj);
 *   }
 *   return ContentService.createTextOutput(JSON.stringify(json)).setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * function doPost(e) {
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *   var data = JSON.parse(e.postData.contents);
 *   sheet.clear();
 *   var headers = ["id", "english", "assamese", "taiKhamyang", "optional", "pronunciation", "exampleSentence", "audioUrl", "category", "addedBy", "createdAt"];
 *   sheet.appendRow(headers);
 *   data.forEach(function(item) {
 *     sheet.appendRow(headers.map(h => item[h] || ""));
 *   });
 *   return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
 * }
 */

import { Word } from '../types';

/**
 * YOUR GOOGLE SHEET: https://docs.google.com/spreadsheets/d/1_cHDReRXYmRwiK5qkYS5efXRj7hk-xuVub6MJA9d1iI
 */
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbyuZHThTS4TIiyQTvZMzYl25J9Blo8-GoVVG2N1fby7ed2hqPi6lYbztPr8wB-olQM/exec';

export const syncWordsToCloud = async (words: Word[]): Promise<boolean> => {
  if (!SHEET_API_URL || SHEET_API_URL.includes('PASTE_YOUR')) {
    alert("Configuration Required: Please set up your Google Sheet sync URL.");
    return false;
  }
  
  try {
    const response = await fetch(SHEET_API_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(words)
    });
    return true; 
  } catch (error) {
    console.error("Cloud Sync Error:", error);
    return false;
  }
};

export const fetchWordsFromCloud = async (): Promise<Word[] | null> => {
  if (!SHEET_API_URL || SHEET_API_URL.includes('PASTE_YOUR')) return null;
  
  try {
    const response = await fetch(SHEET_API_URL);
    const data = await response.json();
    return data as Word[];
  } catch (error) {
    console.error("Cloud Fetch Error:", error);
    return null;
  }
};
