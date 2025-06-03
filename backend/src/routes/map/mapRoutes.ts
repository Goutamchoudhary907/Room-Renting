import { Router } from "express";
import mapController from "../../controller/mapController.js"
import addressController from "../../controller/addressController.js";

const router=Router();

router.get("/autocomplete", mapController.autoComplete)

router.post("/directions", mapController.getDirections);

router.get("/places/:placeId" , mapController.getPlaceDetails);

router.get('/geocode', mapController.geocode);

router.get('/address-components', addressController.getAddressComponents);
router.post('/validate-address', addressController.validateAddress);

export default router;
