// middlewares/typeCheck.js
export function typeCheck(req, res, next) {
  const {
    name,
    slug,
    category,
    subCategory,
    description,
    brand,
    sku,
    price,
    discountPrice,
    stock,
    images,
    attributes,
    tags,
    status,
  } = req.body;

  // Required fields check
  if (!name || !category || !description || !brand || price === undefined || stock === undefined) {
    return res.status(400).json({
      error: "Required fields missing: name, category, description, brand, price, stock",
    });
  }

  // Type checks
  if (typeof name !== "string" || typeof category !== "string" || typeof description !== "string" || typeof brand !== "string") {
    return res.status(400).json({ error: "Name, category, description, and brand must be strings" });
  }

  if (subCategory && typeof subCategory !== "string") {
    return res.status(400).json({ error: "SubCategory must be a string" });
  }

  if (isNaN(Number(price)) || price < 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }

  if (discountPrice !== undefined && (isNaN(Number(discountPrice)) || discountPrice < 0)) {
    return res.status(400).json({ error: "DiscountPrice must be a positive number" });
  }

  if (isNaN(Number(stock)) || stock < 0) {
    return res.status(400).json({ error: "Stock must be a positive number" });
  }

  if (images && !Array.isArray(images)) {
    return res.status(400).json({ error: "Images must be an array of strings" });
  }

  if (tags && !Array.isArray(tags)) {
    return res.status(400).json({ error: "Tags must be an array of strings" });
  }

  if (attributes && typeof attributes !== "object") {
    return res.status(400).json({ error: "Attributes must be an object" });
  }

  if (status && !["active", "inactive", "draft"].includes(status)) {
    return res.status(400).json({ error: "Status must be 'active', 'inactive' or 'draft'" });
  }

  next();
}