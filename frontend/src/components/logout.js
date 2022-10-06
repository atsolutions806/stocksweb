const logoutHandler=()=>{
    localStorage.removeItem("authToken")
    localStorage.removeItem("username")
    localStorage.removeItem("id")
    localStorage.removeItem("role")
    window.location='/login'
  }
  export default logoutHandler