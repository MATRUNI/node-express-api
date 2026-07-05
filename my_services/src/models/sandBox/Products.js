import mongoose from "mongoose";
import { sandboxDB } from "../../config/sandBoxProducts.js";
const sandboxProductSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      ref: "USER",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    price: {
      type: Number,
      default: 0
    },

    category: {
      type: String,
      default: "general",
      index: true
    },

    inStock: {
      type: Boolean,
      default: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      validate: {
        validator(value) {
          if(value === undefined) return true;
          try {
            return Buffer.byteLength(JSON.stringify(value), "utf8") <= 2048;
          } catch {
            return false;
          }
        },
        message: "Metadata cannot exceed 2KB."
      }
    },
    expiresAt: {
      type: Date,
      required: true,
      index: {expires: 0}
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);
sandboxProductSchema.index({ owner: 1, category: 1 });
const SandboxProduct = sandboxDB.model('sandbox_products',sandboxProductSchema)
export default SandboxProduct;