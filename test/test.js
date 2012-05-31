describe('WebsiteBlocker', function() {

    var testdata = {
    };

    it('default', function() {
        var wb = new WebsiteBlocker();
        expect(wb.blockedList).toBeNull();
        expect(wb.date).toBeNull();
        expect(wb.time).toBeNull();
        expect(wb.debug).toBeFalsy();
        expect(wb.disabledTimeLimit).toBeFalsy();
    });

});
