import Dep from "./dep.js"

function observe(obj) {

    if (typeof obj !== 'object' || obj === null) {
        return
    }

    // 响应式
    new Observer(obj)
}

class Observer {
    constructor(value) {
        this.value = value
        // 辨别类型
        if (Array.isArray(value)) {
            // todo
        } else {
            this.walk(value)
        }
    }

    walk(obj) {
        // 对象响应式
        Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
    }
}

function defineReactive(obj, key, val) {

    observe(val)

    const dep = new Dep()

    Object.defineProperty(obj, key, {
        get() {
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log('set', key);
                // 防止newVal是对象，提前做一次observe
                observe(newVal)
                val = newVal

                // 通知更新
                dep.notify()
            }
        }
    })

}

export default observe