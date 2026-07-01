import mongoose from "mongoose";
import { productDB } from "../config/products_DB.js";

const ProductSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true,"Product name is required"],
            trim: true,
            maxLength: [100, "Name can't exceed 100 characters"]
        },
        slug:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        category: {
            type: String,
            required: [true, "Category required"],
            trim: true
        },
        subCategory: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxLength: [1000, "Description shouldn't exceed 1000 characters"],
            minLength: [50, 'Description should have atlest 50 characters']
        },
        brand: {
            type: String,
            required: [true, "We only store branded items, LOL!"],
            trim: true
        },
        sku: {          // Stock Keeping Unit
            type: String,
            unique: true,
            sparse: true
        },
        price: {
            type: Number,
            required: [true, "item without price, Seriously!!"],
            max: [999999, "Bro more value than this, must be billioniar"],
            min: 0
        },
        discountPrice: {
            type: Number,
            min: 0
        },
        stock: {
            type: Number,
            required: [true, "no stock, really?"],
            max: [9999,"we aren't amazon"],
            min: 0
        },
        images: [
            {
                type: [String],
                default: []
            }
        ],
        attributes: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        tags: [
            {
                type: [String],
                default: []
            }
        ],
        status: {
            type: String,
            enum: ["active", "inactive","draft"],
            default: 'draft'
        },
        expireAt: {
            type: Date,
            default: null,
            index: {expires: 0}
        },
        createdBy:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)
const PRODUCT = productDB.model('product',ProductSchema)
export default PRODUCT;