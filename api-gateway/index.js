const express = require("express");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer();
const app = express();

// Middleware to add CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Replace with your frontend's origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // If it's a preflight request (OPTIONS), respond with a 200 status
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Route requests to the auth service
app.use("/auth", (req, res) => {
  proxy.web(req, res, { target: "http://auth:3000" });
});

// Route requests to the product service
app.use("/products", (req, res) => {
  proxy.web(req, res, { target: "http://product:3001" });
});

// Route requests to the order service
app.use("/orders", (req, res) => {
  proxy.web(req, res, { target: "http://order:3002" });
});

// Error handling for proxy
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.status(500).send('Something went wrong. Please try again later.');
});

// Start the server
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
