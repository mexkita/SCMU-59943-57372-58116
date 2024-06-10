const express = require("express");

const router = express.Router();

const park = require("../controllers/park");

const parkAPI = "/park";

router.post(parkAPI, park.createPark);

router.delete(parkAPI + "/:idU", park.deletePark);

router.get(parkAPI + "/:idU", park.getPark);

router.get(parkAPI, park.getAll);

router.put(parkAPI + "/:idU", park.updateSpotStatus);

router.get(parkAPI + "/available_spots/:parkId", park.availableSpots)



module.exports = router;