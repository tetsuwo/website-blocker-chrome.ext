/*!
 * JavaScript for Blocked Page
 *
 * @author Tetsuwo OISHI
 */

function resizer() {
    var $self = $('#blocked-container');
    $self.css({
        left : (window.innerWidth  - $self.get(0).offsetWidth)  / 2,
        top  : (window.innerHeight - $self.get(0).offsetHeight) / 2
    });
}

$(window).load(function() {
    Controller.blockedPage();
    i18n(function(){
        $('#blocked-container').show();
        if (ls.get('flag-password_function')) {
            $('#password-target').val(chrome.extension.getBackgroundPage().WB.generateRandomString(48, false, true, true));
            $('#password').show();
        }
        resizer();
    });
});

var url = getBeforeLocation();
$('.blocked-header h1').html(getLSi18n('blocked_title'));
$('.blocked-body').html(getLSi18n('blocked_message'));
$('.blocked-url').html('<a class="submit url" href="' + url + '">' + url + '</a>');

$('.go-option').css('display', ls.get('flag-option_page_link') ? 'inline-block' : 'none');

$('.go-option a').click(function() {
    goOptions(encodeURIComponent(url));
});

$('.go-back').click(function() {
    window.history.go(-2);
});

$('#password-check').click(function() {
    var valid = chrome.extension.getBackgroundPage().WB.matchPassphrase($('#password-target').val(), $('#password-typing').val());
    if (valid === true) {
        chrome.extension.getBackgroundPage().WB.setTimeLimit(600); // 5 min.
        window.location.href = url;
    }
});

window.onresize = function() {
    resizer();
};

