/**
 * Created by zjfh-chent on 2017/1/11.
 */

//加载该页面的样式
require("./../../styles/main.css");

//加载应用入口
var app = require('./../app.js');

app.controller('MainCtrl',function ($scope) {
    $scope.name = "hello world";
});