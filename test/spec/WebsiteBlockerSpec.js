describe('WebsiteBlocker', function() {
    var testdata = {};
    var blockedArray = [];

    it('default', function() {
        var wb = new WebsiteBlocker();

        expect(wb.blockedList).toBeNull();
        expect(wb.date).toBeNull();
        expect(wb.time).toBeNull();
        expect(wb.debug).toBeFalsy();
        //expect(wb.debug).toBeTruthy();
        expect(wb.disabledTimeLimit).toBeFalsy();
    });

    it('isBlocked(disabled-time)', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        wb.disabledTimeLimit = true;
        wb.daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
        wb.dayOfWeek = 0;

        expect(wb.isBlocked('http://www.yahoo.co.jp', 'yahoo\.co\.jp', [])).toBeTruthy();
        expect(wb.isBlocked('https://www.yahoo.co.jp', '^http:\/\/yahoo\.co\.jp', [])).toBeFalsy();
        expect(wb.isBlocked('file:///www.yahoo.co.jp', '^http:\/\/yahoo\.co\.jp', [])).toBeFalsy();
    });

    it('isBlocked(enabled-time)', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        wb.disabledTimeLimit = false;
        wb.daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
        wb.dayOfWeek = 0;

        expect(wb.isBlocked(
                'http://twitter.com',
                'twitter\.com',
                ['1200-1300'],
                '1245'
                )).toBeTruthy();

        expect(wb.isBlocked(
                'http://twitter.com',
                'twitter\.com',
                ['1200-1300'],
                '1300'
                )).toBeTruthy();

        expect(wb.isBlocked(
                'http://twitter.com',
                'twitter\.com',
                ['1200-1300'],
                '1301'
                )).toBeFalsy();
    });

    it('isBlocked(enabled-time difficult)', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        wb.disabledTimeLimit = false;
        wb.daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
        wb.dayOfWeek = 0;

        expect(wb.isBlocked(
                'http://twitter.com',
                'twitter\.com',
                ['1200-1300', '1315-1445'],
                '1200'
                )).toBeTruthy();

        expect(wb.isBlocked(
                'http://twitter.com',
                'twitter\.com',
                ['1200-1300', '1315-1445'],
                '1300'
                )).toBeTruthy();

        expect(wb.isBlocked(
                'http://twitter.com',
                'twitter\.com',
                ['1200-1300', '1315-1445'],
                '1301'
                )).toBeFalsy();

        expect(wb.isBlocked(
                'http://twitter.com',
                'twitter\.com',
                ['1200-1300', '1315-1445'],
                '1314'
                )).toBeFalsy();

        expect(wb.isBlocked(
                'http://twitter.com',
                'twitter\.com',
                ['1200-1300', '1315-1445'],
                '1315'
                )).toBeTruthy();

        expect(wb.isBlocked(
                'http://twitter.com',
                'twitter\.com',
                ['1200-1300', '1315-1445'],
                '1445'
                )).toBeTruthy();

        expect(wb.isBlocked(
                'http://twitter.com',
                'twitter\.com',
                ['1200-1300', '1315-1445'],
                '1446'
                )).toBeFalsy();
    });

    it('toFormat(simple)', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        wb.disabledTimeLimit = true;
        wb.daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
        wb.dayOfWeek = 0;

        var text = '';
        text += '(facebook|twitter).com 0000-0730,0945-1159\n';
        text += 'yahoo.co.jp';
        var data = wb.toFormat(text);
        //console.log(data);

        expect(data.length).toEqual(2);

        expect(data[0].url).toEqual('(facebook|twitter).com');
        expect(data[0].regexp).toEqual('(facebook|twitter)\\.com');
        expect(data[0].time.length).toEqual(2);

        expect(data[1].url).toEqual('yahoo.co.jp');
        expect(data[1].regexp).toEqual('yahoo\\.co\\.jp');
        expect(data[1].time.length).toEqual(0);
    });

    it('toFormat(difficult)', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        wb.disabledTimeLimit = true;
        wb.daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
        wb.dayOfWeek = 0;

        var text = '';
        text += 'facebook.com 0930-1259,1300-1530\n';
        text += 'twitter.com 1000-1259\n';
        text += '(facebook|twitter).com 0000-0730,0945-1159';
        var data = blockedArray = wb.toFormat(text);
        //console.log(data);

        expect(data.length).toEqual(3);

        expect(data[0].url).toEqual('facebook.com');
        expect(data[0].regexp).toEqual('facebook\\.com');
        expect(data[0].time.length).toEqual(2);
        expect(data[0].time[0]).toEqual('0930-1259');
        expect(data[0].time[1]).toEqual('1300-1530');
    });

    it('toString(simple)', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        wb.disabledTimeLimit = true;
        wb.daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
        wb.dayOfWeek = 0;

        var blockedArray = [
            {
                regexp: '(facebook|twitter)\.com',
                url: '(facebook|twitter).com',
                time: ['0000-0730', '0945-1159']
            },
            {
                regexp: 'yahoo\.co\.jp',
                url: 'yahoo.co.jp',
                time: []
            }
        ];

        var text = '';
        text += '(facebook|twitter).com 0000-0730,0945-1159\n';
        text += 'yahoo.co.jp ';

        var data = wb.toString(blockedArray);
        //console.log(data);

        expect(data).toEqual(text);
    });

    it('generateRandomString', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        var passphrase = '';

        passphrase = wb.generateRandomString(12, true);
        expect(passphrase.length).toEqual(12);

        passphrase = wb.generateRandomString(36, true);
        expect(passphrase.length).toEqual(36);

        passphrase = wb.generateRandomString(12, true, true);
        expect(passphrase.length).toEqual(12);

        passphrase = wb.generateRandomString(36, true, true);
        expect(passphrase.length).toEqual(36);

        passphrase = wb.generateRandomString(12, true, true, true);
        expect(passphrase.length).toEqual(12);

        passphrase = wb.generateRandomString(36, true, true, true);
        expect(passphrase.length).toEqual(36);
    });
});
