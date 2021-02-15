const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "postgres",
		password: "test",
		database: "smart-brain",
	},
});

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.json("It is working!");
});

//SIGNIN
app.post("/signin", (req, res) => {
	signin.handleSignin(req, res, bcrypt, db);
});

//REGISTER
app.post("/register", (req, res) => {
	register.handleRegister(req, res, bcrypt, db);
});

//RETRIEVING PROFILE
app.get("/profile/:id", (req, res) => {
	profile.handleProfileGet(req, res, db);
});

//UPDATING ENTRIES
app.put("/image", (req, res) => {
	image.handleImage(req, res, db);
});

//HANDLING API CALL
app.post("/imageurl", (req, res) => {
	image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is listening on port ${process.env.PORT}`);
});
