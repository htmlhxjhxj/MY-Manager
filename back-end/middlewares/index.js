const status = require('../modules/status')
const multer = require('multer')
const path = require('path')
const svgCaptcha = require('svg-captcha')
const { Encrypt, Decrypt } = require('../modules/crypto')
// 处理响应的数据格式的
const jsonFormat = (req, res, next) => {
    res.setHeader('encoding','utf-8')
    
    res.setHeader('content-type', 'application/json; charset=utf8')
    next()
}

// 处理响应
// state 此次请求的状态
const response = (state, req, res, next) => {
    res.render('default', {  
        data: JSON.stringify(res.responseData || {}), 
        status: status[state]
    })
}

// 验证码
const getCode = (req, res, next) => {
    var codeConfig = {
        size: 5,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 44 
    }
    var captcha = svgCaptcha.create(codeConfig);
    // req.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
    let text = captcha.text.toLowerCase()  // 真正的验证码内容
    
    let mark = Encrypt(text) // 加密之后的标记
    
    var codeData = {
        img:captcha.data, // svg图片
        mark: mark
    }
    
    res.send(codeData)
}





// 接收图片
const uploadImage = (req, res, next) => {
    // 控制图片存储位置与信息
    var storage = multer.diskStorage({
        // 控制存储位置
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../public/images/upload'))
        },
        filename: function (req, file, cb) {
            // 处理存储时的文件名字
            let extname = path.extname(file.originalname)
            let basename = path.basename(file.originalname, extname)
            let filename = basename + '-' + Date.now() + extname
            // 挂载在req.body上方便传递给下一个中间件
            req.body.img = '/images/upload/' + filename
            cb(null, filename)
        }
    })
    // 文件类型过滤
    let fileFilter = (req, file, cb) => {
        let flag = file.mimetype.startsWith('image/')
        cb(flag ? null : '请上传正确的图片格式', flag)
    }
    
    let upload = multer({ storage, fileFilter }).single('movieImage') // 上传文件的中间件

    upload(req, res, (err) => {
        if ( err ) {
            req.error = err
            next()
        } else {
            next()
        }
    })

    
}

module.exports = {
    jsonFormat,
    response,
    uploadImage,
    getCode
}