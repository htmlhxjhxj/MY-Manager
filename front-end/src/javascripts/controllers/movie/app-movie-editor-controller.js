
import appMovieEditor from '@views/routes/app-movie-editor.html'
import angel from '@utils/angel'
import { postMovieItem, getMovieItem, updateMovieItem } from '@models/movie-model'

// import Simditor from 'simditor'

let img = '' // 准备上传的图片的路径
let editor = null
const render = async (req, res, next) => {
    // 先获取对应的电影详情数据，显示在页面中
    let detail = await getMovieItem(req.params.id)
    res.render(template.compile(appMovieEditor)({
        detail
    }))
    // 初始化日历插件
    $('#datepicker').date_input()
    // 初始化富文本编辑器
    
    editor = new Simditor({
        textarea: $('#item-description'),
        imageButton: ['upload'],
        upload: {
            url: '/api/v1/file/description/img',
            fileKey: 'movieImage',
            leaveConfirm: '正在上传文件..'
        }
    });
    editor.setValue(detail.fullDescription)

    bindEvents(req.params.id) // 绑定各种事件
}

function bindEvents (id) {
    // 发布电影讯息
    $('#publish-form').submit(async function(e){
        e.preventDefault()

        let title = $('#item-title').val()
        // let description = $('#item-description').val()
        let description = editor.getValue()
        let star = $('#item-star').val()
        let showTime = $('#datepicker').val()
        let data = await updateMovieItem({
            title, description, star, showTime, img, id
        })
        // // 发布成功后回到列表
        // if ( data ) {
        //     angel.emit('go', '/movie/items')
        // }
    })


    // 上传图片具体逻辑
    // 点击按钮上传图片
    $('.img-btn').click(function() {
        // 触发上传图片input的click方法
        $('#item-img').trigger('click')
    })
    // 当用户选择好图片之后
    $('#item-img').change(function(e) {
        // 将图片内容转换为form-data的二进制格式，post到后端
        uploadImage(this)
    })
}

// 上传图片业务逻辑  action
function uploadImage (inp) {
    let formData = new FormData()
    // 第一个参数为上传的字段
    formData.append('movieImage', inp.files[0])
    $.ajax({
        url: '/api/v1/file/upload/img',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
    }).done((res) => {
        if ( res.code === 501 ) {
            $.Toast('Warning', res.msg, 'warning')
            return false;
        }
        img = 'http://10.60.18.150:3000' + res.data.img
        $('.publish-img-box').removeClass('hidden').find('img').attr('src', img)
        $.Toast('Success', '图片上传成功', 'success')
    }).fail((error) => {
        $.Toast('Danger', '上传出错', 'error')
    })
}

export default {
    render
}