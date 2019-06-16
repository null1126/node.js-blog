const express = require('express')
const path = require('path')
const router = require('./router')
const bodyParser = require('body-parser')
const session = require('express-session')
//创建服务
const app = express()

//配置解析表单post请求体
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//配置session
app.use(session({
    secret:'ITcast', //配置加密字符串 他会在原有加密基础上再加ITcast 更加安全
    resave:false,
    saveUninitialized:true
}))

//开放资源
//app.use('/public/',express.static('./public/'))
app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))
app.use('/views/',express.static(path.join(__dirname,'./views/')))


//配置模板引擎
app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views/')) //默认就是这个路径

//把路由挂载到app中
app.use(router)

//绑定端口 启动服务
app.listen(3000,()=>{
    console.log('服务器启动成功。。。')
})
