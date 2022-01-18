/**
 * 验证是否是登录的中间件
 */

import { state } from "../store"

export default function ({store,redirect}) {
  console.log("-_____====>>>>",store.state.user)
  if(!store.state.user) {
    return redirect("/login")
  }
}