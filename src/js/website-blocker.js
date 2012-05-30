WebsiteBlocker = new function()
{
    var BLOCKED_LIST,
        TIME_LIMIT_DISABLED = false,
        DEBUG = false,
        TIME,
        DATE
		$self = this;

    function blocked(id, url)
	{
        chrome.tabs.update(
            id,
            {'url': chrome.extension.getURL('blocked.html') + '?url=' + encodeURIComponent(url)}
        );
    }

    function isBlocked(taburl, regexp, time)
	{
        $self.log(taburl);
//        $self.log(regexp);
//        $self.log(taburl.search(new RegExp(regexp, 'ig')));
//        $self.log(taburl.search(regexp));
//        return false;
        var i, c;

        if (taburl.search(new RegExp(regexp, 'ig')) > 5) {
            if (TIME_LIMIT_DISABLED) {
                return true;
            }
            if (time.length === 0) {
                return true;
            }
            $self.log(time);

            for (i in time) {
                c = time[i].split('-');
//                $self.log(TIME);
//                $self.log(c);
//                $self.log(Number(c[0])+' <= '+Number(TIME)+' && '+Number(TIME)+' <= '+Number(c[1]));

                if (Number(c[0]) <= Number(TIME) && Number(TIME) <= Number(c[1])) {
                    return true;
                }
            }
        }
        return false;
    }

    function makeTime()
	{
        DATE = new Date();
        var hh = DATE.getHours();
        var mm = DATE.getMinutes();
        if (hh < 10) {
            hh = '0' + hh;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return TIME = hh.toString() + mm.toString();
    }

    function checkUrl(id, taburl)
	{
        BLOCKED_LIST = getStorage('blocked_list');
        $self.log(BLOCKED_LIST);

        if (BLOCKED_LIST !== false) {
            makeTime();
            TIME_LIMIT_DISABLED = getStorage('time_limit_disabled');
            var key;

            for (key in BLOCKED_LIST) {
                $self.log(BLOCKED_LIST[key].regexp);

                if (isBlocked(
                    taburl,
                    BLOCKED_LIST[key].regexp,
                    BLOCKED_LIST[key].time))
				{
                    blocked(id, taburl);
                    break;
                }
            }
        }
        $self.log(chrome.extension.lastError);
    }

    this.log = function(a)
	{
		if (DEBUG) {
	        console.log(a);
		}
    };

    this.run = function(tab)
	{
//        $self.log(tab);
        if (getStorage('blocked_disabled')) {
            return false;
        }

        if (tab.url.search(/https?:/) === 0) {
            checkUrl(tab.id, tab.url);
        }
        return true;
    };
};