import { roughlyEqual } from "../../helpers/unit/general-utils.js";
import { SplitterHelpers } from "../../helpers/unit/splitter-utils.js";

let splitter;
let create = SplitterHelpers.create;

describe("splitter collapse", function() {
    beforeEach(SplitterHelpers.basicModule.setup);
    afterEach(SplitterHelpers.basicModule.teardown);

    it("clicking collapse arrow triggers collapse event", function() {
        let triggered = false;

        splitter = create({
            panes: [{ collapsible: true }, {}],
            collapse: function(e) {
                triggered = e;
            }
        });

        splitter.dom.find(".k-collapse-prev").trigger("click");

        assert.isOk(triggered);
        assert.equal(triggered.pane, splitter.dom.find(".k-pane:first")[0]);
    });

    it("collapse event can be prevented", function() {
        splitter = create({
            panes: [{ collapsible: true }, {}],
            collapse: function(e) {
                e.preventDefault();
            }
        });

        splitter.dom.find(".k-i-caret-alt-left").trigger("click");

        assert.isOk(!splitter.dom.find(".k-pane:first").data("pane").collapsed);
    });

    it("clicking collapse arrow calls splitter.collapse", function() {
        let called;

        splitter = create({
            panes: [{ collapsible: true }, {}]
        });

        splitter.object.collapse = function(pane) {
            called = pane;
        };

        splitter.dom.find(".k-collapse-prev").trigger("click");

        assert.equal(called, splitter.dom.find(".k-pane:first")[0]);
    });

    it("double-clicking splitbar next to an expanded collapsible pane should call splitter.collapse", function() {
        let called;

        splitter = create({
            panes: [{ collapsible: true }, {}]
        });

        splitter.object.collapse = function(pane) {
            called = pane;
        };

        splitter.dom.find(".k-splitbar").trigger("dblclick");

        assert.equal(called, splitter.dom.find(".k-pane:first")[0]);
    });

    it("double-clicking splitbar prev to an expanded collapsible pane should call splitter.collapse", function() {
        let called;

        splitter = create({
            panes: [{}, { collapsible: true }]
        });

        splitter.object.collapse = function(pane) {
            called = pane;
        };

        splitter.dom.find(".k-splitbar").trigger("dblclick");

        assert.equal(called, splitter.dom.find(".k-pane:last")[0]);
    });
});


describe("splitter expand", function() {
    beforeEach(SplitterHelpers.basicModule.setup);
    afterEach(SplitterHelpers.basicModule.teardown);

    it("clicking expand arrow triggers expand event", function() {
        let triggered = false;

        splitter = create({
            panes: [{ collapsible: true, collapsed: true }, {}],
            expand: function(e) {
                triggered = e;
            }
        });

        splitter.dom.find(".k-expand-prev").trigger("click");

        assert.isOk(triggered);
        assert.equal(triggered.pane, splitter.dom.find(".k-pane:first")[0]);
    });

    it("expand event can be prevented", function() {
        splitter = create({
            panes: [{ collapsible: true, collapsed: true }, {}],
            expand: function(e) {
                e.preventDefault();
            }
        });

        splitter.dom.find(".k-expand-prev").trigger("click");

        assert.isOk(splitter.dom.find(".k-pane:first").data("pane").collapsed);
    });

    it("clicking expand arrow calls splitter.expand", function() {
        let called;
        splitter = create({
            panes: [{ collapsible: true, collapsed: true }, {}]
        });

        splitter.object.expand = function(pane) {
            called = pane;
        };

        splitter.dom.find(".k-expand-prev").trigger("click");

        assert.equal(called, splitter.dom.find(".k-pane:first")[0]);
    });

    it("double-clicking splitbar next to an collapsed collapsible pane should call splitter.collapse", function() {
        let called;
        splitter = create({
            panes: [{ collapsible: true, collapsed: true }, {}]
        });

        splitter.object.expand = function(pane) {
            called = pane;
        };

        splitter.dom.find(".k-splitbar").trigger("dblclick");

        assert.equal(called, splitter.dom.find(".k-pane:first")[0]);
    });

    it("double-clicking splitbar prev to an collapsed collapsible pane should call splitter.collapse", function() {
        let called;

        splitter = create({
            panes: [{}, { collapsible: true, collapsed: true }]
        });

        splitter.object.expand = function(pane) {
            called = pane;
        };

        splitter.dom.find(".k-splitbar").trigger("dblclick");

        assert.equal(called, splitter.dom.find(".k-pane:last")[0]);
    });

    it("double-clicking splitbar between two collapsible panes does not trigger collapse", function() {
        let called;
        splitter = create({
            panes: [{ collapsible: true }, { collapsible: true }]
        });

        splitter.object.collapse = function(pane) {
            called = pane;
        };

        splitter.dom.find(".k-splitbar").trigger("dblclick");

        assert.isOk(!called);
    });

    it("expanding a non-resizable pane does not make it resizable", function() {
        splitter = create({
            panes: [
                { resizable: false, collapsible: true, collapsed: true },
                { collapsible: false }
            ]
        });

        splitter.object.expand(".k-pane:first");

        assert.isOk(splitter.dom.find(".k-splitbar").is(":not(.k-splitbar-draggable-horizontal)"));
    });

    it("expanding a non-resizable pane does not modify more splitbars than necessary", function() {
        splitter = create({
            panes: [
                { resizable: false, collapsible: true, collapsed: true },
                { collapsible: false },
                { collapsible: false }
            ]
        }, 3);

        splitter.object.expand(".k-pane:first");

        assert.isOk(splitter.dom.find(".k-splitbar:first").is(":not(.k-splitbar-draggable-horizontal)"));
        assert.isOk(splitter.dom.find(".k-splitbar:last").is(".k-splitbar-draggable-horizontal"));
    });

    it("initially collapsed pane has an overflow:hidden style", function() {
        splitter = create({
            panes: [
                { collapsed: true },
                { collapsed: false },
                { collapsed: false }
            ]
        }, 3);

        assert.equal(splitter.dom.find(".k-pane:first").css("overflow"), "hidden");
    });

    it("expanding a previously collapsed pane removes its overflow:hidden style", function() {
        splitter = create({
            panes: [
                { collapsible: true, collapsed: false },
                { collapsed: false },
                { collapsed: false }
            ]
        }, 3);

        splitter.object.collapse(".k-pane:first");
        assert.equal(splitter.dom.find(".k-pane:first").css("overflow"), "hidden");

        splitter.object.expand(".k-pane:first");

        assert.notEqual(splitter.dom.find(".k-pane:first").css("overflow"), "hidden");
    });

    it("collapsing pane disables collapsing of next pane", function() {
        splitter = create({
            panes: [{ collapsible: true }, { collapsible: true }]
        });

        splitter.object.collapse(".k-pane:first");

        assert.isOk(splitter.dom.find(".k-splitbar").is(":not(.k-splitbar-draggable-horizontal)"));
        assert.isOk(!splitter.dom.find(".k-splitbar .k-i-caret-alt-left").length);
    });

    it("collapsing pane disables collapsing of previous pane", function() {
        splitter = create({
            panes: [{ collapsible: true }, { collapsible: true }]
        });

        splitter.object.collapse(".k-pane:last");

        assert.isOk(splitter.dom.find(".k-splitbar").is(":not(.k-splitbar-draggable-horizontal)"));
        assert.isOk(!splitter.dom.find(".k-splitbar .k-i-caret-alt-right").length);
    });

    // The fluid pane should stay as a buffer as it would distort the fixed size of the remaining static panes
    it.skip("collapsing the last fluid pane distributes remaining size to neighbour pane", function() {
        splitter = create({
            panes: [
                { collapsible: true, size: "50px" },
                { collapsible: true }
            ]
        });

        splitter.object.collapse(".k-pane:last");

        assert.equal(Math.floor(splitter.dom.find(".k-pane:first").width()), Math.floor(splitter.dom.width()) - 12);
        assert.equal(Math.floor(splitter.dom.find(".k-splitbar:first")[0].offsetLeft), Math.floor(splitter.dom.width()) - 12);
    });
    // The fluid pane should stay as a buffer as it would distort the fixed size of the remaining static panes
    it.skip("collapsing the last fluid pane in vertical splitter distributes remaining size to neighbour pane", function() {
        splitter = create({
            orientation: "vertical",
            panes: [
                { collapsible: true, size: "50px" },
                { collapsible: true }
            ]
        });

        splitter.object.collapse(".k-pane:last");

        assert.equal(Math.floor(splitter.dom.find(".k-pane:first").height()), Math.floor(splitter.dom.height()) - 12);
        assert.equal(Math.floor(splitter.dom.find(".k-splitbar:first")[0].offsetTop), Math.floor(splitter.dom.height()) - 12);
    });

    it("collapsing a pane adds an overflow:hidden style to it", function() {
        splitter = create({
            panes: [
                { collapsible: true },
                { collapsible: true }
            ]
        });

        splitter.object.collapse(".k-pane:first");

        assert.equal(splitter.dom.find(".k-pane:first").css("overflow"), "hidden");
    });

    it("collapsing pane does not add overlay to frames", function() {
        $.mockjax({
            url: "http://foo",
            responseText: "foo"
        });

        splitter = create({
            panes: [
                { collapsible: true },
                { contentUrl: "http://foo" }
            ]
        });

        splitter.dom.find(".k-i-caret-alt-left")
            .trigger("mousedown")
            .trigger("mouseup")
            .trigger("click");

        assert.equal(splitter.dom.find(".k-overlay").length, 0);
    });

    it("test name", function() {
        splitter = create({
            panes: [{ collapsible: true }, {}]
        });

        splitter.dom.find(".k-i-caret-alt-left")
            .trigger("mousedown");

        splitter.dom.find(".k-overlay:first")
            .trigger("mouseup")
            .trigger("click");

        assert.equal(splitter.dom.find(".k-overlay").length, 0);
    });

    it("collapsed panes can be expanded again", function() {
        splitter = create({
            panes: [
                { collapsible: true },
                {}
            ]
        });

        splitter.dom.find(".k-i-caret-alt-up").click();

        splitter.dom.find(".k-i-caret-alt-down").click();

        assert.equal(splitter.dom.find(".k-pane:first").width(), 96);
    });

    it("panes can be collapsed after resizing", function() {
        splitter = create({
            panes: [{ collapsible: true }, {}]
        });

        let keys = kendo.keys,
            splitbar = splitter.dom.find(".k-splitbar"),
            initialLeft = splitbar.position().left;

        splitbar.focus().press({
            keyCode: keys.LEFT
        });

        splitbar.focus().press({
            keyCode: keys.ENTER
        });

        splitbar.find(".k-collapse-prev").click();

        assert.equal(splitter.dom.find(".k-pane:first").width(), 0);
    });

    it("collapsible pane with collapsedSize collapses to this size", function() {
        splitter = create({
            panes: [
                { collapsible: true, collapsedSize: "20px" },
                {}
            ]
        });

        splitter.dom.find(".k-collapse-prev").click();

        assert.equal(Math.floor(splitter.dom.find(".k-pane:first").width()), 20);
    });

    it("collapsed pane with collapsedSize is rendered with this size", function() {
        splitter = create({
            panes: [
                { collapsible: true, collapsed: true, collapsedSize: "20px" },
                {}
            ]
        });

        assert.equal(splitter.dom.find(".k-pane:first").width(), 20);
    });

    it("collapsible pane adds k-collapsed class when collapsed", function() {
        splitter = create({
            panes: [
                { collapsible: true },
                {}
            ]
        });

        splitter.dom.find(".k-collapse-prev").click();

        assert.isOk(splitter.dom.find(".k-pane:first").hasClass("k-collapsed"));
    });

});
