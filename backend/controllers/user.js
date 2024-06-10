const Joi = require("joi");
const { db } = require("../firebase_config");
const { collection, addDoc } = require('firebase/firestore');
const { FieldValue } = require("firebase-admin/firestore");

function millisToTime(millis) {
  const date = new Date(millis);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

const createUserSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  profile_pic: Joi.string(),
});

exports.createUser = async (req, res) => {
  try {
    const { error } = createUserSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const data = req.body;
    const userRef = await db.collection('users').add(data);

    res.status(201).json(userRef.id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error while creating user' });
  }
};


const deleteUserSchema = Joi.object({
  idU: Joi.string().required(),
});

exports.deleteUser = async (req, res) => {
  try {
    const { error } = deleteUserSchema.validate(req.params);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    /*  // Delete the user from Firebase Authentication
     await admin.auth().deleteUser(req.params.idU); */

    // delete user from the database
    const deletedUser = await User.findOneAndDelete({ idU: req.params.idU });

    if (deletedUser === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserSchema = Joi.object({
  idU: Joi.string().required(),
});

exports.getUser = async (req, res) => {
  try {
    // validate the user ID parameter using Joi
    const { error } = getUserSchema.validate(req.params);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // find user by ID in the database
    const user = await User.findOne({ idU: req.params.idU });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  photoUrl: Joi.string().required(),
  password: Joi.string().required(),
  petIds: Joi.array().items(Joi.string()),
});

exports.updateUser = async (req, res) => {
  try {
    //Validate the request params
    const { paramError } = Joi.string().validate(req.params.idU);

    // validate the request body using Joi
    const { error } = updateUserSchema.validate(req.body);

    if (error || paramError) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // find user by ID in the database
    const user = await User.findOne({ idU: req.params.idU });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { idU: req.params.idU },
      req.body,
      { new: true }
    );


    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserReservation = async (req, res) => {
  try {
    //Validate the request params
    const { paramError } = Joi.string().validate(req.params.userId);

    if (paramError) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.params.userId;
    const userRef = db.collection('users').doc(userId);
    const user = await userRef.get();

    if (!user.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.data().reservation == undefined) {
      return res.status(409).json({ message: "User does not have a reservation!" })
    }

    const reservation_data = user.data().reservation;

    const parkRef = db.collection('parks').doc(reservation_data.parkId);
    const park = await parkRef.get();

    let response = {
      start_date: reservation_data.start_date,
      end_date: reservation_data.end_date,
      parkId: reservation_data.parkId,
      title: park.data().title,
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.finishStay = async (req, res) => {
  try {
    //Validate the request params
    const { paramError } = Joi.string().validate(req.params.userId);

    if (paramError) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.params.userId;
    const userRef = db.collection('users').doc(userId);
    const user = await userRef.get();

    if (!user.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.data().current_stay == undefined) {
      return res.status(409).json({ message: "User does not have a stay!" })
    }

    const current_stay_data = user.data().current_stay;

    const parkRef = db.collection('parks').doc(current_stay_data.parkId);
    const park = await parkRef.get();

    const start_time = new Date(Date.parse(current_stay_data.start_date));

    console.log(start_time)

    const elapsedTime = Date.now() - start_time;

    console.log(elapsedTime)

    const formattedElapsed = millisToTime(elapsedTime);

    console.log(formattedElapsed);

    const total_value = (elapsedTime * 0.7) / 3600000;


    let response = {
      total_time: formattedElapsed,
      total_price: total_value.toFixed(2)
    }

    await userRef.update({
      current_stay: FieldValue.delete()
    });

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.startStay = async (req, res) => {
  try {
    //Validate the request params
    const { paramError } = Joi.string().validate(req.params);

    if (paramError) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.params.userId;
    const userRef = db.collection('users').doc(userId);
    const user = await userRef.get();

    if (!user.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.data().current_stay != undefined) {
      return res.status(409).json({ message: "User already has a stay!" })
    }

    const parkId = req.params.parkId;
    const parkRef = db.collection('parks').doc(parkId);
    const park = await parkRef.get();

    if (!park.exists) {
      return res.status(404).json({ message: "Park not found" });
    }

    const timestamp = new Date(Date.now())



    let response = {
      start_date: timestamp.toISOString(),
      parkId: park.id
    }

    await userRef.update({ current_stay: response });


    res.status(200).json({ message: "Stay started!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getElapsed = async (req, res) => {
  try {
    //Validate the request params
    const { paramError } = Joi.string().validate(req.params.userId);

    if (paramError) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.params.userId;
    const userRef = db.collection('users').doc(userId);
    const user = await userRef.get();

    if (!user.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.data().current_stay == undefined) {
      return res.status(409).json({ message: "User does not have a stay!" })
    }

    const current_stay_data = user.data().current_stay;

    const start_time = new Date(Date.parse(current_stay_data.start_date));

    const elapsedTime = Date.now() - start_time;

    const formattedElapsed = millisToTime(elapsedTime);

    let response = {
      elapsed: formattedElapsed
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
