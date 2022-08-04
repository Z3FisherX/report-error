import * as network from '@/utils/request';
import api from './api';
// import _ from 'lodash';
import qs from 'qs';

/**
 * 获取组织机构树
 * @param {*} currentPage
 */
export function getDepListAll() {
    let requestUrl = api.appMain.applicationDirectory + api.commonServices.getDepTreeData;
    return new Promise((resolve, reject) => {
        network
            .getData(requestUrl, null, ['data'])
            .then((resData) => {
                let data = resData[0];
                if (data && data.length > 0) {
                    data = JSON.parse(JSON.stringify(data).replace(/id/g, 'value'));
                }
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * 获取角色列表
 */
export function getRoleList() {
    let requestUrl = api.appMain.applicationDirectory + api.commonServices.getRoleList;
    let requestParam = {
        pageSize: 9999,
        pageNum: 1,
        beginTime: '',
        endTime: ''
    };

    return new Promise((resolve, reject) => {
        network
            .getData(requestUrl, requestParam, ['data'])
            .then((data) => {
                let resData = data[0];
                let { rows } = resData;

                if (rows && rows.length > 0) {
                    rows = JSON.parse(JSON.stringify(rows).replace(/roleId/g, 'value'));
                    rows = JSON.parse(JSON.stringify(rows).replace(/roleName/g, 'label'));
                }
                resolve(rows);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * 获取岗位列表
 * @param {*} currentPage
 */
export function getPostList() {
    let requestUrl = api.appMain.applicationDirectory + api.commonServices.getPostList;
    let requestParams = {
        pageNum: 1,
        pageSize: 9999
    };

    requestUrl = requestUrl + '?' + qs.stringify(requestParams);
    return new Promise((resolve, reject) => {
        network
            .getData(requestUrl, null, ['data'])
            .then((data) => {
                let resData = data[0];
                let { rows } = resData;

                if (rows && rows.length > 0) {
                    rows = JSON.parse(JSON.stringify(rows).replace(/postId/g, 'value'));
                    rows = JSON.parse(JSON.stringify(rows).replace(/postName/g, 'label'));
                }
                resolve(rows);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * 查询所有用户
 * @param {*} currentPage
 * @param {*} pageSize
 * @returns
 */
export function getUserListAll(currentPage = 1, pageSize) {
    let requestUrl = api.appMain.applicationDirectory + api.commonServices.getUserList;
    let requestParams = {
        pageSize: pageSize ? pageSize : api.appMain.tableListPageSize,
        pageNum: currentPage
    };

    return new Promise((resolve, reject) => {
        network
            .getData(requestUrl, requestParams, ['data'])
            .then((data) => {
                let rows = data[0];

                if (rows && rows.length > 0) {
                    rows = JSON.parse(JSON.stringify(rows).replace(/nickName/g, 'nick_name'));
                    rows = JSON.parse(JSON.stringify(rows).replace(/userName/g, 'user_name'));
                    rows = JSON.parse(JSON.stringify(rows).replace(/userId/g, 'user_id'));
                }
                resolve({
                    rows: rows,
                    totalRecord: rows.length
                });
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * 查询用户列表
 * @param {*} currentPage
 * @param {*} pageSize
 * @param {*} deptId
 * @param {*} postId
 * @param {*} roleId
 * @param {*} userStatus
 */
export function getUserList(currentPage, pageSize, deptId, postId, roleId, userStatus) {
    let requestUrl = api.appMain.applicationDirectory;
    let requestParams = {
        pageSize: pageSize,
        pageNum: currentPage
    };

    if (deptId != '' && postId == '' && roleId == '') {
        // 查询指定部门用户列表
        requestUrl = requestUrl + api.commonServices.getUserListByDeptId;
        requestParams['deptId'] = deptId;
        requestParams['isRecursion'] = '0'; //是否递归遍历当前指定部门下的子部门 默认为0
    } else if (deptId == '' && postId != '' && roleId == '') {
        // 查询指定岗位用户列表
        requestUrl = requestUrl + api.commonServices.getUserListByPostIds;
        requestParams['postIds'] = postId;
    } else if (deptId == '' && postId == '' && roleId != '') {
        // 查询指定角色用户列表
        requestUrl = requestUrl + api.commonServices.getUserListByRoleIds;
        requestParams['roleIds'] = roleId;
    }

    return new Promise((resolve, reject) => {
        network
            .getData(requestUrl, requestParams, ['data'])
            .then((data) => {
                let resData = data[0];
                let { rows = [], total = 0 } = resData && resData != null ? resData : {};

                resolve({
                    rows: rows,
                    totalRecord: total
                });

                //             let countData = datas[1];

                //             let totalRecord = 0;
                //             let rowsData = [];
                //             if (countData && countData.length > 0) {
                //                 let countDataItem = countData[0];
                //                 if (countDataItem && countDataItem.length > 0) {
                //                     let firstItem = countDataItem[0];
                //                     let { count } = firstItem;
                //                     if (count) {
                //                         totalRecord = count;
                //                     }
                //                 }
                //             }

                //             if (data && data.length > 0) {
                //                 rowsData = data[0];
                //             }

                //             resolve({
                //                 rows: rowsData,
                //                 totalRecord: totalRecord
                //             });

                // let resData = data[0];
                // let { rows } = resData;

                // if (rows && rows.length > 0) {
                //     rows = JSON.parse(JSON.stringify(rows).replace(/roleId/g, 'value'));
                //     rows = JSON.parse(JSON.stringify(rows).replace(/roleName/g, 'label'));
                // }
                // resolve(rows);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });

    // let requestUrl = api.appMain.applicationDirectory + api.commonServices.commonQueryBySql;

    // let status = '';
    // if (!userStatus || userStatus == '') {
    //     status = '0';
    // } else {
    //     status = userStatus;
    // }

    // let sql = '';
    // let totalSql = '';

    // let sqlGroup = '';

    // let deptSqlWhere = '';

    // let postSqlJoin = '';
    // let postSqlWhere = '';

    // let roleSqlJoin = '';
    // let roleSqlWhere = '';

    // if (deptId && deptId != '') {
    //     deptSqlWhere =
    //         "    AND usr.dept_id IN ( SELECT dept_id FROM sys_dept WHERE ancestors LIKE '%" +
    //         deptId +
    //         "%' or dept_id=" +
    //         deptId +
    //         ' )';
    // }

    // if (postId && postId != '') {
    //     // sqlGroup = ' GROUP BY usr.user_id ';
    //     sqlGroup = '';
    //     postSqlJoin = '    LEFT JOIN sys_user_post as userPost on usr.user_id=userPost.user_id ';
    //     postSqlWhere = '    AND userPost.post_id=' + postId + ' ';
    // }

    // if (roleId && roleId != '') {
    //     // sqlGroup = ' GROUP BY usr.user_id ';
    //     sqlGroup = '';
    //     roleSqlJoin = '    LEFT JOIN sys_user_role as userRole on usr.user_id=userRole.user_id ';
    //     roleSqlWhere = '    AND userRole.role_id=' + roleId + ' ';
    // }

    // sql =
    //     '' +
    //     ' SELECT' +
    //     '    usr.user_id AS userId,' +
    //     '    usr.user_name AS userName,' +
    //     '    usr.nick_name AS nickName,' +
    //     '    usr.dept_id AS deptId,' +
    //     '    usr.email,' +
    //     '    usr.phonenumber,' +
    //     '    usr.sex,' +
    //     // '    dict_sex.dict_label AS sexName,' +
    //     '    usr.avatar,' +
    //     '    usr.`status`,' +
    //     '    usr.create_by AS createBy,' +
    //     "    DATE_FORMAT( usr.create_time, '%Y-%m-%d %H:%i:%S' ) AS createTime," +
    //     '    usr.remark,' +
    //     '    usr.login_ip AS loginIp,' +
    //     "    DATE_FORMAT( usr.login_date, '%Y-%m-%d %H:%i:%S' ) AS loginDate " +
    //     // "    group_concat( DISTINCT userRole.role_id ) AS roleIds," +
    //     // "    group_concat( DISTINCT role.role_name ) AS roleNames," +
    //     // "    group_concat( DISTINCT role.role_key ) AS roleKeys," +
    //     // "    group_concat( DISTINCT post.post_id ) AS postIds," +
    //     // "    group_concat( DISTINCT post.post_name ) AS postNames," +
    //     ' ,' +
    //     ' CASE' +
    //     '    WHEN usr.user_id = 1 THEN  true' +
    //     '    ELSE false ' +
    //     '    END AS ifAdmin ' +
    //     ' FROM' +
    //     '    sys_user AS usr' +
    //     // '    LEFT JOIN sys_dict_data AS dict_sex ON usr.sex = dict_sex.dict_value ' +
    //     roleSqlJoin +
    //     postSqlJoin +
    //     // "    LEFT JOIN sys_user_role AS userRole ON usr.user_id = userRole.user_id" +
    //     // "    LEFT JOIN sys_role AS role ON userRole.role_id = role.role_id" +
    //     // "    LEFT JOIN sys_user_post AS userPost ON usr.user_id = userPost.user_id" +
    //     // "    LEFT JOIN sys_post AS post ON userPost.post_id = post.post_id " +
    //     ' WHERE' +
    //     "    usr.STATUS = '" +
    //     status +
    //     "' " +
    //     '    AND usr.del_flag = 0 ' +
    //     // "    AND dict_sex.dict_type = 'sys_user_sex'" +
    //     deptSqlWhere +
    //     roleSqlWhere +
    //     postSqlWhere +
    //     sqlGroup +
    //     ' ORDER BY' +
    //     '    usr.user_id ' +
    //     '    LIMIT ' +
    //     (currentPage - 1) * pageSize +
    //     ',' +
    //     pageSize +
    //     ';';

    // totalSql =
    //     '' +
    //     ' SELECT SQL_CALC_FOUND_ROWS' +
    //     '    COUNT(*) AS count ' +
    //     ' FROM' +
    //     '    sys_user AS usr' +
    //     // '    JOIN sys_dict_data AS dict_sex ON usr.sex = dict_sex.dict_value ' +
    //     roleSqlJoin +
    //     postSqlJoin +
    //     ' WHERE' +
    //     "    usr.STATUS = '" +
    //     status +
    //     "' " +
    //     '    AND usr.del_flag = 0 ' +
    //     // "    AND dict_sex.dict_type = 'sys_user_sex' " +
    //     deptSqlWhere +
    //     roleSqlWhere +
    //     postSqlWhere +
    //     ';';

    // sql = sql.replace(/[\\\/\b\f\n\r\t]/g, '');
    // sql = sql.replace(/[\!\|\~\#\$\^\&\;\?]/g, '');
    // totalSql = totalSql.replace(/[\\\/\b\f\n\r\t]/g, '');
    // totalSql = totalSql.replace(/[\!\|\~\#\$\^\&\;\?]/g, '');

    // let sqlRequestUrl = { sql: sql }; //encodeURI('?sql=' + sql);
    // let totalSqlRequestUrl = { sql: totalSql }; //encodeURI('?sql=' + totalSql);
    // let requestArray = [];

    // requestArray.push(network.postData(requestUrl, sqlRequestUrl, ['data']));
    // requestArray.push(network.postData(requestUrl, totalSqlRequestUrl, ['data']));

    // let requestPromise = new Promise((resolve, reject) => {
    //     Promise.all(requestArray)
    //         .then((datas) => {
    //             let data = datas[0];
    //             let countData = datas[1];

    //             let totalRecord = 0;
    //             let rowsData = [];
    //             if (countData && countData.length > 0) {
    //                 let countDataItem = countData[0];
    //                 if (countDataItem && countDataItem.length > 0) {
    //                     let firstItem = countDataItem[0];
    //                     let { count } = firstItem;
    //                     if (count) {
    //                         totalRecord = count;
    //                     }
    //                 }
    //             }

    //             if (data && data.length > 0) {
    //                 rowsData = data[0];
    //             }

    //             resolve({
    //                 rows: rowsData,
    //                 totalRecord: totalRecord
    //             });
    //         })
    //         .catch(() => {
    //             reject('数据获取失败!');
    //         });
    // });

    //
}
