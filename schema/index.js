//导入定义验证规则的包
const joi = require('joi');
const {svg_config} = require('../config')
//定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
//密码 ^ 开头 $结尾 [\S]非空 {6,12}6到12位
const password = joi.string().pattern(/^[\S]{6,12}$/).required();
//图形验证规则
const svg = joi.string().alphanum().min(svg_config.size).max(svg_config.size).required();
//邮箱验证规则
const email = joi.string().pattern(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/).required();
//邮箱验证码验证规则
const email_value = joi.string().alphanum().max(6).min(6).required();

//导出账号注册验证规则
exports.get_user_verify = {
    body: {
        username, password, svg,email,email_value
    }
}
//导出账号登录验证规则
exports.user_verify={
    body:{
        username,password,svg
    }
}
//导出邮箱验证规则
exports.email_verify = {
    body: {
        email, email_value, svg
    }
}
//导出邮箱验证规则
exports.email_verify= {
    query: {
        email, svg
    }
}

