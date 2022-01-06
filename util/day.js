exports.getDay = (dayNumber) => {
    let day = null;
    switch(dayNumber) {
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
    };
    return day;
};

exports.getSalutation = () => {
    let hours = new Date().getHours(), salutation = null, emoji = null;
    
    if(hours >= 4 && hours <= 11) {
		salutation = "Good Morning";
		emoji = "🌄";
	} else if(hours >= 12 && hours <= 17) {
		salutation = "Good Afternoon";
		emoji = "☀️";
	} else if(hours >= 18 && hours <= 23) {
		salutation = "Good Evening";
		emoji = "🌙";
	} else {
		salutation="Have enough Sleep!";
		emoji = "✨";
    }
    
    return {salutation, emoji};
};