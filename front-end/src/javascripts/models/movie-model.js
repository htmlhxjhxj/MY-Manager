
import request from '@utils/request'

// 获取电影信息
const getMovieItems = (data) => {
    return request({
        url: '/api/v1/movie/items',
        data
    })
}

// 发布电影信息
const postMovieItem = (data) => {
    return request({
        url: '/api/v1/movie/item',
        type: 'post',
        data,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    })
}

// 获取某个电影信息
const getMovieItem = (id) => {
    return request({
        url: '/api/v1/movie/item/' + id
    })
}
// 删除电影
const deleteMovieItem = (id) => {
    return request({
        url: '/api/v1/movie/item/',
        data: { id },
        type: 'delete'
    })
}
// 更新
const updateMovieItem = (data) => {
    return request({
        url: '/api/v1/movie/item',
        type: 'put',
        data,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    })
}

export  {
    getMovieItems,
    postMovieItem,
    getMovieItem,
    deleteMovieItem,
    updateMovieItem
}