const express = require("express");

const router = express.Router();

const park = require("../controllers/park");

const parkAPI = "/park";

router.put(parkAPI + "/:idU", park.updateSpotStatus);

router.get(parkAPI, park.getAll);

router.get(parkAPI + "/available_spots/:parkId", park.availableSpots)

router.get(parkAPI + "/book_spot/:parkId/users/:userId", park.bookSpot)



module.exports = router;