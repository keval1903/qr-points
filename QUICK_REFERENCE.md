# ⚡ Quick Reference Card

## 🚀 Deploy in 5 Minutes

```bash
# 1. Google Setup (2 min)
- Create Google Sheet with 4 tabs
- Create service account
- Share sheet with service account email

# 2. GitHub Push (1 min)
git init && git add . && git commit -m "Initial"
git push origin main

# 3. Netlify Deploy (2 min)
- Connect GitHub repo
- Add 3 environment variables
- Deploy!
```

## 🔑 Environment Variables

```env
GOOGLE_SHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 📊 Google Sheets Structure

### ProductMaster
`Category | ProductName | UniqueCode | Points | Description | Status | Token`

### UsedQRs
`Code | ProductName | Category | Points | CustomerName | Phone | Date | Token`

### CustomerPoints
`Phone | Name | TotalPoints`

### AuditLog
`Timestamp | Code | Phone | Status | Points`

## 🔗 URLs After Deployment

```
Main Site:     https://your-site.netlify.app
Redemption:    https://your-site.netlify.app/?code=PRODUCT001
Dashboard:     https://your-site.netlify.app/dashboard.html
API Redeem:    https://your-site.netlify.app/api/redeem
API Dashboard: https://your-site.netlify.app/api/dashboard?phone=1234567890
```

## 💻 Local Development

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (port 8888)
netlify dev             # Alternative dev server
```

## 🎨 Quick Customization

### Change Colors
Edit `public/styles.css`:
```css
:root {
  --primary: #667eea;    /* Your color */
  --secondary: #764ba2;  /* Your color */
}
```

### Change Text
Edit `public/index.html` and `public/dashboard.html`

### Add Logo
```html
<img src="logo.png" style="width: 100px;">
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Failed to connect" | Check service account email & sheet sharing |
| "Invalid code" | Verify product exists & Status is "Active" |
| "Already redeemed" | Codes are single-use (check UsedQRs) |
| Functions error | Check env vars & redeploy |

## 📱 Generate QR Codes

**Quick:** [qr-code-generator.com](https://www.qr-code-generator.com/)

**URL Format:**
```
https://your-site.netlify.app/?code=PRODUCT001
or
https://your-site.netlify.app/?token=abc123xyz
```

## 🔧 Useful Commands

```bash
# Deploy
git push origin main                    # Auto-deploy via GitHub
netlify deploy --prod                   # Manual deploy

# Logs
netlify logs:function redeem           # View function logs
netlify logs:function dashboard        # View dashboard logs

# Environment
netlify env:list                       # List env vars
netlify env:set KEY "value"           # Set env var

# Development
netlify dev                            # Local dev server
netlify open                           # Open Netlify dashboard
```

## 📊 Monitor Activity

Check these Google Sheets:
- **UsedQRs**: All redemptions
- **CustomerPoints**: Customer balances
- **AuditLog**: All activity (success/errors)

## 🎯 API Quick Reference

### Redeem Points
```bash
curl -X POST https://your-site.netlify.app/api/redeem \
  -H "Content-Type: application/json" \
  -d '{"code":"LAPTOP001","name":"John","phone":"1234567890"}'
```

### Get Dashboard
```bash
curl https://your-site.netlify.app/api/dashboard?phone=1234567890
```

## 📁 Project Files

```
public/
  ├── index.html          # Main page
  ├── dashboard.html      # Dashboard
  ├── styles.css          # Styles
  ├── app.js             # Redemption logic
  └── dashboard.js       # Dashboard logic

netlify/functions/
  ├── redeem.js          # Redeem API
  ├── dashboard.js       # Dashboard API
  └── sheets-service.js  # Google Sheets

Documentation/
  ├── README.md          # Full docs
  ├── SETUP_GUIDE.md     # Setup steps
  ├── DEPLOYMENT.md      # Deploy guide
  └── QUICK_REFERENCE.md # This file
```

## 🔐 Security Checklist

- [ ] Environment variables set
- [ ] Service account has minimal permissions
- [ ] `.env` in `.gitignore`
- [ ] HTTPS enabled (automatic on Netlify)
- [ ] Audit logging active

## 📈 Performance Tips

1. **Images**: Optimize before upload
2. **Caching**: Netlify handles automatically
3. **CDN**: Enabled by default on Netlify
4. **Monitoring**: Use Netlify Analytics

## 🎉 Success Checklist

- [ ] Google Sheet created with 4 tabs
- [ ] Service account created & shared
- [ ] Code pushed to GitHub
- [ ] Deployed to Netlify
- [ ] Environment variables set
- [ ] Test redemption works
- [ ] Dashboard loads correctly
- [ ] QR codes generated
- [ ] Products added to sheet

## 📞 Get Help

- **Docs**: Check README.md, SETUP_GUIDE.md
- **Issues**: GitHub Issues
- **Logs**: Netlify dashboard → Functions

## 🎯 Next Actions

1. [ ] Add products to ProductMaster
2. [ ] Generate QR codes
3. [ ] Test full flow
4. [ ] Share with customers
5. [ ] Monitor Google Sheets

---

**Need detailed help?** See README.md or SETUP_GUIDE.md

**Ready to deploy?** See DEPLOYMENT.md

**Everything working?** Start adding products! 🚀
