# 🏗️ System Architecture

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CUSTOMER                             │
│                    (Mobile/Desktop)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Scans QR Code
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    NETLIFY CDN (HTTPS)                       │
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  Static Files    │         │  Serverless      │         │
│  │  (HTML/CSS/JS)   │         │  Functions       │         │
│  │                  │         │                  │         │
│  │  • index.html    │         │  • redeem.js     │         │
│  │  • dashboard.html│         │  • dashboard.js  │         │
│  │  • styles.css    │         │  • sheets-svc.js │         │
│  │  • app.js        │         │                  │         │
│  │  • dashboard.js  │         │                  │         │
│  └──────────────────┘         └──────────────────┘         │
│                                         │                    │
└─────────────────────────────────────────┼────────────────────┘
                                          │
                                          │ Google Sheets API
                                          ▼
                         ┌────────────────────────────┐
                         │   GOOGLE SHEETS (Database) │
                         │                            │
                         │  • ProductMaster           │
                         │  • UsedQRs                 │
                         │  • CustomerPoints          │
                         │  • AuditLog                │
                         └────────────────────────────┘
```

## 🔄 Data Flow

### Redemption Flow

```
1. Customer scans QR code
   ↓
2. Browser opens: https://site.netlify.app/?code=PRODUCT001
   ↓
3. Frontend loads (index.html + app.js)
   ↓
4. Customer fills form (name + phone)
   ↓
5. Frontend sends POST to /api/redeem
   ↓
6. Netlify Function (redeem.js) processes:
   - Validates input
   - Calls sheets-service.js
   ↓
7. sheets-service.js:
   - Authenticates with Google
   - Finds product in ProductMaster
   - Checks if code used in UsedQRs
   - Adds to UsedQRs
   - Updates CustomerPoints
   - Logs to AuditLog
   ↓
8. Response sent back to frontend
   ↓
9. Success message shown to customer
```

### Dashboard Flow

```
1. Customer visits dashboard.html
   ↓
2. Enters phone number
   ↓
3. Frontend sends GET to /api/dashboard?phone=1234567890
   ↓
4. Netlify Function (dashboard.js) processes:
   - Validates phone
   - Calls sheets-service.js
   ↓
5. sheets-service.js:
   - Gets customer from CustomerPoints
   - Gets redemptions from UsedQRs
   ↓
6. Response with data sent to frontend
   ↓
7. Dashboard rendered with stats and history
```

## 🗂️ Component Architecture

### Frontend Layer

```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ index.html   │  │ dashboard.html  │ │
│  │              │  │                 │ │
│  │ • Form UI    │  │ • Stats Display │ │
│  │ • Validation │  │ • History List  │ │
│  │ • Alerts     │  │ • Search Form   │ │
│  └──────┬───────┘  └────────┬────────┘ │
│         │                   │          │
│  ┌──────▼───────┐  ┌────────▼────────┐ │
│  │   app.js     │  │  dashboard.js   │ │
│  │              │  │                 │ │
│  │ • API calls  │  │ • API calls     │ │
│  │ • State mgmt │  │ • Data render   │ │
│  │ • Events     │  │ • Formatting    │ │
│  └──────────────┘  └─────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Backend Layer

```
┌─────────────────────────────────────────┐
│           APPLICATION LAYER             │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │  redeem.js   │  │  dashboard.js   │ │
│  │              │  │                 │ │
│  │ • Validation │  │ • Validation    │ │
│  │ • Business   │  │ • Data fetch    │ │
│  │   logic      │  │ • Formatting    │ │
│  └──────┬───────┘  └────────┬────────┘ │
│         │                   │          │
│         └───────┬───────────┘          │
│                 ▼                       │
│      ┌──────────────────┐              │
│      │ sheets-service.js│              │
│      │                  │              │
│      │ • Auth           │              │
│      │ • CRUD ops       │              │
│      │ • Data mapping   │              │
│      └──────────────────┘              │
│                                         │
└─────────────────────────────────────────┘
```

### Data Layer

```
┌─────────────────────────────────────────┐
│              DATA LAYER                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────────────────┐ │
│  │        GOOGLE SHEETS               │ │
│  │                                    │ │
│  │  ┌──────────────┐                 │ │
│  │  │ProductMaster │ ← Products      │ │
│  │  └──────────────┘                 │ │
│  │                                    │ │
│  │  ┌──────────────┐                 │ │
│  │  │   UsedQRs    │ ← Redemptions   │ │
│  │  └──────────────┘                 │ │
│  │                                    │ │
│  │  ┌──────────────┐                 │ │
│  │  │CustomerPoints│ ← Customers     │ │
│  │  └──────────────┘                 │ │
│  │                                    │ │
│  │  ┌──────────────┐                 │ │
│  │  │  AuditLog    │ ← Activity      │ │
│  │  └──────────────┘                 │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────┐
│          SECURITY LAYERS                │
├─────────────────────────────────────────┤
│                                         │
│  Layer 1: Transport Security            │
│  • HTTPS enforced by Netlify            │
│  • TLS 1.3                              │
│                                         │
│  Layer 2: Authentication                │
│  • Service Account (Google)             │
│  • JWT tokens                           │
│  • Environment variables                │
│                                         │
│  Layer 3: Input Validation              │
│  • Frontend validation                  │
│  • Backend validation                   │
│  • Type checking                        │
│                                         │
│  Layer 4: Authorization                 │
│  • Sheet-level permissions              │
│  • Service account scope limits         │
│                                         │
│  Layer 5: Audit                         │
│  • All actions logged                   │
│  • Timestamp tracking                   │
│  • Status recording                     │
│                                         │
└─────────────────────────────────────────┘
```

## 📡 API Architecture

### RESTful Endpoints

```
POST /api/redeem
├── Request
│   ├── Headers: Content-Type: application/json
│   └── Body: { code, name, phone }
├── Processing
│   ├── Validate input
│   ├── Find product
│   ├── Check duplicates
│   ├── Update sheets
│   └── Log audit
└── Response
    ├── 200: Success with data
    ├── 400: Validation error
    ├── 404: Product not found
    ├── 409: Already redeemed
    └── 500: Server error

GET /api/dashboard?phone={phone}
├── Request
│   ├── Query: phone (10 digits)
│   └── Headers: (none required)
├── Processing
│   ├── Validate phone
│   ├── Get customer data
│   └── Get redemptions
└── Response
    ├── 200: Success with data
    ├── 400: Invalid phone
    ├── 404: Customer not found
    └── 500: Server error
```

## 🔄 State Management

### Frontend State

```javascript
// app.js state
{
  code: string,           // From URL or input
  name: string,           // User input
  phone: string,          // User input
  isLoading: boolean,     // Loading state
  alert: {
    message: string,
    type: 'success' | 'error'
  }
}

// dashboard.js state
{
  phone: string,          // User input
  isLoading: boolean,     // Loading state
  dashboardData: {
    totalPoints: number,
    redemptions: Array
  }
}
```

### Backend State

```javascript
// Stateless functions
// Each request is independent
// State stored in Google Sheets
```

## 📦 Deployment Architecture

```
┌─────────────────────────────────────────┐
│           DEVELOPMENT                   │
│                                         │
│  Local Machine                          │
│  • npm run dev                          │
│  • Port 8888                            │
│  • .env file                            │
└────────────┬────────────────────────────┘
             │
             │ git push
             ▼
┌─────────────────────────────────────────┐
│            GITHUB                       │
│                                         │
│  Repository                             │
│  • Source code                          │
│  • GitHub Actions                       │
└────────────┬────────────────────────────┘
             │
             │ Webhook trigger
             ▼
┌─────────────────────────────────────────┐
│          NETLIFY BUILD                  │
│                                         │
│  Build Process                          │
│  • Install dependencies                 │
│  • Build functions                      │
│  • Deploy to CDN                        │
└────────────┬────────────────────────────┘
             │
             │ Deploy
             ▼
┌─────────────────────────────────────────┐
│         PRODUCTION                      │
│                                         │
│  Netlify Edge Network                   │
│  • Global CDN                           │
│  • Serverless functions                 │
│  • Environment variables                │
└─────────────────────────────────────────┘
```

## 🌐 Network Architecture

```
                    INTERNET
                       │
                       ▼
              ┌────────────────┐
              │  Netlify Edge  │
              │   (Global CDN) │
              └────────┬───────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │ US East│    │ Europe │    │ Asia   │
   │  Node  │    │  Node  │    │  Node  │
   └────────┘    └────────┘    └────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
              ┌────────────────┐
              │ Netlify Lambda │
              │   (Functions)  │
              └────────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │  Google Cloud  │
              │  Sheets API    │
              └────────────────┘
```

## 📊 Data Model

### Entity Relationship

```
Product (ProductMaster)
├── id: UniqueCode (PK)
├── category: string
├── name: string
├── points: number
├── token: string (unique)
└── status: enum

    ↓ (redeemed by)

Redemption (UsedQRs)
├── code: string (FK → Product)
├── phone: string (FK → Customer)
├── date: datetime
├── points: number
└── token: string

    ↓ (belongs to)

Customer (CustomerPoints)
├── phone: string (PK)
├── name: string
└── totalPoints: number

    ↓ (tracked in)

AuditLog
├── timestamp: datetime
├── code: string
├── phone: string
├── status: enum
└── points: number
```

## ⚡ Performance Architecture

### Optimization Layers

```
1. CDN Layer (Netlify)
   • Static asset caching
   • Global edge distribution
   • Automatic compression

2. Function Layer
   • Cold start optimization
   • Connection pooling
   • Response caching

3. API Layer
   • Batch operations
   • Efficient queries
   • Minimal data transfer

4. Data Layer
   • Indexed lookups
   • Minimal reads
   • Batch writes
```

## 🔄 Scalability Architecture

### Current Capacity

```
Tier 1: Free (Current)
├── Requests: 125k/month
├── Functions: 125k invocations
├── Bandwidth: 100GB
└── Build: 300 minutes

Tier 2: Pro ($19/month)
├── Requests: Unlimited
├── Functions: Unlimited
├── Bandwidth: 1TB
└── Build: Unlimited
```

### Scaling Strategy

```
Phase 1: 0-1k users
└── Current setup (Free tier)

Phase 2: 1k-10k users
├── Upgrade to Netlify Pro
└── Add caching layer

Phase 3: 10k-100k users
├── Migrate to PostgreSQL
├── Add Redis cache
└── Multiple regions

Phase 4: 100k+ users
├── Microservices architecture
├── Load balancing
└── Database sharding
```

## 🛠️ Technology Stack

```
Frontend
├── HTML5
├── CSS3 (Custom, no framework)
├── Vanilla JavaScript (ES6+)
└── Fetch API

Backend
├── Node.js 18+
├── Netlify Functions
├── Google Sheets API
└── googleapis npm package

Infrastructure
├── Netlify (Hosting + Functions)
├── GitHub (Version control)
├── GitHub Actions (CI/CD)
└── Google Cloud (Sheets API)

Development
├── npm (Package manager)
├── Git (Version control)
└── VS Code (Recommended IDE)
```

---

**This architecture is designed for:**
- ✅ Easy deployment
- ✅ Low maintenance
- ✅ High scalability
- ✅ Cost efficiency
- ✅ Developer experience
