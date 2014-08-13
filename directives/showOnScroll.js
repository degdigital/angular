(function(angular) {
	var mod = angular.module('show-on-scroll', []);

	mod.directive('showOnScroll', ['$window', '$document',
		function($window, $document){
			return {
				link: function(scope, element, attrs) {
					var attrOptions = scope.$eval(attrs.showOnScroll);

					var options = angular.extend({
						scrollDir: attrs.dir || 'up',
						showClass: attrs.showClass || 'is-visible',
						hideClass: attrs.hideClass || 'is-hidden',
						showInitial: attrs.showInitial || false,
						target: attrs.target || 'body' 	             
			        }, attrOptions || {});

			        var lastScrollTop = 0;
			        var isHidden;
			        var targetElement = $document[0].querySelector(options.target);

			        angular.element($window).bind("scroll", function(e) {
			        	var scrollDirection = detectScrollDirection();

			        	if(scrollDirection != options.scrollDir || isAtTargetTop()) 
			        		hide();
			        	else
			        		show();

			        });

			        function hide() {
			        	if(isHidden === true)
			        		return;

			        	isHidden = true;
			        	element.addClass(options.hideClass);
			        	element.removeClass(options.showClass);

			        }

			        function show() {
			        	if(isHidden === false)
			        		return;

			        	isHidden = false;
			        	element.addClass(options.showClass);
			        	element.removeClass(options.hideClass);
			        }

			        function detectScrollDirection() {
			        	var scrollTop = $window.pageYOffset, 
			        		scrollDirection;
			        	if($window.pageYOffset > lastScrollTop)
			        		scrollDirection = 'down';
			        	else
			        		scrollDirection = 'up';

			        	lastScrollTop = scrollTop;
			        	return scrollDirection;
			        }

			        function isAtTargetTop() {
			        	return targetElement.getBoundingClientRect().top >= 0;
			        }

			        if(options.showInitial)
			        	show();
			        else
			        	hide();
				}
			}
		}]
	);
}(angular));