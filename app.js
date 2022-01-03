const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.render("home");
});

app.listen(3000, () => {
	console.log("Server started at port 3000");
});