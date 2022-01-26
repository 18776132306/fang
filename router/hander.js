//倒入数据库操作模块
const db = require('../db');
//导入bcrypt加密模块
const bcrypt = require('bcryptjs');

// 注册用户的处理函数
exports.get_user = async (req, res) => {
    // 接收表单数据
    const {username, password} = req.body;
    //  账号名查询语句
    const sql_query = `select * from user where username='?'`
    const data_query = await new Promise((resolve, reject) => {
        db.query(sql_query, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results)
        });
    });
    //错误
    if (data_query instanceof Error) {
        res.cc(data_query);
        return console.log(`账号查询失败:${data_query.message}`);
    }
    //TODO:是否存在用户名
    if (data_query.length>0){
        return res.cc('用户名已存在');
    }
    //TODO：用户可以使用
    //bcrypt加密密码
    const password_encrypt=bcrypt.hashSync(password,12);
    //插入新用户语句
    const sql_add = `insert into user set ?`
    const data_add = await new Promise((resolve, reject) => {
        db.query(sql_add,{username:username, password:password_encrypt}, (err, results) => {
            if (err) {
                return reject(err)
            }
            console.log(results)
            resolve(results)
        });
    });
    //错误
    if (data_add instanceof Error){
        res.cc(data_add);
        return console.log(`插入用户失败:${data_add.message}`);
    }
    //数据库影响行数是否为1
    if (data_add.affectedRows!==1){
        return res.cc('注册失败，请稍后重试');
    }
    //TODO:注册用户成功
    res.cc('注册成功',200);
}

// 登录的处理函数
exports.login = (req, res) => {
    res.send('login OK')
}
