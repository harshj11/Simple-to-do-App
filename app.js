const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const today = new Date();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

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
		salutation: salutationText,
		emoji: emoji,
		date: today.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
		day: day
	});
});

app.listen(3000, () => {
	console.log("Server started at port 3000");
});