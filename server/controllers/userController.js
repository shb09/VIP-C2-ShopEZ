import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const search = req.query.search || '';
  const filter = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
    : {};

  const [users, total] = await Promise.all([
    User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  res.json({ users, page, pages: Math.ceil(total / limit), total });
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').lean();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};

export const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.role = req.body.role || user.role;
  const updated = await user.save();
  res.json(updated);
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ message: 'User removed' });
};

export const getAnalytics = async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, revenueResult] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const recentOrders = await Order.find()
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    ordersByStatus,
    recentOrders,
  });
};
