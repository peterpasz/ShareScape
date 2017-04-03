//Angular JS
var myApp = angular.module('myApp', ['ngStorage']);

myApp.run(['$localStorage', function($localStorage) {
		if($localStorage.votedQuestions != null){

 		}
		else{
 			$localStorage.votedQuestions = [];
			 /*
			$localStorage.downvotes = [];
			$localStorage.upvotes = [];
			*/
 		}
		 console.log($localStorage)
	}])

myApp.controller("MainController", ["$scope", "$http", "$localStorage", function($scope, $http, $localStorage) {
		$scope.message = "Hello World!";

		/*
		When deploying to heroku, change
		'http://localhost:3000/api/posts'
		to
		'https://sharescape.herokuapp.com/api/posts'
		*/

		/*//Old version, tries to place map markers before map is loaded (sometimes?)
		$http.get('http://localhost:3000/api/posts')
			.success(function (posts) {
				$scope.posts = posts
			});

		/*

		/*/
		$http.get('/api/posts')
			.success(function (posts) {
				$scope.posts = posts
				for(var i=0; i<posts.length; i++){

					$scope.makeMarker(posts[i].pos.lat, posts[i].pos.lon, posts[i].title, i,  posts[i].imglink)
					/*
					if ($localStorage.upvotes.indexOf(posts[i]._id) === -1) {

						$scope.posts[i].upvote = true;
					}
					else if ($localStorage.downvotes.indexOf(posts[i]._id) === -1) {

						$scope.posts[i].downvote = true;
					}
					*/
				}

			});


		//Creates a post
		$scope.createPost = function() {
			console.log(userPos);
			if ($scope.title) {
				$http.post('/api/posts', {
					title: $scope.title,
					pos: {
						lat: $scope.userPos.lat,
						lon: $scope.userPos.lon
					},
					rating: 0,
					imglink: $scope.imglink,
				})
				.success(function (post) {
					$scope.posts.unshift(post)
					$scope.makeMarker(
						$scope.userPos.lat,
						$scope.userPos.lon,
						$scope.title,
						0,
						$scope.imglink);
					$scope.title = null
					//Clears title and imglink fields
					$scope.title = "";
					$scope.imglink = "";
				})
			}
		};

		$scope.updateRating = function(postid, postrating, value){
			/*
			console.log(document.getElementsByClassName(postid));
			document.getElementsByClassName(postid).disabled = true;
			*/
			console.log($localStorage.votedQuestions.indexOf(postid))
			//console.log($localStorage.votedQuestions[0].postid[0].vote)
			if ($localStorage.votedQuestions.indexOf(postid) === -1) {
				$localStorage.votedQuestions.push(postid)
				/*
				var rating = parseInt(document.getElementById(postid).innerHTML);
				document.getElementById(postid).innerHTML = rating + value;
				document.getElementById(postid+"up").enabled = false;
				*/
				if(value == 1){
					$scope.upvote = true;
					$localStorage.upvotes.push(postid)
				}
				else if(value == -1){
					$scope.downvote = true;
					$localStorage.downvotes.push(postid)
				}
				document.getElementById(postid).innerHTML = postrating + value;
				console.log("Thanks for Voting");

				$http.put('/api/posts/' + postid, {
					rating: postrating + value
				})
				.success(function(post) {

				})
				$http.get('/api/posts')
					.success(function (posts) {
						$scope.posts = posts
					})
			}
			else{
       			console.log("You already voted to this question");
    		}
		}

		//hashmap to associate marker with img links
		$scope.markerHashMap = new Map();


		//Places a marker at the specified lat and lon
		$scope.makeMarker = function(x, y, markerTitle, count, imglink) {
			//console.log(x, y)
			//console.log($scope.map)
			//console.log($scope.posts)
			var infowindow = new google.maps.InfoWindow({
    			content: "\"" + markerTitle + "\""
  			})
			var marker = new google.maps.Marker({
				position: {lat: x, lng: y},
				map: $scope.map,
				title: markerTitle,
				//animation: google.maps.Animation.DROP,
				icon: '../../images/ShareScapeMapIcon2.png'
   			});

			$scope.markerHashMap.set(marker, imglink);
			//console.log(imglink);
			//console.log($scope.markerHashMap.size);
			//console.log($scope.markerHashMap.get(marker));


			marker.addListener('click', function() {
   				infowindow.open(map, marker);

				link = $scope.markerHashMap.get(marker);
				console.log(link);
				$scope.openView(link);
  			})
		};

		//Creates info window and centers map on clicked post
		$scope.openInfo = function(x, y, title) {
			infowindow = new google.maps.InfoWindow({
				content: title,
				position: {lat:x, lng:y},
				pixelOffset: new google.maps.Size(0, -35)
			})
   			infowindow.open(map)
			map.setCenter({lat:x, lng:y})
		}

		//Centers map on user location
		$scope.centerOnUser = function() {
			if($scope.userPos) {
				map.setCenter({lat: $scope.userPos.lat, lng: $scope.userPos.lon});
			}
		}

		//Places markers for all posts in $scope.posts
		$scope.makeMarkers = function() {
			for(var i = 0; i < $scope.posts.length; i++){
				$scope.makeMarker($scope.posts[i].pos.lat, $scope.posts[i].pos.lon, $scope.posts[i].title, i, $scope.posts[i].imglink);
				console.log(
					"Post marked: " +
					$scope.posts[i].pos.lat.toFixed(7) + ", " +
					$scope.posts[i].pos.lon.toFixed(7) + ", " +
					$scope.posts[i].title
				)
			}
		}

		//Opens the image view overlay
		$scope.openView= function(link) {
			openView(link);
		}

		$scope.openCanvas = function(){
			openCanvas();
		}

		//Position of the user, set by "js/scripts/script.js" when the user shares position
		$scope.userPos;

		//Map, set by "js/scripts/script.js" when the user shares position
		$scope.map;

		$scope.markers = [];
	}])

	//Post template
	.directive("postInfo", function() {
		return {
			restrict: "E",
			scope: {
				info: "="
			},
			templateUrl: "js/directives/postInfo.html"
		};
	})

	//Adds a "+" in front of a number if it is positive
	.filter('rating', function() {
		return function(x) {
			if(x > 0) {
				return "+" + x;
			} else {
				return x;
			}
		};
	})
