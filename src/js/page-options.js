$(window).load(function() {
    Controller.optionsPage();
    i18n(function(){
        $('#container').show();
    });

//    Controller.addBlockData('www.google.com', ['0000-1200']);
});

$(window).unload(function() {
//    Controller.save();
});
