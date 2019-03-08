import { getMovieItem, deleteMovieItem } from '@models/movie-model'
import appMovieDetail from '@views/routes/app-movie-detail.html'
import angel from '@utils/angel'
const render = async (req, res, next) => {  
    let itemId = req.params.id // 详情对应的电影_id
    let data = await getMovieItem(itemId)
    res.render(
        template.compile(appMovieDetail)({
            detail: data
        })
    )

    // 返回
    $('.back').click(function(){
        angel.emit('back')
    })
    $('.delete-btn').click(async function() {
        await deleteMovieItem(itemId)
        angel.emit('back')
    })
    $('.editor-btn').click(async function() {
        angel.emit('go', '/movie/editor/'+itemId)
    })
}
 
export default {
    render
}