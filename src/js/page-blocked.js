
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
        resizer();
        if (ls.get('flag-password_function')) {
            console.log('password lock');
        }
    });
});

var url = getBeforeLocation();
$('.blocked-header h1').html(getLSi18n('blocked_title'));
$('.blocked-body').html(getLSi18n('blocked_message'));
$('.blocked-url').html('<a class="submit url" href="' + url + '">' + url + '</a>');

$('.go-option').css('display', ls.get('flag-option_page_link') ? 'none' : 'inline-block');

$('.go-option a').click(function() {
    goOptions(encodeURIComponent(url));
});

window.onresize = function() {
    resizer();
};

