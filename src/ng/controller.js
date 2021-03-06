'use strict';

/**
 * @ngdoc object
 * @name angular.module.ng.$controllerProvider
 * @description
 * The {@link angular.module.ng.$controller $controller service} is used by Angular to create new
 * controllers.
 *
 * This provider allows controller registration via the
 * {@link angular.module.ng.$controllerProvider#register register} method.
 */
function $ControllerProvider() {
  var controllers = {};


  /**
   * @ngdoc function
   * @name angular.module.ng.$controllerProvider#register
   * @methodOf angular.module.ng.$controllerProvider
   * @param {string} name Controller name
   * @param {Function|Array} constructor Controller constructor fn (optionally decorated with DI
   *    annotations in the array notation).
   */
  this.register = function(name, constructor) {
    controllers[name] = constructor;
  };


  this.$get = ['$injector', '$window', function($injector, $window) {

    /**
     * @ngdoc function
     * @name angular.module.ng.$controller
     * @requires $injector
     *
     * @param {Function|string} constructor If called with a function then it's considered to be the
     *    controller constructor function. Otherwise it's considered to be a string which is used
     *    to retrieve the controller constructor using the following steps:
     *
     *    * check if a controller with given name is registered via `$controllerProvider`
     *    * check if evaluating the string on the current scope returns a constructor
     *    * check `window[constructor]` on the global `window` object
     *
     * @param {Object} locals Injection locals for Controller.
     * @return {Object} Instance of given controller.
     *
     * @description
     * `$controller` service is responsible for instantiating controllers.
     *
     * It's just simple call to {@link angular.module.AUTO.$injector $injector}, but extracted into
     * a service, so that one can override this service with {@link https://gist.github.com/1649788
     * BC version}.
     */
    return function(constructor, locals) {
      if(isString(constructor)) {
        var name = constructor;
        constructor = controllers.hasOwnProperty(name)
            ? controllers[name]
            : getter(locals.$scope, name, true) || getter($window, name, true);

        assertArgFn(constructor, name, true);
      }

      return $injector.instantiate(constructor, locals);
    };
  }];
}
