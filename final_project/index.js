const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: 'No token provided' })
        }

        const token = authHeader.split(" ")[1]

        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next();

    } catch (error) {
        console.error("Auth error:", error.message)
        return res.status(401).json({message: "Invalid or expired token"})
    }

});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
