//导入邮箱发送模块
const nodemailer = require('nodemailer');
//导入全局配置，拿到邮箱的配置
const {email_config, email_option} = require('../config')
//根据配置初始化邮箱发送模块
const email_init = nodemailer.createTransport(email_config);
//TODO:邮箱发送接口
module.exports = (email, message) => {
    const option = {
        ...email_option,
        to: email,
        html: `<p>您的验证码为：${message}</p>`
    }
    return email_init.sendMail(option);
}
