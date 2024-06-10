const Joi = require("joi");
const { db } = require("../firebase_config");
const { collection, addDoc } = require('firebase/firestore');

const createParkSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    profile_pic: Joi.string(),
});

exports.createPark = async (req, res) => {
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

exports.deletePark = async (req, res) => {
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

exports.getPark = async (req, res) => {
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

const updateSpotStatusSchema = Joi.object({
    spot: Joi.string().required(),
    status: Joi.boolean().required()
});

exports.updateSpotStatus = async (req, res) => {
    try {
        //Validate the request params
        const { paramError } = Joi.string().validate(req.params.idU);

        // validate the request body using Joi
        const { error } = updateSpotStatusSchema.validate(req.body);

        if (error || paramError) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const data = req.body;

        // find user by ID in the database
        const parkRef = db.collection('parks').doc(req.params.idU);
        const park = await parkRef.get();

        if (!park.exists) {
            return res.status(404).json({ message: "Park not found" });
        }

        const spots = (await parkRef.listCollections())[0];

        const spotToUpdateRef = spots.doc(data.spot);
        const spotToUpdate = await spotToUpdateRef.get();

        if (!spotToUpdate.exists) {
            return res.status(404).json({ message: "Spot not found" });
        }

        const updatedSpot = await spotToUpdateRef.update({
            "occupied": data.status
        });


        res.status(200).json({ message: "Spot status updated!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


