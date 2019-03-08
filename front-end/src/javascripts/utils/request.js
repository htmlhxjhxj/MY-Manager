


const request = (options) => {
    return new Promise((resolve, reject) => {
        // 自动携带token
        if ( !options.data ) {
            options.data = { token: localStorage.token }
        } else {
            options.data.token = localStorage.token
        }
        
        $.ajax({
            ...options,
            success: (res) =>  {
                if ( res.code >= 200 && res.code < 300 || res.code === 304 ) {
                    if ( res.code === 207 ) {
                        $.Toast('Warning', '请重新登录', 'warning')
                        setTimeout(() => {
                            location.href = '/admin.html'
                        }, 1000)
                    } else  {
                        // 成功处理
                        $.Toast('Success', '数据请求成功', 'success')
                    }      
                    resolve(res.data)
                } else {
                    // 除请求失败处理
                    $.Toast('Warning', '数据请求失败', 'warning')
                    resolve(null)
                }
            },
            error (error) {
                //做error的处理
                $.Toast('Danger', '请求出错', 'error')
                console.log('error', error)
                reject(error)
            }
        })
    })
}

export default request