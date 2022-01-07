const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const day = require(__dirname + "/util/day");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

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

let selectedDate = new Date();
let dateOnly = selectedDate.toISOString().slice(0, 10);
let todos = [];

app.get("/", (req, res) => {
	const weekday = day.getDay(selectedDate.getDay());
	const salutationText = day.getSalutation();

	res.render("home", {
		longDate: selectedDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
		datePickerDate: dateOnly,
		weekday: weekday,
		emoji: salutationText.emoji,
		salutation: salutationText.salutation,
		todoItems: todos
	});
});

app.post("/", (req, res) => {
	let newTodoItem = new Todo({name: req.body.newToDo, date: dateOnly});
	newTodoItem.save().then(promise => {
		todos.push(promise);
		res.redirect("/");
	});	
});

app.post("/mark-unmark", (req, res) => {
	let index = req.body.checkbox;
	// console.log(req.body);
	Todo.updateOne({name: todos[index].name}, {isChecked: !todos[index].isChecked}, (err) => {
		if(err) {
			console.log(err);
		}
	});
	
	todos[index].isChecked = !todos[index].isChecked;
	res.redirect("/");
});

app.post("/delete-todo", (req, res) => {
	let todoIdToDelete = req.body.deleteTodo;
	
	Todo.deleteOne({_id: todoIdToDelete}, (err) => {
		if(err) {
			console.log(err);
		} else {
			todos = todos.filter(todo => todo._id != todoIdToDelete);
			res.redirect("/");
		}
	});
});

app.post("/change-date", (req, res) => {
	dateOnly = req.body.dateToQuery;
	selectedDate = new Date(dateOnly);
	
	Todo.find({date: req.body.dateToQuery}, (err, foundTodos) => {
		if(err) {
			console.log(err);
		} else {
			todos = foundTodos;
			res.redirect("/");
		}
	});
});

app.listen(3000, () => {
	Todo.find({date: dateOnly}, (err, foundTodos) => {
		if(err) {
			console.log(err);
		} else {
			todos = foundTodos;
		}
	});
	console.log("Server started at port 3000");
});