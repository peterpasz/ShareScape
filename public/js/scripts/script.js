//Global variables
var userPos;
var userLat;
var userLon;
var map;
var id;
var currentMarker;

//On page load
document.addEventListener("DOMContentLoaded", function() {

	//Checks if geolocation is available for browser
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure);
	} else {
		console.log("This browser doesn't support geolocation.");
	}

});

//Geolocation success callback
function geolocationSuccess(position) {

	userPos = {lat: position.coords.latitude, lon: position.coords.longitude};
	console.log("Intial user location:  " + userPos.lat.toFixed(7) + ", " + userPos.lon.toFixed(7));
	angular.element(document.querySelector("body")).scope().userPos = userPos;
	userLat = userPos.lat;
	userLon = userPos.lon;

	//Initialize map and place markers
	if(!map) {
		mapInit(userPos.lat, userPos.lon);
		angular.element(document.querySelector("body")).scope().makeMarkers();
	}

	id = navigator.geolocation.watchPosition(trackUser, geolocationFailure);
}

//Tracks user's position as they move
function trackUser(position){
	userPos = {lat: position.coords.latitude, lon: position.coords.longitude};
	console.log("Current user location: " + userPos.lat.toFixed(7) + ", " + userPos.lon.toFixed(7));
	currentMarker.setPosition({lat: (position.coords.latitude-0.0002), lng: position.coords.longitude});
	map.panTo(userPos);
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
	//Opens preview with loading icon
	if(mobile)
		openPreview("images/loading.gif");
	//Update image link field if not using mobile version
	if(!mobile){
		//Change placeholder text
		document.getElementById("post_entry_imglink").value = "Generating image link...";
		//Disable image selction
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
			//Change text to link
			document.getElementById("post_entry_imglink").value = link;
			//Enable image selction
			document.getElementById("post_entry_imglink").disabled = false;
			document.getElementById("post_image_select").disabled = false;
			//Open image preview
			document.getElementById("preview").style.height = "300px";
			document.getElementById("previewimg").src = link;
			document.getElementById('posts').style.height = "calc(100% - 400px)";
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

//Opens the image view overlay for canvas
function openCanvas() {
    document.getElementById("myCanvas").style.width = "100%";
	document.getElementById("myCanvas").style.backgroundColor = "rgba(0, 0, 0, 0.9)";
	document.getElementById("canvasImage").style.opacity = "1";
	document.getElementById("canvasImage").style.backgroundColor = "white";
	document.getElementById("canvasImage").style.border = "10px solid #A9A9A9";
	document.getElementById("closeCanvasBtn").style.opacity = "1";
	document.getElementById("saver").style.visibility = "visible";
}

//Closes the image view overlay
function closeCanvas() {
    document.getElementById("myCanvas").style.width = "0%";
	document.getElementById("myCanvas").style.backgroundColor = "rgba(0, 0, 0, 0.0)";
	document.getElementById("canvasImage").style.opacity = "0.0";
	document.getElementById("closeCanvasBtn").style.opacity = "0";
    document.getElementById("saver").style.visibility = "hidden";
	var canvas = document.getElementById("canvasImage")
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
}

//Close voting prompt
function dismissPrompt(postid) {
	document.getElementById(postid+"vote").style.height = "0";
}

//Turns image on drawing canvas into jpg, then retrieves imgur link
function getPicture(){
    
    try {
	    var img = document.getElementById('canvasImage').toDataURL('image/jpeg', 0.9).split(',')[1];
		//Change placeholder text
		document.getElementById("post_entry_imglink").value = "Generating image link...";
		//Disable image selction
		document.getElementById("post_entry_imglink").disabled = true;
		document.getElementById("post_image_select").disabled = true;
	} catch(e) {
	    var img = document.getElementById('canvasImage').toDataURL().split(',')[1];
	}

	$.ajax({
	    url: 'https://api.imgur.com/3/image',
	    type: 'post',
	    headers: {
	        Authorization: 'Client-ID 37aa31c2a25b049'
	    },
	    data: {
	        image: img
	    },
	    dataType: 'json',
	    success: function(response) {
            console.log(response.data.link);
			angular.element(document.querySelector("body")).scope().imglink = response.data.link;
            //Change text to link
            document.getElementById("post_entry_imglink").value = response.data.link;
            //Open image preview
			document.getElementById("preview").style.height = "300px";
			document.getElementById("previewimg").src = response.data.link;
			document.getElementById('posts').style.height = "calc(100% - 400px)";
			document.getElementById("post_entry_imglink").disabled = false;
			document.getElementById("post_image_select").disabled = false;
	    }
	});
    
    closeCanvas();
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
