// ============================================
// GOOGLE SHEETS SERVICE
// ============================================

const { google } = require('googleapis');

class SheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID;
  }

  async initialize() {
    if (this.sheets) return;

    try {
      // Create JWT auth client
      this.auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/spreadsheets']
      );

      await this.auth.authorize();
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    } catch (error) {
      console.error('Failed to initialize Google Sheets:', error);
      throw new Error('Failed to connect to Google Sheets');
    }
  }

  async getSheetData(sheetName) {
    await this.initialize();

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
      });

      return response.data.values || [];
    } catch (error) {
      console.error(`Error reading ${sheetName}:`, error);
      throw new Error(`Failed to read ${sheetName}`);
    }
  }

  async appendRow(sheetName, values) {
    await this.initialize();

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values],
        },
      });
    } catch (error) {
      console.error(`Error appending to ${sheetName}:`, error);
      throw new Error(`Failed to write to ${sheetName}`);
    }
  }

  async updateCell(sheetName, row, col, value) {
    await this.initialize();

    try {
      const columnLetter = String.fromCharCode(65 + col); // A=0, B=1, etc.
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!${columnLetter}${row}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[value]],
        },
      });
    } catch (error) {
      console.error(`Error updating ${sheetName}:`, error);
      throw new Error(`Failed to update ${sheetName}`);
    }
  }

  async findProduct(code) {
    const data = await this.getSheetData('ProductMaster');
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowCode = row[2] ? row[2].toString().trim().toUpperCase() : '';
      const rowToken = row[6] ? row[6].toString().trim() : '';
      
      if (rowCode === code.toUpperCase() || rowToken === code) {
        return {
          category: row[0],
          productName: row[1],
          code: row[2],
          points: parseInt(row[3]) || 0,
          token: rowToken,
        };
      }
    }
    
    return null;
  }

  async isCodeUsed(code, token) {
    const data = await this.getSheetData('UsedQRs');
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const usedCode = row[0] ? row[0].toString().trim().toUpperCase() : '';
      const usedToken = row[7] ? row[7].toString().trim() : '';
      
      if (usedCode === code.toUpperCase() || (token && usedToken === token)) {
        return true;
      }
    }
    
    return false;
  }

  async addUsedQR(product, name, phone) {
    await this.appendRow('UsedQRs', [
      product.code,
      product.productName,
      product.category,
      product.points,
      name,
      phone,
      new Date().toISOString(),
      product.token || '',
    ]);
  }

  async getCustomerPoints(phone) {
    const data = await this.getSheetData('CustomerPoints');
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] && row[0].toString().trim() === phone) {
        return {
          phone: row[0],
          name: row[1],
          points: parseInt(row[2]) || 0,
          rowIndex: i + 1, // 1-indexed for sheets
        };
      }
    }
    
    return null;
  }

  async updateCustomerPoints(phone, name, newPoints) {
    const customer = await this.getCustomerPoints(phone);
    
    if (customer) {
      // Update existing customer
      await this.updateCell('CustomerPoints', customer.rowIndex, 1, name);
      await this.updateCell('CustomerPoints', customer.rowIndex, 2, newPoints);
      return newPoints;
    } else {
      // Add new customer
      await this.appendRow('CustomerPoints', [phone, name, newPoints]);
      return newPoints;
    }
  }

  async getCustomerRedemptions(phone) {
    const data = await this.getSheetData('UsedQRs');
    const redemptions = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[5] && row[5].toString().trim() === phone) {
        redemptions.push({
          code: row[0],
          product: row[1],
          category: row[2],
          points: parseInt(row[3]) || 0,
          date: row[6],
        });
      }
    }
    
    // Sort by date, newest first
    return redemptions.reverse();
  }

  async logAudit(code, phone, status, points) {
    await this.appendRow('AuditLog', [
      new Date().toISOString(),
      code,
      phone,
      status,
      points,
    ]);
  }
}

module.exports = new SheetsService();
