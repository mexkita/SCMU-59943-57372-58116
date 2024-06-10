const admin = require('firebase-admin');

async function checkAuth(req, res, next) {

    const { authorization } = req.headers;

    //console.log("Authorization ", authorization)

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized');
    }

    const idToken = authorization.split('Bearer ')[1];

    try {

        const decodedToken = await admin.auth().verifyIdToken(idToken);

        req.user = decodedToken;

        next();

    } catch (error) {

        console.error(error);
        return res.status(401).send('Unauthorized');

    }
}

module.exports = checkAuth;
