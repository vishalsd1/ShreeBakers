# 🍰 Shree Bakers & Cake Shop - Online Ordering Website

A modern, responsive bakery website built with **Vite + React + Tailwind CSS** for ordering delicious cakes online in Phulambri.

## ✨ Features

### 🏠 Home Page
- Beautiful hero section with bakery branding
- Clear call-to-action button for ordering
- "Delivery only in Phulambri" badge
- Why choose us section
- Responsive design on all devices

### 🍰 Order Online (Cake Listing)
- Responsive grid layout with cake cards
- Each cake displays:
  - Product image/emoji
  - Name and description
  - Price with weight options (0.5kg, 1kg, 2kg)
  - Egg/Eggless labels
- **Category filters**: All, Birthday, Anniversary, Wedding, Custom
- Interactive quantity selector
- Add to cart with real-time feedback

### 🛒 Cart & Checkout
- View all items in cart with weight and quantity
- Modify quantities or remove items
- **Phulambri address validation** - prevents orders outside service area
- Customer form with:
  - Name
  - 10-digit mobile number validation
  - Address (validated for Phulambri)
  - Delivery date (next day onwards)
  - Delivery time slots
  - Custom message on cake
- **Total price calculation**
- Clear error messages for invalid inputs

### ✅ Order Confirmation
- Order summary with all details
- Customer information display
- Items ordered with prices
- **WhatsApp integration** - pre-filled message button
- Next steps for customer
- Quick contact options (call/WhatsApp)
- Option to place more orders

### 📞 Contact Page
- Phone number for direct calls
- WhatsApp button for quick chat
- Business hours and location
- Delivery information
- Comprehensive FAQ section

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS (Utility-first approach)
- **State Management**: React hooks (useState, useEffect)
- **Storage**: LocalStorage for cart persistence
- **No Authentication**: Simple, fast, no login required
- **No Payment Gateway**: Cash on Delivery model

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx              # Navigation header with cart badge
│   ├── Home.jsx                # Hero page with CTA
│   ├── CakeListing.jsx         # Grid of cakes with filters
│   ├── CakeCard.jsx            # Individual cake card component
│   ├── Cart.jsx                # Cart view & checkout form
│   ├── OrderConfirmation.jsx   # Order summary & WhatsApp button
│   └── Contact.jsx             # Contact info & FAQ
├── data/
│   └── cakes.js                # Mock cake data
├── utils/
│   └── helpers.js              # Utility functions
├── App.jsx                     # Main app component with routing
├── App.css                     # Custom styles
├── index.css                   # Global styles with Tailwind
└── main.jsx                    # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd "Shree Bakers and cake shop"

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port)

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## 🎨 Color Scheme

The website uses warm, bakery-themed colors:
- **Peach** (#F4A084) - Primary accent
- **Coral** (#FF6B6B) - Highlights & CTAs
- **Chocolate** (#8B4513) - Text & headings
- **Cream** (#FFF8F3) - Background
- **Gold** (#D4AF37) - Special accents

## 💡 Key Features Explained

### Phulambri Address Validation
The system validates that addresses contain "Phulambri" to ensure orders are only placed within the service area:

```javascript
isPhulambriAddress("123 Main Street, Phulambri") // ✓ Valid
isPhulambriAddress("Pune")                       // ✗ Invalid
```

### WhatsApp Integration
Orders automatically generate a pre-filled WhatsApp message containing:
- Customer name & contact
- Delivery address & time
- Items ordered with prices
- Total amount
- Custom cake message

Click the WhatsApp button to send to the bakery number.

### Cart Persistence
Cart data is saved to browser's LocalStorage, so items persist even after page refresh.

### Responsive Design
- Mobile-first approach
- Works on phones, tablets, and desktops
- Touch-friendly buttons and inputs
- Optimized images and emojis for fast loading

## 📊 Mock Data

The project includes 12 sample cakes across 4 categories:
- **Birthday**: Chocolate Delight, Vanilla Dream, Strawberry Bliss, etc.
- **Anniversary**: Red Velvet Romance, Anniversary Special
- **Wedding**: Royal Wedding Cake
- **Custom**: Custom Design Cake, Cheesecake

Each cake has:
- Multiple weight options with different prices
- Egg or Eggless option
- Description and emoji representation

## 🔧 Customization

### Update Bakery Info
Edit phone number in `Contact.jsx` and `OrderConfirmation.jsx`:
```javascript
const phoneNumber = "919876543210"; // Update this
```

### Add More Cakes
Edit `src/data/cakes.js` and add items to the `cakesData` array:
```javascript
{
  id: 13,
  name: "Your Cake Name",
  description: "Description",
  category: "Birthday",
  price: 300,
  weights: [
    { size: "0.5kg", price: 300 },
    { size: "1kg", price: 500 }
  ],
  type: "Egg",
  image: "🎂"
}
```

### Change Delivery Slots
Edit `getDeliverySlots()` in `src/utils/helpers.js`:
```javascript
export const getDeliverySlots = () => {
  return [
    "9:00 AM - 11:00 AM",
    "12:00 PM - 2:00 PM",
    // Add more slots...
  ];
};
```

### Modify Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  cream: '#FFF8F3',
  peach: '#F4A084',
  coral: '#FF6B6B',
  // Customize colors...
}
```

## 📱 Performance

- **Bundle Size**: ~226 KB (68 KB gzipped)
- **Load Time**: < 2 seconds on average connection
- **Mobile Optimized**: Fast on 3G/4G
- **No external APIs**: Works without internet dependencies (except WhatsApp links)

## 🚀 Future Enhancements

While not implemented, the project is designed to scale:
- ✅ Migrate to Next.js for server-side rendering
- ✅ Add real payment gateway (Razorpay, Stripe)
- ✅ Implement admin dashboard for orders
- ✅ Add customer authentication & order history
- ✅ Real-time order tracking
- ✅ Email confirmations
- ✅ Seasonal specials & promotions
- ✅ Customer reviews and ratings

## 📋 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⚖️ License

This project is created for Shree Bakers & Cake Shop, Phulambri.

## 📞 Support

For issues or questions about the website:
- **Phone**: +91 9876543210 *(Update with real number)*
- **WhatsApp**: +91 9876543210 *(Update with real number)*
- **Hours**: Mon-Fri (8 AM - 8 PM), Sat (8 AM - 9 PM), Sun (9 AM - 8 PM)

---

**Built with ❤️ for Shree Bakers & Cake Shop**
