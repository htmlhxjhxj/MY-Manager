
import '@styles/index.scss'
import router from  '@router'
import indexController  from '@controllers/index-controller'
import { userLoginAuthAction } from '@modules/auth'

userLoginAuthAction()
        .then(res => { // 登录成功
            indexController.render()
            router.init()
        }).catch(err => {
            console.log('catch', err)
            $.Toast('Warning', '请登陆后进入', 'warning')
            setTimeout(() => {
                window.location.href = '/admin.html'
            }, 1000)
        })




// 埋点
// let count = 0
// $('body').on('click', '.sidebar-toggle', function () {
//     count ++;
//     console.log(count)
// })