import '@progress/kendo-ui/src/kendo.numerictextbox.js';
import '@progress/kendo-ui/src/cultures/kendo.culture.de-DE.js';
import { asyncTest } from '../../helpers/unit/async-utils.js';

let NumericTextBox = kendo.ui.NumericTextBox,
    input;

describe("kendo.ui.NumericTextBox initialization", function() {
    beforeEach(function() {
        input = $("<input />").appendTo(Mocha.fixture);
    });
    afterEach(function() {
        kendo.destroy(Mocha.fixture);
    });

    it("Should render wrapper", function() {
        let textbox = new NumericTextBox(input),
            wrapper = textbox.wrapper;

        assert.equal(wrapper[0].className, "k-numerictextbox k-input k-input-solid k-input-md k-rounded-md");

    });

    it("Should render up and down arrows", function() {
        let textbox = new NumericTextBox(input),
            upArrow = textbox._upArrow,
            downArrow = textbox._downArrow;

        assert.isOk(upArrow.parent().hasClass("k-input-spinner"));

        assert.isOk(upArrow.hasClass("k-button"));
        assert.equal(upArrow.attr("tabindex"), "-1");
        assert.isOk(upArrow.hasClass("k-icon-button"));
        assert.isOk(upArrow.hasClass("k-button-solid"));
        assert.isOk(upArrow.hasClass("k-button-solid-base"));
        assert.isOk(upArrow.hasClass("k-spinner-increase"));
        assert.equal(upArrow.attr("aria-label"), textbox.options.upArrowText);

        assert.isOk(downArrow.hasClass("k-button"));
        assert.equal(downArrow.attr("tabindex"), "-1");
        assert.isOk(downArrow.hasClass("k-icon-button"));
        assert.isOk(downArrow.hasClass("k-button-solid"));
        assert.isOk(downArrow.hasClass("k-button-solid-base"));
        assert.isOk(downArrow.hasClass("k-spinner-decrease"));
        assert.equal(downArrow.attr("aria-label"), textbox.options.downArrowText);

        assert.isOk(upArrow.children(":first").is(".k-icon.k-i-caret-alt-up.k-button-icon, .k-svg-icon.k-svg-i-caret-alt-up.k-button-icon"));
        assert.isOk(downArrow.children(":first").is(".k-icon.k-i-caret-alt-down.k-button-icon, .k-svg-icon.k-svg-i-caret-alt-down.k-button-icon"));
    });

    it("Should render INPUT containing the formatted value", function() {
        input.addClass("custom").css("color", "red");

        let textbox = new NumericTextBox(input),
            text = textbox._text;

        assert.isOk(text.is(":visible"));
        assert.isOk(!input.is(":visible"));
        assert.isOk(text[0].nodeName, "INPUT");
        assert.isOk(text.hasClass("k-input-inner"));
        assert.isOk(text.hasClass("custom"));
        assert.isOk(text[0].style.cssText.indexOf("color: red") != -1);
        assert.equal(text.next()[0].nodeName, "INPUT");
    });

    it("Move accesskey to the visible input", function() {
        input.attr("accesskey", "w");
        let textbox = new NumericTextBox(input);

        assert.equal(textbox._text.attr("accesskey"), "w");
        assert.equal(textbox.element.attr("accesskey"), "");
    });

    it("Copy tabindex to the visible input", function() {
        input.attr("tabindex", 3);
        let textbox = new NumericTextBox(input);

        assert.equal(textbox._text.prop("tabindex"), 3);
        assert.equal(textbox.element.prop("tabindex"), 3);
    });

    it("Change type of the element", function() {
        let textbox = new NumericTextBox($('<input type="number" />').appendTo(Mocha.fixture));

        assert.equal(textbox.element[0].type, "text");
    });

    it("Should get value from input", function() {
        let textbox = new NumericTextBox(input.val("12"));

        assert.equal(textbox.value(), 12);
        assert.equal(textbox.element.val(), "12");
        assert.equal(textbox._text.val(), "12.00");
    });

    it("Bind change events", function() {
        let textbox = new NumericTextBox(input.val("12"), {
            change: function() { }
        });

        assert.equal(textbox._events["change"][0], textbox.options.change);
    });

    it("Get min/max value from the input", function() {
        let textbox = new NumericTextBox($("<input type='number' min='1' max='12' />").appendTo(Mocha.fixture));

        assert.equal(textbox.options.min, 1);
        assert.equal(textbox.options.max, 12);
    });

    it("Get step value from the input", function() {
        let textbox = new NumericTextBox($("<input type='number' step='10' />").appendTo(Mocha.fixture));

        assert.equal(textbox.options.step, 10);
    });

    it("strip format", function() {
        let textbox = new NumericTextBox($("<input type='number' step='10' />").appendTo(Mocha.fixture), {
            format: "{0:c}"
        });

        assert.equal(textbox.options.format, "c");
    });

    it("NumericTextBox uses specific culture", function() {
        let textbox = new NumericTextBox(input, {
            value: 10,
            format: "n",
            culture: "de-DE"
        });

        assert.equal(textbox._text.val(), "10,00");
    });

    it("NumericTextBox can parse value in invariant culture", function() {
        let textbox = new NumericTextBox($("<input type='number' value='1.5' />").appendTo(Mocha.fixture), {
            format: "n",
            culture: "de-DE"
        });

        assert.equal(textbox._text.val(), "1,50");
    });

    it("NumericTextBox hides arrows if spinners is set to false", function() {
        let textbox = new NumericTextBox(input, {
            value: 10,
            spinners: false
        });

        assert.isOk(!textbox._upArrow.parent().is(":visible"));
    });

    it("NumericTextBox gets the placeholder value from the element", function() {
        input.attr("placeholder", "Select...");
        let textbox = new NumericTextBox(input);

        assert.equal(textbox.options.placeholder, "Select...");
    });

    it("NumericTextBox copies the placeholder attribute to the fake input", function() {
        input.attr("placeholder", "Select...");
        let textbox = new NumericTextBox(input);

        assert.equal(textbox._text.attr("placeholder"), "Select...");
    });

    it("copy input className to the wrapper", function() {
        let numeric = new NumericTextBox(input.addClass("test"));

        assert.isOk(numeric.wrapper.hasClass("test"));
    });

    if (!kendo.support.placeholder) {
        it("NumericTextBox sets the placeholder in the input element", function() {
            let textbox = new NumericTextBox(input, {
                placeholder: "Select..."
            });

            assert.equal(textbox._text.val(), "Select...");
        });

        it("NumericTextBox clears the placeholder", function() {
            let textbox = new NumericTextBox(input, {
                placeholder: "Select..."
            });

            textbox.value(10);

            assert.equal(textbox._text.val(), "10.00");
        });
    }

    asyncTest("form reset support", function(done) {
        input.attr("value", "123");

        let form = $("<form/>").appendTo(Mocha.fixture).append(input),
            textbox = new NumericTextBox(input);

        textbox.value("1");

        form[0].reset();

        setTimeout(function() {
            done(() => {
                assert.equal(textbox.element.val(), "123");
                assert.equal(textbox._text.val(), "123.00");
            });
        }, 200);
    });

    asyncTest("form reset support for keeping min max attributes", function(done) {
        input.attr("min", "0");
        input.attr("max", "100");

        let form = $("<form/>").appendTo(Mocha.fixture).append(input),
            textbox = new NumericTextBox(input);

        form[0].reset();

        setTimeout(function() {
            done(() => {
                assert.equal(textbox.element[0].getAttribute("min"), "0");
                assert.equal(textbox.element[0].getAttribute("max"), "100");
            });
        }, 200);
    });

    asyncTest("support for form defined by attribute", function(done) {
        input.attr("form", "form1").attr("value", "123");

        let form = $("<form id='form1'/>").appendTo(Mocha.fixture),
            textbox = new NumericTextBox(input);

        textbox.value("1");

        form[0].reset();

        setTimeout(function() {
            done(() => {
                assert.equal(textbox.element.val(), "123");
                assert.equal(textbox._text.val(), "123.00");
            });
        }, 200);
    });

    it("NumericTextBox honors readonly attribute", function() {
        let numerictextbox = input.attr("readonly", true).kendoNumericTextBox().data("kendoNumericTextBox");

        numerictextbox._upArrowEventHandler.notify("press");

        assert.equal(numerictextbox.value(), null);
    });

    it("NumericTextBox uses disabled attr over the readonly", function() {
        let numerictextbox = input.attr("readonly", true).attr("disabled", true)
            .kendoNumericTextBox().data("kendoNumericTextBox");

        assert.equal(input.attr("readonly"), undefined);
    });

    it("NumericTextBox supports negative exponential numbers", function() {
        let numerictextbox = input.kendoNumericTextBox({
            format: "n7",
            decimals: 7
        }).data("kendoNumericTextBox");

        numerictextbox.value(0.0000001);

        assert.equal(numerictextbox.element.val(), "0.0000001");
    });

    it("NumericTextBox copies input title attribute to the visible input", function() {
        let numerictextbox = input.attr("title", "foo").kendoNumericTextBox().data("kendoNumericTextBox");
        let title = input.attr("title");

        assert.equal(numerictextbox.wrapper.find(".k-input-inner").first().attr("title"), title);
    });

    it("NumericTextBox copies the formatted value to the visible input aria-title attr", function() {
        let textbox = new NumericTextBox(input, { value: 10 });

        assert.equal(textbox._text.attr("title"), textbox._text.val());
    });

    it("NumericTextBox is disabled when placed in disabled fieldset", function() {
        $(input).wrap('<fieldset disabled="disabled"></fieldset>');
        input.kendoNumericTextBox().data("kendoNumericTextBox");
        assert.include(["disabled", "true"], input.attr("disabled"));
    });

    asyncTest("Numerictextbox max and min values are reset to initial when form is reset", function(done) {
        $(input).wrap("<form id='form'></form>");
        let numeric = input.kendoNumericTextBox({
            min: 0,
            max: 4
        }).data("kendoNumericTextBox");

        numeric.max(2);
        $("form")[0].reset();
        setTimeout(function() {
            done(() => assert.equal(numeric.options.max, 4));
        }, 200);
    });

    it("widget restricts value without rounding it", function() {
        let textbox = new NumericTextBox(input, {
            round: false
        });

        textbox.focus();
        textbox.element.val("10.556").blur();

        assert.equal(textbox.value(), 10.55);
    });

    it("enable false disables the widget", function() {
        let textbox = new NumericTextBox(input, {
            enable: false
        });

        assert.isOk(textbox.wrapper.hasClass("k-disabled"));
        assert.include(["disabled", "true"], textbox._text.attr("disabled"));
        assert.equal(textbox._text.attr("aria-disabled"), "true");
    });
});
