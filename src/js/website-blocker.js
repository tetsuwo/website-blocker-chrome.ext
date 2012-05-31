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
    this.debug = false;
    this.disabledTimeLimit = false;
}

WebsiteBlocker.prototype = {
    blocked: function(id, url) {
        chrome.tabs.update(id, {
            url: chrome.extension.getURL('blocked.html') + '?url=' + encodeURIComponent(url)
        });
    },
    isBlocked: function(taburl, regexp, time) {
        if (taburl.search(new RegExp(regexp, 'ig')) > 5) {
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
    },
    toString: function(list) {
        var result = [];

        for (var key in list) {
            var row = list[key];
            result.push(row.url + ' ' + row.time.join(','));
        }

        return result.join('\n');
    },
    toFormat: function(text) {
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

                line.regexp = URLTime[0].replace('.', '\\.');
                BLOCKED.push(line);
            }
        }

        return BLOCKED;
    },
    makeTime: function() {
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
    },
    checkUrl: function(id, url, testmode) {
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
    },
    logger: function(a) {
        if (this.debug) {
            console.log(a);
        }
    },
    run: function(tab) {
        this.logger(tab);

        if (ls.get('blocked_disabled')) {
            return false;
        }

        if (tab.url.search(/https?:/) === 0) {
            this.checkUrl(tab.id, tab.url, false);
        }

        return true;
    }
};
