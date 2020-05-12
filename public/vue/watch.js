import Dep from "./dep.js"

class Watcher {
    constructor(vm, key, updateFn) {
        this.vm = vm;
        this.key = key;
        this.fn = updateFn;

        Dep.target = this;
        this.vm[this.key];
        Dep.target = null;

    }

    update() {
        this.fn.call(this.vm, this.vm[this.key])
    }
}


export default Watcher