/**
 * Created by zjfh-chent on 2017/1/9.
 */

var app = require('./app.js');
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.tpl.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .when('/order', {
            templateUrl: 'views/order.tpl.html',
            controller: 'OrderCtrl',
            controllerAs: 'order'
        })
        .when('/about', {
            templateUrl: 'views/about.tpl.html',
            controller: 'AboutCtrl',
            controllerAs: 'about'
        })
        .otherwise({
            redirectTo: '/'
        });
});