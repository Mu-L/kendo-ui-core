import "./kendo.core.js";
import "./kendo.popup.js";
import "./kendo.icons.js";

export const __meta__ = {
    id: "notification",
    name: "Notification",
    category: "web",
    description: "The Notification widget displays user alerts.",
    depends: [ "core", "popup", "icons" ],
    features: [ {
        id: "notification-fx",
        name: "Animation",
        description: "Support for animation",
        depends: [ "fx" ]
    } ]
};

(function($, undefined) {
    var kendo = window.kendo,
        Widget = kendo.ui.Widget,
        extend = $.extend,
        encode = kendo.htmlEncode,
        setTimeout = window.setTimeout,
        CLICK = "click",
        SHOW = "show",
        HIDE = "hide",
        KNOTIFICATION = "k-notification",
        KCLOSEICONSELECTOR = `.k-notification-actions .k-icon`,
        KHIDING = "k-hiding",
        INFO = "info",
        SUCCESS = "success",
        WARNING = "warning",
        ERROR = "error",
        TYPEICONS = { [INFO]: "info-circle", [ERROR]: "x-outline", [WARNING]: "exclamation-circle", [SUCCESS]: "check-outline" },
        TOP = "top",
        LEFT = "left",
        BOTTOM = "bottom",
        RIGHT = "right",
        UP = "up",
        NS = ".kendoNotification",
        WRAPPER = '<div role="alert" aria-live="polite" class="k-notification"></div>',
        GET_TEMPLATE_FUNC = (encodeContent) =>
            ({ typeIcon, content, closeButton }) =>
                kendo.ui.icon($(`<span class="k-notification-status" title="${encode(typeIcon)}"></span>`), { icon: TYPEICONS[encode(typeIcon)] || encode(typeIcon) }) +
                `<div class="k-notification-content">${encodeContent ? encode(content) : content}</div>`,
        TEMPLATE = GET_TEMPLATE_FUNC(false),
        SAFE_TEMPLATE = GET_TEMPLATE_FUNC(true),
        defaultActions = {
            close: {
                template: kendo.ui.icon($('<span aria-hidden="true" title="Hide"></span>'), { icon: "x" })
            }
        };

    var Notification = Widget.extend({
        init: function(element, options) {
            let that = this;

            Widget.fn.init.call(that, element, options);

            if (options && options.button && !options.position && that.options.position) {
                that.options.position.right = 40;
            }

            options = that.options;

            if (!options.appendTo || !$(options.appendTo).is(element)) {
                that.element.hide();
            }

            that._compileTemplates(options.templates);
            that._guid = "_" + kendo.guid();
            that._isRtl = kendo.support.isRtl(element);
            that._compileStacking(options.stacking, options.position.top, options.position.left);

            kendo.notify(that);
        },

        events: [
            SHOW,
            HIDE
        ],

        options: {
            name: "Notification",
            position: {
                pinned: true,
                top: null,
                left: null,
                bottom: 20,
                right: 20
            },
            stacking: "default",
            hideOnClick: true,
            button: false,
            allowHideAfter: 0,
            autoHideAfter: 5000,
            appendTo: null,
            width: null,
            height: null,
            templates: [],
            title: null,
            animation: {
                open: {
                    effects: "fade:in",
                    duration: 300
                },
                close: {
                    effects: "fade:out",
                    duration: 600,
                    hide: true
                }
            }
        },

        _compileTemplates: function(templates) {
            var that = this;
            var kendoTemplate = kendo.template;

            that._compiled = {};

            $.each(templates, function(key, value) {
                that._compiled[value.type] = kendoTemplate(value.template || $("#" + value.templateId).html());
            });

            that._defaultCompiled = kendoTemplate(TEMPLATE);
            that._safeCompiled = kendoTemplate(SAFE_TEMPLATE);
        },

        _getCompiled: function(type, safe) {
            var defaultCompiled = safe ? this._safeCompiled : this._defaultCompiled;

            return type ? this._compiled[type] || defaultCompiled : defaultCompiled;
        },

        _compileStacking: function(stacking, top, left) {
            var that = this,
                paddings = { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
                horizontalAlignment = left !== null ? LEFT : RIGHT,
                origin, position;

            switch (stacking) {
                case "down":
                    origin = BOTTOM + " " + horizontalAlignment;
                    position = TOP + " " + horizontalAlignment;
                    delete paddings.paddingBottom;
                break;
                case RIGHT:
                    origin = TOP + " " + RIGHT;
                    position = TOP + " " + LEFT;
                    delete paddings.paddingRight;
                break;
                case LEFT:
                    origin = TOP + " " + LEFT;
                    position = TOP + " " + RIGHT;
                    delete paddings.paddingLeft;
                break;
                case UP:
                    origin = TOP + " " + horizontalAlignment;
                    position = BOTTOM + " " + horizontalAlignment;
                    delete paddings.paddingTop;
                break;
                default:
                    if (top !== null) {
                        origin = BOTTOM + " " + horizontalAlignment;
                        position = TOP + " " + horizontalAlignment;
                        delete paddings.paddingBottom;
                    } else {
                        origin = TOP + " " + horizontalAlignment;
                        position = BOTTOM + " " + horizontalAlignment;
                        delete paddings.paddingTop;
                    }
                break;
            }

            that._popupOrigin = origin;
            that._popupPosition = position;
            that._popupPaddings = paddings;
        },

        _attachPopupEvents: function(options, popup) {
            var that = this,
                allowHideAfter = options.allowHideAfter,
                attachDelay = !isNaN(allowHideAfter) && allowHideAfter > 0,
                closeIcon;

            function attachClick(target) {
                target.on(CLICK + NS, function() {
                    that._hidePopup(popup);
                });
            }

            if (options.hideOnClick) {
                popup.bind("activate", function() {
                    if (attachDelay) {
                        setTimeout(function() {
                            attachClick(popup.element);
                        }, allowHideAfter);
                    } else {
                        attachClick(popup.element);
                    }
                });
            } else if (options.button) {
                closeIcon = popup.element.find(KCLOSEICONSELECTOR);
                if (attachDelay) {
                    setTimeout(function() {
                        attachClick(closeIcon);
                    }, allowHideAfter);
                } else {
                    attachClick(closeIcon);
                }
            }
        },

        _showPopup: function(wrapper, options) {
            var that = this,
                autoHideAfter = options.autoHideAfter,
                x = options.position.left,
                y = options.position.top,
                popup, openPopup;

            openPopup = $("." + that._guid + ":not(." + KHIDING + ")").last();

            popup = new kendo.ui.Popup(wrapper, {
                anchor: openPopup[0] ? openPopup : document.body,
                origin: that._popupOrigin,
                position: that._popupPosition,
                _resizeOnWrap: true,
                animation: options.animation,
                copyAnchorStyles: false,
                autosize: true,
                modal: true,
                collision: "",
                isRtl: that._isRtl,
                close: function() {
                    that._triggerHide(this.element);
                },
                deactivate: function(e) {
                    e.sender.element.off(NS);
                    e.sender.element.find(KCLOSEICONSELECTOR).off(NS);
                    e.sender.destroy();
                }
            });

            that._attachPopupEvents(options, popup);

            wrapper.removeClass("k-group k-reset k-popup");

            if (openPopup[0]) {
                popup.open();
            } else {
                if (x === null) {
                    x = $(window).width() - wrapper.outerWidth() - options.position.right;
                }

                if (y === null) {
                    y = $(window).height() - wrapper.outerHeight() - options.position.bottom;
                }

                popup.open(x, y);
            }
            wrapper.removeClass("k-popup");

            popup.wrapper.addClass(that._guid).css(extend({ margin: 0,zIndex: 10050 }, that._popupPaddings));

            if (options.position.pinned) {
                popup.wrapper.css("position", "fixed");
                if (openPopup[0]) {
                    that._togglePin(popup.wrapper, true);
                }
            } else if (!openPopup[0]) {
                that._togglePin(popup.wrapper, false);
            }

            if (autoHideAfter > 0) {
                setTimeout(function() {
                    that._hidePopup(popup);
                }, autoHideAfter);
            }
        },

        _hidePopup: function(popup) {
            popup.wrapper.addClass(KHIDING);
            popup.close();
        },

        _togglePin: function(wrapper, pin) {
            var win = $(window),
                sign = pin ? -1 : 1;

            wrapper.css({
                top: parseInt(wrapper.css(TOP), 10) + sign * win.scrollTop(),
                left: parseInt(wrapper.css(LEFT), 10) + sign * win.scrollLeft()
            });
        },

        _attachStaticEvents: function(options, wrapper) {
            var that = this,
                allowHideAfter = options.allowHideAfter,
                attachDelay = !isNaN(allowHideAfter) && allowHideAfter > 0;

            function attachClick(target) {
                target.on(CLICK + NS, that._hideStatic.bind(that, wrapper));
            }

            if (options.hideOnClick) {
                if (attachDelay) {
                    setTimeout(function() {
                        attachClick(wrapper);
                    }, allowHideAfter);
                } else {
                    attachClick(wrapper);
                }
            } else if (options.button) {
                if (attachDelay) {
                    setTimeout(function() {
                        attachClick(wrapper.find(KCLOSEICONSELECTOR));
                    }, allowHideAfter);
                } else {
                    attachClick(wrapper.find(KCLOSEICONSELECTOR));
                }
            }
        },

        _showStatic: function(wrapper, options) {
            var that = this,
                autoHideAfter = options.autoHideAfter,
                animation = options.animation,
                insertionMethod = options.stacking == UP || options.stacking == LEFT ? "prependTo" : "appendTo",
                initializedNotifications;

            if (!that._hideTimeouts) {
                that._hideTimeouts = [];
            }

            wrapper
                .removeClass("k-popup")
                .addClass(that._guid)
                [insertionMethod](options.appendTo)
                .hide()
                .kendoAnimate(animation.open || false);

            wrapper.css("display", "");
            initializedNotifications = that.getNotifications();
            initializedNotifications.each(function(idx, element) {
                that._attachStaticEvents(options, $(element));

                if (autoHideAfter > 0 && !$(element).attr(kendo.attr("has-hidetimeout"))) {
                    $(element).attr(kendo.attr("has-hidetimeout"), true);
                    that._hideTimeouts.push(
                        setTimeout(function() {
                        that._hideStatic($(element));
                    }, autoHideAfter));
                }
            });
        },

        _hideStatic: function(wrapper) {
            wrapper.kendoAnimate(extend(this.options.animation.close || false, { complete: function() {
                wrapper.off(NS).find(KCLOSEICONSELECTOR).off(NS);
                wrapper.remove();
            } }));
            this._triggerHide(wrapper);
        },

        _triggerHide: function(element) {
            this.trigger(HIDE, { element: element });
        },

        show: function(content, type, safe) {
            var that = this,
                options = that.options,
                wrapper = $(WRAPPER),
                contentId = kendo.guid(),
                args, defaultArgs;

            if (!type) {
                type = INFO;
            }

            wrapper.attr("aria-label", type);

            if (content !== null && content !== undefined && content !== "") {

                if (kendo.isFunction(content)) {
                    content = content();
                }

                defaultArgs = { typeIcon: type, content: "", closeButton: options.button };

                if ($.isPlainObject(content)) {
                    args = extend(defaultArgs, content);
                } else {
                    args = extend(defaultArgs, { content: content });
                }

                wrapper
                    .addClass(KNOTIFICATION + "-" + type)
                    .toggleClass(KNOTIFICATION + "-closable", options.button)
                    .attr({
                        "data-role": "alert",
                        title: options.title
                    })
                    .css({ width: options.width, height: options.height })
                    .append(that._getCompiled(type, safe)(args));

                if (that.options.button) {
                    wrapper.append(that.addActions("close"));
                }

                wrapper.find(".k-notification-content").attr("id", contentId);
                wrapper.attr("aria-describedby", contentId);

                if ($(options.appendTo)[0]) {
                    that._showStatic(wrapper, options);
                } else {
                    that._showPopup(wrapper, options);
                }

                that.trigger(SHOW, { element: wrapper });
            }

            return that;
        },

        showText: function(content, type) {
            this.show(content, type, true);
        },

        info: function(content) {
            return this.show(content, INFO);
        },

        success: function(content) {
            return this.show(content, SUCCESS);
        },

        warning: function(content) {
            return this.show(content, WARNING);
        },

        error: function(content) {
            return this.show(content, ERROR);
        },

        hide: function() {
            var that = this,
                openedNotifications = that.getNotifications();

            if (that.options.appendTo) {
                if (that._hideTimeouts) {
                    that._hideTimeouts.forEach(clearTimeout);
                }
                that._hideTimeouts = [];
                openedNotifications.each(function(idx, element) {
                    that._hideStatic($(element));
                });
            } else {
                openedNotifications.each(function(idx, element) {
                    var popup = $(element).data("kendoPopup");
                    if (popup) {
                        that._hidePopup(popup);
                    }
                });
            }

            return that;
        },

        getNotifications: function() {
            var that = this,
                guidElements = $("." + that._guid + ":not(." + KHIDING + ")");

            if (that.options.appendTo) {
                return guidElements;
            } else {
                return guidElements.find(">.k-child-animation-container >." + KNOTIFICATION);
            }
        },

        setOptions: function(newOptions) {
            var that = this,
                options;

            Widget.fn.setOptions.call(that, newOptions);

            options = that.options;

            if (newOptions.templates !== undefined) {
                that._compileTemplates(options.templates);
            }

            if (newOptions.stacking !== undefined || newOptions.position !== undefined) {
                that._compileStacking(options.stacking, options.position.top, options.position.left);
            }
        },

        destroy: function() {
            Widget.fn.destroy.call(this);
            this.getNotifications().off(NS).find(KCLOSEICONSELECTOR).off(NS);
        },

        addActions: function(actions) {
            var actionsContainer = $('<span class="k-notification-actions"/>');

            if (!Array.isArray(actions)) {
                actions = [actions];
            }

            actions.forEach(function(action) {
                $(defaultActions[action].template)
                    .wrap(`<span class="k-notification-action k-notification-${action}-action">`)
                    .parent()
                    .appendTo(actionsContainer);
            });

            return actionsContainer;
        }
    });

    kendo.ui.plugin(Notification);

})(window.kendo.jQuery);
export default kendo;

