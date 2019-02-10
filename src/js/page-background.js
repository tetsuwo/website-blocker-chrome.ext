/*!
 * JavaScript for Background Page
 *
 * @author Tetsuwo OISHI
 */

// ---- For User ---- //

// Migration
if (window.localStorage.getItem('flag-password_function') === null) {
    ls.set('flag-block_function',     !ls.get('blocked_disabled'));
    ls.set('flag-timegroup_function', !ls.get('time_limit_disabled'));
    ls.set('flag-option_page_link',   !ls.get('option_page_link_disabled'));
    ls.set('flag-password_function',  false);
    //ls.set('flag-timelimit_function', false);
    ls.rm('blocked_disabled');
    ls.rm('time_limit_disabled');
    ls.rm('option_page_link_disabled');
    ls.rm('__password_func_01');
    ls.rm('__wb_1_regular_visitor');
    ls.rm('__wb_1__password_func_01');
}

if (!ls.get('_installed')) {
    //chrome.tabs.create({ url: 'welcome.html', selected: true })
    ls.set('days_of_week', [0,1,2,3,4,5,6]);
    ls.set('_installed', true);
}

if (ls.get('_explain') !== 1) {
    chrome.tabs.create({ url: 'options.html#password', selected: true })
    ls.set('_explain', 1);
}

if (!ls.get('_read_news') || ls.get('_read_news') < ENV_NEWS_VERSION) {
    chrome.tabs.create({ url: 'news.html#news-version-' + ENV_NEWS_VERSION, selected: true })
    ls.set('_read_news', ENV_NEWS_VERSION);
}

// ---- Background ---- //

var afterFunction = null;
var WB = new WebsiteBlocker();

chrome.tabs.onCreated.addListener(function(tab) {
    WB.run(tab);
});

chrome.tabs.onActivated.addListener(function(info) {
    chrome.tabs.get(info.tabId, function(tab) {
        WB.run(tab);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading') {
        WB.run(tab);
        return;
    }
});

function getUrl(callback) {
    chrome.tabs.getSelected(null, function(tab) {
        if (tab.url) {
            afterFunction = callback;
            try {
                chrome.tabs.executeScript(null, { file: 'js/injection.js' });
            } catch (e) {}
        } else {
            callback(null);
        }
    });
};

function checkCurrentTab() {
    chrome.tabs.getSelected(null, function(tab) {
        WB.run(tab);
    });
};

chrome.extension.onRequest.addListener(function(tab) {
    afterFunction(tab);
});

