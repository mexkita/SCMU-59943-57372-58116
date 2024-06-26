const express = require("express");
const authMiddleware = require("../middleware/authMW");

const router = express.Router();

const park = require("../controllers/park");

const parkAPI = "/park";

router.put(parkAPI + "/:idU", authMiddleware, park.updateSpotStatus);

router.get(parkAPI, authMiddleware, park.getAll);

router.get(parkAPI + "/available_spots/:parkId", park.availableSpots);

router.post(parkAPI + "/book_spot/:parkId/users/:userId", authMiddleware, park.bookSpot);

router.post(parkAPI + "/report/:parkId", authMiddleware, park.createReport);



module.exports = router;