import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  if (req.query.priceMin || req.query.priceMax) {
    filter.price = {};
    if (req.query.priceMin) filter.price.$gte = Number(req.query.priceMin);
    if (req.query.priceMax) filter.price.$lte = Number(req.query.priceMax);
  }

  let sort = {};
  if (req.query.sort === 'price_asc') sort = { price: 1 };
  else if (req.query.sort === 'price_desc') sort = { price: -1 };
  else if (req.query.sort === 'newest') sort = { createdAt: -1 };
  else sort = { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
};

const PLACEHOLDER = '/uploads/products/placeholder.svg';

export const createProduct = async (req, res) => {
  const data = { ...req.body };
  if (!data.image || data.image.startsWith('data:')) {
    data.image = PLACEHOLDER;
  }
  const product = await Product.create(data);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const data = { ...req.body };
  if (data.image === '' || data.image?.startsWith('data:')) {
    data.image = PLACEHOLDER;
  }
  const product = await Product.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ message: 'Product removed' });
};

export const getCategories = async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
};

export const getFeaturedProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(8).lean();
  res.json(products);
};
