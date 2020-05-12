import Watcher from "./watch.js"

class Compile {
    constructor(vm) {
        this.$el = document.querySelector(vm.$el);

        this.$vm = vm;
        if (this.$el) {
            this.compile(this.$el)
        }
    }

    compile(el) {

        var childNode = Array.from(el.childNodes);
        childNode.forEach(node => {
            if (this.isElement(node)) {
                this.compileElement(node)
            } else if (this.isInterpolation(node)) {
                this.compileText(node)
            }

            if (node.childNodes.length) {
                this.compile(node)
            }
        })


    }

    isElement(node) {
        return node.nodeType === 1
    }

    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    compileText(node) {

        this.update(node, RegExp.$1, 'text')
    }

    compileElement(node) {

        var attr = Array.from(node.attributes);
        attr.forEach(item => {
            var { name, value } = item;

            if (this.isDirective(name)) {
                var dir = name.substring(2)

                this[dir] && this[dir](node, value)

            } else if (this.isMethod(name)) {
                var dir = name.substring(1);
                this.addEvent(node, dir, value)

                console.log("捕捉到事件")
            }
        })
    }

    isDirective(attr) {
        return attr.indexOf("k-") == 0;
    }

    isMethod(attr) {
        return attr.indexOf("@") == 0;
    }

    text(node, exp) {
        this.update(node, exp, 'text')
    }

    html(node, exp) {
        this.update(node, exp, 'html')
    }

    update(node, exp, type) {
        var fn = this[type + "Update"];
        fn && fn(node, this.$vm[exp]);

        new Watcher(this.$vm, exp, function (val) {
            fn && fn(node, val);
        })
    }

    textUpdate(node, val) {
        node.textContent = val
    }

    htmlUpdate(node, val) {
        node.innerHTML = val
    }

    addEvent(node, eventName, event) {
        var self = this;
        if (this.$vm.$methods[event]) {
            var fn = function(){
                return self.$vm.$methods[event].bind(self.$vm)
            }

            node.addEventListener(eventName, fn())
        }
    }
}


export default Compile