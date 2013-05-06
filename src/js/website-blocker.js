/*!
 * Website Blocker
 *
 * Copyright 2010-2013, Tetsuwo OISHI.
 * Dual license under the MIT license.
 * http://tetsuwo.tumblr.com
 *
 * Date: 2010-11-21
 */

function WebsiteBlocker() {
    this.blockedList = null;
    this.date = null;
    this.time = null;
    this.debug = false; // debug mode
    this.disabledTimeLimit = false; // on/off for time limit function
}

(function(WB, undef) {

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
    WB.prototype.isBlocked = function(url, regexp, targetTime, currentTime) {
        var pos = url.search(new RegExp(regexp, 'ig'));
        this.logger(pos);

        if (5 < pos) {
            if (this.disabledTimeLimit) {
                return true;
            }

            if (targetTime.length === 0) {
                return true;
            }

            for (var i in targetTime) {
                var current = Number(currentTime);
                var target  = targetTime[i]
                                  .split('-')
                                  .map(function(time) {
                                      return Number(time);
                                  });

                if (target[0] <= current && current <= target[1]) {
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
        var currentTime = null;

        if (this.blockedList) {
            currentTime = this.makeTime();
            this.disabledTimeLimit = ls.get('flag-timelimit_function');

            for (var key in this.blockedList) {
                this.logger(this.blockedList[key].regexp);
                if (this.isBlocked(url, this.blockedList[key].regexp, this.blockedList[key].time, currentTime)) {
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
     * Generate Random Sring
     *
     * @author acty
     * @editor 2007/10/19 TETSUWO
     *         2013/05/06 Tetsuwo OISHI, migration to JavaScript
     * @param digit {integer} digit
     * @param number {boolean} use number
     * @param alphabetLower {boolean} use lowercase alphabet
     * @param alphabetUpper {boolean} use uppercase alphabet
     */
    WB.prototype.generateRandomString = function(digit, number, alphabetLower, alphabetUpper) {
        var pool = '', code = '';
        if (number)        pool += '1234567890';
        if (alphabetLower) pool += 'abcdefghijklmnopqrstuvwxyz';
        if (alphabetUpper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (var i = 0; i < digit; i++) {
            code += pool.substr(Math.random() * pool.length, 1);
        }

        return code;
    };


    /**
     * Check Passphrase
     *
     * @param src {string} Source String
     * @param desc {string} Dest String
     */
    WB.prototype.matchPassphrase = function(src, dest) {
        return src === dest;
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

        if (ls.get('flag-block_function')) {
            return false;
        }

        if (tab.url.search(/https?:/) === 0) {
            this.checkUrl(tab.id, tab.url, false);
        }

        return true;
    };

})(WebsiteBlocker);
