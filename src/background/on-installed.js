import { getPartnersList } from '../helpers/get-partners-list.js';

export function onInstalled() {
    chrome.runtime.onInstalled.addListener(function(details){
        //add alarms - these are used sort of like cron jobs here
        chrome.alarms.create('clearClosedWebsites', {periodInMinutes: 10080}); //every 24h redisplay topbar on the websites that users closed it
        chrome.alarms.create('clearDisabledWebsites', {periodInMinutes: 1440}); //every 24h redisplay topbar on websites that user visited through other affiliate's link
        chrome.alarms.create('getPartnersList', {periodInMinutes: 60}); // (nu elk uur dus) every 24h update partners list from api

        //get list of partner shops from api
        getPartnersList();

        //open welcome page for new installs
        if(details.reason == "install"){
            chrome.tabs.create({url: "https://co2ok.ninja/welcome/"});
        }
    });
}