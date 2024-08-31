import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import ApiFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandlers.js";
import productData from "../data/products.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";




/////// get local data ///////
// const getProducts = asyncHandler(async (req,res) =>{
//     console.log('fetching local products..')

//     const pageSize = 4
//     const page = Number(req.query.pageNumber || 1);
//     const keyword = req.query.keyword ? {name:{$regex:req.query.keyword,$options:'i'}} : {};
//     const count = productData.length;

//     const products = productData; 

//     res.json({products,page,pages:Math.ceil(count/pageSize)});
// })



const getProducts1 = asyncHandler(async (req,res) =>{
    console.log('fetching products..')

    const pageSize = 4;
    const page = Number(req.query.pageNumber || 1);
    const keyword = req.query.keyword ? {name:{$regex:req.query.keyword,$options:'i'}} : {};
    const count = await Product.countDocuments({...keyword});
    console.log(count);

    const products = await Product.find({...keyword})
                                    .limit(pageSize)
                                    .skip(pageSize * (page-1));
    res.json({products,page,pages:Math.ceil(count/pageSize)});
})




const getProducts = asyncHandler(async (req,res) =>{
    console.log('fetching products..')
    const pageSize = 4;
    const page = Number(req.query.pageNumber || 1);
    // const apiFIlters = new ApiFilters(Product,req.query).search().filter();
    const apiFIlters = new ApiFilters(Product, req.query).search().filter();


    let products = await apiFIlters.query;
    let count = products.length; 

    if(products){
      apiFIlters.pagination(pageSize);
      products = await apiFIlters.query.clone();

      res.json({ products,page,pages:Math.ceil(count/pageSize)});

    }else{
      new ErrorHandler('Products not found',404);
    }
})


const getProduct = asyncHandler(async (req,res) =>{
    const product = await Product.findById(req.params.id).populate('reviews.user');
    if(product){
        res.status(200).json(product);
    }else{
        // return next(new ErrorHandler('Product not found',404));
        new ErrorHandler('Product not found',404);
    }
})

const getTopProducts = asyncHandler(async (req,res) =>{
    console.log('fetching top products..')

    const products = await Product.find({}).sort({rating:-1}).limit(3);
    if(products){
        res.status(200).json(products);
    }else{
        res.status(404);
        throw new Error('product not found');

    }
})

const createProduct = asyncHandler(async(req,res) =>{
    console.log('creating products..')
    console.log(req.body);
    // const product = new Product({
    //     name:'test',
    //     price:10,
    //     user:req.user._id,
    //     image:'images/sample.jpg',
    //     category:'test cat',
    //     countInStock:10,
    //     numReviews:5,
    //     brand:'test brand',
    //     description:'test des'
    // })
    // const createProduct = await product.save();

    const createProduct = await Product.create(req.body);

    if(createProduct){
        res.status(201).json(createProduct);
    }else{
        res.status(404);
        throw new Error('not created');

    }
})

const uploadProductImages = asyncHandler(async (req, res) => {

  console.log('uploading product images..')
  console.log(req.body);
 
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  try{
    const uploader = async (image) => upload_file(image, "e-commerce/products");

    const urls = await Promise.all((req?.body?.images).map(uploader));
    console.log(urls);

    urls.map((imgUrl) => {
      product?.images?.push({id:imgUrl.public_id,url:imgUrl.url});
    })
    // product?.images?.push(...urls);
    await product?.save();

    res.status(200).json({
      product,
    });

  }catch(err){
    res.status(404);
    throw new Error(err);
  }
});


export const deleteProductImage = asyncHandler(async (req, res) => {

  console.log('delete product image..')

  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isDeleted = await delete_file(req.body.imgId);

  if (isDeleted) {
    product.images = product?.images?.filter(
      (img) => img.id !== req.body.imgId
    );

    await product?.save();
  }

  res.status(200).json({
    product,
  });
});

const updateProduct = asyncHandler(async(req,res) =>{
  console.log('updating products..')
  const {name,price,description,images,brand,category,countInStock} = req.body;
  const product = await Product.findById(req.params.id);


  if(product){
      if(product){
          product.name = name;
          product.price = price;
          product.description = description;
          product.images = images;
          product.brand = brand;
          product.category = category;
          product.countInStock = countInStock;
      }
      const updateProduct = await product.save();

      res.status(200).json(updateProduct);
  }else{
      res.status(404);
      throw new Error('not found');

  }
})


const deleteProduct = asyncHandler(async(req,res) =>{
    console.log('updating products..')
    const product = await Product.findById(req.params.id);
    if(product){
         await Product.deleteOne({_id:product._id});

         for(let i=0; i<product.images.length; i++){
          await delete_file(product.images[i].id);
         }

        res.status(200).json({message:'Product deleted'});
    }else{
        res.status(404);
        throw new Error('not found');

    }
})

const canUserReview = asyncHandler(async (req, res) => {
  console.log('checking can user review....')
  console.log(req.query.productId)
  const orders = await Order.find({
    user: req.user._id,
    "orderItems.product": req.query.productId,
  });

  if (orders.length === 0) {
    return res.status(200).json({ canReview: false });
  }

  res.status(200).json({canReview: true});
});


const createProductReview = asyncHandler(async (req, res) => {
    console.log('creating review....')
    const { rating, comment } = req.body;
  
    const product = await Product.findById(req.params.id);
  
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
  
      if (alreadyReviewed) {
        res.status(400);
        throw new Error('User already reviewed this product');
      }
  
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };  
  
      product.reviews.push(review);
  
      product.numReviews = product.reviews.length;
  
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
  
    //   await product.save();
      await product.save({validateBeforeSave:false});
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
});


const deleteProductReview = asyncHandler(async (req, res) => {
    console.log('deleting review....')
  
    let product = await Product.findById(req.params.id);
  
    if (product) {
      const reviews = product?.reviews?.filter(
        (review) => review._id.toString() !== req.query._id.toString()
      );

      const  numOfReviews = reviews.length;
  
      
      const ratings =
        numOfReviews === 0 ? 0 :
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

  
      product =  await Product.findByIdAndUpdate(req.query.id,{reviews,numOfReviews,ratings},{new:true});
      res.status(200).json({ message: 'Review deleted',product });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
});
  




export {getProducts,getProduct,getTopProducts,createProduct,uploadProductImages,updateProduct,deleteProduct,canUserReview,createProductReview,deleteProductReview}