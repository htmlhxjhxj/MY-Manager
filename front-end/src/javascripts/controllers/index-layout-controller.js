import angel from '@utils/angel'
import { getUserInfo } from '@models'
import appHeader from '@views/layout/app-header.html'
import appNav from '@views/layout/app-nav.html'
import appContent from '@views/layout/app-content.html'

const render = async () => {
    let $wrapper = $('#app') // 主体容器
    let $wrapperHeader = $('#app .main-header') // 主体容器

    $wrapper.append(appContent) // 放入内容区域
    $wrapper.append(appNav) // 放入导航
    // 给左侧导航加点击事件
    $('.router-link').click(function () {
        let url = $(this).data('route') // 获取url
        angel.emit('go', url) // 进行跳转
    })

    // 获取用户信息，更改头部显示
    let data =  await getUserInfo()
    $wrapperHeader.html(template.compile(appHeader)({
        info: data
    })) // 放入头部
    $('.exit-btn').click(async function () {
        // 前端自己删除token，清除内存占用
        localStorage.removeItem('token')
        window.location.href = '/admin.html'
        // 前端跳转到登录
    })
    
}

export default {
    render
}