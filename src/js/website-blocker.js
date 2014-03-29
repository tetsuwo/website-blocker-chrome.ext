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
    this.dayOfWeek = null;
    this.daysOfWeek = [];
    this.debug = false; // debug mode
    this.useTimeGroup = true; // on/off for time limit function
    this.useTimeLimit = false;
    this.redirectHistory = {};
}

(function(WB, undef) {

    /**
     * For Block the tab of target ID
     *
     * @param id  {String} ID of target tab
     * @param url {String} URL of target tab
     */
    WB.prototype.blocked = function(id, url) {
        this.logger('blocked - start');
        var redirect = chrome.extension.getURL('blocked.html') + '?url=' + encodeURIComponent(url);

        if (ls.get('blocked_redirect')) {
            var currentTime = new Date().getTime();
            var key = ls.get('blocked_redirect');
            var beforeTime = false;

            if (this.redirectHistory[key]) {
                beforeTime = this.redirectHistory[key].time;
                this.redirectHistory[key].count++;
                this.redirectHistory[key].time = currentTime;
            } else {
                redirect = ls.get('blocked_redirect');
                this.redirectHistory[key] = {
                    count: 1,
                    time: currentTime
                };
            }

            if (beforeTime) {
                // PREVENT REDIRECT LOOP
                // less than 1000 ms access time to same url && more than 3 times
                if (currentTime - beforeTime < 1000 && 3 < this.redirectHistory[key].count) {
                    this.redirectHistory[key].count = 0;
                } else {
                    redirect = ls.get('blocked_redirect');
                }
                //console.debug('compare', currentTime - beforeTime, this.redirectHistory[key]);
            }
        }
        chrome.tabs.update(id, { url: redirect });
        this.logger('blocked - end');
    };

    /**
     * Is blocked the URL?
     *
     * @param url    {String}
     * @param regexp {String}
     * @param time   {Array}
     */
    WB.prototype.isBlocked = function(url, regexp, targetTime, currentTime, dayOfWeek) {
        this.logger('isBlocked - start');
        var pos = url.search(new RegExp(regexp, 'ig'));
        this.logger(pos);

        if (5 < pos) {
            if (this.useTimeLimit) {
                this.logger('Time Limit!');
                return false;
            }

            if (!this.useTimeGroup) {
                this.logger('Time Group!');
                return true;
            }

            this.logger(dayOfWeek);
            this.logger(this.daysOfWeek);
            if (typeof this.daysOfWeek === 'object'
                && this.matchDaysOfWeek(this.daysOfWeek, dayOfWeek)) {
                this.logger('Match days of week in');

                if (targetTime.length === 0) {
                    this.logger('Target Time!');
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
                //return true;
            }
        }

        this.logger('isBlocked - end');
        return false;
    };

    /**
     * To string
     *
     * @param list {Array}
     */
    WB.prototype.matchDaysOfWeek = function(targetDaysOfWeek, currentDayOfWeek) {
        this.logger('matchDaysOfWeek - in');

        if (typeof targetDaysOfWeek === 'object') {
            //this.logger('typeof targetDaysOfWeek === object');
             for (var weekNum in targetDaysOfWeek) {
                 if (targetDaysOfWeek[weekNum] == currentDayOfWeek) {
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

        this.dayOfWeek = this.date.getDay();

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
            this.useTimeGroup = ls.get('flag-timegroup_function');
            this.daysOfWeek = ls.get('days_of_week');

            for (var key in this.blockedList) {
                this.logger(this.blockedList[key].regexp);
                if (this.isBlocked(url, this.blockedList[key].regexp, this.blockedList[key].time, currentTime, this.dayOfWeek)) {
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
     * Set Time Limit
     *
     * @param sec {integer} seconds
     */
    WB.prototype.setTimeLimit = function(sec) {
        var that = this;
        that.useTimeLimit = true;
        window.setTimeout(function() {
            that.useTimeLimit = false;
        }, sec * 1000);
    };

    /**
     * Logger
     *
     * @param a {Any}
     */
    WB.prototype.logger = function(a) {
        if (this.debug) {
            console.debug('{WebsiteBlocker Log}', a);
        }
    };

    /**
     * Run Website Blocker!
     *
     * @param tab {Object}
     */
    WB.prototype.run = function(tab) {
        this.logger(tab);

        if (!ls.get('flag-block_function')) {
            return false;
        }

        if (tab.url.search(/https?:/) === 0) {
            this.checkUrl(tab.id, tab.url, false);
        }

        return true;
    };

    /**
     * Transform array of checkbox of Day's of week, to string
     *
     * @param days {Array} jQuery selector
     */
    WB.prototype.toFormatDaysOfWeekToString = function(days) {
        var daysOfWeek = [];
        days.each(function(i, el){
            daysOfWeek.push($(el).val());
        });

        return daysOfWeek.toString();
    };

    /**
     * Transform string to array
     *
     * @param days {String}
     */
    WB.prototype.toFormatDaysOfWeekToArray = function(days) {
        return days ? days.split(',') : [];
    };

})(WebsiteBlocker);
