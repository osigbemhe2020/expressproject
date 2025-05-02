const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

aapp.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization['token'];

    jwt.verify(token, "d8#y@GfP!fL^9zR2s3TqWuX7bNmLpA", (err, user) => {
      if (!err) {
        req.user = user; // Attach user info to request
        next(); // Proceed to route
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });

  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
