const cookieparser = process.server ? require("cookieparser") : undefined
//  在服务端渲染期间，运行的都是同一个实例，
// 为了防止数据冲突，务必把state 定义成一个函数，返回数据对象
export const state = ()=>{
  return {
    // 当前登录用户的登录状态
    user:null
  }
}

export const mutations = {
  setUser (state,data) {
    state.user = data
  },

  setAuth (state,data) {
    state.auth = data
  }
}

export const actions = {
  // nuxtServerInit 是一个特殊的action 方法
  // 这个action 会在服务端渲染期间自动调用
  // 主要作用是用来初始化容器数据，传递数据给客户端使用
  nuxtServerInit ({commit},{req}) {
    let auth = null
    // 如果请求头中有cookie 
    if(req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = JSON.parse(parsed.auth)
      } catch (err) {
        
      }
    }

    //  提交 mutations 修改state 状态
    commit('setUser',auth)
  }
}