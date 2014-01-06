/*!
 * JavaScript for Welcome Page
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
    Controller.sharePage();
    i18n(function(){
        $('#blocked-container').show();
        resizer();
    });
});

window.onresize = function() {
    resizer();
};

