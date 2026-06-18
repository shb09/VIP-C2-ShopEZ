import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Mobiles', 'Laptops', 'Electronics', 'Fashion', 'Accessories', 'Home', 'Sports'],
    },
    image: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1, createdAt: -1 });

export default mongoose.model('Product', productSchema);
