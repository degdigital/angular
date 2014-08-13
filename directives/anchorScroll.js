(function(angular) {
	var mod = angular.module('anchor-scroll', []);

	mod.directive('anchorScroll', ['$window', '$document', 
		function($window, $document){
			return {
				link: function(scope, element, attrs) {
					var attrOptions = scope.$eval(attrs.anchorScroll);


					var options = angular.extend({
						duration: attrs.speed || 500		             
			            }, attrOptions || {});

					var elementToScrollTo = element.attr("href");	
					var currentTime = 0;
					var timeIncrement = 20;
					var amountToScroll = 0;
					var initialScrollPosition;

					var animateScroll = function(){        
				        currentTime += timeIncrement;
				        var val = Math.easeInOutQuad(currentTime, initialScrollPosition, amountToScroll, options.duration);                        
				      	$window.scrollTo(0, val);
				        if(currentTime < options.duration)
				            setTimeout(animateScroll, timeIncrement);
				        else
				        	currentTime = 0;
				    };

					element.bind("click", function(e) {	                    
	                    var destination = $document[0].querySelector(elementToScrollTo).offsetTop;
	                    initialScrollPosition = $window.pageYOffset || $document[0].documentElement.scrollTop || $document[0].body.scrollTop || 0;
	                    amountToScroll = destination - initialScrollPosition;
	 
	                    animateScroll();

	                    e.preventDefault();
	                    return false;
					});

					//t = current time
					//b = start value
					//c = change in value
					//d = duration
					Math.easeInOutQuad = function (t, b, c, d) {
					    t /= d/2;
					    if (t < 1) return c/2*t*t + b;
					    t--;
					    return -c/2 * (t*(t-2) - 1) + b;
					};

					
				}
			}
		}]
	);

}(angular));