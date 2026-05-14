const express=require("express");
const router=express.Router();
const {
     addProduct,
     getAllProducts,
     getSingleProduct,
     updateProduct,
     deleteProduct,
}=require("../controllers/productController");
router.post("/add",addProduct);
router.get("/",getAllProducts);
router.get("/:id",getSingleProduct);
router.put("/:id",updateProduct);
router.delete("/:id",deleteProduct);
module.exports=router;