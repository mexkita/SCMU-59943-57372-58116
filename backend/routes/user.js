const express = require("express");

const router = express.Router();

const user = require("../controllers/user");

const userAPI = "/users";

router.post(userAPI, user.createUser);

router.delete(userAPI + "/:idU", user.deleteUser);

router.get(userAPI + "/:idU", user.getUser);

router.get(userAPI, user.getAll);

router.put(userAPI + "/:idU", user.updateUser);

router.get(userAPI + "/reservation/:userId", user.getUserReservation);




module.exports = router;