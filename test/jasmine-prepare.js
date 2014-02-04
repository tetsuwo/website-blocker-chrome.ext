(function() {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;

    var consoleReporter = new jasmine.ConsoleReporter();
    jasmineEnv.addReporter(consoleReporter);

    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    var currentWindowOnload = window.onload;
    window.onload = function() {
        if (currentWindowOnload) {
            currentWindowOnload();
        }

        execJasmine();
    };

    function execJasmine() {
        jasmineEnv.execute();
    }
})();
