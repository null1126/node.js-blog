const express = require('express')
const router = express.Router()
const Users = require('./models/users')
const md5 = require('blueimp-md5')   //对密码进行加密
/**
 * 渲染首页
 */
router.get('/', function (req, res) {
    res.render('index.html', {
        user: req.session.user
    })
})

/**
 * 渲染登录页面
 */
router.get('/login', function (req, res) {
    res.render('login.html')
})

/**
 * 实现登录功能
 */
router.post('/login', function (req, res) {
    //1.拿到post请求体数据
    //2.验证用户是否存在
    //存在就验证用户  不存在就提醒注册
    //3.响应
    var body = req.body
    Users.findOne({
        email: body.email
    }, function (err, user) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                maessage: '服务器错误'
            })
        }
        //不存在该用户
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                maessage: '没有找到用户'
            })
        }

        //存在该用户 验证邮箱和密码
        if (user.email === body.email && user.password === body.password) {
            //登录成功记录session
            req.session.user = user

            res.status(200).json({
                err_code: 0,
                message: 'ok'
            })

        //密码或邮箱错误
        }else{
            return res.status(200).json({
                err_code: 1,
                maessage: '邮箱或密码错误'
            })
        }
    })
})

/**
 * 渲染注册页面
 */
router.get('/register', function (req, res) {
    res.render('register.html')
})

/**
 * 实现注册功能
 */
router.post('/register', function (req, res) {
    //1、获取表单数据
    //2、操作数据库
    //判断用户是否存在 存在就不允许注册 不存在创建新用户
    //3、发送响应   
    var body = req.body
    Users.findOne({
        //或条件查询
        $or: [{
                email: body.email
            },
            {
                nickname: req.nickname
            }
        ]
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                err_code: 500, //服务端错误
                message: '服务端错误'
            })
        }
        if (data) {
            //邮箱或者昵称已存在
            return res.status(200).json({
                err_code: 1,
                message: '昵称或邮箱已存在'
            })
        }
        //对密码进行 md5 重复加密
        body.password = md5(md5(body.password))
        new Users(body).save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    err_code: 500, //服务端错误
                    message: '服务端错误'
                })
            }
            //注册成功，使用Session记录用户的登录状态
            req.session.user = user //注册的用户

            //Express提供了一个响应方法：json
            //该方法接收一个对象作为参数，会自动将对象转化为字符串再发给浏览器
            res.status(200).json({
                err_code: 0,
                message: 'ok'
            })
        })
    })
})


/**
 * 退出登录
 */
router.get('/logout',function(req,res){
    //清除登录状态
    req.session.user = null
    //重定向到登录页
    res.redirect('/login')

})



//导出router
module.exports = router