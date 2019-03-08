const usersModel = require('../../models/users')
const fs = require('fs')
const { Encrypt, Decrypt } = require('../../modules/crypto')

const register = async (req, res, next) => {
    // 查看是否已经有这个用户
    // 查看用户名是否已存在   
    let usernameExist = await usersModel.checkAlready({ username: req.body.username })
    if ( usernameExist.length ) { // 已经有用户存在了
        next('username exist')
        return false
    }

    // 查看昵称是否已存在
    let nicknameExist = await usersModel.checkAlready({ nickname: req.body.nickname })
    if ( nicknameExist.length ) { // 已经有昵称存在了
        next('nickname exist')
        return false
    }
    
    // 开始注册
    try {
        await usersModel.register(req.body)
        next('success')
    } catch (e) {
        console.log(e)
        next('error')
    }
}

const login = async (req, res, next) => {
    let text = Decrypt(req.cookies.mark)
    if ( req.body.code.toLowerCase() !== text ) {
        // 验证码不正确
        next('code wrong')
        return false
    }

    let usernameExist = await usersModel.checkAlready({ username: req.body.username })
    if ( !usernameExist.length ) { // 没有用户
        next('username unexist')
        return false
    }
    // 密码错误
    if ( usernameExist[0].password !== req.body.password ) {
        next('unreal password')
        return false;
    }
    // 登录成功，存入session
    req.session.user = {
        uid: usernameExist[0]._id,
        username: usernameExist[0].username,
    }
    next('success')
}
// 登录验证
const auth = (req, res, next) => {
    if ( req.session.user ) {
        next('success')
        return false
    }
    next('error')
}

// 获取用户信息
const info = async (req, res, next) => {
    if ( req.session.user ) {
        let usernameExist = await usersModel.checkAlready({ 
            username: req.session.user.username 
        })
        let item = Object.assign({}, usernameExist[0]._doc)
        delete item.password
        res.responseData = item
        next('success')
    } else {
        next('not login')
    }
    
}


module.exports = {
    register,
    login,
    auth,
    info
}