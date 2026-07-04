import mongoose from "mongoose";

export const sandboxDB = mongoose.createConnection(
  process.env.MONGO_URI_PRODUCT + "sandboxProducts"
);
sandboxDB.on("error", (err) => {
  console.error("Sandbox DB Error:", err.message);
});
sandboxDB.on("connected", () => {
  console.log("Sandbox DB Connected");
});