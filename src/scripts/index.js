
'use strict';

//蜂鸟UI样式
require('fnui.css');
//应用样式
require('./../styles/app.css');


//应用入口
require('./app');
//路由配置
require('./router');
//service配置
require('./service');

//directive
require('./directives/goTop');

//controller配置 可能存在多个
require('./controllers/main');