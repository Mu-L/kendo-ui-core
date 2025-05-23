import "./kendo.data.js";

export const __meta__ = {
    id: "data.signalr",
    name: "SignalR",
    category: "framework",
    depends: [ "data" ],
    hidden: true
};

(function($) {
    var kendo = window.kendo;
    var isFunction = kendo.isFunction;

    function isJQueryPromise(promise) {
        return promise && isFunction(promise.done) && isFunction(promise.fail);
    }

    function isNativePromise(promise) {
        return promise && isFunction(promise.then) && isFunction(promise.catch);
    }

    var transport = kendo.data.RemoteTransport.extend({
        init: function(options) {
            var signalr = options && options.signalr ? options.signalr : {};

            var promise = signalr.promise;

            if (!promise) {
                throw new Error('The "promise" option must be set.');
            }

            if (!isJQueryPromise(promise) && !isNativePromise(promise)) {
                throw new Error('The "promise" option must be a Promise.');
            }

            this.promise = promise;

            var hub = signalr.hub;

            if (!hub) {
                throw new Error('The "hub" option must be set.');
            }

            if (typeof hub.on != "function" || typeof hub.invoke != "function") {
                throw new Error('The "hub" option is not a valid SignalR hub proxy.');
            }

            this.hub = hub;

            kendo.data.RemoteTransport.fn.init.call(this, options);
        },

        push: function(callbacks) {
            var client = this.options.signalr.client || {};

            if (client.create) {
                this.hub.on(client.create, callbacks.pushCreate);
            }

            if (client.update) {
                this.hub.on(client.update, callbacks.pushUpdate);
            }

            if (client.destroy) {
                this.hub.on(client.destroy, callbacks.pushDestroy);
            }
        },

        _crud: function(options, type) {
            var hub = this.hub;
            var promise = this.promise;
            var server = this.options.signalr.server;

            if (!server || !server[type]) {
                throw new Error(kendo.format('The "server.{0}" option must be set.', type));
            }

            var args = [server[type]];

            var data = this.parameterMap(options.data, type);

            if (!$.isEmptyObject(data)) {
                args.push(data);
            }

            if (isJQueryPromise(promise)) {
                promise.done(function() {
                    hub.invoke.apply(hub, args)
                              .done(options.success)
                              .fail(options.error);
                });
            } else if (isNativePromise(promise)) {
                promise.then(function() {
                    hub.invoke.apply(hub, args)
                              .then(options.success)
                              .catch(options.error);
                });
            }
        },

        read: function(options) {
            this._crud(options, "read");
        },

        create: function(options) {
            this._crud(options, "create");
        },

        update: function(options) {
            this._crud(options, "update");
        },

        destroy: function(options) {
            this._crud(options, "destroy");
        }
    });

    $.extend(true, kendo.data, {
        transports: {
            signalr: transport
        }
    });

})(window.kendo.jQuery);
export default kendo;

