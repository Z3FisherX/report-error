/*
 * @Author: devfpy
 * @Date: 2020-08-19 19:17:03
 * @LastEditTime: 2021-02-02 11:14:49
 * @Description:
 */
import { parseInt, sortBy, filter } from 'lodash';

export function BuildAndSortArrayToTree(arr, mainKey, parentKey, sortKey, rootKeyValue) {
    arr.map((ele) => {
        let tmp = ele[sortKey];
        ele[sortKey] = parseInt(tmp);
    });
    let sortedArr = sortBy(arr, [parentKey, sortKey]);

    let rootItems = filter(sortedArr, (obj) => {
        if (obj[parentKey] === rootKeyValue) {
            return true;
        }
        return false;
    });

    rootItems.map((ele) => {
        let mainKeyValue = ele[mainKey];
        ele['children'] = mapArrayBuildTreeData(sortedArr, mainKey, parentKey, mainKeyValue);
    });

    return rootItems;
}

function mapArrayBuildTreeData(array, mainKey, parentKey, parentKeyValue) {
    let resultNodes = [];
    array.map((item) => {
        let currentParentKeyValue = item[parentKey];
        if (parentKeyValue == currentParentKeyValue) {
            item['children'] = mapArrayBuildTreeData(array, mainKey, parentKey, item[mainKey]);
            resultNodes.push(item);
        }
    });
    return resultNodes;
}
