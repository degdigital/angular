(function (angular, Masonry, imagesLoaded) {
  'use strict';
    angular.module('masonry', []).controller('MasonryCtrl', [
      '$scope',
      '$element',
      '$timeout',
      function controller($scope, $element, $timeout) {
        var bricks = {};
        var schedule = [];
        var destroyed = false;
        var self = this;
        var timeout = null;
        this.preserveOrder = false;
        this.loadImages = true;
        this.masonryInstance = null;
        var self = this;
        this.scheduleMasonryOnce = function scheduleMasonryOnce() {
          var args = arguments;
          var found = schedule.filter(function filterFn(item) {
              return item[0] === args[0];
            }).length > 0;
          if (!found) {
            this.scheduleMasonry.apply(null, arguments);
          }
        };
        this.scheduleMasonry = function scheduleMasonry() {
          if (timeout) {
            $timeout.cancel(timeout);
          }
          schedule.push([].slice.call(arguments));
          timeout = $timeout(function runMasonry() {
            if (destroyed) {
              return;
            }
            
            schedule.forEach(function scheduleForEach(args) {
              self.masonryInstance[args]($element);
            });
            schedule = [];
          }, 30);
        };
        function defaultLoaded($element) {
          $element.addClass('loaded');
        }
        this.appendBrick = function appendBrick(element, id) {
          if (destroyed) {
            return;
          }
         
          function _append() {
            if (Object.keys(bricks).length === 0) {
              self.masonryInstance.resize($element);
            }
            if (bricks[id] === undefined) {
              bricks[id] = true;
              defaultLoaded(element);
              self.masonryInstance.appended(element, true);
            }
          }
          function _layout() {
            self.scheduleMasonryOnce('layout');
          }
          if (!self.loadImages) {
            _append();
            _layout();
          } else if (self.preserveOrder) {
            _append();
            imagesLoaded(element[0], _layout);
          } else {
            imagesLoaded(element[0], function imagesLoaded() {
              _append();
              _layout();
            });
          }
        };
        this.removeBrick = function removeBrick(id, element) {
          if (destroyed) {
            return;
          }
          delete bricks[id];
          self.masonryInstance.remove(element);
          this.scheduleMasonryOnce('layout');
        };
        this.destroy = function destroy() {
          destroyed = true;
          if ($element.data('masonry')) {
            self.masonryInstance.destroy();
          }
          $scope.$emit('masonry.destroyed');
          bricks = [];
        };
        this.reload = function reload() {
          self.masonryInstance.layout($element);
          $scope.$emit('masonry.reloaded');
        };
      }
    ]).directive('masonry', function masonryDirective() {
      return {
        restrict: 'AE',
        controller: 'MasonryCtrl',
        link: {
          pre: function preLink(scope, element, attrs, ctrl) {
            var attrOptions = scope.$eval(attrs.masonry || attrs.masonryOptions);
            var options = angular.extend({
                itemSelector: attrs.itemSelector || '.masonry-brick',
                columnWidth: parseInt(attrs.columnWidth, 10) || attrs.columnWidth,
                transitionDuration: attrs.transitionDuration || 0
              }, attrOptions || {});
      
            ctrl.masonryInstance = new Masonry(element[0], options);
            var loadImages = scope.$eval(attrs.loadImages);
            ctrl.loadImages = loadImages !== false;
            var preserveOrder = scope.$eval(attrs.preserveOrder);
            ctrl.preserveOrder = preserveOrder !== false && attrs.preserveOrder !== undefined;
            scope.$emit('masonry.created', element);
            scope.$on('$destroy', ctrl.destroy);

            if (attrOptions.reload != null) {
              scope.$watch(attrOptions.reload, function(value) {
                if(value) 
                  ctrl.reload();
              });
            }
          }
        }
      };
    }).directive('masonryBrick', function masonryBrickDirective() {
      return {
        restrict: 'AC',
        require: '^masonry',
        scope: true,
        link: {
          post: function preLink(scope, element, attrs, ctrl) {
            var id = scope.$id, index;
            ctrl.appendBrick(element, id);
            element.on('$destroy', function () {
              ctrl.removeBrick(id, element);
            });
            scope.$on('masonry.reload', function () {
              ctrl.scheduleMasonryOnce('reloadItems');
              ctrl.scheduleMasonryOnce('layout');
            });
            scope.$watch('$index', function () {
              if (index !== undefined && index !== scope.$index) {
                ctrl.scheduleMasonryOnce('reloadItems');
                ctrl.scheduleMasonryOnce('layout');
              }
              index = scope.$index;
            });
        }
      }
    };
  });
}(angular, Masonry, imagesLoaded);