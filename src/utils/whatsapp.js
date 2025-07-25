// utils/whatsapp.js

export function generateWhatsAppLink({ customerName, orderId, technicianName, time, phone = '60123456789' }) {
  const message = `Hi ${customerName}, job ${orderId} has been completed by Technician ${technicianName} at ${time}. Please check and leave feedback. Thank you!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
