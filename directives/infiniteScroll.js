(function(angular) {
	
	var mod = angular.module('infinite-scroll', []);

	mod.directive('infiniteScroll', [
	  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
	    return {
	      link: function(scope, elem, attrs) {
	        var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
	        $window = angular.element($window);
	        scrollDistance = 0;
	        if (attrs.infiniteScrollDistance != null) {
	          scope.$watch(attrs.infiniteScrollDistance, function(value) {
	            return scrollDistance = parseInt(value, 10);
	          });
	        }
	        scrollEnabled = true;
	        checkWhenEnabled = false;
	        if (attrs.infiniteScrollDisabled != null) {
	          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
	            scrollEnabled = !value;
	            if (scrollEnabled && checkWhenEnabled) {
	              checkWhenEnabled = false;
	              return handler();
	            }
	          });
	        }
	        handler = function() {
	        	if(!scrollEnabled)
	        		return;

		        var elementBottom, remaining, shouldScroll, windowBottom, scrollTop;
		          scrollTop = getScrollTop();
		          windowBottom = $window[0].outerHeight + scrollTop;
		          elementBottom = elem[0].getBoundingClientRect().top + scrollTop + elem[0].offsetHeight;		         
		          remaining = elementBottom - windowBottom;
		          shouldScroll = remaining <= $window[0].outerHeight * scrollDistance;
		          if (shouldScroll) {
		          	checkWhenEnabled = true;
		            if ($rootScope.$$phase) {
		              return scope.$eval(attrs.infiniteScroll);
		            } else {
		              return scope.$apply(attrs.infiniteScroll);
		            }
		          }
	        };
	        $window.on('scroll', handler);
	        scope.$on('$destroy', function() {
	          return $window.off('scroll', handler);
	        });
	        function getScrollTop() {
	        	if($window[0].pageYOffset != null)
	        		return $window[0].pageYOffset;

	        	return $window[0].document.documentElement.scrollTop;
	        }

	        return $timeout((function() {
	          if (attrs.infiniteScrollImmediateCheck) {
	            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
	              return handler();
	            }
	          } else {
	            return handler();
	          }
	        }), 0);
	      }
	    };
	  }
	]);
}(angular));