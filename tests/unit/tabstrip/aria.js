import '@progress/kendo-ui/src/kendo.tabstrip.js';

let TabStrip = kendo.ui.TabStrip,
    keys = kendo.keys,
    div;

function addItems(count) {
    let tabstrip = div.data("kendoTabStrip");

    for (let i = 0; i < count; i++) {
        tabstrip.append({
            text: "Item" + i
        });
    }
}

describe("tabstrip accessibility with AXE", function() {
    beforeEach(function() {
        div = $('<div id="test">');
        div.appendTo(Mocha.fixture);
    });

    afterEach(function() {
        kendo.destroy(div);
    });

    it("TabStrip is accessible", async function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [
                { text: "foo", content: "bar" },
                { text: "foo2", content: "bar2" },
                { text: "foo3", content: "bar3" }
            ]
        });

        await axeRunFixture();
    });

    it("TabStrip with selected tab is accessible", async function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [
                { text: "foo", content: "bar" },
                { text: "foo2", content: "bar2" },
                { text: "foo3", content: "bar3" }
            ],
            value: "foo2"
        });

        await axeRunFixture();
    });

    it("collapsible TabStrip is accessible", async function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [
                { text: "foo", content: "bar" },
                { text: "foo2", content: "bar2" },
                { text: "foo3", content: "bar3" }
            ],
            collapsible: true
        });

        await axeRunFixture();
    });

    it("vertical TabStrip is accessible", async function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [
                { text: "foo", content: "bar" },
                { text: "foo2", content: "bar2" },
                { text: "foo3", content: "bar3" }
            ],
            tabPosition: "left"
        });

        await axeRunFixture();
    });

    it("scrollable TabStrip is accessible", async function() {
        div.width("100px");
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [
                { text: "foo", content: "bar" },
                { text: "foo2", content: "bar2" },
                { text: "foo3", content: "bar3" }
            ]
        });

        await axeRunFixture();
    });

    it("collapsible TabStrip with selected tab is accessible", async function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [
                { text: "foo", content: "bar" },
                { text: "foo2", content: "bar2" },
                { text: "foo3", content: "bar3" }
            ],
            collapsible: true,
            value: "foo2"
        });

        await axeRunFixture();
    });

    it("vertical TabStrip with selected tab is accessible", async function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [
                { text: "foo", content: "bar" },
                { text: "foo2", content: "bar2" },
                { text: "foo3", content: "bar3" }
            ],
            tabPosition: "left",
            value: "foo2"
        });

        await axeRunFixture();
    });

    it("scrollable TabStrip with selected tab is accessible", async function() {
        div.width("100px");
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [
                { text: "foo", content: "bar" },
                { text: "foo2", content: "bar2" },
                { text: "foo3", content: "bar3" }
            ],
            value: "foo2"
        });

        await axeRunFixture();
    });
});

describe("tabstrip aria", function() {
    beforeEach(function() {
        div = $('<div id="test">');
        div.appendTo(Mocha.fixture);
    });
    afterEach(function() {
        kendo.destroy(div);
    });

    it("tablist role is added to the wrapper", function() {
        let tabstrip = div.kendoTabStrip().data("kendoTabStrip");

        assert.equal(tabstrip.tabGroup.attr("role"), "tablist");
    });

    it("tab role is set to items", function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataSource: [{ text: "foo", content: "bar" }]
        });

        assert.equal(div.find("li[role=tab]").text(), "foo");
    });

    it("tab role is set to items when created from html", function() {
        div = $('<div id="test"><ul><li>foo</li><li>bar</li></ul></div>').kendoTabStrip();

        assert.equal(div.find("li[role=tab]").length, 2);
    });

    it("aria-orientation is set to 'vertical' for vertical TabStrip", function() {
        let tabstrip = div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [{ text: "foo", content: "bar" }],
            tabPosition: "left"
        }).data("kendoTabStrip");

        assert.equal(tabstrip.tabGroup.attr("aria-orientation"), "vertical");
    });

    it("tabpanel role is set to the content items", function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [{ text: "foo", content: "bar" }]
        });

        assert.equal(div.find("div[role=tabpanel]").text(), "bar");
    });

    it("tabpanel role is set to content items when created from html", function() {
        div = $('<div id="test"><ul><li>foo</li><li>bar</li></ul><div>foo content</div><div>bar content</div></div>')
            .kendoTabStrip();

        assert.equal(div.find("div[role=tabpanel]").length, 2);
    });

    it("TabStrip adds aria-controls to the tab items", function() {
        div = $('<div id="test"><ul><li>foo</li><li>bar</li></ul><div>foo content</div><div>bar content</div></div>')
            .kendoTabStrip();

        assert.equal(div.find("li[role=tab]").eq(0).attr("aria-controls"), "test-1");
    });

    it("TabStrip does not replace the id attributes of content items", function() {
        div = $('<div id="test"><ul><li>foo</li><li>bar</li></ul><div id="customId">foo content</div><div>bar content</div></div>')
            .kendoTabStrip();

        assert.equal(div.find(".k-tabstrip-content").attr("id"), "customId");
    });

    it("TabStrip does not replace the id attributes of Tab items", function() {
        div = $('<div id="test"><ul><li id="first">foo</li id="second"><li id="third">bar</li></ul><div id="customId">foo content</div><div>bar content</div></div>')
            .kendoTabStrip();

        assert.equal(div.find(".k-item").attr("id"), "first");
    });

    it("TabStrip render aria-controls with guid if no id", function() {
        div = $('<div><ul><li>foo</li><li>bar</li></ul><div>foo content</div><div>bar content</div></div>')
            .kendoTabStrip();

        assert.isOk(div.find("li[role=tab]").eq(0).attr("aria-controls"));
    });

    it("hidden attribute is set to the content if tab is not visible", function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [{ text: "foo", content: "foo content" }, { text: "bar", content: "bar content" }]
        });

        assert.equal(div.find("div[aria-hidden=true]").length, 2);
    });

    it("hidden attribute is set to the content if tab is not visible when created from html", function() {
        div = $('<div id="test"><ul><li>foo</li><li>bar</li></ul><div>foo content</div><div>bar content</div></div>')
            .kendoTabStrip();

        assert.equal(div.find("div[aria-hidden=true]").length, 2);
    });

    it("aria-hidden is removed from the content if tab is activated", function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [{ text: "foo", content: "foo content" }, { text: "bar", content: "bar content" }]
        });

        div.data("kendoTabStrip").select(1);

        assert.equal(div.find("div[aria-hidden=true]").length, 1);
        assert.equal(div.find("div[aria-hidden=true]").text(), "foo content");
    });

    it("aria-hidden false is set to the prev active content if another tab is activated", function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [{ text: "foo", content: "foo content" }, { text: "bar", content: "bar content" }]
        });

        div.data("kendoTabStrip").select(1);
        div.data("kendoTabStrip").select(0);

        assert.equal(div.find("div[aria-hidden=true]").length, 1);
        assert.equal(div.find("div[aria-hidden=true]").text(), "bar content");
    });

    it("aria-hidden is set to the content if tab is deactivated", function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [{ text: "foo", content: "foo content" }, { text: "bar", content: "bar content" }]
        });

        div.data("kendoTabStrip").select(0);
        div.data("kendoTabStrip").deactivateTab(div.find("li:first"));

        assert.equal(div.find("div[aria-hidden=true]").length, 2);
    });


    it("aria-hidden false is set to the prev active content if another unexisting tab is activated", function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [{ text: "foo", content: "foo content" }, { text: "bar", content: "bar content" }, { text: "bar" }]
        });

        div.data("kendoTabStrip").select(1);
        div.data("kendoTabStrip").select(2);

        assert.equal(div.find("div[aria-hidden=true]").length, 2);
        assert.equal(div.find("div[aria-hidden=true]:first").text(), "foo content");
        assert.equal(div.find("div[aria-hidden=true]:last").text(), "bar content");
    });

    it("aria-selected is added to the active tab", function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [{ text: "foo", content: "foo content" }, { text: "bar", content: "bar content" }]
        });

        div.data("kendoTabStrip").select(0);

        assert.equal(div.find("li[aria-selected=true]").text(), "foo");
    });

    it("aria-selected is remove from the prev active tab", function() {
        div.kendoTabStrip({
            dataTextField: "text",
            dataContentField: "content",
            dataSource: [{ text: "foo", content: "foo content" }, { text: "bar", content: "bar content" }]
        });

        div.data("kendoTabStrip").select(0);
        div.data("kendoTabStrip").select(1);

        assert.equal(div.find("li[aria-selected=true]").length, 1);
        assert.equal(div.find("li[aria-selected=true]").text(), "bar");
    });

    it("aria-selected is added to the active tab when created from html", function() {
        div = $('<div id="test"><ul><li class="k-active">foo</li><li>bar</li></ul><div>foo content</div><div>bar content</div></div>')
            .kendoTabStrip();

        assert.equal(div.find("li[aria-selected=true]").text(), "foo");
    });

    it("preserves the id of the LI elements", function() {
        div = $("<div><ul id='test'><li id='custom' class='k-active'>Test</li><li>Test2</li></ul></div>");

        let tabstrip = div.kendoTabStrip().data("kendoTabStrip");

        tabstrip.select("li:last");
        tabstrip.select("li:first");

        let li = tabstrip.element.find(".k-active");

        assert.equal(li.attr("id"), "custom");
    });

    it("disabled attribute renders aria-disabled", function() {
        div = $("<div><ul id='test'><li class='k-active'>Test</li><li disabled>Test2</li></ul></div>");
        let tabstrip = div.kendoTabStrip().data("kendoTabStrip");

        assert.isOk(div.find("li:last").is("[aria-disabled='true']"));
    });

    it("assigns properly aria-labelledby to the respective Tab items", function() {
        div = $('<div id="test"><ul><li>foo</li><li>bar</li></ul><div>foo content</div><div>bar content</div></div>')
            .kendoTabStrip();

        assert.equal(div.find(".k-item")[0].id, div.children("div:not(.k-tabstrip-items-wrapper)")[0].getAttribute("aria-labelledby"));
        assert.equal(div.find(".k-item")[1].id, div.children("div:not(.k-tabstrip-items-wrapper)")[1].getAttribute("aria-labelledby"));
    });

    it("assigns properly aria-labelledby to the respective Tab items with guid if no id is present for the wrapper", function() {
        div = $('<div><ul><li>foo</li><li>bar</li></ul><div>foo content</div><div>bar content</div></div>')
            .kendoTabStrip();

        assert.equal(div.find(".k-item")[0].id, div.children("div:not(.k-tabstrip-items-wrapper)")[0].getAttribute("aria-labelledby"));
        assert.equal(div.find(".k-item")[1].id, div.children("div:not(.k-tabstrip-items-wrapper)")[1].getAttribute("aria-labelledby"));
    });
});
