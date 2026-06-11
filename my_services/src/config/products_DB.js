import mongoose from "mongoose";

export const productDB = mongoose.createConnection(
  process.env.MONGO_URI_PRODUCT + "products"
);
productDB.on("error", (err) => {
  console.error("Product DB Error:", err.message);
});
productDB.on("connected", () => {
  console.log("Product DB Connected");
});