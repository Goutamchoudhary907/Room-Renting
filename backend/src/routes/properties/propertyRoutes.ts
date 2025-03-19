import express, { Request, Response } from "express";
import { authMiddleware } from "../../middleware/middleware.js";
import { createProperty, getAllProperties, getFilteredProperties, upload } from "../../controller/propertyController.js";
const router = express.Router();

router.post("/create",authMiddleware,upload.array('images', 10), createProperty)
router.get("/all",authMiddleware, getAllProperties);
router.get("/search",authMiddleware, getFilteredProperties);
export default router;