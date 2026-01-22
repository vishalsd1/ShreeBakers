# 🚀 Quick Setup Guide - Shree Bakers Website

## For Bakery Owner

### Initial Setup (One Time)
1. **Install Node.js**: Download from https://nodejs.org/ (v18 or newer)
2. **Open Command Prompt** in the project folder
3. **Run**: `npm install` (this installs all dependencies)
4. **Done!** ✅

### Run the Website

#### Development (for testing/editing):
```bash
npm run dev
```
- Opens at http://localhost:5174
- Live reloads when you make changes
- Perfect for testing before going live

#### Build for Production:
```bash
npm run build
```
- Creates optimized version in `dist/` folder
- Use this when deploying to a hosting service

### Important: Update Your Information

Edit these files to add YOUR business details:

#### 1. **Contact Info** (in `src/components/Contact.jsx`):
```javascript
// Change these phone numbers to YOUR number
href="tel:919876543210"           // Your phone
href="https://wa.me/919876543210" // Your WhatsApp
```

#### 2. **Business Hours** (same file):
```javascript
<p><strong>Monday - Friday:</strong> 8:00 AM - 8:00 PM</p>
// Update hours according to your shop
```

#### 3. **Address** (same file):
```javascript
📍 Main Street, Phulambri
// Update to your actual shop location
```

#### 4. **Order Confirmation** (in `src/components/OrderConfirmation.jsx`):
```javascript
href="tel:919876543210"
// Should be the same as contact number
```

#### 5. **Order Confirmation WhatsApp Link** (in `src/components/OrderConfirmation.jsx`):
```javascript
href="https://wa.me/919876543210"
// Your WhatsApp number where orders come in
```

### Add/Edit Cakes

Edit `src/data/cakes.js`:

```javascript
{
  id: 1,
  name: "Your Cake Name",           // Display name
  description: "Add description here", // What makes it special
  category: "Birthday",              // Birthday, Anniversary, Wedding, Custom
  price: 300,                        // Base price
  weights: [
    { size: "0.5kg", price: 300 },   // Size and price
    { size: "1kg", price: 500 },
    { size: "2kg", price: 900 }
  ],
  type: "Egg",                       // Egg or Eggless
  image: "🍰"                        // Use emoji - 🍰🎂🧁🍓🥕 etc
}
```

### Change Delivery Time Slots

Edit `src/utils/helpers.js`:

```javascript
export const getDeliverySlots = () => {
  return [
    "9:00 AM - 11:00 AM",   // Change these times
    "11:00 AM - 1:00 PM",   // to your actual slots
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM"
  ];
};
```

### Minimum Delivery Date

By default, customers can order for next day onwards. To allow same-day orders, edit `src/utils/helpers.js`:

```javascript
export const getMinDeliveryDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);  // Change +1 to +0 for same-day
  return tomorrow.toISOString().split('T')[0];
};
```

## For Developers

### Project Structure
```
src/
├── components/     # All page/UI components
├── data/          # Mock cake data (cakes.js)
├── utils/         # Helper functions (helpers.js)
├── App.jsx        # Main routing logic
└── index.css      # Global styles
```

### Key Technologies
- **React** 19: Component framework
- **Vite**: Ultra-fast bundler
- **Tailwind CSS**: Utility-first styling

### Making Changes

1. **Edit components**: Save and auto-refresh (HMR)
2. **Add new cakes**: Edit `src/data/cakes.js`
3. **Change colors**: Edit `tailwind.config.js`
4. **Update text/content**: Edit respective `.jsx` files

### Deploy to Production

Options:
1. **Netlify** (Easiest): Drag & drop `dist/` folder
2. **Vercel**: Connect your GitHub repo
3. **Your own hosting**: Upload `dist/` folder via FTP
4. **GitHub Pages**: Follow Vite deployment guide

## Troubleshooting

### "Port 5173 is already in use"
- This is normal if the port is busy
- Vite will automatically use the next available port (5174, 5175, etc.)
- Check the terminal for the actual URL

### Cart data not persisting
- Make sure cookies/LocalStorage is enabled in browser
- Clear browser cache if having issues

### WhatsApp button not working
- Check your phone number is correct (11 digits with country code)
- Example: `919876543210` (include +91 country code)

### Want to test checkout without WhatsApp?
- The order confirmation page works without actually sending WhatsApp
- Button opens WhatsApp web if available
- Customers can also just call/visit shop

## Mobile Testing

### Test on your phone:
1. Go to Command Prompt while server is running
2. Find the "Network:" URL (usually like `http://192.168.x.x:5173`)
3. Open that URL on your mobile phone on same WiFi
4. Test all features

## Security Notes

✅ **What's Protected**:
- Address validation ensures only Phulambri orders
- No payment processing (Cash on Delivery)
- No personal data storage (except for that order)

⚠️ **What's NOT Protected** (Add later if needed):
- Email validation (optional)
- Password protection
- Admin dashboard
- Order history

## Need Help?

Check:
1. Terminal for error messages (red text)
2. Browser console (F12 → Console tab)
3. Make sure `npm install` was run successfully

---

**Website Ready to Use!** 🎉

Your bakery website is now fully functional and ready to receive orders. Customize it with your details and you're good to go!
