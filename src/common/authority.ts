export function setAuthority(authority: string) {
  localStorage.setItem('elearning-authority', authority);
}
export function setInfo(id: string) {
  localStorage.setItem('elearning-user-info', id);
}
export function getInfo() {
  return localStorage.getItem('elearning-user-info');
}

export function getAuthority() {
  return localStorage.getItem('elearning-authority');
}
export function clearAuthority() {
  localStorage.removeItem('elearning-authority');
}
