import request from '@utils/request'

const userLoginAuth = () => {
    return $.ajax({
        url: '/api/v1/users/auth'
    })
}

const getUserInfo = () => {
    return request({
        url: '/api/v1/users/info'
    })
}

const exit = () => {
    return request({
        url: '/api/v1/users/exit'
    })
}

export {
    userLoginAuth,
    getUserInfo,
    exit
}