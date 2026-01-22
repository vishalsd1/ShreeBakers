# 🚀 Deployment Guide - Shree Bakers Website

## Quick Deployment Options

### Option 1: Netlify (EASIEST - Recommended ⭐)

#### Step 1: Build the Project
```bash
npm run build
```
This creates a `dist` folder with the production-ready website.

#### Step 2: Deploy to Netlify
1. Go to https://www.netlify.com (Sign up is free with GitHub)
2. Click "Add new project" → "Deploy manually"
3. Drag and drop the `dist` folder
4. Your site is LIVE! 🎉

**Your website URL will be something like**: `https://your-site-name.netlify.app`

---

### Option 2: Vercel (Very Easy)

#### Step 1: Push to GitHub
1. Create GitHub account (if needed): https://github.com
2. Create a new repository named `shree-bakers`
3. Push your project files

#### Step 2: Deploy with Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Click "Deploy"

**Your site deploys automatically on every code change!**

---

### Option 3: Your Own Web Host (GoDaddy, Bluehost, etc.)

#### Step 1: Build the Project
```bash
npm run build
```

#### Step 2: Get FTP Credentials
- Login to your hosting control panel
- Get FTP username, password, and host

#### Step 3: Upload `dist` Folder
- Use FileZilla or similar FTP client
- Connect using your credentials
- Upload entire `dist` folder contents to `public_html` or `www` folder

#### Step 4: Configure
- Point your domain to the hosting provider
- Website is live!

---

### Option 4: GitHub Pages (Free)

1. Create a GitHub repository
2. Push the project
3. Go to Settings → Pages
4. Select `dist` folder as source
5. Your site is live at `https://yourname.github.io`

---

## Pre-Deployment Checklist

Before deploying, make sure you've updated:

### ✅ Contact Information
File: `src/components/Contact.jsx`
- [ ] Phone number: `919876543210` → Your number
- [ ] Business hours accurate?
- [ ] Shop address correct?

File: `src/components/OrderConfirmation.jsx`
- [ ] Phone number for WhatsApp
- [ ] Business hours

### ✅ Cake Menu
File: `src/data/cakes.js`
- [ ] Review all 12 cakes
- [ ] Update prices if needed
- [ ] Add/remove cakes as needed
- [ ] Correct weights and options

### ✅ Delivery Settings
File: `src/utils/helpers.js`
- [ ] Delivery time slots correct?
- [ ] Minimum delivery date (1 day is default)

### ✅ Branding
File: `tailwind.config.js`
- [ ] Colors look good?
- [ ] Match your bakery theme?

### ✅ Testing
- [ ] Open website on desktop
- [ ] Open website on mobile
- [ ] Test all buttons and navigation
- [ ] Try adding cakes to cart
- [ ] Try checkout (don't submit if testing)
- [ ] Test category filters
- [ ] Try contact page

---

## After Deployment

### ✅ Verify Everything Works
1. Click all buttons
2. Test on mobile
3. Try full checkout flow
4. Test WhatsApp button

### ✅ Share Your Website
- Create WhatsApp status with link
- Share on Facebook/Instagram
- Tell customers about it
- Add to Google Business profile

### ✅ Monitor Orders
- WhatsApp will receive orders
- Respond to customer inquiries
- Keep contact phone charged

---

## Updating After Deployment

### To Make Changes:

**For Netlify:**
1. Edit files on your computer
2. Run: `npm run build`
3. Upload new `dist` folder to Netlify
4. Changes appear in 2-3 minutes

**For GitHub Pages/Vercel:**
1. Edit files
2. `git add .`
3. `git commit -m "Update menu"`
4. `git push`
5. Auto-deploys! ✅

**For FTP Hosting:**
1. Run: `npm run build`
2. Upload new `dist` folder via FTP
3. Changes appear instantly

---

## Domain Setup (Optional)

Once you have a hosting/deployment platform, you can add a custom domain:

### For Netlify:
- Site settings → Domain → Add domain
- Follow instructions

### For Your Own Host:
- Buy domain (GoDaddy, Namecheap, etc.)
- Point DNS to your host
- Host sets it up

---

## Troubleshooting

### Build fails with errors?
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run build
```

### Images not showing?
- Make sure all images are in `src/assets/`
- Update image paths in components

### WhatsApp button not working?
- Check phone number includes country code
- Format: `919876543210` (not: 9876543210)

### Website slow on mobile?
- Already optimized! But you can:
  - Compress images more
  - Use smaller emoji instead of images
  - Reduce font sizes on mobile

---

## Popular Hosting Services (Prices approx)

| Service | Cost | Setup | Best For |
|---------|------|-------|----------|
| **Netlify** | FREE | 5 min | Small projects, fast |
| **Vercel** | FREE | 5 min | Next.js projects |
| **GitHub Pages** | FREE | 10 min | Static sites |
| **GoDaddy** | $3-8/mo | 20 min | Traditional hosting |
| **Bluehost** | $2.95/mo | 20 min | WordPress & static |
| **AWS Amplify** | $0.23/GB | 15 min | High traffic |

**Recommendation for you**: Start with **Netlify** (free, easy, reliable)

---

## Advanced: Custom Domain with Email

Once you have a domain:
1. Add domain to hosting
2. Setup email forwarding (usually free)
3. Customers can email: `orders@yourbakery.com`
4. Emails forward to your phone email

---

## Maintenance Checklist

**Monthly:**
- [ ] Review cake menu
- [ ] Update prices if changed
- [ ] Check for broken links
- [ ] Test on different devices

**Quarterly:**
- [ ] Add new cakes if available
- [ ] Update business hours if seasonal
- [ ] Review contact info
- [ ] Check analytics (if using)

**Annually:**
- [ ] Renew domain (if using custom domain)
- [ ] Update branding/colors
- [ ] Consider major improvements
- [ ] Backup website files

---

## Emergency: Website Goes Down

1. **Check your hosting status page**
2. **Restart server** (if you have hosting control panel)
3. **Contact hosting support**
4. **Put notice on WhatsApp/Facebook**

---

## Next Steps

1. ✅ Choose a deployment platform (Netlify recommended)
2. ✅ Build the project: `npm run build`
3. ✅ Deploy!
4. ✅ Share your website
5. ✅ Start receiving orders!

---

**Need Help?**
- Netlify docs: https://docs.netlify.com
- Vercel docs: https://vercel.com/docs
- React docs: https://react.dev
- Tailwind docs: https://tailwindcss.com

**Questions about the website?** Check SETUP_GUIDE.md or WEBSITE_README.md

---

**Your bakery website is ready to go live!** 🍰📱✨
