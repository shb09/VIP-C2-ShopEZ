export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const truncate = (str, len = 100) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};

export const getOrderStatusColor = (status) => {
  const colors = {
    Processing: 'badge-processing',
    Packed: 'badge-packed',
    Shipped: 'badge-shipped',
    'Out for Delivery': 'badge-outfordelivery',
    Delivered: 'badge-delivered',
    Cancelled: 'badge-cancelled',
    Returned: 'badge-returned',
  };
  return colors[status] || 'badge-customer';
};
