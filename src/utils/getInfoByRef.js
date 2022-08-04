/*
 * @Author: zzb
 * @Date: 2021-07-17 16:11:34
 * @LastEditors: zzb
 * @LastEditTime: 2021-11-30 20:41:12
 * @Descripttion: 根据ref获取相关的信息
 */

// 表格头部标题的高度
const theadHeight = 60;
// 表格底部分页的高度
const pageHeight = 45;

/**
 * 获取内容的高度
 * @param {*} ref
 * @param {*} subtract
 * @returns
 */
export const getContentHeight = (ref, type) => {
    let height = 0;
    if (ref && ref.current) {
        let offsetHeight = ref.current.offsetHeight;
        if (type == 'tableContent') {
            height = offsetHeight - theadHeight;
        } else if (type == 'tableTheadPage') {
            height = offsetHeight - theadHeight - pageHeight;
        } else {
            height = offsetHeight;
        }
    }

    return height;
};

export const getContentHeightByDiv = (ref, type) => {
    let height = 0;
    if (ref && ref.clientHeight) {
        let offsetHeight = ref.clientHeight;
        if (type == 'tableContent') {
            height = offsetHeight - theadHeight;
        } else if (type == 'tableTheadPage') {
            height = offsetHeight - theadHeight - pageHeight;
        } else {
            height = offsetHeight;
        }
    }

    return height;
};

/**
 * 获取表格内容的高度
 * @param {*} ref
 * @param {*} list:包含header、page
 * @param {*} minHeight: 最小的高度，默认400，如果不设置则是400
 * @param {*} call：回调函数
 * @returns
 */
export const getTableContentHeight = (ref, list, minHeight = 40, callBackFn) => {
    let height = ref && ref.current ? ref.current.clientHeight : ref ? ref.clientHeight : 0;
    if (height) {
        // 判断是否需要减去头部和分页的高度
        if (list && list.length > 0) {
            if (list.indexOf('header') >= 0) {
                let headerDiv = document.getElementsByClassName('next-table-header');
                if (headerDiv && headerDiv.length > 0) {
                    let headerClientHeight = headerDiv[0].clientHeight;

                    height = height - headerClientHeight;
                    if (height < minHeight) {
                        height = minHeight;
                    }
                }
            }
            if (list.indexOf('page') >= 0) {
                let paginationDiv = document.getElementsByClassName('next-pagination');
                if (paginationDiv && paginationDiv.length > 0) {
                    let paginationClientHeight = paginationDiv[0].clientHeight;

                    height = height - 44; // 减去的16是分页到内容的外边距
                    if (height < minHeight) {
                        height = minHeight;
                    }
                }
            }
        }
    }

    if (height > 0 && callBackFn) {
        callBackFn(height);
    }

    return height;
};
