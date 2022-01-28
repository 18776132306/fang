// TODO:这里还需要想办法优化一下格式
//引入缓存数据库模块
const Redis = require('ioredis');
//获取通用配置
const {redisConfig} = require('../config');

//设置仓库号
redisConfig.db=1;
//将通用配置导入，创建缓存数据库对象
const client = new Redis(redisConfig)

//导出写入数据api
exports.email_set =(key, value, time=300) => {
    return client.set(key,value, 'EX', time);
}
//导出读取数据api
exports.email_get = async (key) => {
    return client.get(key);
}
