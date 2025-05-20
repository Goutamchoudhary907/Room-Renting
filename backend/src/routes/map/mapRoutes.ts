import { Router } from "express";
import mapController from "../../controller/mapController.js"

const router=Router();

router.get("/autocomplete", mapController.autoComplete)

router.post("/directions", mapController.getDirections);

router.get("/places/:placeId" , mapController.getPlaceDetails);

router.get('/geocode', mapController.geocode);
export default router;
