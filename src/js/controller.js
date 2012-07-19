Controller = new function() {
    var beforepage;
    var that = this;
    var WB = new WebsiteBlocker();

    function buildPage() {
        if (!beforepage) {
            $('.back').hide();
        }

        $('#blocked_disabled').attr('checked', ls.get('blocked_disabled'));
        $('#time_limit_disabled').attr('checked', ls.get('time_limit_disabled'));
        $('#option_page_link_disabled').attr('checked', ls.get('option_page_link_disabled'));
        $('#popup_page_control_disabled').attr('checked', ls.get('popup_page_control_disabled'));

        $('#blocked_text').val(ls.get('blocked_list') ? WB.toString(ls.get('blocked_list')) : '');
        $('#blocked_title').val(ls.i18n('blocked_title'));
        $('#blocked_message').val(ls.i18n('blocked_message'));
    }

    function applyEvent() {
        $('#switching nav a').click(function() {
            $('#switching article section').hide();
            $('#switching nav a').removeClass('F');
            $('#' + $(this).attr('data-id')).show();
            $(this).addClass('F');
        });

        $('.save_and_close').click(function() {
            that.save();
            window.close();
            chrome.tabs.getCurrent(function(tab){
                chrome.tabs.remove(tab.id);
            });
        });

        $('.tell_a_friend').click(function() {
            check2go('share.html');
        });

        $('.with_email').click(function() {
            var tmp = [], body = '';
            tmp.push('');
            tmp.push('----');
            tmp.push('[' + getMessage('ext_name') + ']');
            tmp.push('' + getMessage('ext_description') + '');
            tmp.push('https://chrome.google.com/webstore/detail/' + getMessage('@@extension_id') + '?ref=email');
            tmp.push('----');
            tmp.push('');
            body = encodeURIComponent(tmp.join("\n"));

            window.location.href = 'mailto:?subject=&body=' + body;
        });

        $('.back').click(function() {
            that.save();
            location.href = beforepage;
        });

        $('.save').click(function() {
            that.save();
        });

        $('.please_support_me').click(function() {
            $('#paypal').submit();
            return false;
        });

        $('.bug_report').click(function() {
//            check2go('http://twitter.com/?status=@website_blocker%20%23bug%20%23chrome%20');
            check2go('https://github.com/tetsuwo/website-blocker-chrome.ext/issues');
        });

        $('.facebook_page').click(function() {
            check2go('http://www.facebook.com/website.blocker');
        });

        $('.document').click(function() {
            check2go('https://chrome.google.com/webstore/detail/' + getMessage('@@extension_id'));
        });

        $('fieldset').find('input:text, input:checkbox, textarea').change(function() {
            that.save();
        });
    }

    this.save = function() {
        with (window.localStorage) {
            blocked_text                = '';
            blocked_list                = '';
            blocked_title               = '';
            blocked_message             = '';
            blocked_disabled            = false;
            time_limit_disabled         = false;
            option_page_link_disabled   = false;
            popup_page_control_disabled = false;
        }

        if ($('#blocked_text').val()) {
            var BLOCKED = WB.toFormat($('#blocked_text').val());
            ls.set('blocked_list', BLOCKED);
            $('#blocked_text').val(WB.toString(BLOCKED));
        }

        ls.set('blocked_title', $('#blocked_title').val());
        ls.set('blocked_message', $('#blocked_message').val());
        ls.set('blocked_disabled', $('#blocked_disabled:checked').val() === 'on');
        ls.set('time_limit_disabled', $('#time_limit_disabled:checked').val() === 'on');
        ls.set('option_page_link_disabled', $('#option_page_link_disabled:checked').val() === 'on');
        ls.set('popup_page_control_disabled', $('#popup_page_control_disabled:checked').val() === 'on');

        return true;
    };

    this.checkUrl = function(url) {
        console.log(WB.checkUrl(null, url, true));
    };

    this.getUrl = function() {
        return beforepage;
    };

    this.addBlockData = function(domain, times) {
        var line = domain + ' ' + times.join(',');
        var text = WB.toString(ls.get('blocked_list')) + '\n' + line;
        var save = WB.toFormat(text);
//        save.push(line);
//        console.log(save);
//        console.log(save);
        ls.set('blocked_list', save);
    };

    this.optionsPage = function() {
        beforepage = getBeforeLocation();
        applyFont();
        buildPage();
        applyEvent();
    };

    this.popupPage = function() {
        beforepage = getBeforeLocation();
        applyFont();
        buildPage();
        applyEvent();
    };

    this.sharePage = function() {
        beforepage = getBeforeLocation();
        applyFont();
        buildPage();
        applyEvent();
    };

    this.blockedPage = function() {
        beforepage = getBeforeLocation();
        applyFont();
        buildPage();
        applyEvent();
    };
};
