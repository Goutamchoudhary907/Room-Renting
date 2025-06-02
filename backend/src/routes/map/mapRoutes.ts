import { Router } from "express";
import mapController from "../../controller/mapController"
import addressController from "../../controller/addressController";

const router=Router();

router.get("/autocomplete", mapController.autoComplete)

router.post("/directions", mapController.getDirections);

router.get("/places/:placeId" , mapController.getPlaceDetails);

router.get('/geocode', mapController.geocode);

router.get('/address-components', addressController.getAddressComponents);
router.post('/validate-address', addressController.validateAddress);

export default router;
