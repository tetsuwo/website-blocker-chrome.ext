OptionPages = new function()
{
    var BEFORE_PAGE;
	var $self = this;

    function buildPage()
	{
        if (BEFORE_PAGE === false) {
            $('.back').hide();
        }

        $('#blocked_disabled').attr('checked', getStorageAsBoolean('blocked_disabled'));
        $('#time_limit_disabled').attr('checked', getStorageAsBoolean('time_limit_disabled'));
        $('#option_page_link_disabled').attr('checked', getStorageAsBoolean('option_page_link_disabled'));
        $('#popup_page_control_disabled').attr('checked', getStorageAsBoolean('popup_page_control_disabled'));

        $('#blocked_text').val(getStorage('blocked_text') || '');
        $('#blocked_title').val(getLSi18n('blocked_title'));
        $('#blocked_message').val(getLSi18n('blocked_message'));
    }

    function applyEvent()
	{
        $('.close').click(function() {
			$self.save();
            window.close();
            chrome.tabs.getCurrent(function(tab){
                chrome.tabs.remove(tab.id);
            });
        });

        $('.back').click(function() {
			$self.save();
            location.href = BEFORE_PAGE;
        });

        $('.please_support_me').click(function() {
            $('#paypal').submit();
            return false;
        });

        $('.bug_report').click(function() {
            check2go('http://twitter.com/?status=@_tetsuwo%20%23websiteblocker_bugreport_chrome%20:');
        });

        $('.facebook_page').click(function() {
            check2go('http://www.facebook.com/website.blocker');
        });

        $('.document').click(function() {
            check2go('https://chrome.google.com/webstore/detail/' + getMessage('@@extension_id'));
        });

		$('fieldset').find('input:text, input:checkbox, textarea').change(function() {
			$self.save();
		});
    }

    this.save = function()
	{
        var tmp1, tmp2, tmp3, BLOCKS = [], line = [];
//        console.log('save start!');

		localStorage.blocked_text                = '';
		localStorage.blocked_list                = '';
		localStorage.blocked_title               = '';
		localStorage.blocked_message             = '';
		localStorage.blocked_disabled            = false;
		localStorage.time_limit_disabled         = false;
		localStorage.option_page_link_disabled   = false;
		localStorage.popup_page_control_disabled = false;

        if ($('#blocked_text').val()) {
            tmp1 = $('#blocked_text').val().split('\n');
//            console.log(tmp1);

            if (tmp1.length > 0) {
                for (var i = 0; i < tmp1.length; i++) {
                    tmp1[i] = tmp1[i].trim();
                    if (!tmp1[i]) continue;
                    line.push(tmp1[i]);
                    tmp2 = tmp1[i].split(' ');
                    tmp3 = {};

                    if (tmp2.length === 2) {
                        tmp3['url']  = tmp2[0];
                        tmp3['time'] = tmp2[1].split(',');
                    }
					else if (tmp2.length > 2) {
                        tmp3['url']  = tmp2[0];
                        tmp3['time'] = tmp1[i].replace(/\s/g, '').replace(tmp2[0], '').split(',');
                    }
					else {
                        tmp3['url']  = tmp2[0];
                        tmp3['time'] = [];
                    }

                    tmp3['regexp'] = tmp2[0].replace('.', '\\.');
                    BLOCKS.push(tmp3);
                }
            }
            localStorage.blocked_list = JSON.stringify(BLOCKS);
            localStorage.blocked_text = JSON.stringify(line.join("\n"));
            $('#blocked_text').val(line.join("\n"));
        }

		localStorage.blocked_title               = JSON.stringify($('#blocked_title').val());
		localStorage.blocked_message             = JSON.stringify($('#blocked_message').val());
		localStorage.blocked_disabled            = JSON.stringify($('#blocked_disabled:checked').val() === 'on');
		localStorage.time_limit_disabled         = JSON.stringify($('#time_limit_disabled:checked').val() === 'on');
		localStorage.option_page_link_disabled   = JSON.stringify($('#option_page_link_disabled:checked').val() === 'on');
		localStorage.popup_page_control_disabled = JSON.stringify($('#popup_page_control_disabled:checked').val() === 'on');

//        console.log('save end!');
        return true;
    };

    this.run = function()
	{
        BEFORE_PAGE = getBeforeLocation();
		applyFont();
		i18n();
        buildPage();
        applyEvent();
    };
};