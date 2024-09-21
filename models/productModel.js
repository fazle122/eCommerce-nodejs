import mongoose from "mongoose";
import slugify from "slugify";

const reviewSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,'user is required'],
    },
    name:{
        type:String,
        required:[true,'user name is required'],
    },
    rating:{
        type:Number,
        required:[true,'rating is required'],
    },
    comment:{
        type:String,
        required:[true,'comment is required'],
    }
},{timestamps:true})


const productSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,'user is required'],
    },
    name:{
        type:String,
        required:[true,'product name is required'],
    },
    slug: {
        type:String,
        // unique:true,
        // required:true
    },
    images:[
        {
            id:String,
            url:String
        }
    ],
    brand:{
        type:String,
        required:[true,'brand name is required'],
    },
    category:{
        type:String,
        required:[true,'category is required'],
    },

    //=================//
    // category:{
    //     type:String,
    //     required:[true,'category is required'],
    //     enum:{
    //         values:["Electronics","Mobile","Book","Grocery","Others"],
    //         message:"Please select correct category"
    //     }
    // },
    description:{
        type:String,
        required:[true,'description is required'],
    },
    reviews:[reviewSchema],
    rating:{
        type:Number,
        required:true,
        default:0
    },
    numReviews:{
        type:Number,
        required:true,
        default:0
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    countInStock:{
        type:Number,
        required:true,
        default:0
    },

},{timestamps:true})


productSchema.pre("save",function(next) {
    console.log('slug created')
    this.slug = slugify(this.name,{replacement:'_', lower: true, strict: true, trim: true });
    next();
});



const Product = mongoose.model("Product",productSchema)
export default Product;