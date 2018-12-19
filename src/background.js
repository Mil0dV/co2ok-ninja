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

// chrome.runtime.onMessageExternal.addListener(
//     function(request, sender, sendResponse) {
//         if (request) {
//             if (request.message) {
//                 if (request.message == "version") {
//                     sendResponse({version: 1.0});
//                 }
//             }
//         }
//         return true;
//     });

chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
    alert("message received");
});
