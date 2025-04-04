import '@progress/kendo-ui/src/kendo.virtuallist.js';
import '@progress/kendo-ui/src/kendo.binder.js';
import { asyncTest } from '../../helpers/unit/async-utils.js';

let container,
    template,
    viewModel,
    asyncDataSource,
    virtualList;

function scroll(element, height) {
    element.scrollTop(height);
    element.trigger("scroll");
}

function generateData(parameters) {
    let items = [];
    for (let i = parameters.skip, len = parameters.skip + parameters.take; i < len; i++) {
        items.push({
            id: i,
            value: i,
            text: "Item " + i
        });
    }

    return items;
}

describe("VirtualList MVVM - No CSP", function() {
    beforeEach(function() {
        container = $("<div id='container' data-role='virtuallist' data-bind='source: asyncDataSource' data-template='tmp' data-value-field='value' data-item-height='20' data-height='200'></div>")
            .appendTo(Mocha.fixture);

        template = $("<script id='tmp' type='text/x-kendo-template'>" +
            "<div data-bind='text: text'></div>" +
            "</script>")
            .appendTo(Mocha.fixture);

        asyncDataSource = new kendo.data.DataSource({
            transport: {
                read: function(options) {
                    setTimeout(function() {
                        options.success({ data: generateData(options.data), total: 100 });
                    }, 0);
                }
            },
            serverPaging: true,
            pageSize: 40,
            schema: {
                data: "data",
                total: "total"
            }
        });

        viewModel = kendo.observable({
            asyncDataSource: asyncDataSource
        });

        kendo.bind(Mocha.fixture, viewModel);
    });

    afterEach(function() {
        if (container.data("kendoVirtualList")) {
            container.data("kendoVirtualList").destroy();
        }

        Mocha.fixture.empty();
    });

    it("widget is initialized via data attributes", function() {
        virtualList = container.getKendoVirtualList();
        assert.isOk(virtualList, "widget is initialized");
    });

    asyncTest("dataSource is set", function(done) {
        virtualList = $("#container").getKendoVirtualList();
        setTimeout(function() {
            done(() => {
                assert.isOk(virtualList.dataSource.data().length > 0);
            });
        }, 100);
    });

    asyncTest("items are rendered", function(done) {
        virtualList = container.getKendoVirtualList();
        setTimeout(function() {
            done(() => {
                assert.equal(virtualList.items().eq(0).text(), "Item 0");
                assert.equal(virtualList.items().last().text(), "Item 39");
            });
        }, 100);
    });

    asyncTest("items are rebound after re-rendering (list scroll)", function(done) {
        virtualList = container.getKendoVirtualList();
        setTimeout(function() {
            scroll(virtualList.content, 620);
            setTimeout(function() {
                done(() => {
                    assert.equal(virtualList.items().eq(0).text(), "Item 11");
                    assert.equal(virtualList.items().last().text(), "Item 50");
                });
            }, 300);
        }, 100);
    });

});
