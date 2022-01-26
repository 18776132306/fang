const express = require('express');
const app = express();

//注册cors全局中间件
const cors=require('cors');
app.use(cors());

//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }));

//封装处理返回报错
app.use((err,res,next)=>{
    res.cc=(err,statue=401)=>{
        //err is obj || error string
        //status默认值为401表示失败
        res.send({
            statue,
            message:err instanceof Error?err.message:err
        })
    }
    next();
});

//注册路由全局中间件
const router=require('./router');
app.use(router);


//导入定义验证规则的包
const joi = require('joi');
//定义错误级别的中间件
app.use((err,req,res,next)=>{
    //验证失败，导致报错
    if (err instanceof joi.ValidationError)return  res.cc(err)
    res.cc('未知错误')
    next()
})

app.listen(8080, function () {
    console.log('api server running at http://127.0.0.1:8080');
});
