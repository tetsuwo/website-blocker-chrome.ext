/*!
 * JavaScript for Options Page
 *
 * @author Tetsuwo OISHI
 */

var fragment = window.location.hash.substr(1);

$(window).load(function() {
    Controller.optionsPage();
    i18n(function(){
        $('#container').show();
        $('#switching nav a').filter('[data-id="' + fragment + '"]').click();
    });
});

$(window).unload(function() {
//    Controller.save();
});

