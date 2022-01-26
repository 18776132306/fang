// 创建数据库连接对象
const mysql = require("mysql")

const db = mysql.createConnection({
    host: 'dekunlu.top',
    user: 'fang',
    password: 'fang',
    database: 'fang'
});
db.connect((err)=>{
    if (err) {
        return console.log(`DB连接失败:${err.message}`);
    }
    console.log('DB 连接成功')
})
// 向外共享 db 数据库连接对象
module.exports = db
