define(function (require) {
    var Backbone = require("backbone"),
        _ = require("underscore"),
        createjs = require("ease");
    return Backbone.Model.extend({
        initialize: function (reactElement, domElement) {
            var stage = new createjs.Stage(domElement);
            this.createElement(reactElement, stage);
        },
        createElement: function (reactElement, targetElement) {
            var self = this;
            switch (reactElement.tagName) {
                case "div":
                    var container = new createjs.Container();
                    _.each(reactElement.childNodes, function (childElement) {
                        self.createElement(childElement, container);
                    });
                    reactElement.style.on("change", function (model, change) {
                        container.x = parseInt(reactElement.style.get("left"));
                    }.bind(this));
                    container.y = targetElement.children.length * 20;
                    targetElement.addChild(container);
                    reactElement.on("remove", function () {
                        targetElement.removeChild(container);
                        targetElement.stage.update();
                    }.bind(this));
                    break
                case "h1":
                    var text = new createjs.Text(reactElement.get("textContent"), "20px Arial", "#ff7700");
                    targetElement.addChild(text);

                    var updateTextContent = function () {
                        text.text = reactElement.get("textContent");
                        text.stage.update();
                    };
                    reactElement.on("change:textContent", updateTextContent);
                    setTimeout(updateTextContent);
                    break;
                default:
                    debugger;
                    break;
            }
        }
    });
});