import { onInstalled } from './background/on-installed.js';
onInstalled();

import { onAlarm } from './background/on-alarm.js';
onAlarm();

import { activateMonetizing } from './background/activate-monetizing.js';
activateMonetizing();

import { deactivateMonetizing } from './background/deactivate-monetizing.js';
deactivateMonetizing();

import { recognizeOtherAffiliates } from './background/recognize-other-affiliates.js';
recognizeOtherAffiliates();

/* Check whether new version is installed */
chrome.runtime.onInstalled.addListener(function(details) {
    /* other 'reason's include 'update' */
    if (details.reason == "install") {
        /* If first install, set uninstall URL */
        var uninstallGoogleFormLink = 'https://docs.google.com/forms/d/e/1FAIpQLScFzXABlaBzzKaiyCZR-REhBTC5rQVLaObU3dy6LcNr-awrgw/viewform';
        /* If Browser version supports it... */
        if (chrome.runtime.setUninstallURL) {
            chrome.runtime.setUninstallURL(uninstallGoogleFormLink);
        }
    }
});