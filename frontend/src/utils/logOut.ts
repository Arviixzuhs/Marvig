export const logOut = () => {
  const token = localStorage.getItem('token')
  if (token) {
    localStorage.removeItem('theme')
    localStorage.removeItem('token')
    window.location.reload()
  }
}
