export function setAuthority(authority: string) {
  localStorage.setItem('nhakhoahub-authority', authority);
}
export function setInfo(id: string) {
  localStorage.setItem('nhakhoahub-user-info', id);
}
export function getInfo() {
  return localStorage.getItem('nhakhoahub-user-info');
}

export function getAuthority() {
  return localStorage.getItem('nhakhoahub-authority');
}
export function clearAuthority() {
  localStorage.removeItem('nhakhoahub-authority');
}
