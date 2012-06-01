/*!
 * Website Blocker
 *
 * Copyright 2010-2012, Tetsuwo OISHI.
 * Dual license under the MIT license.
 * http://tetsuwo.tumblr.com
 *
 * Date: 2010-11-21
 */


function WebsiteBlocker() {
    this.blockedList = null;
    this.date = null;
    this.time = null;

    // debug mode
    this.debug = false;

    // on/off for time limit function
    this.disabledTimeLimit = false;
}


(function( WB, undef ) {


/**
 * For Block the tab of target ID
 *
 * @param id  {String} ID of target tab
 * @param url {String} URL of target tab
 */
WB.prototype.blocked = function(id, url) {
    chrome.tabs.update(id, {
        url: chrome.extension.getURL('blocked.html') + '?url=' + encodeURIComponent(url)
    });
};


/**
 * Is blocked the URL?
 *
 * @param url    {String}
 * @param regexp {String}
 * @param time   {Array}
 */
WB.prototype.isBlocked = function(url, regexp, time) {

    this.logger(url.search(new RegExp(regexp, 'ig')));

    if (url.search(new RegExp(regexp, 'ig')) > 5) {
        if (this.disabledTimeLimit) {
            return true;
        }

        if (time.length === 0) {
            return true;
        }

        for (var i in time) {
            var c = time[i].split('-');

            if (Number(c[0]) <= Number(this.time) && Number(this.time) <= Number(c[1])) {
                return true;
            }
        }
    }

    return false;
};


/**
 * To string
 *
 * @param list {Array}
 */
WB.prototype.toString = function(list) {

    var result = [];

    for (var key in list) {
        var row = list[key];
        result.push(row.url + ' ' + row.time.join(','));
    }

    return result.join('\n');
};


/**
 * To format
 *
 * @param text {String}
 */
WB.prototype.toFormat = function(text) {

    var rows, row, URLTime, line, BLOCKED = [];
    rows = text.split('\n');

    if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
            row = rows[i].trim();
            if (!row) continue;
            URLTime = row.split(' ');
            line = { url: URLTime[0], time: [], regexp: null };

            if (URLTime.length === 2) {
                line.time = URLTime[1].split(',');
            }
            else if (URLTime.length > 2) {
                line.time = row.replace(/\s/g, '').replace(URLTime[0], '').split(',');
            }

            line.regexp = URLTime[0].replace(/\./g, '\\.');
            BLOCKED.push(line);
        }
    }

    return BLOCKED;
};


/**
 * Make time
 *
 * @param none
 */
WB.prototype.makeTime = function() {

    this.date = new Date();
    var hh = this.date.getHours();
    var mm = this.date.getMinutes();

    if (hh < 10) {
        hh = '0' + hh;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    return this.time = hh.toString() + mm.toString();
};


/**
 * Check URL
 *
 * @param id       {String}
 * @param url      {String}
 * @param testmode {Boolean}
 */
WB.prototype.checkUrl = function(id, url, testmode) {

    this.blockedList = ls.get('blocked_list');

    if (this.blockedList) {
        this.makeTime();
        this.disabledTimeLimit = ls.get('time_limit_disabled');

        for (var key in this.blockedList) {
            this.logger(this.blockedList[key].regexp);
            if (this.isBlocked(url, this.blockedList[key].regexp, this.blockedList[key].time)) {
                if (testmode) {
                    return true;
                }
                this.blocked(id, url);
                break;
            }
        }
    }

    return false;
};


/**
 * Logger
 *
 * @param a {Any}
 */
WB.prototype.logger = function(a) {
    if (this.debug) {
        console.log(a);
    }
};


/**
 * Run Website Blocker!
 *
 * @param tab {Object}
 */
WB.prototype.run = function(tab) {

    this.logger(tab);

    if (ls.get('blocked_disabled')) {
        return false;
    }

    if (tab.url.search(/https?:/) === 0) {
        this.checkUrl(tab.id, tab.url, false);
    }

    return true;
};


})(WebsiteBlocker);
