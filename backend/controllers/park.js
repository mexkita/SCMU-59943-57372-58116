const Joi = require("joi");
const { db } = require("../firebase_config");
const { v4: uuidv4 } = require('uuid');
const { FieldValue } = require("firebase-admin/firestore");

const updateSpotStatusSchema = Joi.object({
    spot_type: Joi.string().valid('normal', 'reserved').required(),
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

        let updatedSpot;

        if ("normal".match(data.spot_type)) {
            updatedSpot = await parkRef.update({
                "free_spots": data.status ? FieldValue.increment(-1) : FieldValue.increment(1)
            });
        } else {
            updatedSpot = await parkRef.update({
                "free_reserved_spots": data.status ? FieldValue.increment(-1) : FieldValue.increment(1)
            });
        }



        res.status(200).json({ message: "Spot status updated!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.availableSpots = async (req, res) => {
    try {
        //Validate the request params
        const { paramError } = Joi.string().validate(req.params.parkId);

        if (paramError) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const parkID = req.params.parkId;

        // find park by ID in the database
        const parkRef = db.collection('parks').doc(parkID);
        const park = await parkRef.get();

        if (!park.exists) {
            return res.status(404).json({ message: "Park not found" });
        }

        const normal_spots = park.data().free_spots;
        const reserved_spots = park.data().free_reserved_spots


        res.status(200).json({ normal_spots, reserved_spots });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const bookSpotSchema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
});

exports.bookSpot = async (req, res) => {
    try {
        //Validate the request params
        const { paramError } = Joi.string().validate(req.params);

        // validate the request body using Joi
        const { error } = bookSpotSchema.validate(req.body);


        if (error || paramError) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const data = req.body;

        // find user by ID in the database
        const parkRef = db.collection('parks').doc(req.params.parkId);
        const park = await parkRef.get();

        if (!park.exists) {
            return res.status(404).json({ message: "Park not found" });
        }

        const userRef = db.collection('users').doc(req.params.userId);
        const user = await userRef.get();

        if (!user.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.data().reservation != undefined) {
            return res.status(409).json({ message: "User already has a reservation!" })
        }

        if (park.data().free_reserved_spots < 1) {
            return res.status(409).json({ message: "No more spots to reserve!" });
        }

        let reservation_data = {
            start_date: data.startDate,
            end_date: data.endDate,
            parkId: req.params.parkId
        }

        console.log("Reservation Data: ", reservation_data)

        await userRef.update({ reservation: reservation_data });


        res.status(200).json({ message: "Spot booked!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAll = async (req, res) => {
    try {
        const parksRef = await db.collection('parks').listDocuments();

        let parksListAux = [];

        const promises = parksRef.map(docRef =>
            docRef.get().then(element => {
                let data = element.data();
                data.parkId = element.id;
                parksListAux.push(data);
            })
        );

        await Promise.all(promises);

        console.log(parksListAux)

        res.status(200).json(parksListAux);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const createReportSchema = Joi.object({
    message: Joi.string().required()
});

exports.createReport = async (req, res) => {
    try {
        //Validate the request params
        const { paramError } = Joi.string().validate(req.params.parkId);

        // validate the request body using Joi
        const { error } = createReportSchema.validate(req.body);


        if (error || paramError) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const data = req.body;

        // find user by ID in the database
        const parkRef = db.collection('parks').doc(req.params.parkId);
        const park = await parkRef.get();

        if (!park.exists) {
            return res.status(404).json({ message: "Park not found" });
        }

        const addReport = await parkRef.update({
            reports: FieldValue.arrayUnion({ reportId: uuidv4(), message: data.message })
        })

        console.log(addReport)

        res.status(200).json({ message: "Report created" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
