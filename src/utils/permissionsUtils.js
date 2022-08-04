/*
 * @Author: zzt
 * @Date: 2021-01-11 16:23:01
 * @LastEditTime: 2021-02-21 14:43:49
 * @Description:
 */
// 验证权限工具类
export function getPermissionUtils(name) {
    let result = false;
    let userPermissionsArr = JSON.parse(sessionStorage.getItem('userPermissions'))
        ? JSON.parse(sessionStorage.getItem('userPermissions'))
        : [];

    let firstPermission = _.head(userPermissionsArr);
    if (firstPermission && firstPermission == '*:*:*') {
        //超级管理员默认为全部权限
        return true;
    }
    // 不要使用map 推荐使用for 找到对应的权限后 break
    for (let i = 0; i < userPermissionsArr.length; i++) {
        let item = userPermissionsArr[i];
        if (item == name) {
            result = true;
            break;
        }
    }

    // userPermissionsArr.map((ele) => {
    //     if (ele == name) {
    //         result = true;
    //     }
    // });
    return result;
}
