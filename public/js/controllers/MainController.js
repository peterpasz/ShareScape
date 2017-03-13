//Angular JS
angular.module("myApp", [])
	.controller("MainController", ["$scope", "$http", function($scope, $http) {
		$scope.message = "Hello World!",
		
		$http.get('http://localhost:3000/api/posts')
		.success(function (posts) {
			console.log(posts)
		  $scope.posts = posts
		}),
		
		$scope.createPost = function() {
			if ($scope.title) {
				$http.post('/api/posts', {
					title: $scope.title,
					rating: $scope.rating,
					imglink: $scope.imglink
				}).success(function (post) {
					$scope.posts.unshift(post)
					$scope.title = null
				})	
			}
		}

	}])
	.directive("postInfo", function() {
		return {
			restrict: "E",
			scope: {
				info: "="
			},
			templateUrl: "js/directives/postInfo.html"
		};
	});

//Global variables	
var username = "hunter2";
var usrLat;
var usrLng;

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
	usrLat = position.coords.latitude;
	usrLng = position.coords.longitude;
	
	mapInit(usrLat, usrLng);
	//mapInit(43.6560852, -79.38021909999999);
}

//Geolocation failure callback
function geolocationFailure(error) {
	console.log ("Geolocation failed: " + error.message); 
}

//Initializes without placing a marker
function mapInit(x, y) {
    var pos = {lat: x, lng: y};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: pos
    });
}

//Initializes map
/*
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
}*/