const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb://localhost:27017/simpleTodoDB");

const itemsSchema = new mongoose.Schema({
	name: String
});

const Item = mongoose.model("item", itemsSchema);

const today = new Date();
const todos = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

const item1 = new Item({
	name: "Eat"
});

const item2 = new Item({
	name: "Code"
});

const item3 = new Item({
	name: "Repeat"
});

Item.insertMany([item1, item2, item3], (err) => {
	if(err) 
		console.log(err);
	else
		console.log("Successfully saved items.");
});

app.get("/", (req, res) => {
	
	let salutationText = null, emoji = null;
	let hours = today.getHours();
	let day = null;

	switch (today.getDay()) {
		case 0: day = "Sunday";
			break;
		case 1: day = "Monday";
			break;
		case 2: day = "Tuesday";
			break;
		case 3: day = "Wednesday";
			break;
		case 4: day = "Thursday";
			break;
		case 5: day = "Friday";
			break;
		default: day = "Saturday";
	}

	if(hours >= 4 && hours <= 11) {
		salutationText = "Good Morning";
		emoji = "🌄";
	} else if(hours >= 12 && hours <= 17) {
		salutationText = "Good Afternoon";
		emoji = "☀️";
	} else if(hours >= 18 && hours <= 23) {
		salutationText = "Good Evening";
		emoji = "🌙";
	} else {
		salutationText="Have enough Sleep!";
		emoji = "✨";
	}

	res.render("home", {
		date: today.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
		day: day,
		emoji: emoji,
		salutation: salutationText,
		todoItems: todos
	});
});

app.post("/", (req, res) => {
	todos.push(req.body.newToDo);
	res.redirect("/");
});

app.listen(3000, () => {
	console.log("Server started at port 3000");
});