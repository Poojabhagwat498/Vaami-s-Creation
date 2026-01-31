import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  stock: { type: Number, default: 0 },
sold: { type: Number, default: 0 },
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
