const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true });

// 用户信息 Schema （规定文档的格式）
var userItemSchema = new mongoose.Schema({
    username: String,
    password: String,
    nickname: String,
    avatar: String
});
// 单数会自动加s （集合）
var Users = mongoose.model('users', userItemSchema);

// 检验是否已存在
const checkAlready = (option) => {
    console.log(option, 1)
    return Users.find(option)
}
// 注册
const register = (params) => {
    params.avatar = params.avatar || '/images/users/avatar/default-avatar.jpg'
    return Users.insertMany(params)
}

module.exports = { 
    register,
    checkAlready
}