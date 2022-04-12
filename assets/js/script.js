let key = '64f2ee2a8261daa4d9f780f5b365f275';
let city = "Memphis"

//Grabs the current time and date from moment.js
let date = moment().format('dddd, MMMM Do YYYY');
let dateTime = moment().format('YYYY-MM-DD HH:MM:SS')

let cityHistory = [];
//Save the text value of the search and save it to an array and storage
$('.search').on("click", function (evt) {
	evt.preventDefault();
	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
	// if (city === "") {
	// 	return;
	// };
	cityHistory.push(city);
    //save city to local storage.
	localStorage.setItem('city', JSON.stringify(cityHistory));
	fiveDayForecastEl.empty();
	getHistory();
	getWeatherToday();
});

//Will create buttons based on search history 
let contHistEl = $('.cityHistory');
function getHistory() {
	contHistEl.empty();

	for (let i = 0; i < cityHistory.length; i++) {

		let rowEl = $('<row>');
		let btnEl = $('<button>').text(`${cityHistory[i]}`)

		rowEl.addClass('row histBtnRow');
		btnEl.addClass('btn btn-outline-secondary histBtn');
		btnEl.attr('type', 'button');

		contHistEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}
	//Allows the history buttons to start a search as well
	$('.histBtn').on("click", function (evt) {
		evt.preventDefault();
		city = $(this).text();
		fiveDayForecastEl.empty();
		getWeatherToday();
	});
};

//Grab the main 'Today' card body.
let cardTodayBody = $('.cardBodyToday')
//Applies the weather data to the today card and then launches the five day forecast
function getWeatherToday() {
	let getUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(cardTodayBody).empty();

//Use fetch API: 
fetch(getUrl, {
  method: 'GET',
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    $('.cardTodayCityName').text(data.name);
		$('.cardTodayDate').text(date);
		//Icons
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
		// Temperature
		let pEl = $('<p>').text(`Temperature: ${data.main.temp} °F`);
		cardTodayBody.append(pEl);
		//Feels Like
		let pElTemp = $('<p>').text(`Feels Like: ${data.main.feels_like} °F`);
		cardTodayBody.append(pElTemp);
		//Humidity
		let pElHumid = $('<p>').text(`Humidity: ${data.main.humidity} %`);
		cardTodayBody.append(pElHumid);
		//Wind Speed
		let pElWind = $('<p>').text(`Wind Speed: ${data.wind.speed} MPH`);
		cardTodayBody.append(pElWind);
  });
	getFiveDayForecast();
};

let fiveDayForecastEl = $('.fiveDayForecast');

function getFiveDayForecast() {
	let getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;
    
	fetch(getUrlFiveDay, {
      method: 'GET', 
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    let fiveDayArray = data.list;
		let myWeather = [];
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				feels_like: value.main.feels_like,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				myWeather.push(testObj);
			}
		})
		//Put the cards to the screen 
		for (let i = 0; i < myWeather.length; i++) {

			let divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
			divElCard.attr('style', 'max-width: 200px;');
			fiveDayForecastEl.append(divElCard);

			let divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			let m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
			divElHeader.text(m);
			divElCard.append(divElHeader)

			let divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			let divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			//Temp
			let pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);
			divElBody.append(pElTemp);
			//Feels Like
			let pElFeel = $('<p>').text(`Feels Like: ${myWeather[i].feels_like} °F`);
			divElBody.append(pElFeel);
			//Humidity
			let pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
			divElBody.append(pElHumid);
		}
  });
};

//Load the example card for Memphis
function initLoad() {

	let cityHistoryStore = JSON.parse(localStorage.getItem('city'));

	if (cityHistoryStore !== null) {
		cityHistory = cityHistoryStore
	}
	getHistory();
	getWeatherToday();
};

initLoad();