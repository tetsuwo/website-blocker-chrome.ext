/*!
 * ChromeDB.js
 *
 * localStorage's wrapper for Development of Chrome Extension or Apps
 *
 * Copyright 2011-2012, Tetsuwo OISHI.
 * Dual license under the MIT license.
 * http://tetsuwo.tumblr.com
 *
 * Date: 2012-07-09
 */

(function() {
window.db = {
    author: 'Tetsuwo OISHI',

    _debug: true,
    _enabled: false,
    _namespace: '',

    init: function(namespace) {
        this._namespace = (namespace || '') + '_';
        this._enabled = true;
    },

    change: function(ns) {
        if (this._enabled) {
            this._beforeNamespace = this._namespace;
            this.init(ns);
        }
    },

    key: function(k) {
        return String(this._namespace) + String(k);
    },

    get: function(k, defaultValue) {
        var v = JSON.parse(localStorage.getItem(this.key(k)));

        this.log('[get] key = %s', k);
        this.log('[get] val = %s', v);

        return v || defaultValue || null;
    },

    set: function(k, v) {
        this.log('[set] key = %s', k);
        this.log('[set] val = %s', v);

        localStorage.setItem(this.key(k), JSON.stringify(v));

        return this;
    },

    remove: function(k) {
        this.log('[remove] key = %s', k);

        localStorage.removeItem(this.key(k));
    },

    clear: function() {
    },

    log: function(message, replace) {
        if (this._debug) {
            console.log(message, replace);
        }
    }
};

window.db.init();
})();
