/*!
 * JavaScript for Page Controller
 *
 * @author Tetsuwo OISHI
 */

var Controller = new function() {
    var beforepage;
    var that = this;
    var WB = new WebsiteBlocker();

    function buildPage() {
        if (!beforepage) {
            $('.back').hide();
        }

        // day's of week
        var daysOfWeek = ls.get('days_of_week');
        if (daysOfWeek) {
            for (var d in daysOfWeek) {
                if (daysOfWeek[d] !== ',') {
                    $('#days_of_week_' + daysOfWeek[d]).prop('checked', true);
                }
            }
        }

        // for text
        $('#blocked_text'    ).val(ls.get('blocked_list') ? WB.toString(ls.get('blocked_list')) : '');
        $('#blocked_title'   ).val(ls.i18n('blocked_title'));
        $('#blocked_message' ).val(ls.i18n('blocked_message'));
        $('#blocked_redirect').val(ls.i18n('blocked_redirect'));

        // for flag
        $('#flag-block_function'    ).prop('checked', ls.get('flag-block_function'));
        $('#flag-timegroup_function').prop('checked', ls.get('flag-timegroup_function'));
        $('#flag-option_page_link'  ).prop('checked', ls.get('flag-option_page_link'));
        $('#flag-password_function' ).prop('checked', ls.get('flag-password_function'));
    }

    function applyEvent() {
        $('#switching nav a').click(function() {
            $('#switching article section').hide();
            $('#switching nav a').removeClass('F');
            $('#' + $(this).attr('data-id')).show();
            $(this).addClass('F');
            buildPage();
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
        var blockTextExistsInDb = ls.get('blocked_list').length ? true : false;

        if($('#blocked_text').val() || blockTextExistsInDb === true) {
            var BLOCKED = WB.toFormat($('#blocked_text').val());
            ls.set('blocked_list', BLOCKED);
            $('#blocked_text').val(WB.toString(BLOCKED));
        }

        // days of week
        if (0 < $('input.days_of_week:checked').size()) {
            var daysOfWeekString = WB.toFormatDaysOfWeekToString($('input.days_of_week:checked'));
            ls.set('days_of_week', WB.toFormatDaysOfWeekToArray(daysOfWeekString));
        } else {
            ls.set('days_of_week', null);
        }

        // for text
        ls.set('blocked_title',    $('#blocked_title').val());
        ls.set('blocked_message',  $('#blocked_message').val());
        ls.set('blocked_redirect', $('#blocked_redirect').val());

        // for flag
        ls.set('flag-block_function',      $('#flag-block_function:checked').val()     === 'on');
        ls.set('flag-timegroup_function',  $('#flag-timegroup_function:checked').val() === 'on');
        ls.set('flag-option_page_link',    $('#flag-option_page_link:checked').val()   === 'on');
        ls.set('flag-password_function',   $('#flag-password_function:checked').val()  === 'on');

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
        //buildPage();
        applyEvent();
    };

    this.blockedPage = function() {
        beforepage = getBeforeLocation();
        applyFont();
        buildPage();
        applyEvent();

        $('#password-target, #password-typing').on('copy', function(e) {
            return false;
        });

        $('#password-target, #password-typing').on('contextmenu', function() {
            return false;
        });

        $('#password-target, #password-typing').on('paste', function() {
            return false;
        });
    };
};
