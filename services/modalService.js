(function(angular) {
  var mod = angular.module('modal-service', []);

  mod.factory('createDialog', ["$window", "$document", "$compile", "$rootScope", "$controller",
    function ($window, $document, $compile, $rootScope, $controller) {
      var defaults = {
        id: null,
        template: null,
        templateUrl: null,
        title: 'Default Title',        
        success: null,
        cancel: null,
        controller: null, //just like route controller declaration
        backdropClass: "modal-backdrop",
        modalClass: "{'modal': true}"
       
      };
      var html = $document.find('html');
      var body = $document.find('body');

      return function Dialog(templateUrl/*optional*/, options, passedInLocals) {

        // Handle arguments if optional template isn't provided.
        if(angular.isObject(templateUrl)){
          passedInLocals = options;
          options = templateUrl;
        } else {
          options.templateUrl = templateUrl;
        }

        options = angular.extend({}, defaults, options); //options defined in constructor

        var key;
        var idAttr = options.id ? ' id="' + options.id + '" ' : '';        
        
        var modalBody = (function(){
          if(options.template){
            if(angular.isString(options.template)){
              // Simple string template
              return options.template;
            } else {
              // jQuery/JQlite wrapped object
              return options.template.html();
            }
          } else {
            // Template url
            return '<div class="modal-content-inner-wrap" ng-include="' + options.templateUrl + '"></div>'
          }
        })();
        //We don't have the scope we're gonna use yet, so just get a compile function for modal
        var modalEl = angular.element(
                  '<div ng-class="' + options.modalClass + '"' + idAttr + '>' +
                       '<div class="modal-wrap"><div class="modal-inner-wrap"><div class="modal-content">' +       
                      '        <a class="modal-button-close icon-close" ng-click="$modalCancel()"><span>Close</span></a>' +
                      modalBody +
                      '    </div></div></div></div>');
        var backdropEl = angular.element('<div ng-click="$modalCancel()" class="' + options.backdropClass + '"></div>');
       
        var handleEscPressed = function (event) {
          if (event.keyCode === 27) {
            scope.$modalCancel();
          }
        };

        var closeFn = function () {
          body.unbind('keydown', handleEscPressed);
          modalEl.remove();         
          backdropEl.remove();  
          html.css("overflow", ""); 
          scope.$destroy();
        };

        body.bind('keydown', handleEscPressed);

        var ctrl, locals,
          scope = options.scope || $rootScope.$new();

        scope.$title = options.title;
        scope.$modalClose = closeFn;
        scope.$modalCancel = function () {
          var callFn = options.cancel || closeFn;
          callFn.call(this);
          scope.$modalClose();
        };
        scope.$modalSuccess = function () {
          var callFn = options.success || closeFn;
          callFn.call(this);
          scope.$modalClose();
        };
        
        if (options.controller) {
          locals = angular.extend({$scope: scope}, passedInLocals);
          ctrl = $controller(options.controller, locals);
          // Yes, ngControllerController is not a typo
          modalEl.contents().data('$ngControllerController', ctrl);
        }

        $compile(modalEl)(scope);
        $compile(backdropEl)(scope);
        modalEl.append(backdropEl);
        body.append(modalEl);

        html.css("overflow", "hidden");

      };
    }]);
}(angular));