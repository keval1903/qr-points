# 📖 Complete Setup Guide

This guide will walk you through setting up the QR Points Redemption System from scratch.

## 📑 Table of Contents

1. [Google Sheets Setup](#1-google-sheets-setup)
2. [Google Cloud Setup](#2-google-cloud-setup)
3. [Local Development](#3-local-development)
4. [Netlify Deployment](#4-netlify-deployment)
5. [Testing](#5-testing)
6. [QR Code Generation](#6-qr-code-generation)

---

## 1. Google Sheets Setup

### Create Your Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "QR Points System"

### Create Required Sheets

#### Sheet 1: ProductMaster

1. Rename "Sheet1" to "ProductMaster"
2. Add headers in row 1:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Category | ProductName | UniqueCode | Points | Description | Status | Token |

3. Add sample data:

| Category | ProductName | UniqueCode | Points | Description | Status | Token |
|----------|-------------|------------|--------|-------------|--------|-------|
| Electronics | Laptop | LAPTOP001 | 100 | Gaming Laptop | Active | |
| Electronics | Mouse | MOUSE001 | 20 | Wireless Mouse | Active | |
| Fashion | T-Shirt | TSHIRT001 | 30 | Cotton T-Shirt | Active | |
| Food | Snack Box | SNACK001 | 10 | Healthy Snacks | Active | |

#### Sheet 2: UsedQRs

1. Create new sheet named "UsedQRs"
2. Add headers:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Code | ProductName | Category | Points | CustomerName | Phone | Date | Token |

#### Sheet 3: CustomerPoints

1. Create new sheet named "CustomerPoints"
2. Add headers:

| A | B | C |
|---|---|---|
| Phone | Name | TotalPoints |

#### Sheet 4: AuditLog

1. Create new sheet named "AuditLog"
2. Add headers:

| A | B | C | D | E |
|---|---|---|---|---|
| Timestamp | Code | Phone | Status | Points |

### Get Your Sheet ID

1. Look at your Google Sheet URL:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   ```
2. Copy the ID part (between `/d/` and `/edit`)
3. Save it - you'll need it later!

---

## 2. Google Cloud Setup

### Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: "QR Points System"
4. Click "Create"

### Enable Google Sheets API

1. In the search bar, type "Google Sheets API"
2. Click on "Google Sheets API"
3. Click "Enable"

### Create Service Account

1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. Fill in details:
   - **Name**: qr-points-service
   - **Description**: Service account for QR Points System
4. Click "Create and Continue"
5. **Grant access**: Select role "Editor"
6. Click "Continue" → "Done"

### Create Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON"
5. Click "Create"
6. **Save the downloaded JSON file securely!**

### Share Google Sheet with Service Account

1. Open the JSON file you downloaded
2. Find and copy the `client_email` value (looks like: `qr-points-service@project-id.iam.gserviceaccount.com`)
3. Go back to your Google Sheet
4. Click "Share" button
5. Paste the service account email
6. Give "Editor" access
7. Uncheck "Notify people"
8. Click "Share"

---

## 3. Local Development

### Install Dependencies

1. Open terminal in project folder
2. Run:
   ```bash
   npm install
   ```

### Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` and fill in your values:
   ```env
   GOOGLE_SHEET_ID=your_spreadsheet_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   ```

3. **Getting the values**:
   - `GOOGLE_SHEET_ID`: From your Google Sheet URL
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: From JSON file → `client_email`
   - `GOOGLE_PRIVATE_KEY`: From JSON file → `private_key` (keep the quotes and `\n` characters!)

### Test Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open browser to: `http://localhost:8888`

3. Test redemption:
   - Go to: `http://localhost:8888/?code=LAPTOP001`
   - Fill in name and phone
   - Click "Redeem Points"

---

## 4. Netlify Deployment

### Option A: Deploy via GitHub (Recommended)

#### Push to GitHub

1. Create a new repository on GitHub
2. Initialize git and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/qr-points.git
   git push -u origin main
   ```

#### Connect to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Authorize Netlify to access your GitHub
5. Select your repository
6. Build settings (auto-detected):
   - **Build command**: (leave empty)
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`
7. Click "Deploy site"

#### Add Environment Variables

1. Go to "Site settings" → "Environment variables"
2. Click "Add a variable"
3. Add these three variables:

   **Variable 1:**
   - Key: `GOOGLE_SHEET_ID`
   - Value: Your spreadsheet ID

   **Variable 2:**
   - Key: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - Value: Your service account email

   **Variable 3:**
   - Key: `GOOGLE_PRIVATE_KEY`
   - Value: Your private key (with `\n` characters)

4. Click "Save"

#### Redeploy

1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for deployment to complete
4. Click on the site URL to test!

### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize site:
   ```bash
   netlify init
   ```

4. Set environment variables:
   ```bash
   netlify env:set GOOGLE_SHEET_ID "your_spreadsheet_id"
   netlify env:set GOOGLE_SERVICE_ACCOUNT_EMAIL "your-email@project.iam.gserviceaccount.com"
   netlify env:set GOOGLE_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----\n"
   ```

5. Deploy:
   ```bash
   netlify deploy --prod
   ```

---

## 5. Testing

### Test Redemption Flow

1. **Generate a test URL**:
   ```
   https://your-site.netlify.app/?code=LAPTOP001
   ```

2. **Open in browser**
3. **Fill in form**:
   - Name: Test User
   - Phone: 1234567890

4. **Click "Redeem Points"**

5. **Verify in Google Sheets**:
   - Check `UsedQRs` sheet for new entry
   - Check `CustomerPoints` sheet for customer record
   - Check `AuditLog` sheet for log entry

### Test Dashboard

1. **Go to dashboard**:
   ```
   https://your-site.netlify.app/dashboard.html
   ```

2. **Enter phone number**: 1234567890

3. **Click "View Dashboard"**

4. **Verify**:
   - Total points displayed
   - Redemption history shown

### Test Error Cases

1. **Invalid code**:
   - URL: `?code=INVALID`
   - Should show: "Invalid product code"

2. **Duplicate redemption**:
   - Use same code twice
   - Should show: "This code has already been redeemed"

3. **Invalid phone**:
   - Enter 9 digits
   - Should show: "Valid 10-digit phone number required"

---

## 6. QR Code Generation

### Generate QR Codes for Products

#### Option 1: Online QR Generator

1. Go to [QR Code Generator](https://www.qr-code-generator.com/)
2. Enter URL: `https://your-site.netlify.app/?code=LAPTOP001`
3. Customize design (optional)
4. Download QR code
5. Print and attach to product

#### Option 2: Bulk Generation with Tokens

1. **Generate tokens in Google Sheets**:
   - Go to Tools → Script Editor
   - Paste this code:
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
     
     SpreadsheetApp.getUi().alert('Tokens generated!');
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
   - Save and run `generateTokens()`
   - Authorize the script

2. **Export tokens**:
   - Tokens are now in column G
   - Create URLs: `https://your-site.netlify.app/?token=abc123xyz`

3. **Generate QR codes**:
   - Use [QR Code Monkey](https://www.qrcode-monkey.com/) for bulk
   - Or use Python script:
   ```python
   import qrcode
   import pandas as pd
   
   # Read tokens from CSV export
   df = pd.read_csv('products.csv')
   
   for index, row in df.iterrows():
       token = row['Token']
       url = f"https://your-site.netlify.app/?token={token}"
       
       qr = qrcode.QRCode(version=1, box_size=10, border=5)
       qr.add_data(url)
       qr.make(fit=True)
       
       img = qr.make_image(fill_color="black", back_color="white")
       img.save(f"qr_codes/{token}.png")
   ```

### QR Code Best Practices

1. **Size**: Minimum 2cm x 2cm for scanning
2. **Contrast**: High contrast (black on white)
3. **Placement**: Easy to access, well-lit area
4. **Protection**: Laminate or use waterproof material
5. **Testing**: Test scan before mass printing

---

## 🎉 You're Done!

Your QR Points Redemption System is now live!

### Next Steps

1. ✅ Add more products to ProductMaster
2. ✅ Generate and print QR codes
3. ✅ Share redemption URL with customers
4. ✅ Monitor AuditLog for activity
5. ✅ Customize colors and branding

### Need Help?

- Check the main [README.md](README.md)
- Review [Troubleshooting](#troubleshooting) section
- Open an issue on GitHub

---

## 🐛 Troubleshooting

### "Failed to connect to Google Sheets"

**Cause**: Service account not configured correctly

**Solutions**:
1. Verify service account email in environment variables
2. Check Google Sheet is shared with service account
3. Ensure Google Sheets API is enabled
4. Check private key format (must include `\n` characters)

### "Invalid product code"

**Cause**: Product not found in ProductMaster

**Solutions**:
1. Check product exists in ProductMaster sheet
2. Verify UniqueCode matches exactly (case-sensitive)
3. Check Status column is "Active"
4. Ensure no extra spaces in code

### "This code has already been redeemed"

**Cause**: Code already used (by design)

**Solutions**:
1. This is expected behavior - codes are single-use
2. Check UsedQRs sheet to see who redeemed it
3. Generate new code/token for new redemption

### Netlify Functions Not Working

**Cause**: Environment variables or deployment issue

**Solutions**:
1. Check all 3 environment variables are set in Netlify
2. Redeploy the site after adding variables
3. Check function logs in Netlify dashboard
4. Verify `googleapis` package is in dependencies

### QR Code Not Scanning

**Cause**: QR code quality or URL issue

**Solutions**:
1. Increase QR code size (minimum 2cm x 2cm)
2. Ensure high contrast (black on white)
3. Test URL manually in browser first
4. Use error correction level M or H
5. Clean camera lens on phone

---

**Happy Deploying! 🚀**
