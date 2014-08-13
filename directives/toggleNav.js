(function(angular) {
	var mod = angular.module('toggle-nav', []);

	mod.factory('toggleNavService', ['$rootScope', 
		function($rootScope) {
			var menus = {};

	  		return {
	  			toggle: function(menuId) {
	  				$rootScope.$emit('toggleNav.toggle', menuId);
	  			},

	  			activate: function(menuId) {
	  				menus[menuId] = true;
	  				$rootScope.$emit('toggleNav.create', menuId);
	  			},

	  			deactivate: function(menuId) {
	  				menus[menuId] = false;
	  				$rootScope.$emit('toggleNav.destroy', menuId);
	  			},

	  			isMenuActive: function(menuId) {
	  				return menus[menuId];
	  			}
	  		}
	  	}
	]);

	mod.directive('toggleNavViewport', ['$window', '$rootScope', 'toggleNavService', function($window, $rootScope, toggleNavService) {
	  return {
	      restrict: 'AEC'
	    , link: function(scope, element, attrs) {
	    	var isActive = false;

	    	function evaluate() {
	    		var elemStyle = window.getComputedStyle(element[0], null);
	    		var shouldActivate = (elemStyle['display'] != 'none');
	    		if(!isActive && shouldActivate) {
	    			isActive = true;
 					toggleNavService.activate(attrs.toggleNavViewport);
	    		}
 				else if(isActive && !shouldActivate) {
 					isActive = false;
 					toggleNavService.deactivate(attrs.toggleNavViewport);
 				}
 				
	    	}

	    	angular.element($window).on("resize", evaluate);

	       	scope.$on("$destroy",
                function() {
 					angular.element($window).off( "resize" );
 				}
            );

	       	evaluate();
	      }
	  };
	}]);

	mod.directive('toggleNavMenu', ['$rootScope', 'toggleNavService', function($rootScope, toggleNavService) {
	  return {
	      restrict: 'AEC'
	    , link: function(scope, element, attrs) {

	    	var elementId = element.attr("id");
	        
	        $rootScope.$on('toggleNav.toggle', function(e, menuId) {
	          if (elementId == menuId)
	            element.toggleClass('toggle-nav-active');
	          
	        });

	        function create() {
	        	element.addClass('toggle-nav');
	        }

	        function destroy() {
	        	element.removeClass('toggle-nav toggle-nav-active');
	        }

	        $rootScope.$on('toggleNav.create', function(e, menuId) {
	        	if (elementId == menuId)
	        		create();
	        });

	        $rootScope.$on('toggleNav.destroy', function(e, menuId) {
	        	if (elementId == menuId)
	        		destroy();
	        });

	        if(toggleNavService.isMenuActive(elementId))
	        	create();
	      }
	  };
	}]);

	mod.directive('toggleNavControl', [ 'toggleNavService',
		function(toggleNavService) {
		    return {
		     	link: function(scope, elem, attrs) {
		     		scope.isActive = false;

		     		elem.on('click', function(ev) {
		                ev.preventDefault();
		                scope.isActive = !scope.isActive;
		                toggleNavService.toggle(attrs.toggleNavControl);
		                scope.$apply();
		              });

		     		scope.$on("$destroy",
		                function() {
		 					elem.off( "click" );
		 				}
		            );
		     	}
		     }
		}
	]);
}(angular));