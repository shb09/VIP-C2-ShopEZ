const Product=require("../models/Product");
const addProduct=async(req,res)=>{
     try{
          const newProduct=new Product(req.body);
          await newProduct.save();
          res.status(201).json({
               message:"Product Added Successfully",
               product: newProduct,
          });
     }catch(error){
          res.status(500).json({
               message: error.message,
          });
     }
};
const getAllProducts=async (req,res)=>{
    try {
        const {
            category,
            search,
            sort,
        } = req.query;
        let query = {};
        if (category) {
            query.category = category;
        }
        if (search) {
            query.name = {
                $regex: search,
                $options: "i",
            };
        }
        let productsQuery = Product.find(query);
        if (sort === "low") {
            productsQuery = productsQuery.sort({ price: 1 });
        }
        if (sort === "high") {
            productsQuery = productsQuery.sort({ price: -1 });
        }
        const products = await productsQuery;
        res.status(200).json({
    products,
});
    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};
const getSingleProduct=async(req,res)=>{
     try{
          const product=await Product.findById(req.params.id);
          if(!product){
               return res.status(404).json({
                    message: "Product not found",
               });
          }
          res.status(200).json(product);
     }catch(error){
          res.status(500).json({
               message: error.message,
          });
     }
};
const updateProduct = async (req, res) => {

    try {

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};
const deleteProduct = async (req, res) => {

    try {

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};
module.exports={
     addProduct,
     getAllProducts,
     getSingleProduct,
     updateProduct,
     deleteProduct,
};