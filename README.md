# 猫眼电影信息管理系统前后端项目

采取的开发结构（数据渲染采用BSR）是前后端分离开发（部署的时候也是前后端分离）

### 前端架构

主体结构：RMVC ； SPA + MPA （index + admin）

View: 视图编译采用template-web.js（artTemplate）

Router: SME-Router

环境搭建：

采用Webpack 4.0开发

UI框架：AdminLTE

JS编译处理：

webpack 4 + babel 7

[babel项目](https://github.com/babel/babel-loader)
cnpm i babel-loader @babel/core @babel/runtime @babel/plugin-transform-runtime @babel/preset-env -D

{
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime']
      }
    }
}

SCSS编译处理

利用sass-loader来编译scss代码为css代码（node-sass）
利用css-loader找到引入在js中css代码
利用style-loader将其拿走放入到style标签中（head）


### 后端架构

因为采用的开发与部署结构都是前后端分离，所以，Node.js服务器只负责提供一些API的请求

采用RMVC结构：

Router 根据前端的不同的请求，分发给控制器

Model 提供数据或者与数据相关方法 （连接数据库，操作数据库）

Controller 根据不同请求做出不同的处理之后响应

View 表现数据到响应时的展示


---

前端开发的时候，与服务器进行数据交互之后往往需要对此次请求与请求的结果做出成功或者失败的处理，所以前端一般会将请求抽离出来单独配置, 所以后端给前端响应的数据格式统一化之后能更方便前端的配置和使用, 所以我们可以尽可能的遵循某一种规范进行接口的设计：

[resetful API 接口设计规范](https://learnku.com/laravel/t/13740/resetful-api-design-specification)

返回的数据格式： json

{
  code: 200,
  msg: '请求成功',
  data: []
}

前端将文件信息转换为FormData数据后提交给后端，后端利用multer工具完成图片上传的操作, 先将图片更改名字（防止重名）后放入指定的位置，将图片的路径返回给前端，前端整合真正的图片的地址和其他的表单信息集体提交之后保存在数据库中

利用smiditor富文本编辑器实现了详情的多元化编辑

/:param/:param
利用sme-router路由传参实现了详情页的跳转，先指定路由接收参数，再去传递，传递进去之后利用req.params来取出参数


数据库中不会存储任何文件，存储的是文件路径

svg-capture实现了验证码

### 登录鉴权 


主要是在多个api调用或其他应用场景中判断用户是否登录，目前流行的主要有两种方式

Session/Token 

如果仅仅是让前端存储一些cookie，自行验证的话，很容易被攻击（恶意脚本可以很轻易进行cookie的模拟，这种攻击手段叫做cookie钓鱼）

[token与session的区别](https://segmentfault.com/a/1190000015881055)

session:

前端进行登录的时候，后端验证登录成功后，将一些讯息存储在服务端（数据库，本地文件），服务端通过种cookie的方式（在响应头设置set-cookie字段后，浏览器会自动存储cookie），前端在进行登录验证的时候，发送请求到服务端，服务端对比请求头中携带的cookie与本地存储的session，如果通过就验证成功

总结：后端存储，后端对比

缺点： 因为session是存在服务器本地的，如果一个应用需要和多个服务器进行交互，会导致需要让session在多个服务器种有一种共享的机制 - Redis 分布式数据库，怎么解决这个问题都会导致成本变高

token(令牌): 

前端登录的时候，后端验证登录成功后，生成一个token发送给前端（可以种cookie），客户端再进行用户验证的时候主动将token携带到任意相关服务端，服务端进行解析通过后做i出对应的响应

一般的token生成都依据与流行了json-web-token规范，规范约束了token生成方式和组成部分


总结：服务端生成令牌发给客户端，客户端存储令牌，服务器只对比



