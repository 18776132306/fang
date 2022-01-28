//导入邮箱发送模块
const nodemailer = require('nodemailer');
//导入全局配置，拿到邮箱的配置
const {email_config, email_option} = require('../config')
//根据配置初始化邮箱发送模块
const email_init = nodemailer.createTransport(email_config);
//TODO:邮箱发送接口
//TODO：bug未修复 promise对象找一下。我没有找到
module.exports =async (email, message) => {
    const option = {
        ...email_option,
        to: email,
        html: `<p>您的验证码为：${message}</p>`
    }
    return await new Promise((resolve, reject) => {
        email_init.sendMail(option, (err, results) => {
            if (err) {
                return reject(err);
            }
            return results;
        })
    })
}
