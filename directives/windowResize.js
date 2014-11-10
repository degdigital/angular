define(['angular'], function(angular) {
	var mod = angular.module('window-resize', []);

	mod.directive('windowResize', ['$window', '$rootScope',  function($window, $rootScope) {
		return {
	     	restrict: 'AEC',
	      	replace: false,	
	      	link: function(scope, element) {
	      		var w = angular.element($window);

	      		scope.getWindowWidth = function() {
	      			return $window.innerWidth;
	      		};

	      		scope.$watch(scope.getWindowWidth, onWindowResize);

	      		function onWindowResize() {
	      			$rootScope.$broadcast('window.resize');
	      		}

	      		w.bind("resize", function() {
	      			scope.$apply();
	      		});

	      		onWindowResize();
		    }
	  };
	}]);	    	
});