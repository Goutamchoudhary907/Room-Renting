import express, { Request, Response } from "express";
import { authMiddleware } from "../../middleware/middleware";
import { createProperty, upload } from "../../controller/propertyController";
const router = express.Router();

router.post("/create", authMiddleware,upload.array('images', 10), createProperty)
export default router;