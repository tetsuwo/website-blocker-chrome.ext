
function DOMId(selector) {
    return document.querySelector(selector);
}

// オプションへ
function goOptions(url, blank) {
    check2go(chrome.extension.getURL('options.html?url='+url), blank || true);
}

// タブをチェック
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

function isNotUndefined(a) {
    return (a !== 'undefined' && typeof a !== 'undefined');
}

// ローカルストレージにない場合はシステムメッセージを使用するためのエイリアス関数
function getLSi18n(a)
{
    return haveValue(localStorage[a]) ? JSON.parse(localStorage[a]) : chrome.i18n.getMessage(a) ;
}

// システムメッセージのエイリアス関数
function getMessage(a)
{
    return chrome.i18n.getMessage(a) ? chrome.i18n.getMessage(a) : false ;
}

// ローカルストレージのエイリアス関数
function getStorage(a)
{
      console.log('a => ' + a);
      console.log('localStorage[a] => ' + localStorage[a]);
      console.log('isNotUndefined(localStorage[a]) ? JSON.parse(localStorage[a]) : false : '+ (isNotUndefined(localStorage[a]) ? JSON.parse(localStorage[a]) : false));
    return haveValue(localStorage[a]) ? JSON.parse(localStorage[a]) : false ;
}

// ローカルストレージのエイリアス関数
function getStorageAsBoolean(a)
{
    var tmp = localStorage[a];
    return tmp && (tmp !== 'false' || tmp !== 'undefined');
}

// 戻り先URL
function getBeforeLocation()
{
    return location.search != '' ? decodeURIComponent(location.search.replace('?url=', '')) : false;
}

/**
 * Import storage to new format from old format
 * @param A
 * @param B
 */
function importStorageKeyName(A, B)
{
    if (localStorage[A] === undefined) {
        return;
    }
    localStorage[B] = localStorage[A];
    localStorage.removeItem(A);
}

function postUrl(url) {
	$('#current-url').text(url);
}

