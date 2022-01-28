//一个全局配置文件
module.exports = {
    // token基本配置 密匙/过期时间
    token_config: {
        jwtSecretKey: 'this is a housing project',
        expiresIn: '24h'
    },
    //redis基本配置 端口号/地址/密码/第几个数据库
    redisConfig: {
        port: 6379,
        host: 'dekunlu.top',
        password: '123456'
    },
    //图形验证基本配置
    svg_config: {
        size: 4,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 5, // 干扰线条的数量
        height: 40,
        inverse: false,
        fontSize: 40,
    },
    //数据库基本配置
    mysql_config: {
        host: 'dekunlu.top',
        user: 'fang',
        password: 'fang',
        database: 'fang'
    }
}
