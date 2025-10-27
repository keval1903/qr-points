# 🎁 QR Points Redemption System

A modern, serverless QR code points redemption system built with Netlify Functions and Google Sheets API. Deploy in 5 minutes!

## ✨ Features

- 🚀 **Serverless Architecture** - No backend server needed, runs on Netlify Functions
- 📊 **Google Sheets Backend** - Use Google Sheets as your database
- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 📱 **Mobile-First** - Optimized for mobile QR scanning
- 🔒 **Secure** - Token-based QR codes with duplicate prevention
- 📈 **Customer Dashboard** - Track points and redemption history
- ⚡ **Fast** - Instant deployments with Netlify
- 🔄 **Auto-Deploy** - Push to GitHub, auto-deploy to production

## 🏗️ Architecture

```
Frontend (Static HTML/CSS/JS)
    ↓
Netlify Functions (Serverless)
    ↓
Google Sheets API
    ↓
Google Sheets (Database)
```

## 📋 Prerequisites

- Google Account (for Google Sheets)
- GitHub Account (for repository)
- Netlify Account (free tier works!)

## 🚀 Quick Start (5 Minutes)

### Step 1: Set Up Google Sheets (2 minutes)

1. **Create a new Google Sheet** with these tabs:

   **ProductMaster** (Columns: A-G)
   ```
   Category | ProductName | UniqueCode | Points | Description | Status | Token
   ```

   **UsedQRs** (Columns: A-H)
   ```
   Code | ProductName | Category | Points | CustomerName | Phone | Date | Token
   ```

   **CustomerPoints** (Columns: A-C)
   ```
   Phone | Name | TotalPoints
   ```

   **AuditLog** (Columns: A-E)
   ```
   Timestamp | Code | Phone | Status | Points
   ```

2. **Add sample products** to ProductMaster:
   ```
   Electronics | Laptop | LAPTOP001 | 100 | Gaming Laptop | Active | 
   Fashion | T-Shirt | TSHIRT001 | 20 | Cotton T-Shirt | Active |
   ```

### Step 2: Create Google Service Account (2 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Sheets API**
4. Create **Service Account**:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name it (e.g., "qr-points-service")
   - Grant role: "Editor"
   - Click "Create Key" → JSON
   - Download the JSON file

5. **Share your Google Sheet** with the service account email:
   - Copy the `client_email` from JSON file
   - Share your Google Sheet with this email (Editor access)

### Step 3: Deploy to Netlify (1 minute)

#### Option A: Deploy with GitHub (Recommended)

1. **Push this code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/qr-points.git
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings are auto-detected from `netlify.toml`
   - Click "Deploy site"

3. **Add Environment Variables** in Netlify:
   - Go to Site Settings → Environment Variables
   - Add these variables:
     ```
     GOOGLE_SHEET_ID=your_spreadsheet_id
     GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
     GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n
     ```
   - Get these from your service account JSON file

#### Option B: Deploy with Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login and deploy**:
   ```bash
   netlify login
   netlify init
   netlify env:set GOOGLE_SHEET_ID "your_spreadsheet_id"
   netlify env:set GOOGLE_SERVICE_ACCOUNT_EMAIL "your-email@project.iam.gserviceaccount.com"
   netlify env:set GOOGLE_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----\n"
   netlify deploy --prod
   ```

## 🎯 Usage

### For Customers

1. **Scan QR Code** - Scan the QR code on the product
2. **Enter Details** - Fill in name and phone number
3. **Redeem Points** - Click "Redeem Points"
4. **View Dashboard** - Check total points and history

### For Admins

1. **Add Products** - Add new products to ProductMaster sheet
2. **Generate QR Codes** - Create QR codes with URLs:
   ```
   https://your-site.netlify.app/?code=PRODUCT001
   or
   https://your-site.netlify.app/?token=abc123xyz
   ```
3. **Monitor Activity** - Check AuditLog and UsedQRs sheets
4. **Track Customers** - View CustomerPoints sheet

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_SHEET_ID` | Your Google Sheet ID | `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email | `service@project.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Private key from JSON | `-----BEGIN PRIVATE KEY-----\n...` |

### Getting Google Sheet ID

From your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit
```

## 📁 Project Structure

```
qr-points-redemption/
├── public/                 # Frontend files
│   ├── index.html         # Main redemption page
│   ├── dashboard.html     # Customer dashboard
│   ├── styles.css         # Modern CSS styles
│   ├── app.js            # Redemption logic
│   └── dashboard.js      # Dashboard logic
├── netlify/
│   └── functions/         # Serverless functions
│       ├── redeem.js     # Redemption endpoint
│       ├── dashboard.js  # Dashboard endpoint
│       └── sheets-service.js  # Google Sheets integration
├── netlify.toml          # Netlify configuration
├── package.json          # Dependencies
├── .env.example          # Environment variables template
└── README.md            # This file
```

## 🔌 API Endpoints

### POST `/api/redeem`
Redeem a QR code for points.

**Request:**
```json
{
  "code": "PRODUCT001",
  "name": "John Doe",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "100 points added! Total: 100",
  "data": {
    "code": "PRODUCT001",
    "product": "Laptop",
    "category": "Electronics",
    "points": 100,
    "totalPoints": 100
  }
}
```

### GET `/api/dashboard?phone=1234567890`
Get customer dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "phone": "1234567890",
    "name": "John Doe",
    "totalPoints": 100,
    "redemptions": [
      {
        "code": "PRODUCT001",
        "product": "Laptop",
        "category": "Electronics",
        "points": 100,
        "date": "2025-10-27T14:30:00.000Z"
      }
    ]
  }
}
```

## 🎨 Customization

### Change Colors

Edit `public/styles.css`:
```css
:root {
  --primary: #667eea;      /* Main color */
  --secondary: #764ba2;    /* Secondary color */
  --success: #10b981;      /* Success color */
  --error: #ef4444;        /* Error color */
}
```

### Add Custom Fields

1. Add columns to Google Sheets
2. Update `sheets-service.js` to handle new fields
3. Update frontend forms in HTML files

## 🐛 Troubleshooting

### "Failed to connect to Google Sheets"
- Check service account email is correct
- Verify Google Sheet is shared with service account
- Ensure Google Sheets API is enabled

### "Invalid product code"
- Check product exists in ProductMaster sheet
- Verify code/token matches exactly (case-sensitive)
- Check Status column is "Active"

### "This code has already been redeemed"
- Code can only be used once
- Check UsedQRs sheet for redemption record

### Functions not working
- Check environment variables are set correctly
- View function logs in Netlify dashboard
- Ensure `googleapis` package is installed

## 📊 Google Sheets Tips

1. **Use Data Validation** - Add dropdowns for Status, Category
2. **Conditional Formatting** - Highlight used codes
3. **Protected Ranges** - Lock header rows
4. **Formulas** - Auto-calculate totals
5. **Charts** - Visualize redemption trends

## 🔐 Security Best Practices

1. ✅ Never commit `.env` file or service account JSON
2. ✅ Use environment variables for all secrets
3. ✅ Limit service account permissions
4. ✅ Use tokens instead of readable codes for QR
5. ✅ Regularly rotate service account keys
6. ✅ Monitor AuditLog for suspicious activity

## 🚀 Advanced Features

### Generate Tokens for Products

Add this script to your Google Sheet (Tools → Script Editor):

```javascript
function generateTokens() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ProductMaster');
  const lastRow = sheet.getLastRow();
  
  for (let i = 2; i <= lastRow; i++) {
    const code = sheet.getRange(i, 3).getValue();
    const token = sheet.getRange(i, 7).getValue();
    
    if (code && !token) {
      const newToken = generateRandomToken(16);
      sheet.getRange(i, 7).setValue(newToken);
    }
  }
}

function generateRandomToken(length) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
```

### Bulk QR Code Generation

Use a QR code generator with your URLs:
- [QR Code Generator](https://www.qr-code-generator.com/)
- [QRCode Monkey](https://www.qrcode-monkey.com/)

Format: `https://your-site.netlify.app/?token=YOUR_TOKEN`

## 📈 Scaling

This system can handle:
- ✅ Thousands of products
- ✅ Hundreds of concurrent users
- ✅ Millions of redemptions (with Google Sheets limits)

For higher scale, consider:
- Migrate to a real database (PostgreSQL, MongoDB)
- Add caching layer (Redis)
- Implement rate limiting

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use for commercial projects!

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/qr-points/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/qr-points/discussions)

## 🎉 Credits

Built with ❤️ using:
- [Netlify](https://www.netlify.com/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- Modern Web Standards

---

**Ready to deploy?** Follow the Quick Start guide above! 🚀
