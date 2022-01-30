// 倒入数据库操作模块
const db = require('../db');
// 导入bcrypt加密模块
const bcrypt = require('bcryptjs');
// 导入jsonwebtoken，生成token的包
const jwt = require('jsonwebtoken');
// 导入全局配置文件,拿到需要的token配置
const {token_config, svg_config} = require('../config');
// token配置解构
const {jwtSecretKey, expiresIn} = token_config;
//导入图形验证模块
const svg_captcha = require('svg-captcha');
//导入封装好的redis图形验证存储模块
const {svg_set, svg_get} = require('../redis/redis_svg');
//导入封装好的redis邮箱验证存储模块
const {email_set, email_get} = require('../redis/redis_email');
//导入email发送模块
const email_send = require('../email')
//导入随机数生成模块
const stringRandom = require("string-random")
// 图形验证的处理函数
exports.svg = async (req, res) => {
    //通过配置创建svg对象
    const {text, data} = svg_captcha.create(svg_config);
    //redis存入生成的数据
    console.log(req)
    const svg_query = await svg_set(req.ip, text);
    //错误
    if (svg_query !== 'OK') {
        res.cc(svg_query);
        return console.log('svg缓存数据库存储失败', svg_query);
    }
    //缓存数据库存储成功，响应客户端图形码
    res.cc(data, 200);
}
//邮箱发送的处理函数
exports.email = async (req, res) => {
    //接收表单数据
    const {email} = req.query;
    //生成随机验证码
    const email_value = stringRandom(6);
    //TODO:将6位验证存入缓存数据库中
    const email_query = await email_set(email, email_value);
    //错误
    if (email_query !== 'OK') {
        res.cc(email_query);
        return console.log('email缓存数据库存储失败', email_query);
    }
    //TODO:存储成功，向客户发送验证码
    const email_send_query = await email_send(email, email_value);
    //错误
    if (email_send_query instanceof Error) {
        res.cc(email_send_query);
        return console.log('email发送失败', email_send_query);
    }
    //TODO：发送成功
    res.cc('发送成功', 200)
}
// 注册用户的处理函数
exports.get_user = async (req, res) => {
    // 接收表单数据
    const {username, password, email, email_value, svg} = req.body;
    //TODO:查询图形验证码是否正确
    const svg_value_query = await svg_get(req.ip);
    //错误
    if (svg_value_query !== svg) {
        res.cc('图形验证码错误');
        return console.log('缓存数据库查询失败', svg_value_query)
    }
    //图形验证码正确
    //TODO:查询邮箱验证码是否正确
    const email_value_query = await email_get(email);
    //错误
    if (email_value_query !== email_value) {
        res.cc('邮箱验证码错误');
        return console.log('缓存数据库查询失败', email_value_query)
    }
    //  账号名查询语句
    const sql_query = `select username from user where username=?`
    // 执行查询
    const data_query = await db(sql_query, username)
    // 错误
    if (data_query instanceof Error) {
        res.cc(data_query);
        return console.log(`账号查询失败:${data_query.message}`);
    }
    //TODO:是否存在用户名
    if (data_query.length > 0) {
        return res.cc('用户名已存在');
    }
    //TODO：用户可以使用
    //bcrypt加密密码
    const password_encrypt = bcrypt.hashSync(password, 12);
    //插入新用户语句
    const sql_add = `insert into user set ?`
    const data_add = await db(sql_add, {username, password: password_encrypt, email})
    //错误
    console.log(data_add)
    if (data_add instanceof Error) {
        res.cc(data_add);
        return console.log(`插入新用户失败:${data_add.message}`);
    }
    //数据库影响行数是否为1
    if (data_add.affectedRows !== 1) {
        return res.cc('注册失败，请稍后重试');
    }
    //注册用户成功
    res.cc('注册成功', 200);
}
// 账号密码登录的处理函数
exports.user_login = async (req, res) => {
    //接收表单数据
    const {username, password, svg} = req.body;
    //TODO:查询图形验证码是否正确
    const svg_value = await svg_get(req.ip);
    //错误
    if (svg_value !== svg) {
        res.cc('图形验证码错误,请重新输入');
        return console.log('svg缓存数据库查询失败', svg_value)
    }
    //图形验证码正确
    //定义username查询sql语句
    const sql_query_username = `select * from user where username=?`
    //执行sql，根据用户名查询用户信息
    const data_query_username = await db(sql_query_username, username);
    //错误
    if (data_query_username instanceof Error) {
        res.cc(data_query_username);
        return console.log(`账号查询失败:${data_query_username.message}`);
    }
    //TODO:是否存在用户名
    if (data_query_username.length !== 1) {
        return res.cc('用户名不存在');
    }
    //TODO:用户存在
    //查询密码
    //定义查询sql语句
    const sql_query_password = `select password from user where username=?`
    //执行密码查询语句
    const data_query_password = await db(sql_query_password, username);
    //错误
    if (data_query_password instanceof Error) {
        res.cc(data_query_password);
        return console.log(`账号查询失败:${data_query_password.message}`);
    }
    //TODO:判断密码是否正确
    if (!bcrypt.compareSync(password, data_query_password[0].password)) {
        //密码错误
        return res.cc('密码错误', 403);
    }
    //TODO:登录成功
    //数据脱敏
    const user = {...data_query_username[0], password: '', user_pic: ''};
    //生成token
    const token_str = jwt.sign(user, jwtSecretKey, {expiresIn});
    //返回token
    res.cc('登录成功', 200, `Bearer${token_str}`);
}
//邮箱登录的处理函数
exports.email_login = async (req, res) => {
    //接收表单数据
    const {email, email_value} = req.body;
    //定义email查询sql语句
    const sql_query_email = `select * from user where email=?`
    //执行sql，根据email查询用户信息
    const email_query = await db(sql_query_email, email);
    //错误
    if (email_query instanceof Error) {
        res.cc(email_query);
        return console.log(`email查询失败:${email_query.message}`);
    }
    //TODO:是否存在邮箱
    if (email_query.length !== 1) {
        return res.cc('用户不存在');
    }
    //用户存在
    //TODO：验证邮箱验证码是否正确
    const email_value_query = await email_get(email);
    //错误
    if (email_value_query !== email_value) {
        res.cc('邮箱验证码错误');
        return console.log('缓存数据库查询失败', email_value_query)
    }
    //TODO:登录成功
    //数据脱敏
    const user = {...email_query[0], password: '', user_pic: ''};
    //生成token
    const token_str = jwt.sign(user, jwtSecretKey, {expiresIn});
    //返回token
    res.cc('登录成功', 200, `Bearer${token_str}`);
}
