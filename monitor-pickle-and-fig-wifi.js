#!/usr/bin/env casperjs

// if you want more insights to whats happening
// you can change --log-level to debug or info

var casper = require('casper').create();
var fs = require('fs');

var checkInternet = function checkInternet() {
    // use google home page to detect for internet
    casper.open('http://www.google.com/').then(function() {
        var title = this.getTitle();
        if (title === 'Google') {
            // all is good, do nothing
        } else {
            this.echo('[webpage title: ' + title + ']');
            this.echo('Internet is blocked...');
            if (title.search('Y5ZONE') >= 0) {
                this.echo(' + detected Y5ZONE');
                // wait for the Give Me Wi-Fi button and click on it
                this.echo(' + waiting for Give Me Wi-Fi button');
                var selectorButtonGiveMeWifi = 'div#btn_wifi';
                this.waitUntilVisible(selectorButtonGiveMeWifi,
                    function waitUntilVisibleButtonGiveMeWifiThen() {
                        var currentUrl = this.getCurrentUrl();
                        this.echo(' + currentUrl: ' + currentUrl);
                        this.click(selectorButtonGiveMeWifi);
                        this.echo(' + clicked on: ' + selectorButtonGiveMeWifi);
                        this.capture('waitUntilVisibleButtonGiveMeWifiThen.png');
                        this.waitFor(
                            function checkUntilCurrentUrlChanged() {
                                var newCurrentUrl = this.getCurrentUrl();
                                var changed = currentUrl != this.getCurrentUrl();
                                if (changed) {
                                    this.echo(' + newCurrentUrl: ' + newCurrentUrl);
                                }
                                return changed
                            },
                            function waitUntilCurrentUrlChangedThen() {
                                this.echo(' + check done, currentUrl: ' + this.getCurrentUrl());
                                this.capture('waitUntilCurrentUrlChangedThen.png');
                            },
                            function waitUntilCurrentUrlChangedTimeout() {
                                this.capture('waitUntilCurrentUrlChangedTimeout.png');
                            }, 10000);
                    },
                    function waitUntilVisibleButtonGiveMeWifiTimeout() {
                        this.echo(' + timeout while waiting for button');
                        this.capture('waitUntilVisibleButtonGiveMeWifiTimeout.png');
                        fs.write('waitUntilVisibleButtonGiveMeWifiTimeout.html', this.getHTML(), 'w');
                    }, 10000);
            }
        }
        // call recursively, loop forever
        this.wait(2000, function loopCheckInternet() {
            this.echo('.');
            checkInternet();
        });
    });
};

casper.start();
checkInternet();
casper.run();

