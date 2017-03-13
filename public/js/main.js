var username = "Username";
var lat;
var lng;

document.addEventListener("DOMContentLoaded", function() {
	
	//Checks if geolocation is available for browser
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure);
	} else {
		console.log("This browser doesn't support geolocation.");
	}
	
	//"Post" button listener
	document.getElementById("post_button").addEventListener("click", createPost);
});

//Geolocation success callback
function geolocationSuccess(position) {
	lat = position.coords.latitude;
	lng = position.coords.longitude;
	
	initMap(lat, lng);
}

//Geolocation failure callback
function geolocationFailure(error) {
	console.log ("Geolocation failed: " + error.message); 
}

//Initializes map
function initMap(x, y) {
    var uluru = {lat: x, lng: y};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}

function createPost() {
	var text = document.getElementById("post_text").value;
	$scope.posts.push({
		author: username,
		text: text
	});
	console.log(text);
}