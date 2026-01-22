# ⚡ Quick Reference - Shree Bakers Website

## 🚀 Running the Website

```bash
# Start development server
npm run dev

# Build for production
npm run build

# View production build
npm run preview
```

**URL**: http://localhost:5173 (or 5174, 5175...)

---

## 🛠️ Essential Files to Edit

### 1. Update Phone Numbers (URGENT!)
**File**: `src/components/Contact.jsx`
```javascript
Line 39: href="tel:919876543210"      // CHANGE THIS
Line 52: href="https://wa.me/919876543210"  // AND THIS
```

**File**: `src/components/OrderConfirmation.jsx`
```javascript
Line 73: href="tel:919876543210"      // CHANGE THIS
Line 78: href="https://wa.me/919876543210"  // AND THIS
```

### 2. Update Cake Menu
**File**: `src/data/cakes.js`
```javascript
// Edit the cakesData array
// Update prices, names, descriptions, weights
// Add new cakes or remove old ones
```

### 3. Change Delivery Times
**File**: `src/utils/helpers.js`
```javascript
export const getDeliverySlots = () => {
  return [
    "9:00 AM - 11:00 AM",   // EDIT THESE TIMES
    "11:00 AM - 1:00 PM",
    // ... etc
  ];
};
```

### 4. Update Shop Info
**File**: `src/components/Contact.jsx`
```javascript
Line 63: "Monday - Friday: 8:00 AM - 8:00 PM"  // EDIT HOURS
Line 64: "Saturday: 8:00 AM - 9:00 PM"
Line 65: "Sunday: 9:00 AM - 8:00 PM"

Line 50: "Main Street, Phulambri"  // EDIT ADDRESS
```

---

## 📱 Website Pages

| Page | Path | Button | Purpose |
|------|------|--------|---------|
| Home | / | Home | Hero & info |
| Order | /order | Order | Browse cakes |
| Cart | /cart | 🛒 | Review & checkout |
| Confirmation | /confirmation | Auto | Order summary |
| Contact | /contact | Contact | Info & FAQ |

---

## 🎨 Customization Cheat Sheet

### Change Colors
**File**: `tailwind.config.js`
```javascript
colors: {
  cream: '#FFF8F3',    // Background
  peach: '#F4A084',    // Buttons
  coral: '#FF6B6B',    // Highlights
  chocolate: '#8B4513', // Text
  gold: '#D4AF37',     // Accents
}
```

### Change Fonts
**File**: `src/index.css`
```css
:root {
  font-family: 'Your Font', system-ui;
}
```

### Modify Minimum Delivery Date
**File**: `src/utils/helpers.js`
```javascript
tomorrow.setDate(tomorrow.getDate() + 1);
// Change +1 to +0 for same-day orders
```

---

## 📋 Common Tasks

### Add a New Cake
```javascript
// In src/data/cakes.js, add to cakesData:
{
  id: 13,
  name: "Cake Name",
  description: "Description",
  category: "Birthday",  // or Anniversary, Wedding, Custom
  price: 300,
  weights: [
    { size: "0.5kg", price: 300 },
    { size: "1kg", price: 500 }
  ],
  type: "Egg",  // or "Eggless"
  image: "🍰"   // Use emoji
}
```

### Update Cake Price
```javascript
// In src/data/cakes.js, find the cake and change:
price: 350,  // Base price
weights: [
  { size: "0.5kg", price: 350 },  // Update these
  { size: "1kg", price: 600 }
]
```

### Add New Category
```javascript
// 1. Edit src/data/cakes.js
export const categories = ["All", "Birthday", "Anniversary", "Wedding", "Custom", "NEW"];

// 2. Add cakes with category: "NEW"
```

### Enable Same-Day Orders
```javascript
// In src/utils/helpers.js:
export const getMinDeliveryDate = () => {
  const today = new Date();  // Changed from tomorrow
  return today.toISOString().split('T')[0];
};
```

---

## 🔍 Phulambri Address Validation

The system checks if address contains:
- "phulambri"
- "phulamri"
- "phulamburi"

All case-insensitive. ✅ "123 Phulambri Road" works, ❌ "Pune" doesn't.

---

## 🛒 Cart Management

### Cart is stored in:
- **Browser LocalStorage** (survives page refresh)
- Key: `'cart'`
- Cleared when order is placed

### Cart structure:
```javascript
[
  {
    id: 1,
    name: "Chocolate Cake",
    price: 300,        // Price per unit
    weight: "1kg",
    quantity: 2,
    type: "Egg",
    itemTotal: 600     // price × quantity
  },
  // ... more items
]
```

---

## ✅ Validation Rules

### Phone Number
- Exactly 10 digits
- Numbers only
- Error: "Valid 10-digit phone number required"

### Address
- Must contain "Phulambri"
- Error: "We deliver ONLY in Phulambri..."

### Name
- Cannot be empty
- Error: "Name is required"

### Delivery Date
- Minimum: Tomorrow (by default)
- Can be changed in helpers.js

---

## 🌐 WhatsApp Integration

### WhatsApp Message Includes:
- Customer name & phone
- Delivery address & time
- Each item with weight & quantity
- Total amount
- Custom cake message
- "Thank you" message

### WhatsApp Button:
- Pre-filled message
- One click to send
- Opens WhatsApp Web or app
- No API key needed

### To Change WhatsApp Number:
**Files**: Contact.jsx, OrderConfirmation.jsx
```javascript
href="https://wa.me/919876543210?text=..."
                        ↑↑↑↑↑↑↑↑↑
                    CHANGE THIS (11 digits)
```

---

## 📱 Responsive Breakpoints

| Screen | Columns | Example |
|--------|---------|---------|
| Mobile | 1 | iPhone, Android |
| Tablet | 2 | iPad |
| Desktop | 3-4 | Laptop |

All automatic with Tailwind! ✓

---

## 🔐 Security Notes

### ✅ Protected:
- Address validation (Phulambri only)
- Phone number validation
- No access to payment data

### ⚠️ NOT Protected (optional to add):
- No password
- No login system
- No user tracking
- No email validation

These are fine for simple bakery. Add later if needed.

---

## 📦 Deployment Checklist

Before deploying:
- [ ] Phone numbers updated
- [ ] Shop hours correct
- [ ] Address updated
- [ ] Cake menu reviewed
- [ ] Prices verified
- [ ] Delivery slots checked
- [ ] Tested on mobile
- [ ] Built with `npm run build`
- [ ] `dist/` folder ready
- [ ] Hosting platform chosen

---

## 🚀 One-Command Deploy

### Netlify (Easiest):
```bash
npm run build
# Then drag dist/ folder to netlify.com
```

### Vercel:
```bash
npm run build
git add .
git commit -m "Deploy"
git push
# Auto-deploys!
```

---

## 🎨 Component Map

```
App (main router)
├── Header
│   ├── Navigation buttons
│   └── Cart badge
├── Home
├── CakeListing
│   └── CakeCard (×12)
├── Cart
├── OrderConfirmation
└── Contact
```

---

## 📊 Cake Data Structure

```javascript
{
  id: 1,                    // Unique ID
  name: "String",           // Cake name
  description: "String",    // Short description
  category: "String",       // Category type
  price: Number,            // Base price (for reference)
  weights: [
    {
      size: "0.5kg",        // Weight option
      price: 300            // Price for this weight
    }
  ],
  type: "Egg|Eggless",      // Egg type
  image: "emoji"            // Display emoji
}
```

---

## 🔧 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Port already in use" | Another process running | Vite auto-selects next port |
| Images not showing | Wrong path | Check src/assets/ folder |
| Cart empty after refresh | Browser data cleared | Check LocalStorage enabled |
| WhatsApp not working | Wrong number format | Use 11 digits with +91 |
| Build fails | Missing dependencies | Run `npm install` |

---

## 📞 Support Commands

```bash
# Check npm version
npm --version

# Clear cache and reinstall
npm cache clean --force
rm -r node_modules
npm install

# Check for errors
npm run lint

# Build and test
npm run build
npm run preview
```

---

## 🎯 Success Criteria

Your website is ready when:
- ✅ Runs locally: `npm run dev`
- ✅ Builds successfully: `npm run build`
- ✅ All pages load correctly
- ✅ Cart works properly
- ✅ Address validation working
- ✅ Mobile looks good
- ✅ Phone numbers updated
- ✅ Cake menu reviewed

---

## 📚 File Overview

```
src/
├── App.jsx               (100+ lines) - Main routing
├── components/
│   ├── Header.jsx        (50 lines) - Navigation
│   ├── Home.jsx          (100 lines) - Hero page
│   ├── CakeListing.jsx   (80 lines) - Grid & filters
│   ├── CakeCard.jsx      (90 lines) - Individual cake
│   ├── Cart.jsx          (200 lines) - Cart & checkout
│   ├── OrderConfirmation.jsx (150 lines) - Order page
│   └── Contact.jsx       (150 lines) - Contact & FAQ
├── data/
│   └── cakes.js          (150 lines) - 12 cakes data
└── utils/
    └── helpers.js        (80 lines) - Utilities
```

**Total**: ~1300 lines of clean, readable code

---

## ⚡ Performance Tips

- ✓ Already optimized!
- ✓ Minified CSS & JS
- ✓ No heavy dependencies
- ✓ Images as emojis (fast)
- ✓ Lazy component loading possible

---

## 🌍 Internationalization (Future)

To add multiple languages later:
1. Create `src/i18n/en.json` (English)
2. Create `src/i18n/hi.json` (Hindi)
3. Use key-based translations
4. Add language selector in header

Not implemented now, but architecture supports it.

---

## 🎓 Learning Resources

- **Vite**: https://vitejs.dev
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Component Design**: https://react.dev/learn/your-first-component

---

## 🚀 Last Steps

1. **Read**: PROJECT_COMPLETE.md
2. **Setup**: SETUP_GUIDE.md
3. **Deploy**: DEPLOYMENT_GUIDE.md
4. **Run**: `npm run dev`
5. **Customize**: Update phone numbers, menu
6. **Test**: Browse, add to cart, checkout
7. **Deploy**: `npm run build` → upload to hosting
8. **Share**: Send link to customers!

---

## ✨ You're Ready!

Your website is complete, tested, and ready to use. Everything is set up for success. Good luck with your bakery! 🍰

---

*For detailed information, see the other documentation files.*
