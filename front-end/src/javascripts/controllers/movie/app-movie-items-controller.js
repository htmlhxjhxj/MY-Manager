
import appMovieItems from '@views/routes/app-movie-items.html'
import appMovieItemsContent from '@views/routes/app-movie-items-content.html'
import { getMovieItems } from '@models/movie-model'


let pageSize = 10 // 页码数
let pageNo = 1 // 当前页数
let search = '' // 搜索字段
let pages = null // 页面信息
let sortBy = '' // 排序依据 publishTime / showTime
let sort = { // 排序规则
    publishTime: 0,
    showTime: 0
} //0 'normal'   1 'up' 2'down' 
// 控制排序的按钮们
let $sortBtns = null
let $sortShowBtn = null
let $sortPublishBtn = null

const render = async (req, res, next) => { 
    // 渲染列表主体结构
    res.render(template.compile(appMovieItems)())
    // 控制排序的按钮们
    $sortBtns = $('.sort-btn')
    $sortShowBtn = $('.sort-btn--show')
    $sortPublishBtn = $('.sort-btn--publish')
    // 处理搜索逻辑
    searchHandler()
    // 处理排序逻辑
    sortHandler()
    await renderItems() // 初始渲染列表
    // 实例化分页器
    paginationHandler()
}
function sortHandler () { // 处理排序
    $sortBtns.click(async function () {
        sortBy = $(this).data('by')
        sort[sortBy] ++
        if ( sort[sortBy] > 2 ) sort[sortBy] = 0
        renderSortItems()
        pageNo = 1 // 因为是重新排序，所以需要恢复当前页数为1
        // 发送请求得到数据,重新渲染table
        await renderItems()
        paginationHandler()
    })
}
// 渲染排序按钮显示情况的
function renderSortItems () {
    let target = null
    switch ( sortBy ) {
        case 'publishTime': target = $sortPublishBtn; break;
        case 'showTime': target = $sortShowBtn; break;
    }
    $sortBtns.removeClass('btn-primary')
    if ( sort[sortBy] !== 0 ) target.addClass('btn-primary')

    // 给按钮换图标
    let icon = ''
    switch ( sort[sortBy] ) {
        case 0: icon = 'normal'; break;
        case 1: icon = 'up'; break;
        case 2: icon = 'down'; break;
    }


    target.find('i')
            .removeClass('fa-angle-up')
            .removeClass('fa-angle-down')
            .removeClass('fa-angle-normal')
            .addClass('fa-angle-' + icon)
}

// 搜索
function searchHandler() {
    $('#search-btn').click(async function () {
        let val = $('#table-search').val()
        if ( val === search ) return false
        search = val
        pageNo = 1 // 因为是重新搜索，所以需要恢复当前页数为1
        // 发送请求得到数据,重新渲染table
        await renderItems()
        paginationHandler()
    })
}
// 处理分页器
function paginationHandler () {
    $('#movie-items-pagination').createPage({
        pageNum: pages.totalPage,
        current: pageNo,
        backfun: function(e) {
            pageNo = e.current
            renderItems()
        }
    });
}

function renderItems() {
    // 获取电影列表数据
    return new Promise(async (resolve) => {
        let data = await getMovieItems({
            pageSize,
            pageNo,
            search,
            sortBy,
            sort: sort[sortBy]
        }) 
        pages = data.pages
        $('#movie-items-content').html(template.compile(appMovieItemsContent)({
                items: data.items
        }))
        resolve(data)
    })
}
 
export default {
    render
}