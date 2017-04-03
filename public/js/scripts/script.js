//Global variables
var userPos;
var userLat;
var userLon;
var map;
var id;//if you want to turn off real time geolocation
var currentMarker;

//On page load
document.addEventListener("DOMContentLoaded", function() {

	//document.getElementById("post_image_select").addEventListener("click", imageUpload);
	
	//Checks if geolocation is available for browser
	if (navigator.geolocation) {
		//Alex's jank location update, follow the 3 numbered steps
		//1 - Uncomment this line
		//var myVar = setInterval(getGeolocation, 1000);
		//2 - Comment out this line
		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure);
		if(map && currentMarker)
			id = navigator.geolocation.watchPosition(trackUser, geolocationFailure);
	} else {
		console.log("This browser doesn't support geolocation.");
	}
	
});

//Geolocation success callback
function geolocationSuccess(position) {
	
	userPos = {lat: position.coords.latitude, lon: position.coords.longitude};
	console.log("Intial user location: " + userPos.lat + ", " + userPos.lon);
	angular.element(document.querySelector("body")).scope().userPos = userPos;
	userLat = userPos.lat;
	userLon = userPos.lon;
	
	//Initialize map and place markers
	if(!map) {
		mapInit(userPos.lat, userPos.lon);
		angular.element(document.querySelector("body")).scope().makeMarkers();
	}
}

//3 - Uncomment this
/*
function getGeolocation() {
	navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure);
}
*/

//Romy's geolocation success callback
function geolocationSuccess2(position) {
	userPos = {lat: position.coords.latitude, lon: position.coords.longitude};
	
	angular.element(document.querySelector("body")).scope().userPos = userPos;
	
	angular.element(document.querySelector("body")).scope().centerOnUser();
	angular.element(document.querySelector("body")).scope().currentLocation(position.coords.latitude, position.coords.longitude);
	
	console.log("Intial Location found");
}

function trackUser(position){
	userPos = {lat: position.coords.latitude, lng: position.coords.longitude};
	currentMarker.setPosition({lat: (position.coords.latitude-0.0002), lng: position.coords.longitude});
	map.panTo(userPos);
	//angular.element(document.querySelector("body")).scope().centerOnUser();
	console.log("Update");
}

//Geolocation failure callback
function geolocationFailure(error) {
	console.log ("Geolocation failed: " + error.message); 
}

//Initializes without placing a marker
function mapInit(x, y) {
	var pos = {lat: x, lng: y};
	map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: pos,
		streetViewControl: false
    });
	currentMarker = new google.maps.Marker({
		position: {lat: x, lng: y},
		map: map,
		icon: '../../images/purplecrosshair.png',
		zIndex: -1
   	});
	angular.element(document.querySelector("body")).scope().map = map;
	console.log("Map loaded")
}

//Uploads an image on imgur and pastes the link to into post_entry_imglink
function imageUpload(file, mobile) {
	console.log(file.name + " selected");
	if (!file || !file.type.match(/image.*/)) return;
	var imageData, link;
	var fd = new FormData();
    fd.append("image", file);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.imgur.com/3/image.json");
	//Update image link field if not using mobile version
	if(!mobile){
		document.getElementById("post_entry_imglink").value = "Generating image link...";
		document.getElementById("post_entry_imglink").disabled = true;
		document.getElementById("post_image_select").disabled = true;
	}
    xhr.onload = function() {
		imageData = JSON.parse(xhr.responseText).data;
		link = imageData.link;
		//Adds huge-thumbnail suffix to image link
		if((imageData.height > 1024 || imageData.width > 1024) && !imageData.animated)
			link = link.replace(/\.([^\.]*)$/,"h."+'$1');
		console.log(link + " returned");
		angular.element(document.querySelector("body")).scope().imglink = link;
		//Reset image link field if not using mobile version
		if(!mobile){
			document.getElementById("post_entry_imglink").value = link;
			document.getElementById("post_entry_imglink").disabled = false;
			document.getElementById("post_image_select").disabled = false;
		}
		//Preview image if using mobile version
		if(mobile){
			openPreview(link);
		}
    }
    xhr.setRequestHeader('Authorization', 'Client-ID 37aa31c2a25b049');
    xhr.send(fd);
}

//Opens the image preview overlay (mobile only)
function openPreview(link) {
	openView(link);
	document.getElementById("post_entry").style.display = "inline";
	document.getElementById("closebtn").onclick = closePreview;
}

//Closes the image preview overlay (mobile only)
function closePreview() {
	document.getElementById("post_entry").style.display = "none";
	document.getElementById("closebtn").onclick = closeView;
	closeView();
}

//Opens the image view overlay
function openView(link) {
	document.getElementById("bigImage").src = link;
   	document.getElementById("myNav").style.width = "100%";
	document.getElementById("myNav").style.backgroundColor = "rgba(0, 0, 0, 0.9)";
	document.getElementById("bigImage").style.opacity = "1";
	document.getElementById("closebtn").style.opacity = "1";
}

//Closes the image view overlay
function closeView() {
    document.getElementById("myNav").style.width = "0%";
	document.getElementById("myNav").style.backgroundColor = "rgba(0, 0, 0, 0.0)";
	document.getElementById("bigImage").style.opacity = "0.0";
	document.getElementById("closebtn").style.opacity = "0";
}

//Close voting prompt
function dismissPrompt(postid) {
	document.getElementById(postid+"vote").style.height = "0";
}

//Redirects user to mobile site
function redirect() {
	console.log("Screen resolution: " + screen.width + "x" + screen.height);
	if(screen.width < screen.height) {
		window.location = "mobile.html";
	}
}

//Handles key input
function inputKeyUp(e) {
    e.which = e.which || e.keyCode;
	//Closes the image view overlay on ESC
    if(e.which == 27) {
        closeView();
    }
}