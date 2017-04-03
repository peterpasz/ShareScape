var myApp = angular.module('myApp', ['ngStorage']);

myApp.run(['$localStorage', function($localStorage) {
		if($localStorage.votedQuestions != null){
         	
 		}else{
 			$localStorage.votedQuestions = [];
			 /*
			$localStorage.downvotes = [];
			$localStorage.upvotes = [];
			*/
 		}
		console.log($localStorage);
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
		*/
		
		$http.get('/api/posts')
			.success(function (posts) {
				//Goes through all the posts in the database
				for(var i=0; i<posts.length; i++){
					var distance = $scope.haversineDistance(posts[i].pos.lat, posts[i].pos.lon, parseFloat(userLat), parseFloat(userLon));
					if(distance != 0) {
						console.log($scope.haversineDistance(posts[i].pos.lat, posts[i].pos.lon, parseFloat(userLat), parseFloat(userLon)));
						//console.log($scope.haversineDistance(posts[i].pos.lat, posts[i].pos.lon, 43.5821429, -79.6333674));
						//console.log(userLat, userLon);
						//console.log(posts[i].pos.lat, posts[i].pos.lon);
						$scope.posts.unshift(posts[i]);
						//Adds marker for that post
						$scope.makeMarker(posts[i].pos.lat, posts[i].pos.lon, posts[i].title, i, posts[i].imglink);
					}
				}
			});

		//Creates a post
		$scope.createPost = function() {
			//console.log(userPos);
			if ($scope.title && $scope.linkIsImage($scope.imglink)) {
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
			document.getElementById(postid).style.color = "orange";
			if ($localStorage.votedQuestions.indexOf(postid) === -1) {
				$localStorage.votedQuestions.push(postid)
				/*
				var rating = parseInt(document.getElementById(postid).innerHTML);
				document.getElementById(postid).innerHTML = rating + value;
				document.getElementById(postid+"up").enabled = false;
				
				if(value == 1){
					$scope.upvote = true;
					
				}
				else if(value == -1){
					$scope.downvote = true;
					
				}
				*/
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
				document.getElementById(postid+"vote").style.height = "25px";
    		}
		}
		
		$scope.dismissPrompt = function (postid) {
			dismissPrompt(postid)
		}

		//hashmap to associate marker with img links
		$scope.markerHashMap = new Map();
		
		
		//Places a marker at the specified lat and lon
		$scope.makeMarker = function(x, y, markerTitle, count, imglink) {
			//console.log(x, y)
			//console.log($scope.map)
			//console.log($scope.posts)
			var infowindow = new google.maps.InfoWindow({
    			content: markerTitle
  			})
			var marker = new google.maps.Marker({
				position: {lat: x, lng: y},
				map: $scope.map,
				title: markerTitle,
				//animation: google.maps.Animation.DROP,
				icon: '../../images/ShareScapeMapIcon3.png'
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
		}
		
		//Places markers for all posts in $scope.posts
		$scope.makeMarkers = function() {
			for(var i = 0; i < $scope.posts.length; i++){
				$scope.makeMarker($scope.posts[i].pos.lat, $scope.posts[i].pos.lon, $scope.posts[i].title, i, $scope.posts[i].imglink);
				/*console.log(
					"Post marked: " +
					$scope.posts[i].pos.lat.toFixed(7) + ", " + 
					$scope.posts[i].pos.lon.toFixed(7) + ", " + 
					$scope.posts[i].title
				)*/
			}
			console.log("Markers loaded");
		}

		//Creates info window and centers map on clicked post
		$scope.openInfo = function(x, y, title) {
			infowindow = new google.maps.InfoWindow({
				content: title,
				position: {lat:x, lng:y},
				pixelOffset: new google.maps.Size(0, -35)
			})
   			infowindow.open(map);
			//console.log(google.maps.InfoWindow);
			map.panTo({lat:x, lng:y});
		}

		//Centers map on user location
		$scope.centerOnUser = function() {
			if($scope.userPos) {
				map.panTo({lat: $scope.userPos.lat, lng: $scope.userPos.lon});
				//map.setCenter({lat: $scope.userPos.lat, lng: $scope.userPos.lon});
			}
		}

		//Opens the image view overlay
		$scope.openView = function(link) {
			openView(link);
		}

		//Checks if link ends with an image file extension
		$scope.linkIsImage = function(link) {
			var str = link.substring(link.length - 4);
			if(str == ".jpg" || str == ".png" || str == ".gif")
				return true;
			console.log("Invalid file type");
			//document.getElementById("post_entry_imglink").style.backgroundColor = "#FFADAD";
			//document.getElementById("post_image_select").style.backgroundColor = "#FFADAD";
			return false;
		}
		
		//Verifies if a post is close enough to the user to display
		$scope.haversine = function(lat, lon) {
			return true;
		}

		$scope.haversineDistance = function(lat1, lng1, lat2, lng2) {
			Number.prototype.toRad = function() {
				return this * Math.PI / 180;
			}
			
			var R = 6371e3; // metres
			//console.log("R: " + R);
			var φ1 = lat1.toRad();
			//console.log("φ1: " + φ1);
			var φ2 = lat2.toRad();
			//console.log("φ2: " + φ2);
			var Δφ = (lat2-lat1).toRad();
			//console.log("Δφ: " + Δφ);
			var Δλ = (lng2-lng1).toRad();
			
			var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
					Math.cos(φ1) * Math.cos(φ2) *
					Math.sin(Δλ/2) * Math.sin(Δλ/2);
			//console.log("a: " + a);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			//console.log("c: " + c);
			
			var d = R * c;
			d = parseFloat((d/1000).toFixed(2));
			//console.log("d: " + d);
			return d;
		}
		
		//Position of the user, set by "js/scripts/script.js" when the user shares position
		$scope.userPos;
		$scope.userLat;
		$scope.userLon;
		
		//Map, set by "js/scripts/script.js" when the user shares position
		$scope.map;

		$scope.markers = [];
		
		$scope.posts = [];
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