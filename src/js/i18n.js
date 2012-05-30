var i18n = function(){
	function getmsg (a) {
		return chrome.i18n.getMessage(a) ? chrome.i18n.getMessage(a) : false ;
	}
	var res = document.querySelectorAll('[i18n]');
	for (var i = 0; i < res.length; i++) {
		var data  = res[i], msg = false, msgs  = [], msgid = data.getAttribute('i18n');
		if (msgid.indexOf('+') > -1) {
			msgids = msgid.split('+');
			for (var h in msgids) {
				msgs.push(getmsg(msgids[h]));
			}
			msg = msgs.join(' ');
		} else {
			msg = getmsg(msgid);
		}
		if (msg !== false) {
			data.innerHTML = msg;
		}
	}
};