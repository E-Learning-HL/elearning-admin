import { MAP_ACCESS, SUPER_ADMIN, ADMIN } from './const/const';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(
  initialState: { currentUser?: API.CurrentUser; permission?: any } | undefined,
) {
  const { currentUser } = initialState ?? {};


  if(currentUser?.role === "SUPER_ADMIN")
    currentUser.permission = SUPER_ADMIN
  else if(currentUser?.role === "ADMIN")
    currentUser.permission = ADMIN


  console.log("current", currentUser)


  let newAccess: any[] = [];
  if (currentUser?.permission) {
    currentUser?.permission.map((e: any) => newAccess.push(MAP_ACCESS.get(e)));
  }
  console.log("newAccess", newAccess)

  return {
    // canAdmin: currentUser && currentUser.access === 'admin',
    normalRouteFilter: (route: any) => newAccess.includes(route.path),
  };
}
