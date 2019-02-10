/**
 * common.js for chrome extension
 *
 * @author Tetsuwo OISHI <tetsuwo.oishi@gmail.com>
 */

// Set Environment Vars
const ENV_APP_VERSION = '0.3.0';
const ENV_MIGRATION_VERSION = 1;
const ENV_NEWS_VERSION = 1;
const ENV_STORAGE_NAMESPACE = '__wb_' + ENV_MIGRATION_VERSION;

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

_trace('Environment', 'ENV_MIGRATION_VERSION', ENV_MIGRATION_VERSION);
_trace('Environment', 'ENV_APP_VERSION', ENV_APP_VERSION);
