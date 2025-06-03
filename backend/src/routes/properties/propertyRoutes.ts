import express, { Request, Response } from "express";
import { authMiddleware } from "../../middleware/middleware.js";
import { createProperty, getAllProperties, getFilteredProperties,getUserProperties,deleteProperty ,upload, updateProperty, getPropertyById } from "../../controller/propertyController.js";
const router = express.Router();

router.post("/create",authMiddleware,upload.array('images', 10), createProperty)
router.get("/all", getAllProperties);
router.get("/search", getFilteredProperties);
router.get("/my/properties", authMiddleware,getUserProperties)
router.delete("/delete/:id",authMiddleware,deleteProperty);
router.put("/edit/:id", authMiddleware,upload.array('images', 10),updateProperty);
router.get("/:id", getPropertyById);
export default router;