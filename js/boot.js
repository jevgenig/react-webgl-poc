requirejs.config({
    shim: {
        ease: {
            exports: 'createjs'
        }

    },
    paths: {
        "backbone": "/node_modules/backbone/backbone-min",
        "underscore": "/node_modules/underscore/underscore-min",
        "jquery": "/node_modules/jquery/dist/jquery.min",
        "three": "/node_modules/three/three.min",
        "ease": "easeljs-0.8.1.min",
        "react": "/node_modules/react/dist/react-with-addons",
        "test": "/build/test"

    }
});
require(["test", "react", "ReactProxy", "backbone"], function (tt, React, ReactProxy, Backbone) {
    var appClass = React.createClass({
        items: _.map(_.range(1, 11), function (i) {
            return {
                id: i,
                title: "title:" + i,
                style: {
                    left: 0
                }
            }
        }),
        /*getInitialState: function () {
         return {
         childContents: ""
         };
         },*/
        componentDidMount: function () {
            setInterval(function () {
                this.items = _.map(this.items, function (item) {
                    item.title = +new Date();
                    item.kkk = Math.floor(Math.random() * 100)
                    item.style.left += 1;
                    return item;
                });
                //this.items = _.initial(this.items);
                window.render();
            }.bind(this), 100);
        },
        render: tt
    });


    var defineProperties = function (classObject, propertyNames) {
        _.each(propertyNames, function (propertyName) {
            Object.defineProperty(classObject.prototype, propertyName, {
                set: function (value) {
                    var methodName = "__set_" + propertyName;
                    return this[methodName] && this[methodName](value) || this.set(propertyName, value);
                },
                get: function () {
                    var methodName = "__get_" + propertyName;
                    return this[methodName] && this[methodName]() || this.get(propertyName);
                }
            });
        });
        return classObject
    };
    var StyleClass = defineProperties(Backbone.Model.extend({
        defaults: {
            left: 0
        }
    }), ["left"]);
    var CanvasElement = defineProperties(Backbone.Model.extend({
        nodeType: 1,
        initialize: function (options) {
            var options = options || {};
            _.extend(this, {
                //nodeType: options.nodeType || this.nodeType,
                style: new StyleClass(),
                parentNode: options.parentNode,
                childNodes: [],
                attrs: {},
            })
            this.on("change:innerHTML", function (model, html) {
                this.tagName = "div";
                this.childNodes = [new CanvasElement({
                    parentNode: this
                })._initFromHtmlElement($(html).get(0))];
            });
        },
        _initFromHtmlElement: function (htmlElement) {
            if (!htmlElement.tagName) {
                debugger;
            }
            this.tagName = htmlElement.tagName.toLowerCase();
            _.each(htmlElement.attributes, function (a) {
                this.setAttribute(a.name, a.value);
            }.bind(this));
            _.extend(this, _.pick(htmlElement, ["textContent"]));

            this.childNodes = _.map(htmlElement.children, function (childElement) {
                return new CanvasElement({
                    parentNode: this
                })._initFromHtmlElement(childElement);
            }.bind(this));
            return this;
        },
        getAttribute: function (attrName) {
            return this.attrs[attrName];
        },
        setAttribute: function (attrName, attrValue) {
            this.attrs[attrName] = attrValue;
        },
        removeAttribute: function (attrName) {
            delete this.attrs[attrName];
        },
        removeChild: function (childNode) {
            this.childNodes.filter(function (item) {
                return !(childNode === item);
            });
            childNode.trigger("remove");
        },
        __get_firstChild: function () {
            return this.childNodes && _.first(this.childNodes);
        },
        __get_nextSibling: function () {
            return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1];
        }
    }), ["innerHTML", "textContent", "nextSibling", "firstChild"]);

    var e = React.createElement(appClass);


    if (true) {
        var canvas = document.createElement("canvas"),
            t = new CanvasElement();
        canvas.width = canvas.style.width = document.body.offsetWidth;
        canvas.height = canvas.style.height = document.body.offsetHeight;
        canvas.style.position = "absolute";
        canvas.style.left = 0;
        canvas.style.right = 0;
        document.body.appendChild(canvas);
        window.render = function () {
            React.render(e, t);
        };
        render();
        new ReactProxy(t, canvas);
    } else {
        var d = document.createElement("div");
        d.style.width = document.body.offsetWidth;
        d.style.height = document.body.offsetHeight;
        d.style.position = "absolute";
        //d.style.left = -10000;
        //d.style.right = -10000;
        document.body.appendChild(d);
        window.render = function () {
            React.render(e, d);
        };
        render();

    }


});