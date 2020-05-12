import observe from './observe.js'
import proxy from "./proxy.js"
import Compile from "./compile.js"

export default function Vue(options) {
    // 保存el和data配置
    this.$el = options && options.el;
    this.$data = options && options.data;
    this.$methods = options.methods || {};
    // 添加响应式
    observe(this.$data)

    // 将data中的数据附加到代理对象——vue实例中
    proxy(this)

    // 编译模版
    new Compile(this)
}

