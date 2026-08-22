const admin = require("../firebaseAdmin");

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await admin.auth().createUser({
            displayName: name,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            uid: user.uid,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};