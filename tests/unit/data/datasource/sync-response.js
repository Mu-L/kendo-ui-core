import '@progress/kendo-ui/src/kendo.data.js';
import { asyncTest } from '../../../helpers/unit/async-utils.js';
import { stub } from '../../../helpers/unit/stub.js';

let Model = kendo.data.Model;
let DataSource = kendo.data.DataSource;
let dataSource;

function setup(options) {
    dataSource = new DataSource($.extend(true, {
        data: [{ id: 1, foo: "foo" }, { id: 2, foo: "foo2" }],
        schema: {
            model: $.extend({}, Model, { id: "id" })
        }
    }, options));

    dataSource.read();
}

function stubTransport(method, data) {
    let obj = {};
    data = data !== undefined ? data : [{ id: 1, foo: "bar" }];
    obj[method] = function(options) {
        options.success(kendo.isFunction(data) ? data() : data);
    };

    stub(dataSource.transport, obj);
}

describe("data source sync response", function() {
    beforeEach(() => {
        setup();
    });

    asyncTest("sync updates the fields of created model from array server response", function(done) {
        stubTransport("create");

        let model = new Model();
        dataSource.add(model);
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(model.id, 1);
                assert.equal(model.get("foo"), "bar");
            });
        });
    });

    it("sync updates the fields of updated model from array server response", function() {
        stubTransport("update");

        let model = dataSource.get(1);
        model.set("foo", "bar");
        dataSource.sync();

        assert.equal(model.get("foo"), "bar");
    });

    it("sync updates data from server response", function() {
        stubTransport("update");

        let model = dataSource.get(1);
        model.set("foo", "bar");
        dataSource.sync();

        assert.equal(dataSource.data()[0].foo, "bar");
    });

    it("sync updates data if server response without content", function() {
        dataSource = new DataSource({
            schema: {
                model: {
                    id: "id"
                },
                data: "d.d"
            },
            transport: {
                read: function(options) {
                    options.success({ d: { d: [{ id: 1, foo: "foo" }] } });
                },
                update: function(options) {
                    options.success(null);
                }
            }
        });

        dataSource.read();
        let model = dataSource.get(1);
        model.set("foo", "bar");
        dataSource.sync();

        assert.equal(dataSource.data()[0].foo, "bar");
    });

    asyncTest("sync updates pristine data if server response is empty object", function(done) {
        dataSource = new DataSource({
            schema: {
                model: {
                    id: "id",
                    fields: {
                        foo: { type: "string" }
                    }
                }
            },
            transport: {
                read: function(options) {
                    options.success([{ id: 1, foo: "bar" }]);
                },
                update: function(options) {
                    options.success({});
                }
            }
        });

        dataSource.read();
        let model = dataSource.get(1);
        model.set("foo", "car");
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(dataSource._pristineData[0].foo, "car");
            });
        });
    });

    asyncTest("sync updates pristine data for array property", function(done) {
        dataSource = new DataSource({
            schema: {
                model: {
                    id: "id",
                    fields: {
                        foo: {
                            type: "object",
                            defaultValue: []
                        }
                    }
                }
            },
            transport: {
                read: function(options) {
                    options.success([{ id: 1, foo: [{ bar: 1 }, { bar: 2 }] }]);
                },
                update: function(options) {
                    options.success(null);
                }
            }
        });

        dataSource.read();
        let model = dataSource.get(1);
        model.set("foo", [{ bar: 1 }]);
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(dataSource.data()[0].foo.length, 1);
                assert.equal(dataSource._pristineData[0].foo.length, 1);
            });
        });


    });

    asyncTest("sync updates the fields of created model from single object server response", function(done) {
        stubTransport("create", { id: 1, foo: "foo" });

        let model = new Model();
        dataSource.add(model);
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(model.id, 1);
                assert.equal(model.get("foo"), "foo");
            });
        });

    });

    it("sync updates the fields of updated model from single object server response", function() {
        stubTransport("update", { id: 1, foo: "bar" });

        let model = dataSource.get(1);
        model.set("foo", "bar");
        dataSource.sync();

        assert.equal(model.id, 1);
        assert.equal(model.get("foo"), "bar");
    });

    asyncTest("sync merges created model data with server response", function(done) {
        stubTransport("create", { id: 1 });

        let model = new Model({ foo: "foo" });
        dataSource.add(model);
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(model.id, 1);
                assert.equal(model.get("foo"), "foo");
            });
        });

    });

    asyncTest("sync merges updated model data with server response", function(done) {
        stubTransport("update", { id: 1 });

        let model = dataSource.get(1);
        model.set("foo", "bar");
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(model.id, 1);
                assert.equal(model.get("foo"), "bar");
            });
        });

    });

    asyncTest("sync updates created model when response is empty", function(done) {
        stubTransport("create", null);

        let model = dataSource.add({ foo: "foo" });
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(model.get("foo"), "foo");
                assert.equal(model.dirty, false);
            });
        });

    });

    asyncTest("sync updates the state of updated model when response is empty", function(done) {
        stubTransport("update", null);

        let model = dataSource.get(1);
        model.set("foo", "bar");
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(model.get("foo"), "bar");
                assert.equal(model.dirty, false);
                assert.equal(dataSource._pristineData[0].foo, "bar");
            });
        });

    });

    asyncTest("sync updates all created models with server response", function(done) {
        let response = [{ id: 1, foo: "foo" }, { id: 2, foo: "bar" }];

        stubTransport("create", function() { return [response.shift()]; });

        let model1 = new Model();
        dataSource.add(model1);

        let model2 = new Model();
        dataSource.add(model2);
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(model1.id, 1);
                assert.equal(model1.get("foo"), "foo");
                assert.equal(model2.id, 2);
                assert.equal(model2.get("foo"), "bar");
            });
        });

    });

    it("sync updates all updated models with server response", function() {
        let response = [{ id: 1, foo: "bar" }, { id: 2, foo: "baz" }];

        stubTransport("update", function() { return [response.shift()]; });

        let model1 = dataSource.get(1);

        model1.set("foo", "bar");

        let model2 = dataSource.get(2);

        model2.set("foo", "baz");

        dataSource.sync();

        assert.equal(model1.get("foo"), "bar");
        assert.equal(model2.get("foo"), "baz");
    });

    asyncTest("sync updates all created models with server response when batch is true and incomplete response", function(done) {
        setup({ batch: true });

        stubTransport("create", [{ id: 1, foo: "bar" }, { id: 2, foo: "baz" }]);

        let model1 = new Model();
        dataSource.add(model1);

        let model2 = new Model();
        dataSource.add(model2);
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(model1.id, 1);
                assert.equal(model1.get("foo"), "bar");
                assert.equal(model2.isNew(), false);
                assert.equal(model2.dirty, false);
            });
        });

    });

    asyncTest("sync updates all created models with server response when batch is true", function(done) {
        setup({ batch: true });

        stubTransport("create", [{ id: 1, foo: "foo" }, { id: 2, foo: "bar" }]);

        let model1 = new Model();
        dataSource.add(model1);

        let model2 = new Model();
        dataSource.add(model2);
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(model1.id, 1);
                assert.equal(model1.get("foo"), "foo");
                assert.equal(model2.id, 2);
                assert.equal(model2.get("foo"), "bar");
            });
        });

    });

    it("sync updates all updated models with server response when batch is true", function() {
        setup({ batch: true });

        stubTransport("update", [{ id: 1, foo: "baz" }, { id: 2, foo: "bar" }]);

        let model1 = dataSource.get(1);

        model1.set("foo", "baz");

        let model2 = dataSource.get(2);

        model2.set("foo", "bar");
        dataSource.sync();

        assert.equal(model1.get("foo"), "baz");
        assert.equal(model2.get("foo"), "bar");
    });

    asyncTest("created models are no longer new after sync", function(done) {
        stubTransport("create");

        let model = new Model();
        dataSource.add(model);
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(model.isNew(), false);
            });
        });

    });

    it("created model has no changes after sync", function() {
        stubTransport("create");

        let model = new Model();
        dataSource.add(model);
        dataSource.sync();

        assert.equal(model.dirty, false);
    });

    it("updated model has no changes after sync", function() {
        stubTransport("update");

        let model1 = dataSource.get(1);

        model1.set("foo", "foo");

        dataSource.sync();

        assert.equal(model1.dirty, false);
    });

    asyncTest("sync clears destroyed models", function(done) {
        stubTransport("destroy");
        let model = dataSource.get(1);

        dataSource.remove(model);
        dataSource.sync();

        setTimeout(() => {
            dataSource.sync();
        });

        setTimeout(() => {
            done(() => {
                assert.equal(dataSource.transport.calls("destroy"), 1);
            });
        });

    });

    asyncTest("sync uses the parse method of the reader", function(done) {
        let reader = stub(dataSource.reader, {
            parse: function() {
                return [{ id: 1 }];
            },
            data: function(result) {
                return result;
            }
        });

        stubTransport("create");

        let model = new Model();
        dataSource.add(model);
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(reader.calls("parse"), 1);
                assert.equal(model.id, 1);
            });
        });

    });

    asyncTest("sync uses the data method of the reader", function(done) {
        let reader = stub(dataSource.reader, {
            parse: function(result) {
                return [{ id: 1 }];
            },
            data: function(result) {
                return [{ id: 1 }];
            }
        });

        stubTransport("create");

        let model = new Model();
        dataSource.add(model);
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(reader.calls("parse"), 1);
                assert.equal(model.id, 1);
            });
        });

    });

    asyncTest("sync raises requestEnd event", function(done) {
        stubTransport("destroy", { foo: "bar" });

        dataSource.remove(dataSource.get(1));

        dataSource.bind("requestEnd", function(e) {
            done(() => {
                assert.deepEqual(e.response, { foo: "bar" });
                assert.deepEqual(e.type, "destroy");
            });
        });

        dataSource.sync();
    });


    asyncTest("sync raises change event after delete", function(done) {
        stubTransport("destroy");

        dataSource.remove(dataSource.get(1));

        dataSource.bind("change", function() {
            done(() => assert.isOk(true));
        });

        dataSource.sync();
    });

    asyncTest("sync raises sync event after delete attached through the constructor", function(done) {
        setup({
            sync: function() {
                done(() => assert.isOk(true));
            }
        });

        stubTransport("destroy");

        dataSource.remove(dataSource.get(1));

        dataSource.sync();
    });

    asyncTest("sync raises sync event after delete", function(done) {
        stubTransport("destroy");

        dataSource.remove(dataSource.get(1));

        dataSource.bind("sync", function() {
            done(() => assert.isOk(true));
        });

        dataSource.sync();
    });

    asyncTest("sync raises sync event after update attached through the constructor", function(done) {
        setup({
            sync: function() {
                done(() => assert.isOk(true));
            }
        });

        stubTransport("update");

        dataSource.get(1).set("foo", "bar");

        dataSource.sync();
    });

    asyncTest("sync raises sync event after update", function(done) {

        stubTransport("update");

        dataSource.get(1).set("foo", "bar");

        dataSource.bind("sync", function() {
            done(() => assert.isOk(true));
        });

        dataSource.sync();
    });

    asyncTest("sync raises sync event after create attached through the constructor", function(done) {
        setup({
            sync: function() {
                done(() => assert.isOk(true));
            }
        });

        stubTransport("create");

        dataSource.add({});

        dataSource.sync();
    });

    asyncTest("sync raises sync event after create", function(done) {

        stubTransport("create");
        dataSource.add({});

        dataSource.bind("sync", function() {
            done(() => assert.isOk(true));
        });

        dataSource.sync();
    });
    asyncTest("sync raises change event after create", function(done) {
        stubTransport("create");

        let model = new Model();
        dataSource.add(model);

        dataSource.bind("change", function() {
            done(() => assert.isOk(true));
        });

        dataSource.sync();
    });

    asyncTest("sync raises change event after update", function(done) {
        stubTransport("update", [{ foo: "moo" }]);

        dataSource.get(1).set("foo", "moo");

        dataSource.bind("change", function() {
            done(() => assert.isOk(true));
        });

        dataSource.sync();
    });

    asyncTest("get returns new models after sync", function(done) {
        stubTransport("create", [{ id: 3, foo: "moo" }]);

        dataSource.add({});
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(dataSource.get(3).get("id"), 3);
            });
        });

    });

    asyncTest("cancelChanges does not remove the added models after sync", function(done) {
        stubTransport("create", [{ id: 3, foo: "moo" }]);

        dataSource.add({});
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                dataSource.cancelChanges();

                assert.isOk(dataSource.get(3));
            });
        });

    });

    asyncTest("cancelChanges does not remove the added models after sync", function(done) {
        stubTransport("create", [{ id: 3, foo: "moo" }]);

        dataSource.add({});
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                dataSource.cancelChanges();

                assert.isOk(dataSource.get(3));
            });
        });

    });

    asyncTest("cancelChanges does not revert the updated models after sync when Model has fields defined", function(done) {
        setup({
            schema: {
                model: {
                    fields: {
                        foo: "foo"
                    }
                }
            }
        });

        stubTransport("create", [{ id: 42, foo: "moo" }]);

        dataSource.add();

        dataSource.sync();

        setTimeout(() => {
            done(() => {
                dataSource.cancelChanges();

                assert.equal(dataSource.get(42).foo, "moo");
            });
        });

    });

    asyncTest("cancelChanges does not revert the deleted models after sync", function(done) {
        stubTransport("destroy", [{ id: 2, foo: "moo" }]);

        dataSource.remove(dataSource.get(2));
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                dataSource.cancelChanges();

                assert.isOk(!dataSource.get(2));
            });
        });

    });

    asyncTest("sync response data as array is converted if model types are set", function(done) {
        setup({
            data: [{ id: 1, foo: "1" }],
            schema: { model: { id: "id", fields: { foo: { type: "number" } } } }
        });
        stubTransport("create", [{ id: 3, foo: "2" }]);

        dataSource.add({});
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.strictEqual(dataSource.get(3).get("foo"), 2);
            });
        });

    });

    asyncTest("sync response data as object is converted if model types are set", function(done) {
        setup({
            data: [{ id: 1, foo: "1" }],
            schema: { model: { id: "id", fields: { foo: { type: "number" } } } }
        });
        stubTransport("create", { id: 3, foo: "2" });

        dataSource.add({});
        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.strictEqual(dataSource.get(3).get("foo"), 2);
            });
        });
    });

    it("destroy sync null response", function() {
        setup({
            transport: {
                read: function(options) {
                    options.success({ d: [{ id: 1, foo: "foo" }, { id: 2, foo: "foo2" }] });
                }
            },
            schema: { data: "d", model: { id: "id", fields: { foo: { type: "string" } } } }
        });
        stubTransport("destroy", { d: null });

        dataSource.remove(dataSource.get(1));

        dataSource.sync();
        assert.equal(dataSource.data().length, 1);
    });

    it("deleted items are not synced after changes are reverted", function() {
        dataSource = new kendo.data.DataSource({
            transport: {
                read: function(options) {
                    options.success([{ id: 1, foo: "bar" }]);
                },
                destroy: function(options) {
                    assert.isOk(false);
                }
            }
        });
        dataSource.read();

        dataSource.remove(dataSource.at(0));

        dataSource.cancelChanges();
        dataSource.sync();
        assert.isOk(!dataSource._destroyed.length);
    });

    it("deleted items are synced after other record changes are reverted", function() {
        dataSource = new kendo.data.DataSource({
            transport: {
                read: function(options) {
                    options.success([{ id: 1, foo: "bar" }, { id: 2, foo: "baz" }]);
                },
                destroy: function(options) {
                    assert.isOk(true);
                }
            },
            schema: { model: { id: "id" } }
        });
        dataSource.read();

        dataSource.remove(dataSource.at(0));

        dataSource.cancelChanges(dataSource.get(2));
        dataSource.sync();
        assert.equal(dataSource._destroyed.length, 1);
    });

    asyncTest("error event is raised if custom errors are returned", function(done) {
        setup({
            data: [{ id: 1, foo: "1" }],
            schema: { model: { id: "id", fields: { foo: { type: "number" } } } }
        });
        stubTransport("create", { errors: "error" });

        dataSource.add({});

        dataSource.bind("error", function(e) {
            done(() => assert.equal(e.errors, "error"));
        });

        dataSource.sync();
    });

    asyncTest("sync updates the pristine data with server grouping", function(done) {
        dataSource = new DataSource({
            schema: {
                model: { id: "id" },
                total: function() {
                    return 1;
                }
            },
            batch: true,
            serverGrouping: true,
            group: { field: "foo" }
        });

        stubTransport("update", [{ foo: "moo" }]);
        stubTransport("read", [{ items: [{ foo: 1, id: 0 }, { foo: 2, id: 1 }], field: "foo", value: "bar" },
        { items: [{ foo: 3, id: 2 }, { foo: 4, id: 3 }], field: "foo", value: "baz" }]);

        dataSource.read();

        dataSource.get(0).set("foo", "moo");

        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(dataSource._pristineData[0].items[0].foo, "moo");
                assert.equal(dataSource._pristineData[0].items[1].foo, 2);
                assert.equal(dataSource._pristineData[1].items[0].foo, 3);
                assert.equal(dataSource._pristineData[1].items[1].foo, 4);
            });
        });

    });

    asyncTest("sync update the pristine data with created items if server grouping", function(done) {
        dataSource = new DataSource({
            schema: {
                model: { id: "id" },
                total: function() {
                    return 1;
                }
            },
            batch: true,
            serverGrouping: true,
            group: { field: "foo" }
        });

        stubTransport("create", [{ foo: "moo" }]);
        stubTransport("read", [{ items: [{ foo: 1, id: 0 }, { foo: 2, id: 1 }], field: "foo", value: "bar" },
        { items: [{ foo: 3, id: 2 }, { foo: 4, id: 3 }], field: "foo", value: "baz" }]);

        dataSource.read();

        dataSource.add({});

        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.equal(dataSource.data().length, 3);

                assert.equal(dataSource._pristineData[0].items[0].foo, 1);
                assert.equal(dataSource._pristineData[0].items[1].foo, 2);
                assert.equal(dataSource._pristineData[1].items[0].foo, 3);
                assert.equal(dataSource._pristineData[1].items[1].foo, 4);
                assert.equal(dataSource._pristineData[2].items[0].foo, "moo");
            });
        });

    });

    it("nested object are observable after sync", function() {
        setup({
            data: [{ id: 1, obj: { foo: "bar" } }]
        });

        stubTransport("update", null);
        let initial = dataSource.get(1);
        initial.set("obj", { foo: "baz" });

        dataSource.sync();

        assert.isOk(dataSource.get(1).obj instanceof kendo.data.ObservableObject);
        assert.equal(dataSource.get(1).uid, initial.uid);
    });

    it("sync updates the pristine data with plain objects", function() {
        dataSource = new DataSource({
            schema: {
                model: {
                    id: "id"
                }
            }
        });
        dataSource.insert(0, {});

        dataSource.sync();

        assert.equal(dataSource._pristineData[0] instanceof kendo.data.ObservableObject, false);
    });

    it("sync model custom field mapping is persisted after sync with empty response", function() {
        setup({
            data: [{ id: 1, foo: "bar" }],
            schema: {
                model: {
                    fields: {
                        baz: "foo"
                    }
                }
            }
        });
        stubTransport("update", null);
        let initial = dataSource.get(1);
        initial.set("baz", "foo");

        dataSource.sync();

        assert.isOk(!("foo" in dataSource.get(1)));
        assert.equal(dataSource.get(1).baz, "foo");
    });

    it("sync submit promises are rejected on success", function() {
        setup({
            batch: true,
            data: [{ id: 1, foo: "bar" }],
            schema: {
                model: {
                    id: "id"
                }
            }
        });

        stub(dataSource.transport, {
            submit: function(options) {
                options.error({});
            }
        });

        let initial = dataSource.get(1);
        initial.set("baz", "foo");

        dataSource.add({});

        dataSource.bind("error", function() {
            assert.isOk(true);
        });

        dataSource.sync();
    });

    asyncTest("sync submit promises are resloved on success", function(done) {
        setup({
            batch: true,
            data: [{ id: 1, foo: "bar" }],
            schema: {
                model: {
                    id: "id"
                }
            }
        });

        stub(dataSource.transport, {
            submit: function(options) {
                options.success([], "update");
                options.success([], "create");
                options.success([], "destroy");
            }
        });

        let initial = dataSource.get(1);
        initial.set("baz", "foo");

        dataSource.add({});

        dataSource.bind("sync", function() {
            done(() => assert.isOk(true));
        });

        dataSource.sync();
    });

    asyncTest("sync submit applies server changes to correct items", function(done) {
        setup({
            batch: true,
            data: [{ id: 1, foo: "bar" }, { id: 2, foo: "boo" }],
            schema: {
                model: {
                    id: "id"
                }
            }
        });

        stub(dataSource.transport, {
            submit: function(options) {
                options.success([{ id: 1, foo: "baz" }], "update");
                options.success([{ id: 3, foo: "created" }], "create");
                options.success(null, "destroy");
            }
        });

        let initial = dataSource.get(1);

        initial.set("foo", "foo");

        dataSource.remove(dataSource.get(2));

        dataSource.add({});

        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.isOk(!dataSource.hasChanges());

                assert.equal(dataSource.get(1).foo, "baz");
                assert.equal(dataSource.get(3).foo, "created");
                assert.isOk(dataSource.get(2) === undefined);
                assert.equal(dataSource.data().length, 2);
            });
        });

    });

    asyncTest("sync submit changes are accepted with no server response", function(done) {
        setup({
            batch: true,
            data: [{ id: 1, foo: "bar" }, { id: 2, foo: "boo" }],
            schema: {
                model: {
                    id: "id"
                }
            }
        });

        stub(dataSource.transport, {
            submit: function(options) {
                options.success([], "update");
                options.success({ id: 3 }, "create");
                options.success(null, "destroy");
            }
        });

        let initial = dataSource.get(1);

        initial.set("foo", "foo");

        dataSource.remove(dataSource.get(2));

        dataSource.add({});

        dataSource.sync();

        setTimeout(() => {
            done(() => {
                assert.isOk(!dataSource.hasChanges());

                assert.equal(dataSource.get(1).foo, "foo");
                assert.isOk(dataSource.get(3) !== undefined);
                assert.isOk(dataSource.get(2) === undefined);
                assert.equal(dataSource.data().length, 2);
            });
        });

    });

});
