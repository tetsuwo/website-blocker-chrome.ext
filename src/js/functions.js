/*!
 * JavaScript Original Functions
 *
 * @author Tetsuwo OISHI
 */

function DOMId(selector) {
    return document.querySelector(selector);
}

// go option
function goOptions(url, blank) {
    check2go(chrome.extension.getURL('options.html?url='+url), blank || true);
}

// check tab
function check2go(href, blank) {
    chrome.tabs.getAllInWindow(null, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].url === href) {
                chrome.tabs.update(tabs[i].id, { selected: true });
                return;
            }
        }
        if (blank) {
            chrome.tabs.getCurrent(function(tab) {
                chrome.tabs.update(tab.id, { url: href, selected: true });
            });
        } else {
            chrome.tabs.create({ url: href, selected: true });
        }
    });
}

function applyFont() {
    document.body.style.fontFamily = getMessage('font_family');
}

function haveValue(a) {
    return a && (a !== 'false' || a !== 'undefined');
}

// localStorage > i18n message
function getLSi18n(a) {
    return haveValue(localStorage[a]) ? JSON.parse(localStorage[a]) : chrome.i18n.getMessage(a);
}

// i18n message
function getMessage(a) {
    return chrome.i18n.getMessage(a) ? chrome.i18n.getMessage(a) : false ;
}

/**
 * Back to URL
 */
function getBeforeLocation() {
    return location.search != '' ? decodeURIComponent(location.search.replace('?url=', '')) : false;
}