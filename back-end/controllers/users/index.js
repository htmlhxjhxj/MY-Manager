const usersModel = require('../../models/users')
const fs = require('fs')
const jwt = require('jsonwebtoken')
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
    // 存储 token   返回给前端
    let token = jwt.sign({
        uid: usernameExist[0]._id,
        username: usernameExist[0].username,
        rank: usernameExist[0].rank
    }, 'i love u')
    res.responseData = { 
        token: Encrypt(token),
        rank: usernameExist[0].rank
    }
    next('success')
}
// 登录验证
const auth = (tokenInfo, req, res, next) => {
    next('success')
}

// 获取用户信息
const info = async (tokenInfo, req, res, next) => {
    let usernameExist = await usersModel.checkAlready({ 
        _id: tokenInfo.uid
    })
    let item = Object.assign({}, usernameExist[0]._doc)
    delete item.password
    res.responseData = item
    next('success') 
}


module.exports = {
    register,
    login,
    auth,
    info
}