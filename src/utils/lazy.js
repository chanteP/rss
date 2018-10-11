/**
 * lazyload组件。添加directive支持
 *  v-lazy   实现load 接口的组件都可以使用（可自行实现checkInView接口）
 *  v-lazy-container   绑定触发检测事件的元素
 * components/Pic默认支持
 */
const events = ['scroll', 'touchend', 'mouseup', 'wheel', 'mousewheel', 'resize', 'transitionend', 'animationend'];

class Lazy {
    constructor() {
        this.items = new Set();
        this.containers = new WeakSet();

        // throttle marker
        this.throttleTimer = false;
        this.throttleLimit = 10;
        this.dirtyCheck();
    }
    install(Vue, options = {}) {
        Vue.directive('lazy', {
            bind: this.addLazyItem,
            // inserted: this.addLazyItem,
            update: this.addLazyItem,
            unbind: this.removeLazyItem,
        });
        Vue.directive('lazy-container', {
            bind: this.addLazyContainer,
            // inserted: this.addLazyContainer,
            update: this.addLazyContainer,
            unbind: this.removeLazyContainer,
        });
    }
    addLazyContainer(el) {
        el = el && el.$el || el;
        if(!el) {
            return;
        }
        this.containers.add(el);
        this.bindEvents(el);
    }
    bindEvents(container) {
        if(container.__lazyload_node) {
            return;
        }
        container.__lazyload_node = true;
        events.forEach(event => {
            container.addEventListener(event, this.throttleEmitter.bind(this), true);
        });
    }
    // 兜底脏检查
    dirtyCheck(){
        window.clearTimeout(this.dirtyTimer);
        this.dirtyTimer = window.setTimeout(_ => {
            this.checkItemList();
            this.dirtyCheck();
        }, 1000);
    }
    throttleEmitter() {
        // 降频
        if(this.throttleTimer) {
            return;
        }
        this.throttleTimer = setTimeout(_ => {
            this.throttleTimer = false;
        }, 1000 / this.throttleLimit);

        this.checkItemList();
    }
    removeLazyContainer(el) {
        el = el && el.$el || el;
        this.containers.delete(el);
    }
    addLazyItem(item) {
        // TODO加上原生el支持
        if(!item || typeof item.load !== 'function') {
            return;
        }
        if(typeof item.checkInView !== 'function') {
            item.checkInView = this.checkInView;
        }
        this.items.add(item);
        setImmediate(_ => {
            this.checkItem(item);
        });
    }
    checkItem(item) {
        (item.checkInView ? item.checkInView(item) : this.checkInView(item)) && item.load();
    }
    checkItemList() {
        this.items.forEach(this.checkItem);
    }
    removeLazyItem(item) {
        this.items.delete(item);
    }
    // 检查是否在屏幕里面
    checkInView(el) {
        el = el && el.$el || el;
        if(!el || !el.getBoundingClientRect) { return; }
        let rect = el.getBoundingClientRect();
        return (rect.top < window.innerHeight && rect.bottom >= 0) && (rect.left < window.innerWidth && rect.right > 0);
    }
}

let lazy = new Lazy();
document.body && lazy.addLazyContainer(document.body);
export default lazy;

