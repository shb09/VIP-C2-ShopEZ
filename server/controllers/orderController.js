import Order from '../models/Order.js';
import Product from '../models/Product.js';

const VALID_STATUSES = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];

const STATUS_TRANSITIONS = {
  'Processing': ['Packed', 'Cancelled'],
  'Packed': ['Shipped', 'Cancelled'],
  'Shipped': ['Out for Delivery', 'Cancelled'],
  'Out for Delivery': ['Delivered', 'Cancelled'],
  'Delivered': ['Returned'],
  'Cancelled': [],
  'Returned': [],
};

export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = {};
  products.forEach((p) => { productMap[p._id.toString()] = p; });

  for (const item of items) {
    const product = productMap[item.product];
    if (!product) {
      return res.status(400).json({ message: `Product ${item.product} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }
  }

  const deducted = [];
  try {
    for (const item of items) {
      const result = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!result) {
        throw new Error(`Insufficient stock for product ${item.product}`);
      }
      deducted.push(item.product);
    }
  } catch (err) {
    for (const productId of deducted) {
      const item = items.find((i) => i.product === productId);
      if (item) {
        await Product.findByIdAndUpdate(productId, { $inc: { stock: item.quantity } });
      }
    }
    return res.status(400).json({ message: err.message || 'Insufficient stock' });
  }

  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 49;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    statusHistory: [{ status: 'Processing', timestamp: new Date() }],
  });

  res.status(201).json(order);
};

export const getUserOrders = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ user: req.user._id }),
  ]);

  res.json({ orders, page, pages: Math.ceil(total / limit), total });
};

export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').lean();
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json(order);
};

export const getOrders = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status && VALID_STATUSES.includes(req.query.status)) {
    filter.status = req.query.status;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  res.json({ orders, page, pages: Math.ceil(total / limit), total });
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Allowed: ${VALID_STATUSES.join(', ')}`,
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const allowedNext = STATUS_TRANSITIONS[order.status];
  if (!allowedNext || !allowedNext.includes(status)) {
    return res.status(400).json({
      message: `Cannot transition from '${order.status}' to '${status}'. Allowed: ${(allowedNext || ['none']).join(', ')}`,
    });
  }

  order.statusHistory.push({ status, timestamp: new Date() });
  order.status = status;
  const updated = await order.save();

  res.json(updated);
};
