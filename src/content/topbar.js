import { ASSETS_PATHS } from '../helpers/assets-paths.js';
import { extractDomain } from '../helpers/extract-domain.js';

const DOMAIN = extractDomain(location.href);

/**
 * Change topbar's inner HTML.
 */
function updateTopbar(activated) {
    let innerHTML = getInnerHTML(activated);
    let topbarElement = document.getElementById('CO2ok');
    topbarElement.innerHTML = innerHTML;
}

/**
 * Deactivate getting commission from current webpage.
 *
 * This is accomplished by sending request to background.js. Background.js deletes all cookies from the domain of current page and removes the domain from locally stored list of activated websites.
 *
 */
// eslint-disable-next-line no-unused-vars
function deactivateAffiliate() {
    chrome.runtime.sendMessage({domain: DOMAIN}, function(response) {
        if(response.status === true){
            updateTopbar(false);
        }
    });
}

/**
 * Set topbar's display property to none and save to storage.local the information that on this website the topbar should not be (temporarily) displayed.
 */
function hideTopbar(){
    let updatedClosedWebsites = [];

    document.getElementById("CO2okTopBar").style.display = 'none';
    //moveWebsite('-50px');

    chrome.storage.local.get({closedWebsites: []}, function(items) {
        if(items.closedWebsites.indexOf(DOMAIN) == -1){
            updatedClosedWebsites = items.closedWebsites;
            updatedClosedWebsites.push(DOMAIN);
            chrome.storage.local.set({'closedWebsites': updatedClosedWebsites});
        }
    });
}

/**
 * Add proper event listeners to topbar elements.
 *
 * @param {boolean} activated Topbar's activation status.
 */
function addListeners(activated){
    document.getElementById("CO2okTopBarIcon").addEventListener("click", function(){
        hideTopbar();
    });
}


function CO2okTopBarButton(url)
{

  let co2logo = chrome.extension.getURL('assets/img/logo.svg');
  let co2logowhite = chrome.extension.getURL('assets/img/logo_wit.svg');

  //   <a href='http://localhost/CO2ok/${url}?url=${location.href}&lang=${chrome.i18n.getUILanguage()}' class='confirmButt' style='text-decoration: none;'>
  let confirmButt = `

    <div class="logoButtCont">

      <a href=https://CO2ok.Ninja id="CO2okTopBarLogoLink">
          <img src="${chrome.extension.getURL('assets/img/icon.png')}" id=CO2okTopBarLogo>
      </a>

      <div id=CO2okTopBarCTA>

        <a href='http://co2ok.ninja/dojo/${url}?url=${location.href}&lang=${chrome.i18n.getUILanguage()}' class='confirmButt' style='text-decoration: none;'

          onmouseover="

            let logoSrc = document.querySelector('.confirmButt img'); logoSrc.src = '${co2logowhite}';

          "

          onmouseout="

            let logoSrc = document.querySelector('.confirmButt img'); logoSrc.src = '${co2logo}';

          "
        >

          <div class="shopText"><p>${chrome.i18n.getMessage('topbarActivateButton')}</p></div>
          <img src='${co2logo}' alt=''>

        </a>

        <p class="topbarActivatedInfo">${chrome.i18n.getMessage('topbarActivateInfo')}</p>

      </div>

    </div>

    <img src=${chrome.extension.getURL('assets/img/cancel.png')} id=CO2okTopBarIcon>

  `;

  return confirmButt;

}


function thanksBar()
{

//  let gifsArr = ["assets/img/happy-globe.mp4", "assets/img/happy-piggy-loop.mp4", "assets/img/happy-flower.mp4", 'assets/img/cat-high-five.mp4'];
  let gifsArr = ["assets/img/happy-globe.gif", "assets/img/happy-piggy.gif", "assets/img/happyflower.gif", 'assets/img/cat-high-five.gif'];
  let randSrc = Math.floor(Math.random() * gifsArr.length);
  let CO2okTopBarLogoLink = document.getElementById('CO2okTopBarLogoLink');
  let thanksBar = `

    <div class='thanksBar'>

    <img src='${chrome.extension.getURL(gifsArr[randSrc])}' alt=''>
    <!--  <video width='200' height='102' autoplay loop>
       <source src='${chrome.extension.getURL(gifsArr[randSrc])}' type='video/mp4'>
       <source src='${chrome.extension.getURL(gifsArr[randSrc])}' type='video/ogg'>
      </video>-->
      <p>You are now shopping climate neutral</p>

    </div>
    <img src=${chrome.extension.getURL('assets/img/cancel.png')} id=CO2okTopBarIcon>

  `;

  return thanksBar;

}


/**
 * Return topbar's content based on activation status.
 *
 * @param {boolean} activated Topbar's activation status.
 */

function getContent(activated){

     let content;

     if(activated){

         //content = chrome.i18n.getMessage('topbarActivatedInfo') + '<p id="CO2okSmallText">' + chrome.i18n.getMessage('topbarActivatedClose') + '</p>';
         content = thanksBar();
     }
     else if(DOMAIN.indexOf('ebay') !== -1) {
       //content = chrome.i18n.getMessage('topbarActivateInfo') + '<a href=http://localhost/CO2ok/confirm.php?url=' + location.href + '&lang=' + chrome.i18n.getUILanguage() + ' id=CO2okTopBarButton>' + chrome.i18n.getMessage('topbarActivateButton') + '</a>';
       content =  CO2okTopBarButton('confirm.php');

     }
     else {

         //content = chrome.i18n.getMessage('topbarActivateInfo') + chrome.i18n.getMessage('topbarActivateInfo') + '<a href=http://localhost/CO2ok/redirect.php?url=' + location.href + '&lang=' + chrome.i18n.getUILanguage() + ' id=CO2okTopBarButton>' + chrome.i18n.getMessage('topbarActivateButton') + '</a>';
         content =  CO2okTopBarButton('redirect.php');
     }

     return content;
 }
/**
 * Load html template and fill it with proper content.
 *
 * @param {boolean} activated Topbar's activation status.
 */
function getInnerHTML(activated) {
    let template = require('./topbar.html');
    let content = getContent(activated);
    let innerHTML = template({
        ASSETS_PATHS: ASSETS_PATHS,
        content: content,
    });

    return innerHTML;
}

/**
 * Load CSS style and HTML of topbar, create html elements, append them to the document and add listeners.
 *
 * @param {boolean} activated Topbar's activation status.
 */
function renderTopbar(activated) {
    let style = require('./topbar.css').toString();
    let styleElement = document.createElement('style');
    styleElement.innerHTML = style;

    let innerHTML = getInnerHTML(activated);

    let topbarElement = document.createElement('div');
    topbarElement.id = 'CO2ok';
    //arabic should be displayed from the right to the left
    if (chrome.i18n.getUILanguage() == 'ar') {
        topbarElement.dir = 'rtl';
    }
    topbarElement.innerHTML = innerHTML;

    //moveWebsite('50px');

    document.documentElement.prepend(styleElement);
    document.documentElement.prepend(topbarElement);

    if(activated){
        setInterval(function(){
            hideTopbar();
        }, 5000);
    }

    addListeners(activated);
}


/**
 * Check if raising money with current website has been already activated (and not longer than 7 days ago).
 *
 * @param {array} activatedAffiliates Array containing domains and timestamps of affiliates that has already been activated. Should be loaded from storage.local.
 */
function isAlreadyActivated(activatedAffiliates){
    //if activatedAffiliates has any values
    if(activatedAffiliates.length){
        //loop through all the values
        for(let i = 0; i < activatedAffiliates.length; i++){
            //if current page is in our list of already activated pages
            if(activatedAffiliates[i].domain == DOMAIN){
                //if page was activated not longer than 7 days ago
                let activationEndTimestamp = activatedAffiliates[i].timestamp + 1000*60*60*24*7;
                let currentTimestamp = Date.now();
                if(activationEndTimestamp > currentTimestamp ){
                    return true;
                }
            }
        }
    }
}

/**
 * Check if the user is on a checkout page of one of our biggest partners.
 */
function isCheckoutPage() {
    if(DOMAIN == 'booking.com' && location.href.indexOf('book.html') !== -1) {
        return true;
    }
    else if(DOMAIN == 'etsy.com' && location.href.indexOf('/cart/') !== -1) {
        return true;
    }
    else if(DOMAIN == 'aliexpress.com' && location.href.indexOf('/confirm_order.htm') !== -1) {
        return true;
    }
    else if(DOMAIN == 'barnesandnoble.com' && location.href.indexOf('/checkout/') !== -1) {
        return true;
    }
    else {
        return false;
    }
}

export default function () {
    chrome.storage.local.get({
            activatedAffiliates: [],
            closedWebsites: [],
            disabledWebsites: [],
            partners: []
        }, function(items) {

            //if current domain is one of our partners
            if(items.partners.indexOf(DOMAIN) != -1){

                //if current domain is not on disabled or closed websites list
                if(items.closedWebsites.indexOf(DOMAIN) == -1
                && items.disabledWebsites.indexOf(DOMAIN) == -1){
                    let activated = false;
                    if(isAlreadyActivated(items.activatedAffiliates)){
                        activated = true;
                    }

                    renderTopbar(activated);
                }

                //if user is on checkout page - show
                if(items.disabledWebsites.indexOf(DOMAIN) == -1
                && isCheckoutPage(location.href)){
                    let activated = false;
                    if(isAlreadyActivated(items.activatedAffiliates)){
                        activated = true;
                    }

                    renderTopbar(activated);
                }

            }

        });

}
