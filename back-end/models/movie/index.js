const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true });

// 电影item Schema （规定文档的格式）
var movieItemSchema = new mongoose.Schema({
    img: String,
    title:   String,
    star: String,
    showTime: Number,
    publishTime: Number,
    description: String,
    fullDescription: String
});
// 单数会自动加s （集合）
var Items = mongoose.model('item', movieItemSchema);

const getTotalPage = (query) => {
    return Items.find(query).count()
}

// 获取电影信息
// pageSize （每页几条）  pageNo 当前页数（非零自然数）
const getMovieItems =  async ({ 
    pageSize, 
    pageNo,
    search,
    sort,
    sortBy
}) => {
    // 搜索条件
    let query = search ? {
        title: new RegExp(search, 'g')
    } : {}
    let _sort = {}
    // 如果没有排序根据或者排序规则为0，就让_sort一直为空对象，不做排序处理
    if ( sortBy && (~~sort) ) _sort[sortBy] = sort === '2' ? -1 : 1
    
    // 页码信息
    let count = await getTotalPage(query)
    let pages = { 
        totalNo : count,
        totalPage : Math.ceil(count / pageSize)
    }
    return Items.find(query)
            .sort(_sort)
            .limit(~~pageSize) // 截取长度        
            .skip((pageNo - 1) * pageSize) // 从哪截取 确定起点
            .then(res => {
                return {
                    items: res,
                    pages
                }
            })
}


// 获取某个id对应的电影信息
const getMovieItemById =  (id) => {
    return Items.find({_id: id})
}

// 发布新电影
const postMovieItem =  (params) => {
    let html = params.description
    let formatHtml = html.replace(/<[^>]*>/g, '') // 没有标签的
    params.description = formatHtml.slice(0, 30) + '...'
    params.fullDescription = html // 完整描述
    return Items.insertMany(params)
}
// 删除
const deleteMovieItem = (id) => {
    return Items.remove({ _id: id })
}
// 更新电影信息
const updateMovieItem =  (params) => {
    let html = params.description
    let formatHtml = html.replace(/<[^>]*>/g, '') // 没有标签的
    params.description = formatHtml.slice(0, 30) + '...'
    params.fullDescription = html // 完整描述
    let id = params.id
    delete params.id
    // 去除空参数的影响
    for ( var key in params ) {
        if ( !params[key] ) delete params[key]
    }

    return Items.update({_id: id}, params)
}

module.exports = { 
    getMovieItems,
    postMovieItem,
    getMovieItemById,
    deleteMovieItem,
    updateMovieItem
}

// id , title, img, publishTime, showTime, description