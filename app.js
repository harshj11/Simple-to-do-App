const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb://localhost:27017/simpleTodoDB");

const todosSchema = new mongoose.Schema({
	name: String,
	date: Date,
	isChecked: {
		type: Boolean,
		default: false
	}
});

const Todo = mongoose.model("todo", todosSchema);

let currentDay = new Date();
let dateOnly = currentDay.toISOString().slice(0, 10);
let todos = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	
	let salutationText = null, emoji = null;
	let hours = new Date().getHours();
	let day = null;

	switch (currentDay.getDay()) {
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
		date: currentDay.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
		datePickerDefault: dateOnly,
		day: day,
		emoji: emoji,
		salutation: salutationText,
		todoItems: todos
	});
});

app.post("/", (req, res) => {
	let newTodo = new Todo({name: req.body.newToDo, date: dateOnly});
	newTodo.save().then(promise => todos.push(promise));	
	res.redirect("/");
});

app.post("/mark-unmark", (req, res) => {
	let index = req.body.checkbox;
	// console.log(req.body);
	
	Todo.updateOne(
		{name: todos[index].name}, 
		{isChecked: !todos[index].isChecked}
	, (err) => {
		if(err) {
			console.log(err);
		}
	});
	
	todos[index].isChecked = !todos[index].isChecked;

	res.redirect("/");
});

app.post("/delete-to-do", (req, res) => {
	let todoIdToDelete = req.body.deleteTodo;
	
	Todo.deleteOne({_id: todoIdToDelete}, (err) => {
		if(err) {
			console.log(err);
		}
	});

	todos = todos.filter(todo => todo._id != todoIdToDelete);
	
	res.redirect("/");
});

app.post("/change-date", (req, res) => {
	dateOnly = req.body.dateToQuery;
	currentDay = new Date(dateOnly);
	//console.log(currentDay.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
	Todo.find({date: req.body.dateToQuery}, (err, foundTodos) => {
		if(err) {
			console.log(err);
		} else {
			todos = foundTodos;
		}
	});
	res.redirect("/");
});

app.listen(3000, () => {
	Todo.find({date: dateOnly}, (err, foundTodos) => {
		if(err) {
			console.log(err);
		} else {
			todos = foundTodos;
		}
	}) 
	console.log("Server started at port 3000");
});