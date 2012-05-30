
	/**
	 * クエリーセレクター
	 */
	function DOMId(selector)
	{
		return document.querySelector(selector);
	}

	// オプションへ
	function goOptions(url, blank)
	{
		check2go(chrome.extension.getURL('options.html?url='+url), blank||true);
	}

	// タブをチェック
	function check2go(href, blank)
	{
	    chrome.tabs.getAllInWindow(null, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
				if (tabs[i].url === href) {
					chrome.tabs.update(tabs[i].id, {selected:true});
					return;
				}
			}

			if (blank) {
				chrome.tabs.getCurrent(function(tab) {
					chrome.tabs.update(tab.id, {url:href, selected:true});
				});
			} else {
				chrome.tabs.create({url:href, selected:true});
			}
	    });
	}

	function applyFont()
	{
		document.body.style.fontFamily = getMessage('font_family');
	}

	function isNotUndefined(a)
	{
		return (a !== 'undefined' && typeof a !== 'undefined');
	}

	// ローカルストレージにない場合はシステムメッセージを使用するためのエイリアス関数
	function getLSi18n(a)
	{
		return isNotUndefined(localStorage[a]) ? JSON.parse(localStorage[a]) : chrome.i18n.getMessage(a) ;
	}

	// システムメッセージのエイリアス関数
	function getMessage(a)
	{
		return chrome.i18n.getMessage(a) ? chrome.i18n.getMessage(a) : false ;
	}

	// ローカルストレージのエイリアス関数
	function getStorage(a)
	{
//		console.log('isNotUndefined(localStorage[a]) ? JSON.parse(localStorage[a]) : false : '+ (isNotUndefined(localStorage[a]) ? JSON.parse(localStorage[a]) : false));
		return isNotUndefined(localStorage[a]) ? JSON.parse(localStorage[a]) : false ;
	}

	// ローカルストレージのエイリアス関数
	function getStorageAsBoolean(a)
	{
		return !localStorage[a] || localStorage[a] === 'false' ? false : true ;
	}

	// 戻り先URL
	function getBeforeLocation()
	{
		return location.search != '' ? decodeURIComponent(location.search.replace('?url=', '')) : false;
	}

	// 言語を選択
	function selectLanguage(lang)
	{
		LANG = localStorage['lang'] = lang;
		location.reload();
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
