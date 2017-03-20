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
				for(var i=0; i<posts.length; i++){
					$scope.makeMarker(posts[i].pos.lat, posts[i].pos.lon)
				}	
				$scope.posts = posts
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
					$scope.title = null
				})	
			}
		};
		
		//Places a marker at the specified lat and lon
		$scope.makeMarker = function(x, y) {
			console.log(x, y)
			console.log($scope.map)
			console.log($scope.posts)
			var marker = new google.maps.Marker({
				position: {lat: x, lng: y},
				map: $scope.map
   			 })
		};

		//Increments post rating (non-functional atm because of scope issues due to calling it from a directive)
		$scope.upvote = function(index) {
			console.log("u tryna upboat fam xDD");
			$scope.posts[index].rating += 1;
		};
		
		//Decrements post rating (non-functional atm because of scope issues due to calling it from a directive)
		$scope.downvote = function(index) {
			console.log("downboats lololo");
			$scope.posts[index].rating -= 1;
		};
		
		$scope.userPos;
		
		$scope.map;
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