function WebsiteBlocker () {
    this.blocked_list = null;
    this.date = null;
    this.debug = false;
    this.time = null;
    this.time_limit_disabled = false;
}

WebsiteBlocker.prototype = {
    blocked: function(id, url) {
        chrome.tabs.update(id, {
            url: chrome.extension.getURL('blocked.html') + '?url=' + encodeURIComponent(url)
        });
    },
    isBlocked: function(taburl, regexp, time) {
        if (taburl.search(new RegExp(regexp, 'ig')) > 5) {
            if (this.time_limit_disabled) {
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
        this.blocked_list = ls.get('blocked_list');
        if (this.blocked_list) {
            this.makeTime();
            this.time_limit_disabled = ls.get('time_limit_disabled');
            for (var key in this.blocked_list) {
//                this.logger(this.blocked_list[key].regexp);
                if (this.isBlocked(url, this.blocked_list[key].regexp, this.blocked_list[key].time)) {
					if (testmode) {
						return true;
					}
                    this.blocked(id, url);
                    break;
                }
            }
        }
//        this.logger(chrome.extension.lastError);
		return false;
    },
    logger: function(a) {
        if (this.debug) {
            console.log(a);
        }
    },
    run: function(tab) {
//        this.logger(tab);
        if (ls.get('blocked_disabled')) {
            return false;
        }
        if (tab.url.search(/https?:/) === 0) {
            this.checkUrl(tab.id, tab.url, false);
        }
        return true;
    }
};
