(function () {
    var routeMap = {};
    var prveRoute = "";
    
    function VueRouter(options) {
        this.options = options;
        this.mode = options.mode || 'hash';
        this.routes = options.routes || [];

        this.routes.forEach(route => {
            routeMap[route.path] = route
        })
        Vue.util.defineReactive(this, 'current', "/");

        // 请确保onHashChange中this指向当前实例
        window.addEventListener('hashchange', this.onHashChange.bind(this))
        window.addEventListener('load', this.onHashChange.bind(this))

    }

    VueRouter.prototype.onHashChange = function () {
        var current = window.location.hash.slice(1) || '/';

        if(current === prveRoute){
            return
        }
        prveRoute = current;
        this.current = current;

    }

    VueRouter.install = function (Vue) {

        Vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    Vue.prototype.$router = this.$options.router;

                }
            },
        });

        Vue.component("router-link", {
            props: {
                to: {
                    type: String,
                    required: true
                },
            },
            render(h) {

                return h('a',
                    { attrs: { href: '#' + this.to } },
                    this.$slots.default
                )
            }
        })
        Vue.component("router-view", {
            render(h) {

                var { current } = this.$router;
                var component = null;

                if (current && routeMap[current]) {
                    component = routeMap[current].component;
                    
                }
                return h(component)

            }
        })

        
    }

    if (window.Vue) {
        window.Vue.use(VueRouter);
    }

    window.VueRouter = VueRouter
}())



