describe('WebsiteBlocker', function() {
    var testdata = {};
    var blockedArray = [];

    describe('default setting', function() {
        var wb = new WebsiteBlocker();

        it('WebsiteBlocker.blockedList is NULL', function() {
            expect(wb.blockedList).toBeNull();
        });

        it('WebsiteBlocker.date is NULL', function() {
            expect(wb.date).toBeNull();
        });

        it('WebsiteBlocker.time is NULL', function() {
            expect(wb.time).toBeNull();
        });

        it('WebsiteBlocker.debug is false', function() {
            expect(wb.debug).toBeFalsy();
        });

        it('WebsiteBlocker.disabledTimeLimit is false', function() {
            expect(wb.disabledTimeLimit).toBeFalsy();
        });
    });

    describe('isBlocked(disabled-time)', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        wb.disabledTimeLimit = true;
        wb.daysOfWeek = [0, 1, 2, 3, 4, 5, 6];

        it('Pattern-1 is True', function() {
            expect(wb.isBlocked(
                    'http://www.yahoo.co.jp',
                    'yahoo\.co\.jp',
                    [], '1200', 0)).toBeTruthy();
        });

        it('Pattern-2 is False', function() {
            expect(wb.isBlocked(
                    'https://www.yahoo.co.jp',
                    '^http:\/\/yahoo\.co\.jp',
                    [], '1200', 0)).toBeFalsy();
        });

        it('Pattern-3 is False', function() {
            expect(wb.isBlocked(
                    'file:///www.yahoo.co.jp',
                    '^http:\/\/yahoo\.co\.jp',
                    [], '1200', 0)).toBeFalsy();
        });
    });

    describe('isBlocked(enabled-time)', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        wb.disabledTimeLimit = false;
        wb.daysOfWeek = [0, 1, 2, 3, 4, 5, 6];

        it('Pattern-1 is True', function() {
            expect(wb.isBlocked(
                    'http://twitter.com',
                    'twitter\.com',
                    ['1200-1300'],
                    '1245',
                    0
                    )).toBeTruthy();
        });

        it('Pattern-2 is True', function() {
            expect(wb.isBlocked(
                    'http://twitter.com',
                    'twitter\.com',
                    ['1200-1300'],
                    '1300',
                    0
                    )).toBeTruthy();
        });

        it('Pattern-3 is False', function() {
            expect(wb.isBlocked(
                    'http://twitter.com',
                    'twitter\.com',
                    ['1200-1300'],
                    '1301',
                    0
                    )).toBeFalsy();
        });
    });

    describe('isBlocked(enabled-time difficult)', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        wb.disabledTimeLimit = false;
        wb.daysOfWeek = [0, 1, 2, 3, 4, 5, 6];

        it('Pattern-1 is True', function() {
            expect(wb.isBlocked(
                    'http://twitter.com',
                    'twitter\.com',
                    ['1200-1300', '1315-1445'],
                    '1200',
                    0
                    )).toBeTruthy();
        });

        it('Pattern-2 is True', function() {
            expect(wb.isBlocked(
                    'http://twitter.com',
                    'twitter\.com',
                    ['1200-1300', '1315-1445'],
                    '1300',
                    0
                    )).toBeTruthy();
        });

        it('Pattern-3 is False', function() {
            expect(wb.isBlocked(
                    'http://twitter.com',
                    'twitter\.com',
                    ['1200-1300', '1315-1445'],
                    '1301',
                    0
                    )).toBeFalsy();
        });

        it('Pattern-4 is False', function() {
            expect(wb.isBlocked(
                    'http://twitter.com',
                    'twitter\.com',
                    ['1200-1300', '1315-1445'],
                    '1314',
                    0
                    )).toBeFalsy();
        });

        it('Pattern-5 is True', function() {
            expect(wb.isBlocked(
                    'http://twitter.com',
                    'twitter\.com',
                    ['1200-1300', '1315-1445'],
                    '1315',
                    0
                    )).toBeTruthy();
        });

        it('Pattern-6 is True', function() {
            expect(wb.isBlocked(
                    'http://twitter.com',
                    'twitter\.com',
                    ['1200-1300', '1315-1445'],
                    '1445',
                    0
                    )).toBeTruthy();
        });

        it('Pattern-7 is False', function() {
            expect(wb.isBlocked(
                    'http://twitter.com',
                    'twitter\.com',
                    ['1200-1300', '1315-1445'],
                    '1446',
                    0
                    )).toBeFalsy();
        });
    });

    describe('toFormat(simple)', function() {
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

        it('data length is 2', function() {
            expect(data.length).toEqual(2);
        });

        it('data line-1 is all clean', function() {
            expect(data[0].url).toEqual('(facebook|twitter).com');
            expect(data[0].regexp).toEqual('(facebook|twitter)\\.com');
            expect(data[0].time.length).toEqual(2);
        });

        it('data line-2 is all clean', function() {
            expect(data[1].url).toEqual('yahoo.co.jp');
            expect(data[1].regexp).toEqual('yahoo\\.co\\.jp');
            expect(data[1].time.length).toEqual(0);
        });
    });

    describe('toFormat(difficult)', function() {
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

        it('data length is 3', function() {
            expect(data.length).toEqual(3);
        });

        it('data line-1 is all clean', function() {
            expect(data[0].url).toEqual('facebook.com');
            expect(data[0].regexp).toEqual('facebook\\.com');
            expect(data[0].time.length).toEqual(2);
            expect(data[0].time[0]).toEqual('0930-1259');
            expect(data[0].time[1]).toEqual('1300-1530');
        });
    });

    describe('toString(simple)', function() {
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

        it('array to string data is expected string', function() {
            expect(data).toEqual(text);
        });
    });

    describe('generateRandomString', function() {
        var wb = new WebsiteBlocker();
        wb.debug = true;
        var passphrase = '';

        it('12 chars and number only', function() {
            passphrase = wb.generateRandomString(12, true);
            expect(passphrase.length).toEqual(12);
        });

        it('36 chars and number only', function() {
            passphrase = wb.generateRandomString(36, true);
            expect(passphrase.length).toEqual(36);
        });

        it('12 chars and number, lower alphabet', function() {
            passphrase = wb.generateRandomString(12, true, true);
            expect(passphrase.length).toEqual(12);
        });

        it('36 chars and number, lower alphabet', function() {
            passphrase = wb.generateRandomString(36, true, true);
            expect(passphrase.length).toEqual(36);
        });

        it('12 chars and number, alphabet', function() {
            passphrase = wb.generateRandomString(12, true, true, true);
            expect(passphrase.length).toEqual(12);
        });

        it('36 chars and number, alphabet', function() {
            passphrase = wb.generateRandomString(36, true, true, true);
            expect(passphrase.length).toEqual(36);
        });
    });
});
