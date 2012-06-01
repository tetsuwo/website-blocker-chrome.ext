describe('WebsiteBlocker', function() {

    var testdata = {
    };
    var blockedArray = [];

    it('default', function() {
        var wb = new WebsiteBlocker();

        expect(wb.blockedList).toBeNull();
        expect(wb.date).toBeNull();
        expect(wb.time).toBeNull();
        expect(wb.debug).toBeFalsy();
        expect(wb.disabledTimeLimit).toBeFalsy();
    });

    it('isBlocked', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        wb.disabledTimeLimit = true;

        expect(wb.debug).toBeTruthy(
            wb.isBlocked('http://www.yahoo.co.jp', 'yahoo\.co\.jp', [])
        );
    });

    it('toFormat', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        wb.disabledTimeLimit = true;

        var text = '';
        text += '(facebook|twitter).com 0000-0730,0945-1159\n';
        text += 'yahoo.co.jp';
        var data = blockedArray = wb.toFormat(text);
        console.log(data);

        expect(data.length).toEqual(2);

        expect(data[0].url).toEqual('(facebook|twitter).com');
        expect(data[0].regexp).toEqual('(facebook|twitter)\\.com');
        expect(data[0].time.length).toEqual(2);

        expect(data[1].url).toEqual('yahoo.co.jp');
        expect(data[1].regexp).toEqual('yahoo\\.co\\.jp');
        expect(data[1].time.length).toEqual(0);
    });

    it('toString', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        wb.disabledTimeLimit = true;

        var text = '';
        text += '(facebook|twitter).com 0000-0730,0945-1159\n';
        text += 'yahoo.co.jp ';

        var data = wb.toString(blockedArray);
        console.log(data);

        expect(data).toEqual(text);
    });

});
