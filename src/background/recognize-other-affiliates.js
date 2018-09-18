import { extractDomain } from '../helpers/extract-domain.js';

/**
* If user vists website through some other affiliates' link, prevent showing topbar by adding it to disabledWebsites list                                                                                                                                                                           link, we add the website to the locally stored list, so content.js does not show the top bar at this website.
*/
export function recognizeOtherAffiliates() {
    var affiliateRedirectDetected = false; 
    var CO2okRedirectDetected = false;
    var redirectTabId;


    chrome.webRequest.onBeforeRedirect.addListener(function(details){
        var urlDomain       = extractDomain(details.url);
        var redirectDomain  = extractDomain(details.redirectUrl);
        var currentTab      = details.tabId;

        if(isAffiliateRedirectLink(urlDomain) || isAffiliateRedirectLink(redirectDomain)){
            affiliateRedirectDetected = true;
            if(isCO2okLink(details.url) || isCO2okLink(details.redirectUrl)){
                CO2okRedirectDetected = true;
            }
            else {
                redirectTabId = currentTab;
            }
        }
    }, {urls: ['<all_urls>'], types: ["main_frame"]});

    chrome.webRequest.onCompleted.addListener(function(details){
        var currentTab = details.tabId;

        if(affiliateRedirectDetected && !CO2okRedirectDetected){
            if(redirectTabId == currentTab){
                disableAffiliate(extractDomain(details.url));
                
                //reset triggers
                affiliateRedirectDetected = false;
                CO2okRedirectDetected = false;
                redirectTabId = 0;
            }
        } 
        else if(affiliateRedirectDetected && CO2okRedirectDetected){
            //reset triggers
            affiliateRedirectDetected = false;
            CO2okRedirectDetected = false;
        }
    }, {urls: ['<all_urls>'], types: ["main_frame"]});
}

/**
* Add given domain to the list of websites that are monetized by other affiliates, so the top bar is not being shown on them.
*
* @param {string} domain Domain of the website that is already monetized by other affiliate.
*/
function disableAffiliate(domain) {
    var updatedDisabledWebsites = [];
    chrome.storage.local.get({disabledWebsites: []}, function(items) {
        updatedDisabledWebsites = items.disabledWebsites;
        if(items.disabledWebsites.indexOf(domain) == -1){
            updatedDisabledWebsites.push(domain);
            chrome.storage.local.set({'disabledWebsites': updatedDisabledWebsites});
        }
    });
}

/**
* Check if given URL is CO2ok's affiliate link by comparing it against our stamps
*
* @returns {boolean}
*/
function isCO2okLink(url){
    var CO2okStamps = ['id=XK9XruzkyUo', '8106588'];
    if(new RegExp(CO2okStamps.join("|")).test(url)) {
        return true;
    }
    else {
        return false;
    }
}

/**
* Check if given URL is affiliate redirect link by compating it against list of domains of affiliate networks
*
* @returns {boolean}
*/
function isAffiliateRedirectLink(domain){
    var trackedDomains = ['anrdoezrs.net', 'commission-junction.com', 'dpbolvw.net', 'apmebf.com', 'jdoqocy.com', 'kqzyfj.com', 'qksrv.net', 'tkqlhce.com', 'ww.qksz.net', 
    'emjcd.com', 'afcyhf.com', 'awltovhc.com', 'ftjcfx.com', 'lduhtrp.net', 'tqlkg.com', 'awxibrm.com', 'cualbr.com', 'rnsfpw.net', 'vofzpwh.com', 'yceml.net',
    'linksynergy.com'];
    
    if(trackedDomains.indexOf(domain) == -1) {
        return false;
    }
    else {
        return true;
    }
}