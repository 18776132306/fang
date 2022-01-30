const express = require('express');

// 创建路由对象
const router = express.Router();

//导入验证数据的局部中间件
const express_joi = require('@escook/express-joi')
//导入自定义验证规则模块
const {get_user_verify, user_verify, email_verify} = require('../schema')

//函数处理模块
const {get_user, user_login, svg, email, email_login} = require('./hander');

// 注册新用户
router.post('/api/get_user', express_joi(get_user_verify), get_user)
    // 图形验证api
    .get('/api/svg', svg)
    //邮箱验证api
    .get('/api/email', email)
    // 账号密码登录api
    .post('/api/user_login', express_joi(user_verify), user_login)
    //邮箱登录api
    .post('/api/email_login', express_joi(email_verify), email_login)
// 推送路由逻辑
module.exports = router;
