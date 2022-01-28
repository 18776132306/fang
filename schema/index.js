//导入定义验证规则的包
const joi = require('joi');
const {svg_config}=require('../config')
//定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
//密码 ^ 开头 $结尾 [\S]非空 {6,12}6到12位
const password = joi.string().pattern(/^[\S]{6,12}$/).required();
//图形验证
const svg=joi.string().alphanum().min(svg_config.size).max(svg_config.size).required();

//定义验证验证注册和登录表单数据的规则对象

//导出账号密码验证规则
exports.user_verify={
    body:{
        username, password,svg
    }
}

