import "./kendo.core.js";
import "./kendo.splitbutton.js";
import "./kendo.dropdownbutton.js";
import "./kendo.buttongroup.js";
import "./kendo.menu.js";
import "./kendo.icons.js";

export const __meta__ = {
    id: "toolbar",
    name: "ToolBar",
    category: "web",
    description: "The ToolBar widget displays one or more command buttons divided into groups.",
    depends: ["core", "splitbutton", "dropdownbutton", "buttongroup", "menu", "icons"]
};

(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
        isFunction = kendo.isFunction,
        keys = kendo.keys,
        outerWidth = kendo._outerWidth,
        ns = ".kendoToolBar",
        TOOLBAR = "toolbar",
        KTOOLBAR = "k-toolbar",
        KBUTTON = "k-button",
        BUTTON_GROUP = "k-button-group",
        SPLIT_BUTTON = "k-split-button",
        MENU_BUTTON = "k-menu-button",
        POPUP_BUTTON = "k-popup-button",
        KSEPARATOR = "k-toolbar-separator k-separator",
        SPACER_CLASS = "k-spacer",
        UPLOAD_BUTTON = "k-upload-button",
        POPUP = "k-popup",
        RESIZABLE_TOOLBAR = "k-toolbar-resizable",
        STATE_SELECTED = "k-selected",
        STATE_DISABLED = "k-disabled",
        STATE_HIDDEN = "k-hidden",
        FORCE_HIDDEN = "k-force-hidden",
        GROUP_START = "k-group-start",
        GROUP_END = "k-group-end",
        MENU_LINK = "k-menu-link",
        MENU_ITEM = "k-menu-item",
        OVERFLOW_ANCHOR = "k-toolbar-overflow-button",
        TEMPLATE_ITEM = "k-toolbar-item",
        MENU_LINK_TOGGLE = "k-menu-link-toggle",
        DROPDOWNLIST = "k-dropdownlist",
        INPUT_BUTTON = "k-input-button",
        MENU_POPUP = "k-menu-popup",
        KFOCUS = "k-focus",
        SINGLE = "single",
        MULTIPLE = "multiple",
        NONE = "none",
        TABINDEX_MINUS_1 = "[tabindex=-1]",
        TOOLBAR_TOOL = "toolbar-tool",

        ARIA_DISABLED = "aria-disabled",
        ARIA_CHECKED = "aria-checked",
        ARIA_LABEL = "aria-label",

        CHANGE = "change",
        CLICK = "click",
        TOGGLE = "toggle",
        OPEN = "open",
        CLOSE = "close",
        FOCUS = "focus",
        FOCUSIN = "focusin",
        FOCUSOUT = "focusout",
        KEYDOWN = "keydown",

        SPACER = "spacer",
        PRIMARY = "primary",
        ROLE = "role",
        ITEM_REF = "ref-",
        SEPARATOR = "separator",
        OVERFLOW = "overflow",
        TABINDEX = "tabindex",
        INPUT = "input",
        SELECT = "select",
        HIDDEN = "hidden",
        GROUP = "group",
        DATA_UID = "data-uid",
        DATA_PARENTUID = "data-parentuid",
        DATA_ROLE_SELECTOR = "[data-role]",
        DATA_TOGGLE_SELECTOR = "[data-toggle]",
        DATA_ROLE_BUTTONMENU = "[data-role=buttonmenu]",
        ITEM_REF_SELECTOR = "[ref-toolbar-tool]",
        KENDO_FOCUSABLE = ":kendoFocusable:not([class*='pager'])",

        OVERFLOW_OPEN = "overflowOpen",
        OVERFLOW_CLOSE = "overflowClose",
        OVERFLOW_NEVER = "never",
        OVERFLOW_AUTO = "auto",
        OVERFLOW_ALWAYS = "always",

        KENDO_UID_ATTR = kendo.attr("uid"),

        NOTHING = "",
        DASH = "_",
        EMPTY = " ",
        DOT = ".",
        COMMA = ",",
        ID = "id",
        UID = "uid",
        NBSP = "&nbsp;",

        K_DROP_DOWN_BUTTON = "kendoDropDownButton",
        K_SPLIT_BUTTON = "kendoSplitButton",
        K_TOGGLE_BUTTON = "kendoToggleButton",
        K_BUTTON_GROUP = "kendoButtonGroup",

        DEFAULT_SCROLL_DISTANCE = 200;

    kendo.toolbar = {};

    var WIDGET_TYPES = {
        button: "Button",
        splitButton: "SplitButton",
        dropDownButton: "DropDownButton",
        buttonGroup: "ButtonGroup",
        popupButton: "Button",
        open: "Button"
    };

    var TOOLBAR_TOOLS_CLASSES = {
        Button: "k-toolbar-button",
        ToggleButton: "k-toolbar-toggle-button",
        SplitButton: "k-toolbar-split-button",
        DropDownButton: "k-toolbar-menu-button",
        ButtonGroup: "k-toolbar-button-group",
        ColorPicker: "k-toolbar-color-picker",
        Switch: "k-toolbar-switch"
    };

    var SAFE_COMPONENTS = ["Button", "SplitButton", "DropDownButton", "ButtonGroup", "Switch", "ColorPicker"];

    var POPUP_BUTTON_TEMPLATE = `<button class="k-popup-button"><span class="k-button-icon k-icon"></span><span class="k-button-text">${kendo.ui.icon("caret-alt-down")}</span></button>`;
    var TEMPLATE_WRAPPER = "<div class='k-toolbar-item' aria-keyshortcuts='Enter'></div>";
    var CUSTOM_WIDGET_WRAP = "<span class='k-toolbar-item' tabindex='0' ref-toolbar-tool >";
    var SEPARATOR_OVERFLOW_EL = "<li role='separator' class='k-separator k-menu-separator k-hidden'></li>";
    var SEPARATOR_EL = '<div role="separator">&nbsp;</div>';
    var SPACER_EL = '<div>&nbsp;</div>';

    var ToolBar = Widget.extend({
        init: function(element, options) {
            Widget.fn.init.call(this, element, options);

            options = this.options;

            this._isRtl = kendo.support.isRtl(element);
            this.uid = kendo.guid();

            element = this.wrapper = this.element;
            element.attr(KENDO_UID_ATTR, this.uid);
            element.addClass(KTOOLBAR);
            element.attr(ROLE, TOOLBAR);

            if (options.resizable) {
                this.hasOverflowButton = ["section", "menu"].includes(this.options.overflow?.mode);
                this._resizable();
            } else {
                options.overflow = $.extend({}, options.overflow, { mode: "none" });
            }

            if (options.tools && options.tools.length > 0) {
                options.items = this._extendToolsOptions();
            }

            if (options.items && options.items.length) {
                this._items();
            }

            this._scrollable();

            this._attachEvents();
            this._tabIndex();
            this._applyCssClasses();

            if (options.resizable) {
                if (this.hasOverflowButton) {
                    let containerWidth = this.element.find("> .k-toolbar-items").length > 0 ? this.element.find("> .k-toolbar-items")[0].offsetWidth : this.element.innerWidth();
                    this._shrink(containerWidth);
                    this.overflowAnchorSeparator?.appendTo(this.wrapper);
                    this.overflowAnchor?.appendTo(this.wrapper);
                    this._toggleOverflowAnchor();
                }
                else {
                    this._toggleScrollButtons();
                }
            }

            kendo.notify(this);
        },

        events: [
            CLICK,
            TOGGLE,
            OPEN,
            CLOSE,
            OVERFLOW_OPEN,
            OVERFLOW_CLOSE,
            CHANGE
        ],

        options: {
            name: "ToolBar",
            items: [],
            resizable: true,
            navigateOnTab: false,
            evaluateTemplates: false,
            size: "medium",
            fillMode: "solid",
            overflow: {
                mode: "menu", // scroll, menu, section, none
                scrollButtons: "auto", // auto, hidden, visible
                scrollButtonsPosition: "split", // split, start, end
                scrollDistance: DEFAULT_SCROLL_DISTANCE
            }
        },

        destroy: function() {
            var that = this;

            if (that.options.resizable) {
                kendo.unbindResize(that._resizeHandler);
                that.overflowMenu?.destroy?.();
                that.overflowSection?.destroy?.();
            }

            if (that.options.overflow?.mode == "scroll") {
                that.element.find("> .k-toolbar-items").unbind("scroll" + ns);
                that._removeScrollableClasses();
            }

            that.element.find(DOT + POPUP_BUTTON).each((i, el) => {
                var button = $(el).getKendoButton(),
                    popup, popupWrapper, chooser;

                if (button) {
                    chooser = button.chooser;
                    popup = button.popup;
                    popupWrapper = popup.wrapper;

                    chooser.destroy();
                    popup.destroy();
                    popupWrapper.remove();
                }
            });

            that.element.off(ns);
            that.element.removeAttr(DATA_UID);

            kendo.destroy(that.element.children());

            Widget.fn.destroy.call(that);
        },

        add: function(options) {
            this._add(options);

            if (this.options.resizable) {
                this.resize(true);
            }
        },


        _scrollableAllowed: function() {
            const options = this.options;

            if (options.overflow && options.overflow.mode == "scroll" && !options.overflow.scrollDistance) {
                options.overflow.scrollDistance = DEFAULT_SCROLL_DISTANCE;
            }

            return options.overflow?.mode == "scroll" && !isNaN(options.overflow.scrollDistance);
        },

        _getScrollButtonHtml: function(buttonClass, icon) {
            return kendo.html.renderButton($(`<span class="k-toolbar-${buttonClass}"></span>`), { icon: icon, type: "", size: this.options.size });
        },

        _getChildrenWidth: function(element) {
            let width = 0;
            element.children().each(function() {
                width += outerWidth($(this));
            });
            return Math.floor(width);
        },
        _removeScrollableClasses: function() {
            const that = this;
            const isHidden = that.options.overflow.scrollButtons === "hidden";

            that.element.removeClass("k-toolbar-scrollable");

            if (isHidden) {
                that.element.removeClass("k-toolbar-scrollable-overlay");
                that.element.removeClass("k-toolbar-scrollable-start");
                that.element.removeClass("k-toolbar-scrollable-end");

                that.element.removeClass("k-toolbar-items-scroll");
            }
        },
        _scrollable: function() {
            const that = this,
                toolbarElement = that.element,
                options = that.options,
                scrollButtonsPosition = options.overflow.scrollButtonsPosition,
                scrollButtonsVisibility = options.overflow.scrollButtons,
                isHidden = scrollButtonsVisibility === "hidden";

            if (that._scrollableAllowed()) {
                let scrollPrevButton,
                    scrollNextButton;

                that.element.addClass("k-toolbar-scrollable");
                let useNativeScrolling = true;
                that.element.wrapInner(`<div class="k-toolbar-items ${useNativeScrolling ? "k-toolbar-items-scroll" : ""}"></div>`);
                const scrollableElement = toolbarElement.find("> .k-toolbar-items");
                const wrapperOffset = that.element[0].offsetWidth;
                const tabGroupScroll = scrollableElement[0].scrollWidth;
                const condition = that._getChildrenWidth(scrollableElement) > scrollableElement.outerWidth();
                const enableScroll = (tabGroupScroll > wrapperOffset) || condition;

                if (enableScroll && !that._scrollableModeActive && isHidden) {
                    that.element.addClass("k-toolbar-items-scroll");
                    that.element.addClass("k-toolbar-scrollable-overlay");

                    that._scrollableModeActive = true;
                    that._toggleScrollButtons();
                } else if ((enableScroll || !isHidden) && !that._scrollableModeActive) {
                    that._nowScrollingTabs = false;
                    that._isRtl = kendo.support.isRtl(that.element);
                    const mouseDown = kendo.support.touch ? "touchstart" : "mousedown";
                    const mouseUp = kendo.support.touch ? "touchend" : "mouseup";
                    const browser = kendo.support.browser;
                    const isRtlScrollDirection = that._isRtl && !browser.msie && !browser.edge;
                    const prevIcon = !that._isRtl ? "caret-alt-left" : "caret-alt-right";
                    const nextIcon = !that._isRtl ? "caret-alt-right" : "caret-alt-left";

                    const scrollLeftButtonHtml = this._getScrollButtonHtml("prev", prevIcon);
                    const scrollRightButtonHtml = this._getScrollButtonHtml("next", nextIcon);

                    switch (scrollButtonsPosition) {
                        case 'split':
                            that.element.prepend(scrollLeftButtonHtml);
                            that.element.append(scrollRightButtonHtml);
                            break;
                        case 'start':
                            that.element.prepend(scrollRightButtonHtml);
                            that.element.prepend(scrollLeftButtonHtml);
                            break;
                        case 'end':
                            that.element.append(scrollLeftButtonHtml);
                            that.element.append(scrollRightButtonHtml);
                            break;
                    }

                    scrollPrevButton = that._scrollPrevButton = that.element.children(".k-toolbar-prev");
                    scrollNextButton = that._scrollNextButton = that.element.children(".k-toolbar-next");

                    scrollPrevButton.on(mouseDown + ns, function() {
                        that._nowScrollingTabs = true;
                        that._scrollTabsByDelta(options.overflow.scrollDistance * (isRtlScrollDirection ? 1 : -1));
                    });

                    scrollNextButton.on(mouseDown + ns, function() {
                        that._nowScrollingTabs = true;
                        that._scrollTabsByDelta(options.overflow.scrollDistance * (isRtlScrollDirection ? -1 : 1));
                    });

                    scrollPrevButton.add(scrollNextButton).on(mouseUp + ns, function() {
                        that._nowScrollingTabs = false;
                        that._toggleScrollButtons();
                    });

                    that._scrollableModeActive = true;

                    that._toggleScrollButtons();
                } else if (that._scrollableModeActive && !enableScroll && isHidden) {
                    that._scrollableModeActive = false;

                    that._removeScrollableClasses();

                    that._scrollPrevButton && that._scrollPrevButton.off().remove();
                    that._scrollNextButton && that._scrollNextButton.off().remove();
                } else if (!that._scrollableModeActive && isHidden) {
                    that._removeScrollableClasses();
                } else {
                    that._toggleScrollButtons();
                }
            }
        },

        _scrollTabsByDelta: function(delta) {
            const that = this;
            const toolbarElement = that.element;
            const scrollableElement = toolbarElement.find("> .k-toolbar-items");

            let scrOffset = kendo.scrollLeft(scrollableElement);
            const browser = kendo.support.browser;

            if (that._isRtl && (browser.mozilla || (browser.webkit && browser.version >= 85))) {
                scrOffset = scrOffset * -1;
            }

            const animationProps = { "scrollLeft": scrOffset + delta };

            scrollableElement.finish().animate(animationProps, "fast", "linear", function() {
                if (that._nowScrollingTabs && !jQuery.fx.off) {
                    that._scrollTabsByDelta(delta);
                }
            });
        },
        _toggleScrollButtons: function(forceHideButtons) {
            const that = this;

            if (!that._scrollableAllowed()) {
                return;
            }

            let toolbarElement = that.element,
                scrollableElement = toolbarElement.find("> .k-toolbar-items"),
                scrollLeft = Math.floor(kendo.scrollLeft(scrollableElement)),
                scrollButtonsVisibility = that.options.overflow.scrollButtons;

            const disableNextButton = Math.abs(scrollLeft - (scrollableElement[0].scrollWidth - scrollableElement[0].offsetWidth)) <= 1;
            const disablePrevButton = scrollLeft === 0;

            if (scrollButtonsVisibility !== "hidden") {
                that._scrollPrevButton.toggleClass(STATE_DISABLED, disablePrevButton);
                that._scrollNextButton.toggleClass(STATE_DISABLED, disableNextButton);

                if (scrollButtonsVisibility === "auto") {
                    const shouldHideScrollButtons = forceHideButtons || scrollableElement[0].scrollWidth - scrollableElement[0].offsetWidth <= 1;
                    that._scrollPrevButton.toggleClass(STATE_HIDDEN, shouldHideScrollButtons);
                    that._scrollNextButton.toggleClass(STATE_HIDDEN, shouldHideScrollButtons);
                }
            } else {
                that.element.toggleClass("k-toolbar-scrollable-start", disablePrevButton);
                that.element.toggleClass("k-toolbar-scrollable-end", disableNextButton);
            }
        },

        enable: function(candidate, enable) {
            var that = this,
                uid = this._getUid(candidate),
                item = this._getItem(candidate, uid),
                overflowItem = this._getOverflowItem(candidate, uid),
                component = item.component,
                buttonPopup, children, focused, wrapper;

            if (typeof enable == "undefined") {
                enable = true;
            }

            function enableItem(item) {
                if (item.component) {
                    wrapper = component.wrapper;
                    focused = wrapper.hasClass(KFOCUS) || wrapper.is(":focus");
                    component.enable(enable);
                    wrapper.find("[disabled]").removeAttr("disabled");
                    wrapper.removeAttr("disabled");

                    if (focused) {
                        wrapper.addClass(KFOCUS).trigger(FOCUS);
                    }
                } else if (item.buttonsPopupItem.length > 0) {
                    buttonPopup = kendo.widgetInstance(item.buttonsPopupItem.closest(DOT + MENU_POPUP));
                    buttonPopup.enable(enable, item.buttonsPopupItem);
                }
            }

            if (this.overflowSection && overflowItem) {
                enableItem(overflowItem);
            }

            if (!item) {
                return;
            }

            enableItem(item);

            if (this.overflowMenu) {
                this.overflowMenu.enable(item.menuItem, enable);

                children = this.overflowMenu.element
                    .find("[data-parentuid=" + uid + "]");

                children.each((i, el) => {
                    that.overflowMenu.enable($(el), enable);
                });
            }
        },

        getSelectedFromGroup: function(groupName) {
            return this.element.find("[data-group='" + groupName + "']").filter(DOT + STATE_SELECTED);
        },

        hide: function(candidate) {
            var that = this,
                uid = this._getUid(candidate),
                item = that._getItem(candidate, uid),
                overflowItem = that._getOverflowItem(candidate, uid),
                elements, parentButtonGroup, children, parentGroupEl;

            if (!item && !overflowItem) {
                return;
            }

            function hideItem(item, isOverflowItem) {
                elements = item.templateEl.add(item.toolbarEl).add(item.buttonsPopupItem).add(item.menuItem);
                elements.addClass(STATE_HIDDEN);
                elements.addClass(FORCE_HIDDEN);

                parentGroupEl = item.toolbarEl.parent().closest(DOT + BUTTON_GROUP);
                parentButtonGroup = parentGroupEl.data(K_BUTTON_GROUP);

                if (parentButtonGroup) {
                    if (parentGroupEl.children(":not(.k-hidden)").length === 0) {
                        that.hide(parentGroupEl);
                    } else {
                        that._groupVisibleButtons(parentGroupEl);
                    }
                }

                if (elements.find("[tabindex=0]").addBack("[tabindex=0]").length > 0) {
                    that._resetTabIndex(that._getAllItems(isOverflowItem).first());
                }
            }

            if (this.overflowSection && overflowItem) {
                hideItem(overflowItem, true);
            }

            if (item) {
                hideItem(item);

                if (this.overflowMenu) {
                    children = this.overflowMenu.element
                        .find("[data-parentuid=" + uid + "]");

                    children.each((i, el) => {
                        $(el).addClass(FORCE_HIDDEN);
                        $(el).addClass(STATE_HIDDEN);
                    });
                }
            }

            if (this.options.resizable) {
                this.resize(true);
            }
        },

        remove: function(candidate) {
            var that = this,
                uid = this._getUid(candidate),
                item = this._getItem(candidate, uid),
                overflowItem = this._getOverflowItem(candidate, uid),
                buttonGroup, children;

            if (!item && !overflowItem) {
                return;
            }

            function removeItem(item) {
                if (item.component) {
                    buttonGroup = item.toolbarEl.closest('[data-role="buttongroup"]');
                    if (buttonGroup.length > 0 && item.toolbarEl.siblings().length === 0) {
                        buttonGroup.data(K_BUTTON_GROUP).destroy();
                        buttonGroup.remove();

                        item.toolbarEl = $(NOTHING);
                    } else {
                        item.component.destroy();
                    }
                }

                if (item.templateEl.length > 0) {
                    item.templateEl.remove();
                } else if (item.toolbarEl.length > 0) {
                    item.toolbarEl.remove();
                }

                if (item.buttonsPopupItem.length > 0) {
                    item.buttonsPopupItem.remove();
                }
            }

            if (this.overflowSection && overflowItem) {
                removeItem(overflowItem);
            }

            if (item) {
                removeItem(item);

                if (this.overflowMenu) {
                    this.overflowMenu.remove(item.menuItem);

                    children = this.overflowMenu.element
                        .find("[data-parentuid=" + uid + "]");

                    children.each((i, el) => {
                        that.overflowMenu.remove($(el));
                    });
                }
            }

            if (this.options.resizable) {
                this.resize(true);
            }
        },

        show: function(candidate) {
            var that = this,
                uid = this._getUid(candidate),
                item = this._getItem(candidate, uid),
                overflowItem = this._getOverflowItem(candidate, uid),
                elements, parentButtonGroup, children, parentGroupEl;

            function showItem(item) {
                elements = item.templateEl.add(item.toolbarEl).add(item.buttonsPopupItem);
                elements.removeClass(FORCE_HIDDEN);
                elements.removeClass(STATE_HIDDEN);

                parentGroupEl = item.toolbarEl.parent().closest(DOT + BUTTON_GROUP);
                parentButtonGroup = parentGroupEl.data(K_BUTTON_GROUP);

                if (parentButtonGroup) {
                    if (parentGroupEl.hasClass("k-hidden") && parentGroupEl.children(":not(.k-hidden)").length > 0) {
                        that.show(parentGroupEl);
                    } else {
                        that._groupVisibleButtons(parentGroupEl);
                    }
                }
            }

            if (this.overflowSection && overflowItem) {
                showItem(overflowItem);
            }

            if (item) {
                showItem(item);
                item.menuItem.removeClass(FORCE_HIDDEN);
                if (this.overflowMenu) {
                    children = this.overflowMenu.element
                        .find("[data-parentuid=" + uid + "]");

                    children.each((i, el) => {
                        $(el).removeClass(FORCE_HIDDEN);
                    });
                }
            }

            if (this.options.resizable) {
                this.resize(true);
            }
        },

        toggle: function(candidate, checked) {
            var item = this._getItem(candidate),
                overflowItem = this._getOverflowItem(candidate),
                menuItem = item.menuItem;

            if (checked === undefined) {
                checked = true;
            }

            function toggleItem(item) {
                const element = item.toolbarEl;
                const button = element.data(K_TOGGLE_BUTTON);

                if (!item.component && menuItem.find(DOT + MENU_LINK_TOGGLE).length === 0) {
                    return;
                }

                const group = element.data(GROUP);

                if (item.component) {
                    const parentGroup = element.closest(DOT + BUTTON_GROUP).data(K_BUTTON_GROUP);

                    if (parentGroup) {
                        if (element.hasClass(STATE_SELECTED) !== checked) {
                            parentGroup._toggleIndex(element.index());
                        }
                    }

                    button.toggle(checked);

                    if (checked) {
                        const groupButtons = element.closest(".k-toolbar,.k-toolbar-popup").find("[data-group=" + group + "]");

                        groupButtons.each((i, el) => {
                            if (el !== element[0]) {
                                $(el).data(K_TOGGLE_BUTTON).toggle(false);
                            }
                        });
                    }
                }
            }

            if (this.overflowSection && overflowItem) {
                toggleItem(overflowItem);
            }

            if (!item) {
                return;
            }

            toggleItem(item);

            if (menuItem) {
                const group = item.toolbarEl.data(GROUP);

                menuItem
                    .attr(ARIA_CHECKED, checked)
                    .find(DOT + MENU_LINK_TOGGLE)
                    .toggleClass(STATE_SELECTED, checked);

                if (checked && this.overflowMenu) {
                    const groupButtons = this.overflowMenu.element.find("[data-group=" + group + "]");

                    groupButtons.each((i, el) => {
                        if (el !== menuItem[0]) {
                            $(el)
                                .attr(ARIA_CHECKED, false)
                                .find(DOT + MENU_LINK_TOGGLE)
                                .removeClass(STATE_SELECTED);
                        }
                    });
                }
            }
        },

        toggleTools: function(conditions) {
            var that = this,
                tools = that.element.find(DATA_TOGGLE_SELECTOR),
                focusable = that.element.find(KENDO_FOCUSABLE).not(TABINDEX_MINUS_1);

            tools.each(function(index, elm) {
                var tool = $(elm),
                    widget = null,
                    condition = tool.data(TOGGLE),
                    toToggle = conditions && conditions[condition];

                if (tool.is(DATA_ROLE_SELECTOR)) {
                    widget = kendo.widgetInstance(tool);
                }

                if (widget && widget.enable) {
                    widget.enable(toToggle || false);
                } else {
                    that.enable(tool, toToggle);
                }
            });

            that.element.find(DATA_TOGGLE_SELECTOR + "[disabled]").removeAttr("disabled");

            that.element.find(KENDO_FOCUSABLE).not(TABINDEX_MINUS_1).attr("tabindex", -1);
            focusable.attr(TABINDEX, 0);
        },

        _generateToolElement: function(template, overflowTemplate, type, processed) {
            let element;

            if (template || overflowTemplate) {
                element = this._addTemplate(processed);
            } else if (kendo.ui[processed.component]) {
                element = this._addCustomWidget(processed);
            } else if (type) {
                element = this._addDefaultTool(type, processed);
            } else if (processed.type === SPACER) {
                this._addSpacer();
            } else if (processed.type === SEPARATOR) {
                this._addSeparator(processed);
            }
            return element;
        },

        _add: function(options) {
            var processed = this._processOptions(options),
                template = processed.template,
                overflowTemplate = processed.overflowTemplate,
                type = WIDGET_TYPES[processed.type];
            let element;

            if (processed.overflow !== OVERFLOW_ALWAYS || this.options.overflow?.mode == "menu") {
                element = this._generateToolElement(template, overflowTemplate, type, processed);

                if (element && processed.overflow !== OVERFLOW_ALWAYS) {
                    if (this.overflowAnchor && this.overflowAnchorSeparator) {
                        element.insertBefore(this.overflowAnchorSeparator);
                    } else {
                        element.appendTo(this.element);
                    }

                    element.find("[disabled]").removeAttr("disabled");

                    if (element.is("[disabled]")) {
                        element.removeAttr("disabled");
                    }
                }
            }

            if (this.options.overflow?.mode == "section" && processed.overflow !== OVERFLOW_NEVER) {
                if (processed.type === SPACER) {
                    return this._addSpacer(this._overflowSectionContentElement());
                }

                if (processed.type === SEPARATOR) {
                    return;
                }

                let sectionElement = this._generateToolElement(template, overflowTemplate, type, processed);

                if (sectionElement) {
                    this._overflowSectionContentElement().append(sectionElement);
                    if (processed.overflow !== OVERFLOW_ALWAYS) {
                        sectionElement.addClass(STATE_HIDDEN);
                    }

                    sectionElement.find("[disabled]").removeAttr("disabled");

                    if (sectionElement.is("[disabled]")) {
                        sectionElement.removeAttr("disabled");
                    }
                    sectionElement.attr("ref-section-tool", element?.attr("data-uid") || "");
                }
            }
        },

        _addAttributes: function(options, element) {
            var attributes = options.attributes,
                classes = NOTHING;

            if (!attributes) {
                attributes = {};
            }

            if (options.hidden) {
                classes = STATE_HIDDEN + EMPTY + FORCE_HIDDEN;
            }

            if (options.align) {
                classes = classes + " k-align-" + options.align;
            }

            if (attributes) {
                if (attributes.class) {
                    classes = classes + EMPTY + attributes.class;
                    delete attributes.class;
                }

                element.attr(attributes);
            }

            element.addClass(classes);
            element.attr(KENDO_UID_ATTR, options.uid);

            if (options.id) {
                element.attr(ID, options.id);
            }
            if (options.overflow === OVERFLOW_NEVER) {
                element.attr("data-overflow", OVERFLOW_NEVER);
            }

            if (options.items) {
                options.items.forEach(item => {
                    if (item && item.groupClass && !element.hasClass(item.groupClass)) {
                        element.addClass(item.groupClass);
                    }
                });
            }
        },

        _addCustomWidget: function(options) {
            var element = $(options.element || "<input>"),
                widget, result, classes;

            if (options.overflowComponent) {
                this._addMenuItem(options.overflowComponent.type, $.extend({}, options, options.overflowComponent));
            }

            if (options.attributes) {
                classes = options.attributes.class;
                delete options.attributes["class"];
                element.attr(options.attributes);
                delete options.attributes[ARIA_LABEL];
            }

            if (!options.componentOptions) {
                options.componentOptions = {};
            }

            options.componentOptions.size = this.options.size;

            widget = new kendo.ui[options.component](element, options.componentOptions);

            if (SAFE_COMPONENTS.indexOf(options.component) > -1) {
                widget.wrapper.addClass(TOOLBAR_TOOLS_CLASSES[options.component]).attr(ITEM_REF + TOOLBAR_TOOL, '');
                result = widget.wrapper;
            } else {
                result = (widget.wrapper || widget.element).wrap(CUSTOM_WIDGET_WRAP).parent();
            }

            if (options.attributes) {
                options.attributes.class = classes;
            }

            this._addAttributes(options, result);

            return result;
        },

        _addDefaultTool: function(component, options) {
            var element, op;
            let toolbar = this;

            if (options.overflow !== OVERFLOW_ALWAYS || (toolbar.overflowSection && options.overflow !== OVERFLOW_NEVER)) {
                element = toolbar._addToolbarTool(component, $.extend(true, {}, options));
            }

            if (toolbar.overflowMenu && options.overflow !== OVERFLOW_NEVER) {
                if (options.overflowComponent) {
                    op = $.extend(true, {}, options, options.overflowComponent);
                    delete op["data-command"];
                    toolbar._addMenuItem("Button", op);
                } else {
                    toolbar._addMenuItem(component, $.extend(true, {}, options));
                }
            }

            return element;
        },

        _addMenuItem: function(component, options) {
            var that = this,
                selected = options.selected,
                menuitem;

            delete options.selected;

            if (options.id) {
                options.id = options.id + DASH + OVERFLOW;
            }
            if (options.showIcon === TOOLBAR) {
                delete options.imageUrl;
                delete options.icon;
            }

            if (options.showText === TOOLBAR) {
                if (!options.attributes) {
                    options.attributes = {};
                }

                options.attributes[ARIA_LABEL] = options.text;

                options.text = NOTHING;
            } else if (options.text === undefined || options.text === NOTHING) {
                options.text = NBSP;
                options.encoded = false;
            }

            that.overflowMenu?.append(options);
            menuitem = that.overflowMenu.element.find(DOT + MENU_ITEM).last();

            if (component === "ToggleButton" || (component === "Button" && options.togglable === true)) {
                menuitem.find(DOT + MENU_LINK).addClass(MENU_LINK_TOGGLE);

                if (selected) {
                    menuitem.find(DOT + MENU_LINK).addClass(STATE_SELECTED);
                }

                if (options.group) {
                    menuitem.attr("data-group", options.group);
                }
            } else if (options.menuButtons) {
                options.menuButtons.forEach((i) => {
                    i.overflow = options.overflow;
                    that._addMenuItem(null, i);
                });
            } else if (options.buttons) {
                menuitem.remove();
                menuitem = null;

                options.buttons.forEach((i) => {
                    var attributes = i.attributes;
                    i.overflow = options.overflow;
                    i.attributes = $.extend(attributes, options.attributes);

                    that._addMenuItem("Button", i);
                });
            }

            if (component === "DropDownButton") {
                menuitem.addClass(STATE_DISABLED);
                menuitem.attr(ARIA_DISABLED, true);
            }

            if (menuitem) {
                that._addAttributes(options, menuitem);

                if (options.overflow === OVERFLOW_AUTO) {
                    menuitem.addClass(STATE_HIDDEN);
                }

                if (options.click || options.toggle) {
                    that.overflowMenu.bind(SELECT, (e) => {
                        if (e.item === menuitem[0]) {
                            this._onMenuItemSelect(e, options.click, options.toggle);
                        }
                    });
                }
            }

            return menuitem;
        },

        _addPopupButton: function(options) {
            var that = this,
                widgetElement = $(POPUP_BUTTON_TEMPLATE),
                component = options.popupComponent,
                popup, chooser;

            widgetElement.attr(ARIA_LABEL, options.text);

            popup = $("<div/>").appendTo($("<body>")).kendoPopup({
                anchor: widgetElement
            }).data("kendoPopup");

            widgetElement.on(CLICK + " touchend", (e) => {
                popup.toggle();
                e.preventDefault();
            });

            chooser = new component(popup.element);

            chooser.bind(options.commandOn, (e) => {
                that.trigger(CHANGE, { target: widgetElement, value: e.value || e });
                popup.close();
            });

            return { widgetElement, chooser, popup };
        },

        _addSeparator: function(options) {
            var separator = $(SEPARATOR_EL),
                overflowSeparator = $(SEPARATOR_OVERFLOW_EL);
            const id = options.id;

            separator.addClass(KSEPARATOR);
            separator.attr(ROLE, SEPARATOR);

            if (this.overflowAnchor && this.overflowAnchorSeparator) {
                separator.insertBefore(this.overflowAnchorSeparator);
            } else {
                separator.appendTo(this.element);
            }

            this._addAttributes(options, separator);

            if (options.id) {
                options.id = options.id + DASH + OVERFLOW;
            }

            this._addAttributes(options, overflowSeparator);

            if (this.overflowMenu) {
                this.overflowMenu.element.append(overflowSeparator);
            }

            if (this.overflowSection) {
                const sectionSeparator = $(SEPARATOR_EL)
                    .addClass(KSEPARATOR)
                    .addClass(STATE_HIDDEN)
                    .attr(ROLE, SEPARATOR)
                    .attr("ref-section-tool", options.uid);

                let sectionSeparatorOptions = id ? $.extend(true, options, { id: id + DASH + "section-overflow" }) : options;

                this._addAttributes(sectionSeparatorOptions, sectionSeparator);
                this._overflowSectionContentElement().append(sectionSeparator);
            }
        },

        _addSpacer: function(destinationElement) {
            var spacer = $(SPACER_EL);
            spacer.addClass(SPACER_CLASS);

            if (this.overflowAnchor && this.overflowAnchorSeparator) {
                spacer.insertBefore(this.overflowAnchorSeparator);
            } else {
                spacer.appendTo(destinationElement || this.element);
            }
        },
        _overflowSectionContentElement: function() {
            return this.overflowSection?.element.find(".k-toolbar-items-list");
        },
        _addTemplate: function(options) {
            var template = options.template,
                overflowTemplate = options.overflowTemplate,
                element, menuitem, inputsInTemplate = $(NOTHING);

            if (overflowTemplate && this.overflowMenu && options.overflow !== OVERFLOW_NEVER) {
                overflowTemplate = isFunction(overflowTemplate) ? overflowTemplate(options)[0] : overflowTemplate;
                this.overflowMenu.append({});
                menuitem = this.overflowMenu.element
                    .find(DOT + MENU_ITEM)
                    .last()
                    .find(DOT + MENU_LINK)
                    .html(overflowTemplate)
                    .parent();
            }

            if (template && options.overflow !== OVERFLOW_ALWAYS) {
                if (this.options.evaluateTemplates) {
                    template = kendo.template(template);
                }

                template = isFunction(template) ? template(options) : template;

                element = $(TEMPLATE_WRAPPER);
                element.html(template);

                if (menuitem) {
                    menuitem.addClass(STATE_HIDDEN);
                }
            }

            if (element) {
                inputsInTemplate = element.find(INPUT + COMMA + SELECT);
                this._addAttributes(options, element);
            }

            if (menuitem) {
                inputsInTemplate.add(menuitem.find(INPUT + COMMA + SELECT));
                this._addAttributes(options, menuitem);
            }

            if (!this.options.navigateOnTab && inputsInTemplate.length > 0) {
                element.attr(TABINDEX, 0);
                element.attr(ITEM_REF + TOOLBAR_TOOL, '');
                inputsInTemplate.attr(TABINDEX, -1);
            }

            return element;
        },

        _addToolbarTool: function(component, options) {
            var widgetElement = $("<button>"),
                hasButtons = false,
                widget, element, popupRef;

            if (options.primary === true) {
                options.themeColor = PRIMARY;
            }
            if (options.url) {
                widgetElement = $("<a href='" + kendo.sanitizeLink(options.url) + "'>");
            }
            if (options.showIcon === OVERFLOW) {
                delete options.imageUrl;
                delete options.icon;
            }
            if (options.showText !== OVERFLOW) {
                widgetElement.text(options.text);
            } else {
                widgetElement.attr(ARIA_LABEL, options.text);
            }

            if (options.type === "popupButton") {
                popupRef = this._addPopupButton(options);
                widgetElement = popupRef.widgetElement;
            } else if (component === "Button" && options.togglable === true) {
                component = "ToggleButton";
            } else if (options.menuButtons) {
                options.items = options.menuButtons;
                delete options.menuButtons;

                if (options.attributes && options.attributes.class) {
                    widgetElement.addClass(options.attributes.class);
                }

                widgetElement.attr(DATA_UID, options.uid);
                delete options.uid;
            } else if (options.buttons) {
                widgetElement = $("<span></span>");
                hasButtons = true;
                options.items = options.buttons;
                delete options.buttons;

                options.preventKeyNav = true;

                options.items.forEach(i => {
                    if (i.showIcon === OVERFLOW) {
                        delete i.imageUrl;
                        delete i.icon;
                    }

                    if (i.showText === OVERFLOW) {
                        if (!i.attributes) {
                            i.attributes = {};
                        }

                        i.attributes[ARIA_LABEL] = i.text;

                        delete i.text;
                    }
                });
            }

            if (options.id) {
                widgetElement.attr(ID, options.id);
                delete options.id;
            }

            // Remove the name property. Otherwise the default component name will be overriden.
            // This will cause us to init an element with data-role=${name} instead of the correct data-role of the component.
            if (options.name) {
                delete options.name;
            }

            options.size = this.options.size;

            widget = new kendo.ui[component]($(widgetElement), options);
            element = widget.wrapper || widget.element;
            element.addClass(TOOLBAR_TOOLS_CLASSES[component]);
            this._addAttributes(options, element);

            if (options.url) {
                widgetElement.removeAttr(ROLE);
            }

            if (hasButtons) {
                element.find(DOT + KBUTTON).attr(ITEM_REF + TOOLBAR_TOOL, '');
                this._groupVisibleButtons(element);
            } else {
                widget.element.attr(ITEM_REF + TOOLBAR_TOOL, '');
            }

            if (options.type !== "popupButton" && options.type !== "open") {
                this._attachWidgetEvents(widget);
            } else if (options.type === "open") {
                widgetElement.addClass(UPLOAD_BUTTON);
                this._resetOpen(widgetElement, options.extensions);
                element = widgetElement.parent();
            } else {
                widget.chooser = popupRef.chooser;
                widget.popup = popupRef.popup;
            }

            return element;
        },

        _attachEvents: function() {
            var that = this,
                options = that.options;

            that.element.on(KEYDOWN + ns, that._keydown.bind(that))
                .on(FOCUSIN + ns, that._focusIn.bind(that))
                .on(FOCUSOUT + ns, that._focusOut.bind(that));

            if (options.overflow?.mode == "section" && that.overflowSection) {
                that._overflowSectionContentElement().on(KEYDOWN + ns, that._keydown.bind(that));
            }

            if (options.overflow?.mode == "scroll") {
                that.element.find("> .k-toolbar-items").bind("scroll", function(e) {
                    if (!that._nowScrollingTabs) {
                        that._toggleScrollButtons();
                    }
                });
            }
        },

        _attachWidgetEvents: function(widget) {
            var that = this;

            widget.bind(CLICK, that._onClick.bind(that));
            widget.bind(TOGGLE, that._onToggle.bind(that));
            widget.bind(SELECT, that._onSelect.bind(that));
            widget.bind(OPEN, that._onOpen.bind(that));
            widget.bind(CLOSE, that._onClose.bind(that));

            widget.wrapper.find(DOT + KBUTTON).each((i, el) => {
                var $el = $(el);

                if ($el.data("kendoButton")) {
                    $el.data("kendoButton").bind(CLICK, (e) => {
                        that.trigger(CLICK, { id: e.id, target: e.target, originalEvent: e.originalEvent || e.event });
                    });
                }
            });
        },

        _childrenWidth: function() {
            var gap = parseInt(this.element.css('gap'), 10) || 0;
            var childrenWidth = gap;
            let container = this.element.find("> .k-toolbar-items").length > 0 ? this.element.find("> .k-toolbar-items") : this.element;

            container.children(":visible:not(" + DOT + SPACER_CLASS + ")").each(function() {
                childrenWidth += outerWidth($(this), false) + gap;
            });

            return Math.ceil(childrenWidth);
        },

        _extendToolsOptions: function() {
            var options = this.options,
                items = options.tools.flatMap((tool) => this._mapTool(tool, options.parentMessages, options.defaultTools));

            this.options.items = items;

            return items;
        },

        _focusIn: function(e) {
            var target = $(e.target),
                button = target.closest(DOT + KBUTTON);

            if (button.length > 0) {
                this._resetTabIndex(button);
                button.addClass(KFOCUS);
            }
        },

        _focusOut: function(e) {
            this.wrapper.find(DOT + KBUTTON + DOT + KFOCUS).removeClass(KFOCUS);
        },

        _getAllItems: function(isSection, skipDisabled) {
            let container = isSection == true ? this._overflowSectionContentElement() : this.wrapper;
            return container.find(ITEM_REF_SELECTOR + (skipDisabled ? ":not(.k-disabled)" : ""))
                .filter(":visible")
                .filter((i, el) => {
                    if (el.style.visibility === HIDDEN) {
                        return false;
                    }

                    return true;
                });
        },

        _getOverflowItem: function(candidate, knownUid) {
            return this._getItem(candidate, knownUid, this._overflowSectionContentElement());
        },

        _getItem: function(candidate, knownUid, container) {
            var uid = knownUid || this._getUid(candidate),
                buttonsPopups = $(DATA_ROLE_BUTTONMENU),
                uidSelector, toolbarEl;

            if (!uid) {
                return {
                    toolbarEl: (container || this.element).find(candidate),
                    templateEl: $(NOTHING),
                    menuItem: this.overflowMenu ? this.overflowMenu.element.find(candidate) : $(NOTHING),
                    buttonsPopupItem: $(NOTHING)
                };
            }

            uidSelector = "[data-uid=" + uid + "]";
            toolbarEl = (container || this.element).find(uidSelector);

            return {
                toolbarEl: toolbarEl,
                templateEl: toolbarEl.closest(DOT + TEMPLATE_ITEM + COMMA + DOT + SPLIT_BUTTON),
                component: kendo.widgetInstance(toolbarEl),
                menuItem: this.overflowMenu ? this.overflowMenu.element.find(uidSelector) : $(NOTHING),
                buttonsPopupItem: buttonsPopups.find(uidSelector)
            };
        },

        _getNextElement: function(item, direction) {
            const isSection = $(item).closest(".k-toolbar-popup").length > 0;
            var items = this._getAllItems(isSection, true),
                itemIndex = items.index(item) === -1 ? items.index(item.parentElement) : items.index(item),
                focusableItem = items[itemIndex + direction];

            if (!focusableItem) {
                if (direction === -1) {
                    focusableItem = items.last();
                } else {
                    focusableItem = items.first();
                }
            }

            return focusableItem;
        },

        _getUid: function(candidate) {
            var element;

            // find toolbar item by jQuery selector
            element = this.element.find(candidate);

            // if not found find in in the DropDown-/SplitButton popups
            if (!element.length) {
                element = $(DATA_ROLE_BUTTONMENU).find(candidate);
            }

            // if not, find it in the OverflowMenu
            if (!element.length && this.overflowMenu) {
                element = this.overflowMenu.element.find(candidate);
            }

            // if not, find it in the OverflowSection
            if (!element.length && this.overflowSection) {
                element = this._overflowSectionContentElement().find(candidate);
            }

            if (!element.length) {
                return null;
            } else {
                return element.data(UID) || element.closest(ITEM_REF_SELECTOR).data(UID);
            }
        },

        _groupVisibleButtons: function(el) {
            var buttons = el.children(),
                visibleBtns;

            buttons.removeClass(GROUP_END).removeClass(GROUP_START);
            visibleBtns = buttons.filter(":not('." + STATE_HIDDEN + "')");
            visibleBtns.first().addClass(GROUP_START);
            visibleBtns.last().addClass(GROUP_END);
        },

        _hideItem: function(item) {
            var that = this,
                widget;

            item.addClass(STATE_HIDDEN);

            if (this.overflowSection) {
                this._overflowSectionContentElement().find(`[ref-section-tool=${item.data("uid")}]`).removeClass(STATE_HIDDEN);
            }

            if (that.overflowMenu) {
                if (item.hasClass(SPLIT_BUTTON) || item.hasClass(MENU_BUTTON)) {
                    if (item.hasClass(SPLIT_BUTTON)) {
                        item = item.children().eq(0);
                        widget = item.data(K_SPLIT_BUTTON);
                    } else {
                        widget = item.data(K_DROP_DOWN_BUTTON);
                    }

                    widget.menu.list.children().each((i, el) => {
                        that._showMenuItem($(el));
                    });

                    that._showMenuItem(item);
                } else if (item.hasClass(BUTTON_GROUP)) {
                    item.children().each((i, el) => {
                        that._showMenuItem($(el));
                    });
                } else {
                    that._showMenuItem(item);
                }
            }
        },

        _hideMenuItem: function(item) {
            this.overflowMenu.element
                .find(">li[data-uid='" + item.data(UID) + "']")
                .addClass(STATE_HIDDEN);
        },

        _items: function() {
            let options = this.options;

            for (var i = 0; i < options.items.length; i++) {
                this._add(options.items[i]);
            }
        },

        _keydown: function(e) {
            var target = $(e.target),
                keyCode = e.keyCode,
                templateItem = target.closest(DOT + TEMPLATE_ITEM),
                isOverflowAnchor = target.is(DOT + OVERFLOW_ANCHOR);
            const isInSection = target.closest(DOT + "k-toolbar-popup").length > 0;

            if (!this.options.navigateOnTab && !target.is(ITEM_REF_SELECTOR) && keyCode === keys.ESC && templateItem.length > 0) {
                e.stopPropagation();
                this._keyDeactivateTemplate(templateItem);
                return;
            }

            if (!target.is(ITEM_REF_SELECTOR)) {
                return;
            }

            if (!this.options.navigateOnTab && keyCode === keys.ENTER && target.hasClass(TEMPLATE_ITEM)) {
                this._keyActivateTemplate(target);
            } else if (isInSection && keyCode === keys.ESC) {
                this.overflowSection.close();
                this.element.trigger(FOCUS);
            } else if (isOverflowAnchor && (e.altKey && keyCode === keys.DOWN || keyCode === keys.SPACEBAR)) {
                this._keyOpenOverflow(e, keyCode);
            } else if (keyCode === keys.HOME) {
                this._keyFocusFirst(target, e);
            } else if (keyCode === keys.END) {
                this._keyFocusLast(target, e);
            } else if (!this.options.navigateOnTab && (keyCode === keys.RIGHT || keyCode === keys.LEFT)) {
                this._keyFocusNext(keyCode, e);
            }
        },

        _keyActivateTemplate: function(target) {
            var innerFocusable = target.find(KENDO_FOCUSABLE + ":not('" + DOT + INPUT_BUTTON + "')" + COMMA + DOT + DROPDOWNLIST);
            const pagerTool = target.find('.k-pager');

            if (pagerTool.length > 0) {
                pagerTool.trigger(FOCUS);
            } else if (innerFocusable.length > 0) {
                target.attr(TABINDEX, -1);

                innerFocusable.attr(TABINDEX, 0);
                innerFocusable.first().trigger(FOCUS);
            }
        },

        _keyDeactivateTemplate: function(templateItem) {
            var innerWidget = templateItem.find(DATA_ROLE_SELECTOR),
                innerFocusable = templateItem.find(KENDO_FOCUSABLE + ":not('" + DOT + INPUT_BUTTON + "')" + COMMA + DOT + DROPDOWNLIST),
                widgetInstance;

            if (innerWidget.length > 0) {
                widgetInstance = kendo.widgetInstance(innerWidget);

                if (widgetInstance) {
                    if (widgetInstance.overflowMenu && widgetInstance.overflowMenu.visible()) {
                        return;
                    } else {
                        templateItem.attr(TABINDEX, 0);
                        templateItem.trigger(FOCUS);
                        templateItem.find(KENDO_FOCUSABLE).attr(TABINDEX, -1);
                    }
                }
            }

            if (innerFocusable.length > 0) {
                templateItem.attr(TABINDEX, 0);
                templateItem.trigger(FOCUS);
                innerFocusable.attr(TABINDEX, -1);
            }
        },

        _keyFocusFirst: function(target, e) {
            const isSection = target.closest(".k-toolbar-popup").length > 0;
            var items = this._getAllItems(isSection, true);

            if (target.is(DOT + DROPDOWNLIST) || target.is(INPUT)) {
                return;
            }

            this._resetTabIndex(items.first());
            items.first().trigger(FOCUS);
            e.preventDefault();
        },

        _keyFocusLast: function(target, e) {
            const isSection = target.closest(".k-toolbar-popup").length > 0;
            var items = this._getAllItems(isSection, true),
                last;

            if (target.is(DOT + DROPDOWNLIST) || target.is(INPUT)) {
                return;
            }

            last = items.last();

            if (last.width() === 0) {
                last = items.eq(items.length - 2);
            }

            this._resetTabIndex(last);
            last.trigger(FOCUS);
            e.preventDefault();
        },

        _keyFocusNext: function(keyCode, e) {
            var direction = this._isRtl ? -1 : 1,
                next;

            if (keyCode === keys.LEFT) {
                direction = -1 * direction;
            }

            next = $(this._getNextElement(e.target, direction));
            this._resetTabIndex(next);
            next.trigger(FOCUS);

            e.preventDefault();
        },

        _keyOpenOverflow: function(e, keyCode) {
            if (keyCode === keys.SPACEBAR) {
                e.preventDefault();
            }

            (this.overflowMenu || this.overflowSection).open();
        },

        _mapAttributes: function(toolOptions, messages) {
            return {
                "aria-label": messages[toolOptions.name || toolOptions.property],
                "title": messages[toolOptions.name || toolOptions.property],
                "data-command": toolOptions.command,
                "data-options": toolOptions.options,
                "data-dialog": toolOptions.dialog,
                "data-property": toolOptions.property,
                "data-value": toolOptions.value,
                "data-toggle": toolOptions.toggleCondition
            };
        },

        _mapComponent: function(component, messages) {
            var that = this,
                componentOptions = component.componentOptions,
                componentMessages = componentOptions.messages,
                componentPlaceholder = componentOptions.placeholder,
                attributes = $.extend({}, that._mapAttributes(component, messages), component.attributes),
                options;

            if (component.overflowComponent) {
                options = component.options || {};

                if (component.componentOptions.dataSource) {
                    options.options = component.componentOptions.dataSource;
                }
                if (component.componentOptions.value) {
                    options.default = component.componentOptions.value;
                }

                if (Object.keys(options).length > 0) {
                    component.overflowComponent.options = JSON.stringify(options);
                }

                component.overflowComponent = that._mapTool(component.overflowComponent, messages);
            }

            if (componentMessages) {
                Object.keys(componentMessages).forEach((key) => {
                    component.componentOptions.messages[key] = messages[componentMessages[key]] || componentMessages[key];
                });
            }

            if (componentPlaceholder) {
                component.componentOptions.placeholder = messages[componentPlaceholder] || componentPlaceholder;
            }

            Object.keys(componentOptions).forEach((key) => {
                if (key === "commandOn") {
                    component.componentOptions[componentOptions[key]] = (ev) => {
                        that.trigger(CHANGE, { target: ev.target || ev.sender.element });
                    };
                }
            });

            if (componentOptions.dataSource && componentOptions.dataSource.length) {
                component.componentOptions.dataSource = componentOptions.dataSource.map(i => {
                    if (i.name && messages[i.name]) {
                        i.text = messages[i.name];
                    }

                    return i;
                });
            }

            component.attributes = attributes;

            return component;
        },

        _mapTool: function(tool, messages, defaultTools) {
            let that = this,
                isArray = Array.isArray(tool),
                isPlainObjectTool = $.isPlainObject(tool),
                toolKeysCount = isPlainObjectTool && Object.keys(tool).length,
                isBuiltInTool, toolOptions, attributes, originalTool;

            if (isArray) {
                return {
                    type: "buttonGroup",
                    buttons: tool.map(t => that._mapTool(t, messages, defaultTools))
                };
            }

            isBuiltInTool = isPlainObjectTool && (toolKeysCount === 1 || toolKeysCount === 2) && tool.name;
            originalTool = isBuiltInTool ? tool : {};
            tool = isBuiltInTool ? tool.name : tool;
            toolOptions = $.isPlainObject(tool) ? tool : $.extend({}, defaultTools[tool]);

            attributes = $.extend({}, that._mapAttributes(toolOptions, messages), toolOptions.attributes);

            kendo.deepExtend(toolOptions, {
                text: originalTool.text || messages[toolOptions.name || toolOptions.property],
                attributes: attributes,
            });

            if (toolOptions.type === "component") {
                if (toolOptions.items) {
                    return toolOptions.items.map(t => that._mapComponent(t, messages));
                } else {
                    return that._mapComponent(toolOptions, messages);
                }
            } else if (toolOptions.type === "buttonGroup") {
                delete toolOptions.attributes[ARIA_LABEL];
                toolOptions.buttons = toolOptions.buttons.map(t => that._mapTool(t, messages, defaultTools));
            } else if (toolOptions.type === "splitButton") {
                delete toolOptions.attributes[ARIA_LABEL];
                toolOptions.menuButtons = toolOptions.menuButtons.flatMap(t => that._mapTool(t, messages, defaultTools));
            } else if (toolOptions.type === "popupButton" && toolOptions.overflowComponent) {
                toolOptions.overflowComponent = that._mapTool(toolOptions.overflowComponent, messages);
            }

            delete toolOptions.name;

            return toolOptions;
        },

        _menuItemSelect: function(e) {
            var item = $(e.item),
                id = item.attr(ID),
                togglable = item.find(DOT + MENU_LINK_TOGGLE),
                groupName = item.data(GROUP),
                shouldSelect, twin, group;

            if (id && id.indexOf(DASH + OVERFLOW) > -1) {
                id = id.replace(DASH + OVERFLOW, NOTHING);
            }

            if (togglable.length) {
                if (groupName) {
                    this.overflowMenu.element.find("[data-group=" + groupName + "]").each((i, el) => {
                        var current = $(el);

                        current.attr(ARIA_CHECKED, false);
                        current.find(DOT + MENU_LINK_TOGGLE).removeClass(STATE_SELECTED);
                    });
                }

                shouldSelect = groupName ? true : !togglable.hasClass(STATE_SELECTED);

                togglable.toggleClass(STATE_SELECTED, shouldSelect);
                item.attr(ARIA_CHECKED, shouldSelect);

                twin = this.element.find("[data-uid=" + item.data(UID) + "]");

                if (twin.length) {
                    if (twin.closest(DOT + BUTTON_GROUP).length) {
                        group = twin.closest(DOT + BUTTON_GROUP).data(K_BUTTON_GROUP);
                        group.select(twin);
                    } else {
                        if (groupName) {
                            this.element.find("[data-group=" + groupName + "]").each((i, el) => {
                                $(el).data(K_TOGGLE_BUTTON).toggle(false);
                            });
                        }

                        twin.data(K_TOGGLE_BUTTON).toggle(true);
                    }
                }

                this.trigger(TOGGLE, {
                    id: item.attr(ID),
                    target: item,
                    checked: shouldSelect
                });
            } else {
                this.trigger(CLICK, {
                    id: id,
                    target: item,
                });
            }
        },

        _onClick: function(e) {
            var el = e.target,
                togglable = el.hasClass("k-toolbar-toggle-button"),
                group = el.data(GROUP);

            if (!togglable) {
                this.trigger(CLICK, { id: e.id, target: e.target, originalEvent: e.originalEvent || e.event });
            }

            if (group && this.element.find("[data-group=" + group + "]").length > 1) {
                if (el.hasClass(STATE_SELECTED)) {
                    e.preventDefault();
                }
            }
        },

        _onClose: function(e) {
            if (this.trigger(CLOSE, { widget: e.sender })) {
                e.preventDefault();
            }
        },

        _onMenuItemSelect: function(e, click, toggle) {
            var item = $(e.item),
                togglable = item.find(DOT + MENU_LINK_TOGGLE).length > 0,
                id = item.attr(ID);

            if (id && id.indexOf(DASH + OVERFLOW) > -1) {
                id = id.replace(DASH + OVERFLOW, NOTHING);
            }

            if (click) {
                click.bind(this)({
                    event: e.event,
                    id: id,
                    target: item
                });
            }

            if (togglable && toggle) {
                setTimeout(() => {
                    toggle.bind(this)({
                        event: e.event,
                        id: id,
                        target: item,
                        checked: item.find(DOT + STATE_SELECTED).length > 0
                    });
                });
            }
        },

        _onOpen: function(e) {
            if (this.trigger(OPEN, { widget: e.sender })) {
                e.preventDefault();
            }
        },

        // triggered on Radio group select action
        _onSelect: function(e) {
            let that = this;
            var menuEl = this.overflowMenu ? this.overflowMenu.element : $(NOTHING);

            e.sender.element.children().each((i, el) => {
                var current = $(el),
                    uid = current.data(UID),
                    dataUidSelector = `[data-uid=${uid}]`,
                    selected = current.hasClass(STATE_SELECTED);

                menuEl
                    .find(dataUidSelector)
                    .attr(ARIA_CHECKED, selected)
                    .find(DOT + MENU_LINK_TOGGLE)
                    .toggleClass(STATE_SELECTED, selected);

                if (that.overflowSection) {
                    let mainItem = that.element.find(dataUidSelector);
                    let overflowItem = that.overflowSection.element.find(dataUidSelector);

                    let component = kendo.widgetInstance(mainItem[0] == el ? overflowItem : mainItem);
                    //sync the main item with the overflow item
                    component?.toggle?.(selected);
                }
            });

            this.trigger(TOGGLE, {
                id: e.target.attr(ID),
                target: e.target,
                checked: e.target.hasClass(STATE_SELECTED)
            });
        },

        _onToggle: function(e) {
            var that = this,
                el = e.target,
                group = el.data(GROUP),
                overflowItem,
                overflowGroup;

            if (that.overflowMenu) {
                overflowItem = that.overflowMenu.element.find("[data-uid=" + el.attr(DATA_UID) + "]");
                overflowGroup = that.overflowMenu.element.find("[data-group=" + group + "]");

                overflowGroup.attr(ARIA_CHECKED, false).find(DOT + MENU_LINK_TOGGLE).removeClass(STATE_SELECTED);
                overflowItem.attr(ARIA_CHECKED, true).find(DOT + MENU_LINK_TOGGLE).addClass(STATE_SELECTED);
            }

            if (that.overflowSection) {
                let mainItem = that.element.find("[data-uid=" + el.attr(DATA_UID) + "]");
                overflowItem = that.overflowSection.element.find("[data-uid=" + el.attr(DATA_UID) + "]");
                let component = kendo.widgetInstance(mainItem[0] == e.target[0] ? overflowItem : mainItem);
                //sync the main item with the overflow item
                component?.toggle?.(e.checked);
            }

            if (group) {
                that.element.find("[data-group=" + group + "]").each((i, item) => {
                    if (item !== el[0]) {
                        $(item).data(K_TOGGLE_BUTTON).toggle(false);
                    }
                });
            }

            this.trigger(TOGGLE, { id: e.id, target: e.target, checked: e.checked, originalEvent: e.originalEvent || e.event });
        },

        _processInner(items, parentUid) {
            var attributes, current;

            for (var i = 0; i < items.length; i++) {
                current = items[i];
                attributes = current.attributes;

                if (!attributes) {
                    items[i].attributes = {};
                }

                items[i].attributes[DATA_UID] = kendo.guid();
                items[i].attributes[DATA_PARENTUID] = parentUid;

                if (current.id) {
                    items[i].attributes[ID] = items[i].id;
                }

                if (current.hidden) {
                    if (!items[i].attributes.class) {
                        items[i].attributes.class = NOTHING;
                    }

                    items[i].attributes.class += (EMPTY + STATE_HIDDEN + EMPTY + FORCE_HIDDEN);
                }
            }

            return items;
        },

        _processOptions: function(options) {
            let that = this,
                template = options.template,
                overflowTemplate = options.overflowTemplate,
                uid = kendo.guid(),
                groupName;

            $.extend(options, {
                uid: uid,
                fillMode: options.fillMode ? options.fillMode : that.options.fillMode,
                rootUid: this.uid
            });

            if (options.menuButtons) {
                options.menuButtons = this._processInner(options.menuButtons, uid);
            } else if (options.buttons && options.buttons.length) {
                options.buttons = this._processInner(options.buttons, uid);

                if (options.buttons.some(b => b.togglable)) {
                    groupName = options.buttons[0].group;

                    if (!!groupName && options.buttons.every(b => b.group === groupName)) {
                        options.selection = SINGLE;
                    } else {
                        options.selection = MULTIPLE;
                    }
                } else {
                    options.selection = NONE;
                }
            }

            if ((template && !overflowTemplate) || options.type === SPACER) {
                options.overflow = OVERFLOW_NEVER;
            } else if (!options.overflow) {
                options.overflow = OVERFLOW_AUTO;
            }

            if (options.enable !== undefined) {
                options.enabled = options.enable;
            }

            return options;
        },

        _renderOverflow: function() {
            var that = this,
                isRtl = that._isRtl,
                horizontalDirection = isRtl ? "left" : "right";
            const overflowMode = that.options.overflow?.mode;

            if (overflowMode !== "section" && overflowMode !== "menu") {
                return;
            }

            that.overflowAnchorSeparator = $(`<div class="k-toolbar-separator k-toolbar-button-separator k-separator" ${ROLE}="${SEPARATOR}"></div>`);
            that.overflowAnchor = $("<button class='k-toolbar-overflow-button' title='More tools'>");
            that.overflowAnchor.attr(ITEM_REF + TOOLBAR_TOOL, '');
            that.element.append(that.overflowAnchorSeparator);
            that.element.append(that.overflowAnchor);
            that.overflowAnchor.kendoButton({
                icon: overflowMode == "menu" ? "more-vertical" : "more-horizontal",
                fillMode: "flat",
                size: that.options.size,
                click: function(e) {
                    // open the overflow menu depending on the overflowMode
                    if (overflowMode == "section") {
                        that.overflowSection.open();
                    }
                }
            });

            if (!that.options.navigateOnTab) {
                that.overflowAnchor.attr(TABINDEX, -1);
            }


            if (overflowMode == "section") {
                that.overflowSection = new kendo.ui.Popup($(`<div class="k-toolbar-popup"><div class="k-toolbar-items-list ${kendo.getValidCssClass("k-toolbar-items-list-", "fill", that.options.fillMode)}  ${kendo.getValidCssClass("k-toolbar-items-list-", "size", that.options.size)}"></div></div>`), {
                    anchor: that.element,
                    origin: "bottom left",
                    position: "top left",
                    open: function(e) {
                        if (that.trigger(OVERFLOW_OPEN)) {
                            return e.preventDefault();
                        }

                        that.overflowSection.element.width(that.element.outerWidth());
                    },
                    activate: function(e) {
                        const isSection = true;
                        let firstFocusableSectionItem = that._getAllItems(isSection, true).first();
                        that._resetTabIndex(firstFocusableSectionItem);
                        firstFocusableSectionItem.trigger(FOCUS);
                    },
                    close: function(e) {
                        if (that.trigger(OVERFLOW_CLOSE)) {
                            e.preventDefault();
                        } else {
                            that._resetTabIndex(that.overflowAnchor);
                            that.overflowAnchor.trigger(FOCUS);
                        }
                    }
                });
            }

            if (overflowMode == "menu") {
                that.overflowMenu = new kendo.ui.ContextMenu($("<ul>"), {
                    size: that.options.size,
                    showOn: "click tap",
                    origin: "bottom " + horizontalDirection,
                    position: "top " + horizontalDirection,
                    alignToAnchor: true,
                    target: that.overflowAnchor,
                    open: function(e) {
                        if (that.trigger(OVERFLOW_OPEN)) {
                            e.preventDefault();
                        }
                    },
                    close: function(e) {
                        if (that.trigger(OVERFLOW_CLOSE)) {
                            e.preventDefault();
                        } else {
                            that._resetTabIndex(that.overflowAnchor);
                            that.overflowAnchor.trigger(FOCUS);
                        }
                    }
                });

                that.overflowMenu.element.attr(KENDO_UID_ATTR, this.uid);

                setTimeout(() => {
                    that.overflowMenu.bind(SELECT, that._menuItemSelect.bind(that));
                });
            }
        },

        _resetOpen: function(element, extensions) {
            var that = this,
                uploadWrapper,
                input;

            element.closest(".k-upload-button-wrap").find("input").remove();
            uploadWrapper = element.wrap("<div class='k-upload-button-wrap'></span>").parent();

            input = $("<input type='file' autocomplete='off' accept='" + extensions + "'/>")
                .attr("aria-hidden", true)
                .one("change", (e) => {
                    that.trigger(CHANGE, {
                        target: element,
                        value: e.target.files[0]
                    });

                    that._resetOpen(element, extensions);
                })
                .appendTo(uploadWrapper);

            element.off(KEYDOWN).on(KEYDOWN, (e) => {
                if (e.keyCode === kendo.keys.ENTER) {
                    input.trigger(CLICK);
                }
            });
        },

        _resetTabIndex: function(toFocus) {
            if (this.options.navigateOnTab !== true) {
                const isSection = toFocus.closest(".k-toolbar-popup").length > 0;
                const containerToSearch = isSection ? this._overflowSectionContentElement() : this.wrapper;
                containerToSearch.find(KENDO_FOCUSABLE).attr(TABINDEX, -1);
                toFocus.attr(TABINDEX, 0);
            }
        },

        _resizable: function() {
            var that = this,
                element = that.element;

            that._renderOverflow();
            element.addClass(RESIZABLE_TOOLBAR);

            that._resizeHandler = kendo.onResize(function() {
                that.resize();
            });
        },

        _resize: function(e) {
            var containerWidth = e.width,
                wrapper = this.element,
                popupBtnElements = wrapper.find('[data-role="splitbutton"]').add(wrapper.find('[data-role="dropdownbutton"]'));

            if (!this.options.resizable) {
                return;
            }

            this.overflowMenu?.close();
            this.overflowSection?.close();

            if (popupBtnElements.length > 0) {
                popupBtnElements.each((i, el) => {
                    kendo.widgetInstance($(el)).close();
                });
            }

            if (this.hasOverflowButton) {
                this._shrink(containerWidth);
                this._stretch(containerWidth);
                this._toggleOverflowAnchor();
            }
            else {
                this._toggleScrollButtons();
            }
        },

        _shrink: function(containerWidth) {
            var commandElement,
                visibleCommands,
                activeElement;
            let container = this.element.find("> .k-toolbar-items").length > 0 ? this.element.find("> .k-toolbar-items") : this.element;

            if (containerWidth < this._childrenWidth()) {
                visibleCommands = container.children(":visible:not([data-overflow='never'], ." + OVERFLOW_ANCHOR + ")");

                for (var i = visibleCommands.length - 1; i >= 0; i--) {
                    commandElement = visibleCommands.eq(i);

                    if (containerWidth > this._childrenWidth()) {
                        break;
                    } else {
                        activeElement = commandElement.find("[tabindex=0]") || commandElement.is("[tabindex=0]") ? commandElement : $(NOTHING);

                        if (activeElement.length > 0) {
                            activeElement.attr(TABINDEX, -1);
                            this.element.children(DOT + OVERFLOW_ANCHOR).attr(TABINDEX, 0);
                        }

                        this._hideItem(commandElement);
                    }
                }
            }
        },

        _showItem: function(item, containerWidth) {
            var that = this,
                gap = parseInt(this.element.css('gap'), 10) || 0,
                widget;

            item.removeClass(STATE_HIDDEN);
            var itemOuterWidth = outerWidth(item, true) + gap;
            item.addClass(STATE_HIDDEN);

            if (item.length && (item.hasClass(SPACER_CLASS) || containerWidth > this._childrenWidth() + itemOuterWidth)) {
                item.removeClass(STATE_HIDDEN);

                if (this.options.navigateOnTab !== true) {
                    item.find(KENDO_FOCUSABLE).attr(TABINDEX, -1);
                } else {
                    if (item.is("[tabindex=-1]")) {
                        item.removeAttr(TABINDEX);
                    }
                }

                if (this.overflowSection) {
                    this._overflowSectionContentElement().find(`[ref-section-tool=${item.data("uid")}]`).addClass(STATE_HIDDEN);
                }

                if (this.overflowMenu) {
                    if (item.hasClass(SPLIT_BUTTON) || item.hasClass(MENU_BUTTON)) {
                        if (item.hasClass(SPLIT_BUTTON)) {
                            item = item.children().eq(0);
                            widget = item.data(K_SPLIT_BUTTON);
                        } else {
                            widget = item.data(K_DROP_DOWN_BUTTON);
                        }

                        widget.menu.list.children().each((i, el) => {
                            that._hideMenuItem($(el));
                        });

                        that._hideMenuItem(item);
                    } else if (item.hasClass(BUTTON_GROUP)) {
                        item.children().each((i, el) => {
                            that._hideMenuItem($(el));
                        });
                    } else {
                        that._hideMenuItem(item);
                    }
                }

                return true;
            }

            return false;
        },

        _showMenuItem: function(item) {
            var menuItem = this.overflowMenu.element.find(">li[data-uid='" + item.data(UID) + "']");

            if (!menuItem.hasClass(FORCE_HIDDEN)) {
                menuItem.removeClass(STATE_HIDDEN);
            }
        },

        _stretch: function(containerWidth) {
            var overflowAnchor = this.element.children(DOT + OVERFLOW_ANCHOR),
                commandElement,
                hiddenCommands;
            let container = this.element.find("> .k-toolbar-items").length > 0 ? this.element.find("> .k-toolbar-items") : this.element;

            if (containerWidth > this._childrenWidth()) {
                hiddenCommands = container.children(DOT + STATE_HIDDEN + ":not(" + DOT + FORCE_HIDDEN + ")");

                for (var i = 0; i < hiddenCommands.length; i++) {
                    commandElement = hiddenCommands.eq(i);

                    if (containerWidth < this._childrenWidth() || !this._showItem(commandElement, containerWidth)) {
                        break;
                    }
                }
            }

            if (!this.options.navigateOnTab && overflowAnchor.is("[tabindex=0]")) {
                overflowAnchor.attr(TABINDEX, -1);
                this._resetTabIndex(this._getAllItems().first());
            }
        },

        _tabIndex: function() {
            var focusableItems = this.wrapper.find(KENDO_FOCUSABLE + ":not('" + TABINDEX_MINUS_1 + "')"),
                firstFocusable = focusableItems.first();

            if (this.options.navigateOnTab !== true) {
                focusableItems.attr(TABINDEX, -1);
                firstFocusable.attr(TABINDEX, 0);
            } else {
                this.wrapper.find(".k-toolbar-item").removeAttr(TABINDEX);
            }
        },

        _toggleOverflowAnchor: function() {
            var hasVisibleChildren = false;
            if (!this.hasOverflowButton) {
                return;
            }

            hasVisibleChildren = (this.overflowMenu?.element || this._overflowSectionContentElement()).children(":not(." + STATE_HIDDEN + ", ." + POPUP + ")").length > 0;

            if (hasVisibleChildren) {
                this.overflowAnchor.removeClass(STATE_HIDDEN);
                this.overflowAnchorSeparator.removeClass(STATE_HIDDEN);
            } else {
                this.overflowAnchor.addClass(STATE_HIDDEN);
                this.overflowAnchorSeparator.addClass(STATE_HIDDEN);
            }
        }
    });

    kendo.toolbar = {
        Item: kendo.Class,
        OverflowButton: kendo.Class,
        TemplateItem: kendo.Class,
        ToolBarButton: kendo.Class,
        registerComponent: () => null
    };

    kendo.cssProperties.registerPrefix("ToolBar", "k-toolbar-");

    kendo.cssProperties.registerValues("ToolBar", [{
        prop: "fillMode",
        values: ['solid', 'flat']
    }]);

    kendo.ui.plugin(ToolBar);
})(window.kendo.jQuery);
export default kendo;

