/**
 * ios弹性滚动优化。bug：overflow：scroll元素在滚动边缘时第一次点击无效
 * 单例
 *
 * 规则：
    1. overscroll:scroll的元素始终可以在对应坐标方向滚动
    2. overscroll:auto的元素如果在对应方向滚动到头则继续向上层寻找可滚动元素
    3. 符合extra条件的元素不能作为选择元素的条件
*/
let startPosY;
let startPosX;
let curPosY;
let curPosX;

let stat = false;

const defaultConfig = {
    // 其他不爽的element
    isExtraElement: function(element) {
        switch(true) {
            case element.tagName === 'INPUT' && element.type === 'range':
                return true;
            default:
                return false;
        }
    }
};
let config = {};

const notPreventScrollElement = function(element) {
    return config.isExtraElement(element) || isScrollElement(element);
}
// 能滚的element
const isScrollElement = function(element, whileTouch) {
    let checkFunc = whileTouch ? checkIsScrollElementWhileTouch : checkIsScrollElementWhileScroll;
    while(element) {
        if(checkFunc(element)) {
            return element;
        }
        element = element.parentElement;
    }
    return false;
}
const checkIsScrollElementWhileTouch = function(element) {
    let style = window.getComputedStyle(element);
    let tmp;
    let check;
    // 规则1
    if(style.overflowY === 'scroll' && element.scrollHeight > element.clientHeight) {
        check = true;
        if(element.scrollTop === 0) {
            element.scrollTop = 1;
        }
        tmp = element.scrollHeight - element.clientHeight;
        if(tmp === element.scrollTop) {
            element.scrollTop = tmp - 1;
        }
    }
    if(style.overflowX === 'scroll' && element.scrollWidth > element.clientWidth) {
        check = true;
        if(element.scrollLeft === 0) {
            element.scrollLeft = 1;
        }
        tmp = element.scrollWidth - element.clientWidth;
        if(tmp === element.scrollLeft) {
            element.scrollLeft = tmp - 1;
        }
    }
    if(check) {
        return element;
    }
}
const checkIsScrollElementWhileScroll = function(element) {
    let style = window.getComputedStyle(element);
    // 规则2
    return (
        (style.overflowY === 'scroll' || style.overflowY === 'auto')
        && (
            element.scrollHeight > element.clientHeight
            && !(startPosY <= curPosY && element.scrollTop === 0)
            && !(startPosY >= curPosY && element.scrollHeight - element.scrollTop === element.clientHeight)
        )
        ||
        (style.overflowX === 'scroll' || style.overflowX === 'auto')
        &&
            element.scrollWidth > element.clientWidth
            && !(startPosX <= curPosX && element.scrollLeft === 0)
            && !(startPosX >= curPosX && element.scrollWidth - element.scrollLeft === element.clientWidth)
        );
}

// bind
const bindFunc = {
    move: function(e) {
        curPosY = e.touches ? e.touches[0].screenY : e.screenY;
        curPosX = e.touches ? e.touches[0].screenX : e.screenX;
        !notPreventScrollElement(e.target) && e.cancelable && e.preventDefault();
    },
    start: function(e) {
        let target = isScrollElement(e.target, true);
        startPosY = e.touches ? e.touches[0].screenY : e.screenY;
        startPosX = e.touches ? e.touches[0].screenX : e.screenX;
    }
}
const api = {
    bind: function() {
        if(!stat) {
            stat = true;
            document.addEventListener('touchmove', bindFunc.move, true);
            document.addEventListener('touchstart', bindFunc.start, true);
        }
        return this;
    },
    config: function(cfg) {
        cfg = cfg || {};
        config.isExtraElement = cfg.isExtraElement || defaultConfig.isExtraElement;
        return this;
    },
    move: function(nodes, target) {
        nodes = nodes || ('all' in document ?
                [].filter.call(document.all, (el) => {
                    return window.getComputedStyle(el).position === 'fixed';
                }) :
                []);
        target = target || document.body;
        [].forEach.call(nodes, (el) => {
            target.appendChild(el);
        });
        return this;
    },
    destory: function() {
        stat = false;
        document.removeEventListener('touchmove', bindFunc.move, true);
        document.removeEventListener('touchstart', bindFunc.start, true);
    }
};
export default api;
