const mongoose = require('mongoose')
//拿到mongoose的架构 规范表(构造函数)
const Schema = mongoose.Schema
//连接数据库(连接的数据库不需要存在，在插入第一条数据的时候自动创建 StuUser为数据库名称)
mongoose.connect('mongodb://localhost/Userdb', {useNewUrlParser: true});

const UserTab = new Schema({
    email:{
        type:String,
        required:true
    },
    nickname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    //创建时间
    created_time:{
        type:Date,
        default:Date.now  //调用当前时间  不能用Date.now() 因为会及时调用
    },
    //最后一次修改时间
    last_modified_time:{
        type:Date,
        default:Date.now 
    },
    //头像
    avatar:{
        type:String,
        default:'/public/img/avatar-max-img.png'
    },
    //个人介绍
    bio:{
        type:String,
        default:''
    },
    //性别
    gender:{
        type:Number,
        enum:[-1,0,1],   //枚举 只能选择里面设置的数
        default:-1
    },
    //生日
    birthday:{
        type:Date
    },
    //状态
    status:{
        type:Number,
        //0 没有权限限制
        //1 不可以评论
        //2 不可以登录
        enum:[1,2],
        default:0
    }
})

module.exports = mongoose.model("User",UserTab)

