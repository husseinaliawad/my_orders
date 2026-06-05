import { Router } from "express";
import { addReview, createItem, deleteItem, getItem, getItems, updateItem } from "../controllers/itemController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

export const itemRoutes = Router();
itemRoutes.get("/", getItems);
itemRoutes.get("/my/items", protect, (req, res) => {
  req.query.mine = "true";
  return getItems(req as any, res);
});
itemRoutes.get("/:id", getItem);
itemRoutes.post("/:id/reviews", protect, addReview);
itemRoutes.post("/", protect, upload.array("images", 5), createItem);
itemRoutes.put("/:id", protect, upload.array("images", 5), updateItem);
itemRoutes.delete("/:id", protect, deleteItem);
