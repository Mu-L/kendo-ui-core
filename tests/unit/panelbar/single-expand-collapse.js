import '@progress/kendo-ui/src/kendo.panelbar.js';

let panelbar;
let ul;

describe('panelbar single expand collapse', function() {
    beforeEach(function() {


        Mocha.fixture.append(
            '<ul id="panelbar">' +
            '    <li class="k-panelbar-item"><span class="k-link k-header">Mail<span' +
            '            class="k-icon k-i-chevron-down k-panelbar-expand"></span></span>' +
            '        <ul>' +
            '            <li class="k-panelbar-item"><span class="k-link">My Profile<span' +
            '                    class="k-icon k-i-arrow-chevron-up k-panelbar-collapse"></span></span>' +
            '                <ul style="display: none;" class="k-panelbar-group">' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Server Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Ajax Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Web Service Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Custom Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Twitter Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Facebook Binding</a></li>' +
            '                </ul>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">My Profile<span' +
            '                    class="k-icon k-i-arrow-chevron-up k-panelbar-collapse"></span></span>' +
            '                <ul style="display: none;" class="k-panelbar-group">' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Server Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Ajax Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Web Service Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Custom Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Twitter Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Facebook Binding</a></li>' +
            '                </ul>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">My Profile<span' +
            '                    class="k-icon k-i-arrow-chevron-up k-panelbar-collapse"></span></span>' +
            '                <ul style="display: none;" class="k-panelbar-group">' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Server Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Ajax Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Web Service Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Custom Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Twitter Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Facebook Binding</a></li>' +
            '                </ul>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">My Mail</span>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">Sent Items</span>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">Outbox</span>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">Search Folders</span>' +
            '            </li>' +
            '        </ul>' +
            '    </li>' +
            '    <li class="k-panelbar-item k-disabled"><span class="k-link k-header">Contacts<span' +
            '            class="k-icon k-i-chevron-down k-panelbar-expand"></span></span>' +
            '        <ul>' +
            '            <li class="k-panelbar-item"><span class="k-link">Phone List</span>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">Shared Contacts</span>' +
            '            </li>' +
            '        </ul>' +
            '    </li>' +
            '    <li class="k-panelbar-item"><span class="k-link k-header">Tasks<span' +
            '            class="k-icon k-i-chevron-down k-panelbar-expand"></span></span>' +
            '        <ul class="k-panelbar-group" style="display: none;">' +
            '            <li class="k-panelbar-item"><span class="k-link">My Tasks</span>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">Shared Tasks</span>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">Active Tasks</span>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">Completed Tasks</span>' +
            '            </li>' +
            '        </ul>' +
            '    </li>' +
            '    <li class="k-panelbar-item k-expanded"><span class="k-link k-header k-selected">Notes<span' +
            '            class="k-icon k-i-arrow-chevron-up k-panelbar-collapse"></span></span>' +
            '        <ul class="k-panelbar-group" style="display: block;">' +
            '            <li class="k-panelbar-item"><span class="k-link">My Notes</span>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">Notes List</span>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">Shared Notes</span>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">Archive</span>' +
            '            </li>' +
            '        </ul>' +
            '    </li>' +
            '    <li class="k-panelbar-item"><span class="k-link k-header">Folders List<span' +
            '            class="k-icon k-i-chevron-down k-panelbar-expand"></span></span>' +
            '        <ul class="k-panelbar-group" style="display: none;">' +
            '            <li class="k-panelbar-item"><span class="k-link">My Profile<span' +
            '                    class="k-icon k-i-arrow-chevron-up k-panelbar-collapse"></span></span>' +
            '                <ul style="display: none;" class="k-panelbar-group">' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Server Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Ajax Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Web Service Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Custom Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Twitter Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Facebook Binding</a></li>' +
            '                </ul>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">My Profile<span' +
            '                    class="k-icon k-i-arrow-chevron-up k-panelbar-collapse"></span></span>' +
            '                <ul style="display: none;" class="k-panelbar-group">' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Server Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Ajax Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Web Service Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Custom Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Twitter Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Facebook Binding</a></li>' +
            '                </ul>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">My Profile<span' +
            '                    class="k-icon k-i-arrow-chevron-up k-panelbar-collapse"></span></span>' +
            '                <ul style="display: none;" class="k-panelbar-group">' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Server Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Ajax Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Web Service Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Custom Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Twitter Binding</a></li>' +
            '                    <li class="k-panelbar-item"><a href="#"' +
            '                                                          class="k-link">Facebook Binding</a></li>' +
            '                </ul>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">My Support Tickets</span>' +
            '            </li>' +
            '            <li class="k-panelbar-item"><span class="k-link">My Licenses</span>' +
            '            </li>' +
            '        </ul>' +
            '    </li>' +
            '</ul>'
        );

        ul = $("#panelbar");

        panelbar = new kendo.ui.PanelBar(ul, { expandMode: "single" });
    });
    afterEach(function() {
        panelbar.destroy();
    });

    function getRootItem(index) {
        return ul.find('.k-header').parent().eq(index);
    }

    it('clicking not expandable item should not collapse expanded item', function() {
        let item = getRootItem(3);
        let item2 = getRootItem(1);

        item2.find('> .k-link').click();

        assert.equal(item.find('.k-panelbar-group').css("display"), "block");
    });

    it('clicking item should collapse other and fire collapse on it', function() {

        let item = getRootItem(3),
            item2 = getRootItem(2),
            collapseItem = false;

        panelbar.bind("collapse", function(e) {
            collapseItem = e.item;
        });

        item2.find('> .k-link').trigger('click');

        assert.equal(item.find('.k-panelbar-group').css("display"), "none");
        assert.equal(collapseItem, item[0]);
    });

    it('clicking item twice should not collapse it', function() {
        let item = getRootItem(0);

        item.find('> .k-link').trigger('click');
        item.find('> .k-link').trigger('click');

        assert.equal(item.find('.k-panelbar-group').css("display"), "block");
    });

    it('clicking subItem should not collapse headerItem', function() {
        let item = getRootItem(0);
        item.find('> .k-link').trigger('click');
        let subItem = item.find('> .k-panelbar-group').children()[0];

        $(subItem).find('> .k-link').trigger('click');

        assert.equal(item.find('.k-panelbar-group').css("display"), "block");
    });

    it('clicking sub item should collapse siblings', function() {
        let item = getRootItem(4);
        panelbar.expand(item, false);

        let subItem1 = item.find('> .k-panelbar-group').children().eq(0);
        let subItem2 = subItem1.next();

        subItem1.find('> .k-link').trigger('click');
        subItem2.find('> .k-link').trigger('click');

        assert.equal(subItem1.find('> .k-panelbar-group').css("display"), "none");
        assert.equal(subItem2.find('> .k-panelbar-group').css("display"), "block");
    });
});
