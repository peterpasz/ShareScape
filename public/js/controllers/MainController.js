//Angular JS
angular.module("myApp", [])
	.controller("MainController", ["$scope", "$http", function($scope, $http) {
		$scope.message = "Hello World!";
		
		/*
		When deploying to heroku, change 
		'http://localhost:3000/api/posts'
		to
		'https://sharescape.herokuapp.com/api/posts'
		*/
		
		$http.get('http://localhost:3000/api/posts')
			.success(function (posts) {
				console.log(posts)
				$scope.posts = posts
			});
		
		//Creates a post
		$scope.createPost = function() {
			console.log(userPos);
			if ($scope.title) {
				$http.post('/api/posts', {
					title: $scope.title,
					pos: {
						lat: userPos.lat,
						lon: userPos.lon
					},
					rating: 0,
					imglink: $scope.imglink,
				})
				.success(function (post) {
					$scope.posts.unshift(post)
					$scope.title = null
				})	
			}
		};
		
		//Increments post rating (non-functional atm because of scope issues due to calling it from a directive)
		$scope.upvote = function(index) {
			console.log("u tryna upboat fam xDD");
			$scope.posts[index].rating += 1;
		};
		
		//Decrements post rating (non-functional atm because of scope issues due to calling it from a directive)
		$scope.downvote = function(index) {
			$scope.posts[index].rating -= 1;
		};
	}])
	
	.directive("postInfo", function() {
		return {
			restrict: "E",
			scope: {
				info: "="
			},
			templateUrl: "js/directives/postInfo.html"
		};
	})
	
	//Converts a number to string and adds a + in front if it is positive
	.filter('rating', function() {
		return function(x) {
			if(x > 0) {
				return "+" + x.toString();
			} else {
				return x.toString();
			}
		};
	})

//Global variables
var userPos;

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
	
	mapInit(userPos.lat, userPos.lon);
}

//Geolocation failure callback
function geolocationFailure(error) {
	console.log ("Geolocation failed: " + error.message); 
}

//Initializes without placing a marker
function mapInit(x, y) {
    var pos = {lat: x, lng: y};
	console.log("Your postition: " + pos.lat + ", " + pos.lng);
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: pos
    });
}