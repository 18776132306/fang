// 创建数据库连接对象
const mysql = require("mysql");
//导入全局配置文件
const {mysql_config}=require('../config')
//创建数据库处理对象
const db = mysql.createConnection(mysql_config);
//判断是否连接成功
db.connect((err)=>{
    if (err) {
        return console.log(`DB连接失败:${err.message}`);
    }
    console.log('DB 连接成功')
})
// 向外暴露 db 数据库连接对象
module.exports = (sql_str,data)=>{
    return new Promise((resolve, reject) => {
        db.query(sql_str,data, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results)
        });
    });
}

