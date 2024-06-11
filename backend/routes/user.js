const express = require("express");
const authMiddleware = require("../middleware/authMW");

const router = express.Router();

const user = require("../controllers/user");

const userAPI = "/users";

router.post(userAPI, user.createUser);

router.delete(userAPI + "/:idU", authMiddleware, user.deleteUser);

router.get(userAPI + "/:idU", authMiddleware, user.getUser);

router.get(userAPI, authMiddleware, user.getAll);

router.put(userAPI + "/:idU", authMiddleware, user.updateUser);

router.get(userAPI + "/reservation/:userId", authMiddleware, user.getUserReservation);

router.post(userAPI + "/finish_stay/:userId", authMiddleware, user.finishStay);

router.post(userAPI + "/start_stay/:userId/parks/:parkId", authMiddleware, user.startStay);

router.get(userAPI + "/elapsed/:userId", authMiddleware, user.getElapsed);


module.exports = router;