const express = require('express');

// 创建路由对象
const router = express.Router();

//导入验证数据的局部中间件
const express_joi=require('@escook/express-joi')
//导入自定义验证规则模块
const {verify}=require('../schema')

//函数处理模块
const {get_user,login}=require('./hander');

// 注册新用户
router.post('/get_user',express_joi(verify), get_user);

// 登录
router.post('/login', login);

// 推送路由逻辑
module.exports = router;
