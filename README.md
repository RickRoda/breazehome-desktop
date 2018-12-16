# Breazehome-desktop
Desktop companion webapp to the [Ionic Brezehome](https://git.breazehome.com/Breaze/SharGroup-Ionic) application. This version does not use the Ionic framework.

## Our Stack
* AngularJS + jQuery
    * For app logic, routing, api calls.
* Bootstrap (SASS)
    * For application UI styling, style modularity.
* GruntJS
    * For building, serving, and task running.
* Karma
    * For application unit testing.
* Yeoman(optional cli tool)
		* To create new routes, views, states, etc, **please** follow the <a href="https://github.com/yeoman/generator-angular" target="_blank">yeoman</a> docs.

## Configure settings file
Inside of the breaze-desktop/app file create a file named **settings.js**.
Copy the contents below and save the file.
```javascript
/*
	Important: This file contains all secret/sensitive keys for 
	building/running our project in development mode. This is the
	skeleton for your settings.js file which should exist at app/
*/
const SETTINGS = {
	'API_HOST': '',
	'IMAGE_URL': '',
	'AUTH_REDIRECT_URL_GOOGLE': '',
	'AUTH_REDIRECT_URL_FB': '',
	'CHAT_HOST': 'wss://chat.breazehome.com/',
	
	'VERBOSE_CONSOLE_DEBUG': false,
	//PoLR Specific Settings    
  'POLR_ISOCHRONE_STRINGIFICATION_GEOSGEOMETRY': 'GEOSGEOMETRY'
}
```

## Testing
Running `grunt test` will run the unit tests with karma.

## Project Directory Structure
```
breaze-desktop/                          * root
├-- .git/                                * Git files
|
|-- app/                                 * Source code folder
|    |-- images/                         * Project assets
|    |
|    |-- scripts/                        * All javascript code
│    │    ├── controllers/               * Angularjs controllers files
│    │    ├── directives/                * Angularjs directives files
│    │    │── services/                  * Angularjs services files
│    │    │── translations/              * translation json for multi user interface language
│    │    │-- app.js                     * application configuration file
|    |
│    ├── views/                          * HTML files for pages, modals, directive templates
│    │     ├── modals/                   * modals HTML templates
│    │     └── *.html                    * HTML files for pages, directive templates
|    |
│    ├── styles/                         * All sass styling files
│    │    │-- *.scss                     * SASS styling files
|    |
|    |-- index.html                      * Application end point
|    |-- settings.js                     * API URL configuration file
|
|-- bower_components/                    * Bower components dependencies folder
|
|-- node_modules/                        * nodejs modules dependencies folder
|
|-- test/                                * Project testing folder
|
├── Gruntfile.js                         * Defines coding styles between editors
├── gulpfile.js                          * Defines coding styles between editors
├── .gitignore                           * Git ignore file
├── bower.json                           * bower dependencies configuration file
├── package.json                         * npm dependencies configuration file
├── Dockerfile                           * docker configuration file
├── README.md                            * Readme file
├── package.json                         * Defines our JavaScript dependencies
```

## Dependencies

### NPM
* autoprefixer: ^5.2.1
	It parse your CSS and add vendor prefixes to CSS rules using values from Can I Use. It is recommended by Google and used by Twitter and Taobao. <a href="https://autoprefixer.github.io/" target="_blank">More info</a>		
* grunt: 
	Grunt is a JavaScript task runner, a tool used to automatically perform frequent tasks such as minification, compilation, unit testing, and linting.  <a href="https://gruntjs.com/" target="_blank">More info</a>		
	* time-grunt: ^1.0.0
		Display the elapsed execution time of grunt tasks. <a href="https://github.com/sindresorhus/time-grunt" target="_blank">More info</a>	
	* jit-grunt: ^0.9.1
		A Just In Time plugin loader for Grunt. <a href="https://github.com/shootaroo/jit-grunt" target="_blank">More info</a>
* jshint-stylish: ^1.0.0
	Stylish reporter for JSHint. <a href="https://github.com/sindresorhus/jshint-stylish" target="_blank">More info</a>	
* karma: ^1.4.0
	Karma brings a productive testing environment to developers. <a href="https://karma-runner.github.io/2.0/index.html" target="_blank">More info</a>
* jasmine: ^2.5.2
	Jasmine is a behavior-driven development framework for testing JavaScript code. <a href="https://jasmine.github.io/" target="_blank">More info</a>	
	

### Bower

* angular: 1.6.3
	AngularJS is a JavaScript-based open-source front-end web application framework. <a href="https://angularjs.org/" target="_blank">More info</a>
	* angular-animate: ^1.6.2
		AngularJS provides animation hooks for common directives such as ngRepeat, ngSwitch, and ngView, as well as custom directives via the $animate service. <a href="https://docs.angularjs.org/guide/animations" target="_blank">More info</a>
	* angular-cookies: ^1.4.0
		Expose properties that represented the current browser cookie values. <a href="https://github.com/angular/bower-angular-cookies" target="_blank"></a>	
	* angular-resource: ^1.4.0
		A factory which creates a resource object that lets you interact with RESTful server-side data sources. <a href="https://docs.angularjs.org/api/ngResource/service/$resource" target="_blank">More info</a>	
	* angular-route: ^1.4.0
		Make your applications ready for routing. <a href="https://docs.angularjs.org/api/ngRoute" target="_blank">More info</a>
	* angular-sanitize: ^1.4.0
		Sanitizes an html string by stripping all potentially dangerous tokens. <a href="https://docs.angularjs.org/api/ngSanitize/service/$sanitize" target="_blank">More info</a>
	* angular-touch: ^1.4.0
		AngularJS module for touch events and helpers for touch-enabled devices. <a href="https://docs.angularjs.org/api/ngTouch" target="_blank">More info</a>
	* ngstorage: ^0.3.11
		An AngularJS module that makes Web Storage working in the Angular Way. <a href="https://github.com/gsklee/ngStorage" target="_blank">More info</a>	
	* angular-modal-service: ^0.10.1
		Modal service for AngularJS - supports creating popups and modals via a service. <a href="https://github.com/dwmkerr/angular-modal-service" target="_blank">More info</a>	
	* ngInfiniteScroll: 1.0.0
		ngInfiniteScroll is a directive for AngularJS to evaluate an expression when the bottom of the directive's element approaches the bottom of the browser window, which can be used to implement infinite scrolling. <a href="https://github.com/sroze/ngInfiniteScroll" target="_blank">More info</a>	
	* angular-chart.js: ^1.1.1
		Reactive, responsive, beautiful charts for AngularJS based on Chart.js. <a href="http://jtblin.github.io/angular-chart.js/" target="_blank">More info</a>
	* angularjs-slider: ^6.1.1
		Slider directive implementation for AngularJS. <a href="https://github.com/angular-slider/angularjs-slider" target="_blank">More info</a>
	* ng-file-upload: ^12.2.13
		Lightweight Angular directive to upload files. <a href="https://github.com/danialfarid/ng-file-upload" target="_blank">More info</a>	
	* angular-slick: ^0.2.1
		Angular directive for slick jquery carousel. <a href="https://github.com/vasyabigi/angular-slick" target="_blank">More info</a>
* bootstrap-sass-official: ^3.2.0
	bootstrap-sass is a Sass-powered version of Bootstrap 3. <a href="https://github.com/twbs/bootstrap-sass" target="_blank">More info</a>	
* Leaflet: ^1.0.61
	Leaflet is a widely used open source JavaScript library used to build web mapping applications. <a href="http://leafletjs.com/" target="_blank">More info</a>
	* Leaflet-draw: ^0.4.3
		Leaflet plugin provides onmap polygon drawing. <a href="http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html" target="_blank">More info</a>
	* Leaflet.markercluster: ^1.0.0
		Leaflet plugin provides Beautiful Animated Marker Clustering functionality. <a href="https://github.com/Leaflet/Leaflet.markercluster" target="_blank">More info</a>
	* leaflet-polylinedecorator: ^1.1.0
		A Leaflet plug-in to define and draw patterns on existing Polylines or along coordinate paths. <a href="https://github.com/bbecquet/Leaflet.PolylineDecorator" target="_blank">More info</a>
* image-viewer: ^1.3.6
	A web image viewer jQuery plugin for desktops and phones. <a href="https://github.com/gghg1989/Image-Viewer" target="_blank">More info</a>
* allmighty-autocomplete: *
	A simple autocomplete directive for AngularJS. <a href="https://github.com/JustGoscha/allmighty-autocomplete" target="_blank">More info</a>	
* moment-timezone: ^0.5.14
	Parse and display dates in any timezone. <a href="https://momentjs.com/timezone/" target="_blank">More info</a>
* js-timezone-detect: *
	This library allows you to detect a user's timezone from within their browser. <a href="https://github.com/iansinnott/jstz" target="_blank">More info</a>
