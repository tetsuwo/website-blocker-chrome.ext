/**
 * common.js for chrome extension
 *
 * @author Tetsuwo OISHI <tetsuwo.oishi@gmail.com>
 */

// Set Environment Vars
MIGRATION_VERSION = 1;
NEWS_VERSION = 1;
STORAGE_NAMESPACE = '__wb_' + MIGRATION_VERSION;
//db.change(STORAGE_NAMESPACE);

// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-17392775-5']);
_gaq.push(['_trackPageview']);
(function(d) {
    var ga = d.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = d.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})(document);

// Tracking
function _trace(category, action, label) {
    try {
        _gaq.push(['_trackEvent', category, action, label]);
    } catch (e) {;}
}

//_trace('SETTING', 'MIGRATION_VERSION', MIGRATION_VERSION);

//if (!CommonDB.get('migration_version')) {
//    console.log('low migration');
//
//    switch (MIGRATION_VERSION) {
//        case 1:
//            ;
//            break;
//    }
//
//    CommonDB.set('migration_version', MIGRATION_VERSION);
//}

