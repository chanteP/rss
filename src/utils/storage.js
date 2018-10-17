/*
    webstorage存储处理

    session: expired=true
    local: expired=number|default

    set 保存 :
        expired < 0 || expire === true  保存为sessionStorage
        expired > 1000000000000   作为失效时间处理
        else   作为maxage处理
    get 获取 :
        forceFormattedStorage  强制获取使用这个规范保存的值
*/
const defaultExpired = 20 * 24 * 3600 * 1000;

let storage = {
    set(key, value, expired) {
        let webStorage = window.localStorage;
        if (expired === true || +expired < 0) {
            // sessionStorage
            webStorage = window.sessionStorage;
        } else if (+expired && +expired > 1000000000000) {
            // 存的是目标时间戳
            expired = +expired;
        } else {
            // 存的是偏移量
            expired = Date.now() + (+expired || defaultExpired);
        }
        try {
            webStorage.setItem(
                key,
                JSON.stringify({
                    expired: expired,
                    value: value
                })
            );
        } catch (e) {
            console.error('webStorage设置失败', e);
        }
    },
    get(key, forceFormattedStorage = true) {
        let data = isStorageKey(key);
        if (!data) {
            // 强制新格式的storage 或 原生格式
            return forceFormattedStorage ? null : getItem(key);
        }
        // 已过期
        if (data.expired !== true && +data.expired <= Date.now()) {
            storage.remove(key);
            return null;
        }
        return data.value;
    },
    remove(key) {
        try{
            window.localStorage.removeItem(key);
            window.sessionStorage.removeItem(key);
        }catch(e) {
            console.error('webStorage删除失败', e);
        }
    },
    clear(force) {
        if (!checkSupport()) {
            return null;
        }
        if (force) {
            window.localStorage.clear();
            window.sessionStorage.clear();
        } else {
            Object.keys(window.localStorage).forEach(key => {
                let data = isStorageKey(key);
                if (!data) {
                    return;
                }
                if (+data.expired <= Date.now()) {
                    storage.remove(key);
                }
            });
        }
    }
};

setTimeout(_ => {
    storage.clear();
}, 3000);

export default storage;


function getItem(key) {
    return window.sessionStorage.getItem(key) || window.localStorage.getItem(key);
}

function checkSupport() {
    return window.localStorage && window.sessionStorage;
}

function isStorageKey(key) {
    if (!checkSupport()) {
        return null;
    }
    let data = getItem(key);
    // 没有查到key
    if (!data) {
        return data;
    }
    try {
        data = JSON.parse(data);
        // 旧数据
        if (!data.expired && !data.hasOwnProperty('value')) {
            data = null;
        }
    } catch (e) {
        console.warn('无效webStorage', key, e);
    }
    return data;
}
