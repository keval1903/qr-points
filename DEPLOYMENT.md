# 🚀 5-Minute Deployment Guide

Get your QR Points System live in 5 minutes!

## ⏱️ Time Breakdown

- **2 minutes**: Google Sheets + Service Account
- **1 minute**: GitHub push
- **2 minutes**: Netlify deployment

---

## Step 1: Google Setup (2 min)

### A. Create Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new sheet, add 4 tabs:
   - `ProductMaster` (Category, ProductName, UniqueCode, Points, Description, Status, Token)
   - `UsedQRs` (Code, ProductName, Category, Points, CustomerName, Phone, Date, Token)
   - `CustomerPoints` (Phone, Name, TotalPoints)
   - `AuditLog` (Timestamp, Code, Phone, Status, Points)

3. Add sample product:
   ```
   Electronics | Laptop | LAPTOP001 | 100 | Gaming Laptop | Active | 
   ```

### B. Create Service Account

1. [console.cloud.google.com](https://console.cloud.google.com)
2. New Project → Enable "Google Sheets API"
3. IAM & Admin → Service Accounts → Create
4. Download JSON key
5. Share your sheet with the `client_email` from JSON

---

## Step 2: Deploy to GitHub (1 min)

```bash
# Initialize git
git init
git add .
git commit -m "QR Points System"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/qr-points.git
git push -u origin main
```

---

## Step 3: Deploy to Netlify (2 min)

### A. Connect Repository

1. Go to [app.netlify.com](https://app.netlify.com)
2. "Add new site" → "Import from Git"
3. Choose GitHub → Select repository
4. Click "Deploy site"

### B. Add Environment Variables

Go to Site Settings → Environment Variables → Add:

```
GOOGLE_SHEET_ID
→ Get from sheet URL: docs.google.com/spreadsheets/d/[THIS_PART]/edit

GOOGLE_SERVICE_ACCOUNT_EMAIL
→ From JSON: "client_email" value

GOOGLE_PRIVATE_KEY
→ From JSON: "private_key" value (keep the \n characters!)
```

### C. Redeploy

1. Deploys tab → "Trigger deploy"
2. Wait 30 seconds
3. Click site URL → Test!

---

## ✅ Test Your Deployment

1. **Test URL**: `https://your-site.netlify.app/?code=LAPTOP001`
2. **Fill form**: Name + Phone (10 digits)
3. **Redeem**: Should see success message
4. **Check sheets**: Verify data in UsedQRs, CustomerPoints, AuditLog

---

## 🎯 Quick Commands

### Local Development
```bash
npm install
npm run dev
# Open http://localhost:8888
```

### Deploy Updates
```bash
git add .
git commit -m "Update"
git push
# Auto-deploys to Netlify!
```

### View Logs
```bash
netlify logs:function redeem
netlify logs:function dashboard
```

---

## 🔗 Important URLs

After deployment, you'll have:

- **Main site**: `https://your-site.netlify.app`
- **Redemption**: `https://your-site.netlify.app/?code=PRODUCT001`
- **Dashboard**: `https://your-site.netlify.app/dashboard.html`
- **API Redeem**: `https://your-site.netlify.app/api/redeem`
- **API Dashboard**: `https://your-site.netlify.app/api/dashboard?phone=1234567890`

---

## 🎨 Customize

### Change Colors

Edit `public/styles.css`:
```css
:root {
  --primary: #667eea;      /* Your brand color */
  --secondary: #764ba2;    /* Accent color */
}
```

### Change Text

Edit `public/index.html` and `public/dashboard.html`

### Add Logo

Add to `public/index.html`:
```html
<div class="header">
  <img src="logo.png" alt="Logo" style="width: 100px; margin-bottom: 16px;">
  <h1>Points Redemption</h1>
</div>
```

---

## 🐛 Common Issues

### "Failed to connect to Google Sheets"
- ✅ Check service account email is correct
- ✅ Verify sheet is shared with service account
- ✅ Ensure Google Sheets API is enabled

### "Invalid product code"
- ✅ Product must exist in ProductMaster
- ✅ Status must be "Active"
- ✅ Code is case-sensitive

### Functions returning 500 error
- ✅ Check all 3 environment variables are set
- ✅ Redeploy after adding variables
- ✅ Check function logs in Netlify

---

## 📱 Generate QR Codes

### Quick Method

1. Go to [qr-code-generator.com](https://www.qr-code-generator.com/)
2. Enter: `https://your-site.netlify.app/?code=LAPTOP001`
3. Download and print!

### Bulk Method

Use Google Sheets script (see SETUP_GUIDE.md) to:
1. Generate unique tokens
2. Export token list
3. Batch generate QR codes

---

## 🎉 You're Live!

Your QR Points System is now deployed and ready to use!

**Next steps:**
1. Add more products to ProductMaster
2. Generate QR codes for each product
3. Share redemption URL with customers
4. Monitor activity in Google Sheets

**Need help?** Check README.md or SETUP_GUIDE.md

---

**Deployment Time**: ~5 minutes ⚡
**Total Cost**: $0 (using free tiers) 💰
**Scalability**: Thousands of users ✅
