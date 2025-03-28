import '@progress/kendo-ui/src/kendo.combobox.js';
import { asyncTest } from '../../helpers/unit/async-utils.js';

let ComboBox = kendo.ui.ComboBox,
    CLICK = kendo.support.touch ? "touchend" : "click",
    combobox,
    input;

describe("kendo.ui.ComboBox events", function() {
    beforeEach(function() {

        input = $("<input />").appendTo(Mocha.fixture);

        $.fn.press = function(key) {
            return this.trigger({ type: "keydown", keyCode: key });
        };
    });
    afterEach(function() {

        combobox.destroy();
        kendo.destroy(Mocha.fixture);
    });

    asyncTest("_blur calls _change", function(done) {
        combobox = new ComboBox(input, {
            dataSource: [{ text: "foo" }, { text: "bar" }]
        });

        combobox._change = function() {
            done(() => assert.isOk(true));
        };

        combobox._blur();
    });

    asyncTest("_blur calls popup close", function(done) {
        combobox = new ComboBox(input, {
            dataSource: [{ text: "foo" }, { text: "bar" }]
        });

        combobox.dataSource.read();
        combobox.popup.open();

        combobox.popup.bind("close", function() {
            done(() => assert.isOk(true));
        });

        combobox._blur();
    });

    asyncTest("_change raises the change event if value has changed", function(done) {
        combobox = new ComboBox(input, {
            dataSource: [{ text: "foo" }, { text: "bar" }],
            change: function() {
                done(() => assert.isOk(true));
            }
        });

        combobox.value("bar");
        combobox._old = "foo";
        combobox._oldText = "foo";
        combobox._change();
    });

    asyncTest("_change raises the input change event", function(done) {
        combobox = new ComboBox(input, {
            dataSource: [{ text: "foo" }, { text: "bar" }]
        });

        input.bind("change", function() {
            done(() => assert.isOk(true));
        });

        combobox.value("bar");
        combobox._old = "foo";
        combobox._oldText = "foo";
        combobox._change();
    });

    it("_change is not raised initially", function() {
        combobox = new ComboBox(input, {
            dataSource: [{ text: "foo" }, { text: "bar" }],
            autoBind: false,
            change: function() {
                assert.isOk(false);
            }
        });

        combobox.input.focus();
        combobox._change();
    });

    it("select does not raise the change event", function() {
        combobox = new ComboBox(input, {
            dataSource: [{ text: "foo" }, { text: "bar" }],
            change: function() {
                assert.isOk(false);
            }
        });

        combobox.input.focus();
        combobox.select($("<li>foo</li>"));
    });

    asyncTest("clicking an item raises the change event", function(done) {
        combobox = new ComboBox(input, {
            dataValueField: "text",
            dataTextField: "text",
            dataSource: [{ text: "foo" }, { text: "bar" }],
            change: function() {
                done(() => assert.isOk(true));
            }
        });

        combobox.input.focus();
        combobox.open();

        combobox.ul.children().eq(1).trigger(CLICK);
    });

    asyncTest("change should be raised on enter", function(done) {
        combobox = new ComboBox(input, {
            dataSource: [{ text: "foo" }, { text: "bar" }],
            change: function() {
                done(() => assert.isOk(true));
            }
        });

        combobox.open();
        combobox.input.focus();
        combobox.input.press(kendo.keys.DOWN);
        combobox.input.press(kendo.keys.ENTER);
    });

    it("change should not be raised on enter if input is empty", function() {
        combobox = new ComboBox(input, {
            dataSource: [{ text: "foo" }, { text: "bar" }],
            change: function() {
                assert.isOk(false);
            }
        });

        combobox.input.focus();
        combobox.input.press(kendo.keys.ENTER);
    });

    asyncTest("change should be raised on tab", function(done) {
        combobox = new ComboBox(input, {
            dataSource: [{ text: "foo" }, { text: "bar" }],
            change: function() {
                done(() => assert.isOk(true));
            }
        });

        combobox.input.focus();
        combobox.open();
        combobox.input.press(kendo.keys.DOWN);
        combobox.input.press(kendo.keys.TAB);
        combobox.input.focusout();
    });

    asyncTest("change should not be raised on tab after already changed value", function(done) {
        combobox = new ComboBox(input, {
            dataSource: ["One", "Two", "Three"],
            change: function() {
                done(() => assert.isOk(true));
            }
        });

        combobox.input.focus();
        combobox.open();
        combobox.input.press(kendo.keys.DOWN);
        combobox.input.press(kendo.keys.ENTER);
        combobox.input.press(kendo.keys.TAB);
        combobox.input.focusout();
    });

    it("change should not be raised twice on tab after edits of arbitrary text", function() {
        let counter = 0;

        combobox = new ComboBox(input, {
            dataSource: [],
            change: function() {
                counter++;
            }
        });

        for (let i = 0; i < 2; i++) {
            combobox.input.focus();
            combobox.input.val(i);
            combobox.input.press(kendo.keys.ENTER);
            combobox.input.press(kendo.keys.TAB);
            combobox.input.focusout();
        }

        assert.equal(counter, 2);
    });

    asyncTest("_change raises change event if selectedIndex has changed", function(done) {
        let select = $("<select/>");

        combobox = new ComboBox(select, {
            dataSource: ["foo", "bar"],
            change: function() {
                done(() => assert.isOk(true));
            }
        });

        combobox.selectedIndex = 1;
        combobox._change();
    });

    asyncTest("clicking an item raises the change event of HTML select", function(done) {
        let select = $("<select><option value=1>foo1</option><option value=3>foo3</option></select>")
            .bind("change", function() {
                done(() => assert.isOk(true));
            });

        combobox = new ComboBox(select, {
            dataTextField: "text",
            dataValueField: "value"
        });

        combobox.input.focus();
        combobox.open();

        combobox.ul.children().eq(1).trigger(CLICK);
    });

    it("raise change on custom value", function() {
        combobox = new ComboBox(input, {
            dataSource: [{ text: "foo" }, { text: "bar" }],
            change: function() {
                assert.equal(combobox.value(), "foo");
            }
        });

        combobox.input
            .focus()
            .val("foo");

        combobox.open();

        combobox.input.focusout();
    });

    it("raise change on custom text with empty value", function() {
        combobox = new ComboBox(input, {
            dataSource: [{ text: "foo" }, { text: "bar" }],
            change: function() {
                assert.equal(combobox.value(), "");
                assert.equal(combobox.text(), "foo");
            },
            syncValueAndText: false
        });

        combobox.input
            .focus()
            .val("foo");

        combobox.open();

        combobox.input.focusout();
    });

    it("raise change on custom value if element is select", function() {
        let select = $("<select><option value=1>foo1</option><option value=3>foo3</option></select>");
        combobox = new ComboBox(select, {
            dataSource: [{ text: "foo" }, { text: "bar" }]
        });

        select.bind("change", function() {
            assert.equal(combobox.value(), "custom value");
        });

        combobox.input
            .focus()
            .val("custom value");

        combobox.open();

        combobox.input.focusout();
    });

    it("raise change on custom text with empty value (select)", function() {
        let select = $("<select><option value=1>foo1</option><option value=3>foo3</option></select>");
        combobox = new ComboBox(select, {
            dataSource: [{ text: "foo" }, { text: "bar" }],
            syncValueAndText: false
        });

        select.bind("change", function() {
            assert.equal(combobox.value(), "");
            assert.equal(combobox.text(), "custom value");
        });

        combobox.input
            .focus()
            .val("custom value");

        combobox.open();

        combobox.input.focusout();
    });

    it("raise change if empty input after selection", function() {
        let select = $("<select><option value=1>foo1</option><option value=3>foo3</option></select>").appendTo(Mocha.fixture);

        select.bind("change", function() {
            assert.equal(combobox.value(), "");
        });

        combobox = new ComboBox(select, {
            dataValueField: "text",
            dataTextField: "text"
        });

        combobox.select(0);

        combobox.input.focus().val("").press(kendo.keys.BACKSPACE);

        combobox.open();

        combobox.input.focusout();
    });

    asyncTest("change with custom value on blur", function(done) {
        let select = $("<select><option value=1>foo1</option><option value=3>foo3</option></select>").appendTo(Mocha.fixture);

        combobox = new ComboBox(select, {
            delay: 0
        });

        combobox.input.focus();
        combobox.input.val("test");
        combobox.input.press(60); //some letter

        combobox.bind("change", function() {
            done(() => {
                assert.equal(combobox.value(), "test");
                assert.equal(combobox.text(), "test");
            });
        });

        combobox.open();

        combobox.input.focusout();
    });

    asyncTest("change on custom value and ENTER", function(done) {
        let select = $("<select><option value=1>foo1</option><option value=3>foo3</option></select>").appendTo(Mocha.fixture);

        select.bind("change", function() {
            done(() => {
                assert.equal(combobox.value(), "test");
                assert.equal(combobox.text(), "test");
            });
        });

        combobox = new ComboBox(select, {
            delay: 0
        });

        combobox.input.focus();
        combobox.input.val("test");
        combobox.input.press(60); //some letter
        combobox.input.press(kendo.keys.ENTER);
    });

    asyncTest("change on ENTER with custom text and empty value", function(done) {
        let select = $("<select><option value=1>foo1</option><option value=3>foo3</option></select>").appendTo(Mocha.fixture);

        select.bind("change", function() {
            done(() => {
                assert.equal(combobox.value(), "");
                assert.equal(combobox.text(), "test");
            });
        });

        combobox = new ComboBox(select, {
            delay: 0,
            syncValueAndText: false
        });

        combobox.input.focus();
        combobox.input.val("test");
        combobox.input.press(60); //some letter
        combobox.input.press(kendo.keys.ENTER);
    });

    asyncTest("open event when click _arrow", function(done) {
        combobox = input.kendoComboBox({
            animation: false,
            dataSource: [{ text: "foo" }, { text: "bar" }],
            open: function() {
                done(() => {
                    assert.isOk(true);
                    assert.isOk(this === combobox, "'this' is not the correct scope");
                });
            }
        }).data("kendoComboBox");

        input.data("kendoComboBox").wrapper.find(".k-icon, .k-svg-icon").trigger(CLICK);
    });

    it("open event should be cancellable", function() {
        input.kendoComboBox({
            dataSource: [{ text: "foo" }, { text: "bar" }],
            open: function(e) {
                e.preventDefault();
            }
        });

        combobox = input.data("kendoComboBox");

        combobox._arrow.trigger(CLICK);

        assert.isOk(!combobox.popup.visible());
    });

    it("open event should not raise twice on initial binding", function() {
        let index = 0;
        input.kendoComboBox({
            dataSource: [{ text: "foo" }, { text: "bar" }],
            open: function(e) {
                index++;
            },
            autoBind: false
        });

        combobox = input.data("kendoComboBox");

        combobox._arrow.trigger(CLICK);

        assert.equal(index, 1);
    });

    asyncTest("open event when ALT + down _arrow", function(done) {
        input.kendoComboBox({
            dataSource: [{ text: "foo" }, { text: "bar" }],
            open: function() {
                done(() => assert.isOk(true));
            }
        });

        combobox = input.data("kendoComboBox");

        combobox.input.trigger({ type: "keydown", keyCode: kendo.keys.DOWN, altKey: true });
    });

    asyncTest("close event when click _arrow", function(done) {
        input.kendoComboBox({
            dataSource: [{ text: "foo" }, { text: "bar" }],
            close: function() {
                done(() => {
                    assert.isOk(true);
                    assert.isOk(this === combobox, "'this' is not the correct scope");
                });
            }
        });

        combobox = input.data("kendoComboBox");
        combobox.open();
        combobox._arrow.trigger(CLICK);
    });

    it("close event should be cancellable", function() {
        input.kendoComboBox({
            dataSource: [{ text: "foo" }, { text: "bar" }],
            close: function(e) {
                e.preventDefault();
            }
        });

        combobox = input.data("kendoComboBox");

        combobox.open();
        combobox._arrow.trigger(CLICK);

        assert.isOk(combobox.popup.visible());
    });

    it("close should not raise if no data", function() {
        input.kendoComboBox({
            close: function(e) {
                assert.isOk(false);
            }
        });

        combobox = input.data("kendoComboBox");
        combobox._arrow.trigger(CLICK);
    });

    asyncTest("close event when ALT + up _arrow", function(done) {
        input.kendoComboBox({
            dataSource: [{ text: "foo" }, { text: "bar" }],
            close: function() {
                done(() => assert.isOk(true));
            }
        });


        combobox = input.data("kendoComboBox");
        combobox.open();

        combobox.input.trigger({ type: "keydown", keyCode: kendo.keys.UP, altKey: true });
    });

    it("click item raises select event", function() {
        combobox = input.kendoComboBox({
            dataSource: ["foo"],
            select: function(e) {
                assert.equal(e.item[0], combobox.ul.children()[0]);
                assert.equal(e.dataItem, combobox.dataSource.view()[0]);
            }
        }).data("kendoComboBox");

        combobox.open();
        combobox.ul.children().first().trigger(CLICK);
    });

    it("select event is not raised when custom value is entered", function() {
        combobox = input.kendoComboBox({
            highlightFirst: true,
            dataSource: ["foo"],
            select: function(e) {
                assert.equal(e.item[0], combobox.ul.children()[0]);
                assert.equal(e.dataItem, combobox.dataSource.view()[0]);
            }
        }).data("kendoComboBox");

        combobox.open();
        combobox.input.focus();
        combobox.listView.focus(0);
        combobox.input.press(kendo.keys.ENTER);
    });

    it("select event is not raised when custom value is entered", function() {
        combobox = input.kendoComboBox({
            highlightFirst: true,
            dataSource: ["foo"],
            select: function(e) {
                assert.isOk(false);
            }
        }).data("kendoComboBox");

        combobox.input.val("custom");
        combobox.input.press(kendo.keys.ENTER);
    });

    it("select event is not raised no item is focused", function() {
        combobox = input.kendoComboBox({
            highlightFirst: false,
            dataSource: ["foo"],
            select: function(e) {
                assert.isOk(false);
            }
        }).data("kendoComboBox");

        combobox.open();
        combobox.input.press(kendo.keys.ENTER);
    });

    it("select event is not raised on focusout", function() {
        combobox = input.kendoComboBox({
            highlightFirst: false,
            dataSource: ["foo"],
            select: function(e) {
                assert.isOk(false);
            }
        }).data("kendoComboBox");

        combobox.input.focus();
        combobox.input.val("abcd");
        combobox.input.trigger("focusout");
    });

    it("select is raised when down arrow is clicked", function() {
        combobox = input.kendoComboBox({
            highlightFirst: false,
            dataSource: ["foo"],
            select: function(e) {
                assert.equal(e.item[0], combobox.ul.children()[0]);
                assert.equal(e.dataItem, combobox.dataSource.view()[0]);
            }
        }).data("kendoComboBox");

        combobox.open();
        combobox.input.press(kendo.keys.DOWN);
    });

    it("prevent select event should only close the popup", async function() {
        combobox = input.kendoComboBox({
            dataSource: ["foo"],
            select: function(e) {
                assert.isOk(true);
                e.preventDefault();
            },
            change: function() {
                assert.isOk(false);
            }
        }).data("kendoComboBox");

        combobox.open();

        combobox.ul.children().first().trigger(CLICK);
        await vi.waitUntil(() => !combobox.popup.visible());
    });

    it("preventing select event during navigation reverts selection", function() {
        let combobox = input.kendoComboBox({
            dataSource: ["foo", "bar"],
            select: function(e) {
                e.preventDefault();
            }
        }).data("kendoComboBox");

        combobox.input.focus();
        combobox.wrapper.press(kendo.keys.DOWN);

        let current = combobox.current();

        assert.isOk(current.hasClass("k-focus"));
        assert.equal(current.find(".k-list-item-text").html(), "foo");
    });

    asyncTest("trigger select event on blur when input text is changed", function(done) {
        let combobox = input.kendoComboBox({
            dataSource: ["foo", "bar"],
            select: function(e) {
                done(() => {
                    assert.equal(e.item[0], combobox.ul.children()[1]);
                    assert.equal(e.dataItem, combobox.dataSource.view()[1]);
                });
            }
        }).data("kendoComboBox");

        combobox.input.focus().val("bar").focusout();
    });

    asyncTest("do not trigger select event on blur when input text is not changed", function(done) {
        let calls = 0;
        let combobox = input.kendoComboBox({
            dataSource: ["foo", "bar"],
            select: function(e) {
                calls++;
            }
        }).data("kendoComboBox");

        combobox.select(0).done(function() {
            combobox.input.focus().focusout();
            done(() => assert.equal(calls, 0));
        });
    });

    asyncTest("prevent select event on blur returns old value", function(done) {
        let combobox = input.kendoComboBox({
            dataSource: ["foo", "bar"],
            select: function(e) {
                e.preventDefault();
            }
        }).data("kendoComboBox");

        combobox.select(0).then(function() {
            combobox.input.focus().val("bar").focusout();
            done(() => assert.equal(combobox.text(), "foo"));
        });
    });

    asyncTest("ComboBox trigger blur of the hidden input", function(done) {
        combobox = input.kendoComboBox().data("kendoComboBox");

        combobox.element.blur(function() {
            done(() => assert.isOk(true));
        });

        combobox.input.focusout();
    });

    asyncTest("ComboBox trigger cascade on TAB", function(done) {
        combobox = input.kendoComboBox({
            dataSource: ["foo"],
            cascade: function() {
                done(() => assert.isOk(true));
            }
        }).data("kendoComboBox");

        combobox.open();
        combobox.input.trigger({
            type: "keydown",
            keyCode: kendo.keys.DOWN
        });

        combobox.text(combobox.text());
    });

    it("ComboBox trigger cascade when selected index is changed", function() {
        combobox = input.kendoComboBox({
            dataSource: [
                { text: "foo", value: "1" },
                { text: "bar", value: "2" }
            ],
            dataTextField: "text",
            dataValueField: "value",
            filter: "contains",
            suggest: true
        }).data("kendoComboBox");

        combobox.bind("cascade", function() {
            assert.equal(combobox.value(), "1");
            assert.equal(combobox.text(), "1");
        });

        combobox.input.focus().val("1");
        combobox.search("1");
        combobox.input.blur();
    });

    it("ComboBox does not trigger cascade when selected index is changed due to filtering", function() {
        combobox = input.kendoComboBox({
            dataSource: [
                { text: "foo", value: "1" },
                { text: "bar", value: "2" }
            ],
            dataTextField: "text",
            dataValueField: "value",
            filter: "contains",
            suggest: true
        }).data("kendoComboBox");

        let timesCascadeCalled = 0;

        combobox.bind("cascade", function() {
            timesCascadeCalled++;
            assert.equal(combobox.value(), "2");
            assert.equal(combobox.text(), "bar");
        });

        combobox.input.focus().val("2");
        combobox.search("bar");
        combobox.ul.children(":first").click();
        combobox.dataSource.filter({});


        assert.equal(timesCascadeCalled, 1);
    });

    asyncTest("ComboBox triggers cascade only once when setting value externally", function(done) {
        combobox = input.kendoComboBox({
            dataSource: {
                transport: {
                    read: function(options) {
                        options.success([
                            { text: "foo", value: "1" },
                            { text: "bar", value: "2" }
                        ]);
                    }
                }
            },
            dataTextField: "text",
            dataValueField: "value"
        }).data("kendoComboBox");

        combobox.bind("cascade", function() {
            done(() => assert.isOk(true));
        });

        combobox.value("2");
    });

    asyncTest("ComboBox trigger change on blur after filtration", function(done) {
        combobox = input.kendoComboBox({
            dataSource: ["foo", "bar"],
            filter: "contains",
            suggest: true
        }).data("kendoComboBox");

        combobox.input.focus();
        combobox.value("foo");

        combobox.bind("change", function() {
            done(() => assert.isOk(true));
        });

        combobox.search("b");
        combobox.input.val("");
        combobox.suggest("bar");

        combobox.input.focusout();
    });

    it("ComboBox trigger change when selected index is changed", function() {
        combobox = input.kendoComboBox({
            dataSource: [
                { text: "foo", value: "1" },
                { text: "bar", value: "2" }
            ],
            dataTextField: "text",
            dataValueField: "value",
            filter: "contains",
            suggest: true
        }).data("kendoComboBox");

        combobox.bind("change", function() {
            assert.equal(combobox.value(), "1");
            assert.equal(combobox.text(), "1");
        });

        combobox.input.focus().val("1");
        combobox.search("1");
        combobox.input.blur();
    });

    asyncTest("ComboBox trigger change when selected value is cleared", function(done) {
        combobox = input.kendoComboBox({
            dataSource: [
                "Apples",
                "Oranges"
            ],
            change: function() {
                done(() => assert.isOk(true));
            }
        }).data("kendoComboBox");

        combobox.value("Apples");
        combobox._clear.trigger(CLICK);
    });

    asyncTest("ComboBox trigger change when selected custom value is cleared", function(done) {
        combobox = input.kendoComboBox({
            dataSource: [
                "Apples",
                "Oranges"
            ],
            change: function() {
                done(() => assert.isOk(true));
            }
        }).data("kendoComboBox");

        combobox.value("Pears");
        combobox._clear.trigger(CLICK);
    });

    asyncTest("ComboBox trigger change when selected text is cleared", function(done) {
        combobox = input.kendoComboBox({
            dataSource: [
                "Apples",
                "Oranges"
            ],
            change: function() {
                done(() => assert.isOk(true));
            }
        }).data("kendoComboBox");

        combobox.text("Apples");
        combobox._clear.trigger(CLICK);
    });

    asyncTest("ComboBox trigger change when selected custom text is cleared", function(done) {
        combobox = input.kendoComboBox({
            dataSource: [
                "Apples",
                "Oranges"
            ],
            change: function() {
                done(() => assert.isOk(true));
            }
        }).data("kendoComboBox");

        combobox.text("Pears");
        combobox._clear.trigger(CLICK);
    });

    it("ComboBox triggers filtering event on data source filter", function() {
        combobox = input.kendoComboBox({
            autoBind: false,
            dataSource: ["foo", "bar"],
            filter: "contains",
            filtering: function(e) {
                let filter = e.filter;

                assert.equal(filter.field, "");
                assert.equal(filter.operator, "contains");
                assert.equal(filter.value, "baz");
            }
        }).data("kendoComboBox");

        combobox.search("baz");
    });

    it("modifying filter expression in filtering event changes datasource result", function() {
        combobox = input.kendoComboBox({
            autoBind: false,
            dataSource: ["foo", "bar"],
            filter: "contains",
            filtering: function(e) {
                e.filter.value = "foo";
            }
        }).data("kendoComboBox");

        combobox.search("baz");

        let data = combobox.dataSource.view();

        assert.equal(data.length, 1);
        assert.equal(data[0], "foo");
    });

    it("ComboBox filtering event can be prevented", function() {
        combobox = input.kendoComboBox({
            dataSource: ["foo", "bar"],
            filter: "contains",
            filtering: function(e) {
                e.preventDefault();
            }
        }).data("kendoComboBox");

        combobox.dataSource.bind("change", function() {
            assert.isOk(false);
        });

        combobox.search("baz");
    });

    it("ComboBox does not trigger change event on blur after initialization (<select>)", function() {
        let select = $('<select id="combobox"><option selected></option><option value="1">Value1</option></select>');

        combobox = select.kendoComboBox({
            change: function(e) {
                assert.isOk(false);
            }
        }).data("kendoComboBox");

        combobox.input.focus().blur();
    });

    it("change event is not raised when value is set through configuration", function() {
        let combobox = new ComboBox(input, {
            value: 2,
            dataValueField: "id",
            dataTextField: "name",
            dataSource: [
                { id: 1, name: "name1" },
                { id: 2, name: "name2" },
                { id: 3, name: "name3" }
            ],
            change: function() {
                assert.isOk(false);
            }
        });

        combobox.input.focus().blur();
    });

    it("change event is not raised when widget is not bound and value method is used", function() {
        let select = $("<select></select>").appendTo(Mocha.fixture);

        let combobox = new ComboBox(select, {
            autoBind: false,
            dataValueField: "id",
            dataTextField: "name",
            dataSource: [
                { id: 1, name: "name1" },
                { id: 2, name: "name2" },
                { id: 3, name: "name3" }
            ],
            change: function() {
                assert.isOk(false);
            }
        });

        combobox.value(2);
        combobox.input.focus().blur();
    });

    it("change event is not raised when widget value is cleared", function() {
        let select = $("<select></select>").appendTo(Mocha.fixture);

        let combobox = new ComboBox(select, {
            autoBind: false,
            dataValueField: "id",
            dataTextField: "name",
            dataSource: [
                { id: 1, name: "name1" },
                { id: 2, name: "name2" },
                { id: 3, name: "name3" }
            ],
            change: function() {
                assert.isOk(false);
            }
        });

        combobox.value("");
        combobox.input.focus().blur();
    });

    it("trigger set when setting value", function() {
        let value = "test";

        let combobox = new ComboBox(input, {
            dataValueField: "id",
            dataTextField: "name",
            dataSource: [
                { id: 1, name: "name1" },
                { id: 2, name: "name2" },
                { id: 3, name: "name3" }
            ],
            set: function(e) {
                assert.equal(e.value, value);
            }
        });

        combobox.value(value);
    });

    asyncTest("raised change event on blur after filtering", function(done) {
        let combobox = new ComboBox(input, {
            dataValueField: "id",
            dataTextField: "name",
            dataSource: [
                { id: 1, name: "name1" },
                { id: 2, name: "name2" },
                { id: 3, name: "name3" }
            ],
            change: function() {
                done(() => assert.isOk(true));
            }
        });

        combobox.input.val("n");
        combobox._search();
        combobox.open();
        combobox.input.trigger({
            type: "keydown",
            keyCode: kendo.keys.DOWN
        });
        combobox.input.focus().blur();
    });

    it("not raise change event on selecting current item after filtering", function() {
        let combobox = new ComboBox(input, {
            dataValueField: "id",
            dataTextField: "name",
            value: 2,
            dataSource: [
                { id: 1, name: "foo" },
                { id: 2, name: "boo" }
            ],
            change: function() {
                assert.isOk(false);
            }
        });

        combobox.input.trigger({
            type: "keydown",
            keyCode: kendo.keys.BACKSPACE
        });
        combobox._search();
        combobox.open();
        combobox.input.trigger({
            type: "keydown",
            keyCode: kendo.keys.DOWN
        });
        combobox.input.focus().blur();
    });

    asyncTest("element click calls _focusHandler", function(done) {
        combobox = new ComboBox(input, {
            dataSource: [{ text: "foo" }, { text: "bar" }]
        });

        combobox.input.on("focus", function() {
            done(() => assert.isOk(true));
        });

        combobox.element.trigger(CLICK);
    });
    it("change is not raised with highlightFirst set to false and item already selected", function() {
        combobox = new ComboBox(input, {
            dataSource: [{ id: 1, text: "foo" }, { id: 2, text: "bar" }],
            value: 1,
            dataValueField: "id",
            dataTextField: "text",
            highlightFirst: false,
            change: function() {
                assert.isOk(false);
            }
        });

        combobox.open();
        combobox.input.trigger({
            type: "keydown",
            keyCode: kendo.keys.TAB
        });
    });
});
