const express = require('express');

// 创建路由对象
const router = express.Router();

//导入验证数据的局部中间件
const express_joi = require('@escook/express-joi')
//导入自定义验证规则模块
const {user_verify} = require('../schema')

//函数处理模块
const {get_user, login, svg,email} = require('./hander');

// 注册新用户
router.post('/api/get_user', express_joi(user_verify), get_user)
    // 图形验证接口
    .get('/api/svg', svg)
    //邮箱验证接口
    .get('/api/email', email)
    // 登录
    .post('/api/login', express_joi(user_verify), login);

// 推送路由逻辑
module.exports = router;
