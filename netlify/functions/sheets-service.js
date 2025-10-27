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
      console.log('Initializing Google Sheets with:');
      console.log('- Sheet ID:', this.spreadsheetId);
      console.log('- Service Account Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
      console.log('- Private Key Present:', !!process.env.GOOGLE_PRIVATE_KEY);

      if (!process.env.GOOGLE_PRIVATE_KEY) {
        throw new Error('GOOGLE_PRIVATE_KEY is not set');
      }

      const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
      this.auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        privateKey,
        ['https://www.googleapis.com/auth/spreadsheets']
      );

      console.log('Authorizing...');
      await this.auth.authorize();
      console.log('Authorization successful');

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      console.log('Google Sheets API initialized');

      // Test connection
      await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
        fields: 'properties.title',
      });

    } catch (error) {
      console.error('Failed to initialize Google Sheets:');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      throw new Error(`Failed to connect to Google Sheets: ${error.message}`);
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

  async findProduct(code) {
    const data = await this.getSheetData('ProductMaster');

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

  async appendRow(sheetName, values) {
    await this.initialize();

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values],
        },
      });
    } catch (error) {
      console.error(`Error appending to ${sheetName}:`, error);
      throw new Error(`Failed to update ${sheetName}`);
    }
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
        };
      }
    }

    return null;
  }

  async updateCustomerPoints(phone, name, points) {
    await this.initialize();

    try {
      const data = await this.getSheetData('CustomerPoints');
      let rowIndex = -1;

      for (let i = 1; i < data.length; i++) {
        if (data[i][0] && data[i][0].toString().trim() === phone) {
          rowIndex = i + 1; // +1 because of 1-based indexing in Sheets
          break;
        }
      }

      if (rowIndex > 0) {
        // Update existing customer
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `CustomerPoints!A${rowIndex}:C${rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[phone, name, points]],
          },
        });
      } else {
        // Add new customer
        await this.appendRow('CustomerPoints', [phone, name, points]);
      }
    } catch (error) {
      console.error('Error updating customer points:', error);
      throw new Error('Failed to update customer points');
    }
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