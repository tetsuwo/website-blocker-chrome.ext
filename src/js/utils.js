
/**
 * I18N [InternationalizatioN]
 *
 * @author Tetsuwo OISHI
 */
window.i18n = function(callback) {
    var getmsg = function(a) {
        return chrome.i18n.getMessage(a) ? chrome.i18n.getMessage(a) : false;
    };
    var res = document.querySelectorAll('[i18n]');
    for (var i = 0; i < res.length; i++) {
        var data  = res[i], msg = false, msgs  = [], msgid = data.getAttribute('i18n');
        if (msgid.indexOf('+') > -1) {
            msgids = msgid.split('+');
            for (var h in msgids) {
                msgs.push(getmsg(msgids[h]));
            }
            msg = msgs.join(' ');
        } else {
            msg = getmsg(msgid);
        }
        if (msg !== false) {
            data.innerHTML = msg;
        }
    }
    if (typeof callback === 'function') {
        callback();
    }
};

/**
 * localStorage aliase object
 *
 * @author Tetsuwo OISHI
 */
window.ls = new function() {
    this.set = function(a, b) {
        window.localStorage.setItem(a, JSON.stringify(b));
    };
    this.get = function(a) {
        return window.localStorage[a] ? JSON.parse(window.localStorage[a]) : false;
    };
    this.i18n = function(a) {
       return ls.get(a) || chrome.i18n.getMessage(a);
    };
    this.rm = function(a) {
        window.localStorage.removeItem(a);
    };
};

