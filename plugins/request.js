import axios  from "axios";

export const request = axios.create({
  baseURL:"https://conduit.productionready.io"
})

//  通过插件机制获取到上下文对象(query,params,req,res,app,store)
// 插件到处函数必须作为default 成员
export default ({store})=>{
  request.interceptors.request.use(function(config){
    const {user} = store.state
    if(user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  },function(error){
    // 如果请求失败(此时请求还没有发出去) 就会进入这里
    return Promise.reject(error)
  })
  
}
