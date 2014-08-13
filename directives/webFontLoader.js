(function(angular) {
	
	var mod = angular.module('web-font-loader', []);

	mod.directive('webFontLoader', ['$rootScope', '$window', 
		function($rootScope, $window) {
		    return {
		    	link: function(scope, elem, attrs) {

		    		function onActive() {
		    			$rootScope.$broadcast('webFontLoader.loaded');
		    		}

		    		function onInactive() {
		    			$rootScope.$broadcast('webFontLoader.error');
		    		}

			    	$window.WebFont.load({
					    google: {
					      families: [attrs.webFontLoader]
					    },
					    active: onActive,
		    			inactive: onInactive
					});
				}
		    }
		}
	]);
}(angular));