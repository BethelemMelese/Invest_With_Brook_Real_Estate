const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const admin = require("./routes/admin.router.js");
const user = require("./routes/user.router.js");
const speaker = require("./routes/speakers.router.js");
const heroSection = require("./routes/heroSection.router.js");

// configuration file
dotenv.config();

var corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

const allowedOrigins = [
  "https://InvestWithBrookRealEstate.netlify.app", // Add this if you still use Netlify preview
  "http://localhost:3000",
];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser());
// app.use(cors(corsOptions));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies & authentication headers
  })
);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello, Express.js with MongoDB!");
});

// Connection with Mongodb Database and run the server
let PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.mongoDbURL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}...`);
    });
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log("Connection failed!", error);
  });

// CSRF Protection
// const csrfProtection = csurf({ cookie: true });
// app.use(csrfProtection);

// routes
app.use("/api/admin", admin);
app.use("/api/users", user);
app.use("/api/speakers", speaker);
app.use("/api/heroSections", heroSection);
