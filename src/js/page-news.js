/*!
 * JavaScript for Share Page
 *
 * @author Tetsuwo OISHI
 */

function resizer() {
    var el = document.getElementById('blocked-container');
    el.style.left = ((window.innerWidth  - el.offsetWidth)  / 2) + 'px';
    el.style.top = ((window.innerHeight - el.offsetHeight) / 2) + 'px';
}

window.onload = function() {
    ls.set('_read_news', ENV_NEWS_VERSION);
    Controller.sharePage();
    i18n(function() {
        document.getElementById('blocked-container').style.display = 'block';
        resizer();
    });
};

window.onresize = function() {
    resizer();
};
