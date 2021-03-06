const express = require('express')
const router = express.Router()
const movieController = require('../controllers/movie')
const { response, authLogin } = require('../middlewares')


// 获取电影信息
router.get('/items', movieController.getMovieItems, response)
// 发布电影信息
router.post('/item', authLogin, movieController.postMovieItem, response)
router.get('/item/:id', movieController.getMovieItem, response)
// 删除
router.delete('/item',authLogin, movieController.deleteMovieItem, response)
// 更新
router.put('/item',authLogin, movieController.updateMovieItem, response)

module.exports = router