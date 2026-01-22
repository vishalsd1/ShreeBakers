// Validate if address is in Phulambri
export const isPhulambriAddress = (address) => {
  if (!address) return false;
  
  const phulambriKeywords = [
    'phulambri',
    'phulamri',
    'phulamburi',
  ];
  
  const addressLower = address.toLowerCase();
  return phulambriKeywords.some(keyword => addressLower.includes(keyword));
};

// Generate WhatsApp message
export const generateWhatsAppMessage = (order) => {
  const { cartItems, total, customerInfo } = order;
  
  let message = "🎂 *Shree Bakers Order Confirmation*\n\n";
  message += `*Customer:* ${customerInfo.name}\n`;
  message += `*Mobile:* ${customerInfo.phone}\n`;
  message += `*Delivery Address:* ${customerInfo.address}\n`;
  message += `*Delivery Date & Time:* ${customerInfo.deliveryDate} ${customerInfo.deliveryTime}\n\n`;
  
  message += "*Order Details:*\n";
  cartItems.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (${item.weight})\n`;
    message += `   Qty: ${item.quantity} | ₹${item.itemTotal}\n`;
  });
  
  if (customerInfo.customMessage) {
    message += `\n*Message on Cake:* ${customerInfo.customMessage}\n`;
  }
  
  message += `\n*Total Amount:* ₹${total}\n`;
  message += `*Payment Mode:* Cash on Delivery\n\n`;
  message += "Thank you for ordering from Shree Bakers! 🍰";
  
  return encodeURIComponent(message);
};

// Generate WhatsApp link
export const getWhatsAppLink = (message, phoneNumber = "917498585802") => {
  return `https://wa.me/${phoneNumber}?text=${message}`;
};

// Format currency
export const formatCurrency = (amount) => {
  return `₹${amount.toFixed(0)}`;
};

// Get delivery time slots
export const getDeliverySlots = () => {
  return [
    "9:00 AM - 11:00 AM (Morning)",
    "11:00 AM - 1:00 PM (Late Morning)",
    "2:00 PM - 4:00 PM (Afternoon)",
    "4:00 PM - 6:00 PM (Evening)",
    "6:00 PM - 8:00 PM (Late Evening)"
  ];
};

// Get minimum delivery date (next day)
export const getMinDeliveryDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};
