import { ASSETS_PATHS } from '../helpers/assets-paths.js';
import { extractDomain } from '../helpers/extract-domain.js';
// import { gifCheckbox_status } from '../pages/options.js';

const DOMAIN = extractDomain(location.href);
let toolBarDuration = 2500;
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

        <a href='https://api.co2ok.ninja/dojo/${url}?url=${location.href}&lang=${chrome.i18n.getUILanguage()}' class='confirmButt' style='text-decoration: none;'

          onmouseover="

            let logoSrc = document.querySelector('.confirmButt img'); logoSrc.src = '${co2logowhite}';

          "

          onmouseout="

            let logoSrc = document.querySelector('.confirmButt img'); logoSrc.src = '${co2logo}';

          "

        >

          <div class="shopText">${chrome.i18n.getMessage('topbarActivateButton')}</div>
          <img src='${co2logo}' alt=''>

        </a>

        <div class="topbarActivatedInfo">${chrome.i18n.getMessage('topbarActivateInfo')}</div>

      </div>

    </div>

    <img src=${chrome.extension.getURL('assets/img/cancel.png')} id=CO2okTopBarIcon>

  `;

  return confirmButt;

}


function getShopUrl()
{

  let current_shopUrl = location.href;
  chrome.storage.sync.set({"current_shopUrl":current_shopUrl},function(){
    if (chrome.runtime.error) {
       console.log("Runtime error.");
     }
     console.log(`set: ${current_shopUrl}`);
  })

}
getShopUrl();


function confirmButtClicked()
{

   let confirmButt = document.querySelector('.confirmButt');
   let count = 0;
   confirmButt.addEventListener('click', function(){

     count++;
     let locastorage = window.localStorage.setItem('count', count);
     window.localStorage.getItem('count');
     console.log(locastorage);

   })

}
//confirmButtClicked();


function gifStatus(){
  chrome.storage.sync.get("gifCheckboxStatus",function(items){
    if (!chrome.runtime.error) {
        let gifCheckboxStatus = items.gifCheckboxStatus

        console.log(`get: ${gifCheckboxStatus}`);
     }
  })
}
window.addEventListener('load', function(){gifStatus();})


function thanksBar()
{

//  let gifsArr = ["assets/img/happy-globe.mp4", "assets/img/happy-piggy-loop.mp4", "assets/img/happy-flower.mp4", 'assets/img/cat-high-five.mp4'];
  let gifsArr = ["assets/img/happy-globe.gif", "assets/img/happy-piggy.gif", "assets/img/happyflower.gif", 'assets/img/cat-high-five.gif'];
  let randSrc = Math.floor(Math.random() * gifsArr.length);
  let CO2okTopBarLogoLink = document.getElementById('CO2okTopBarLogoLink');
  let thanksBar = `

    <img src=${chrome.extension.getURL('assets/img/cancel.png')} id=CO2okTopBarIcon>
    <div class='thanksBar'>

     <div id="co2okgifsContainer"><img src='${chrome.extension.getURL(gifsArr[randSrc])}' alt='' id=co2okgifs></div>
     ${sharedIcons()}

    </div>

  `;

  return thanksBar;

}


function sharedIcons()
{

   let icons = `

     <div class="sharedMediaContainer">

        <div class="sharedText">${chrome.i18n.getMessage('shareMsg')}</div>

        <div class="sharedMedia">

          <a href="https://www.facebook.com/sharer?u=https%3A%2F%2Fco2ok.ninja%2F" target="_blank" class="facebook"><img src="${chrome.extension.getURL('assets/img/facebook.svg')}"><span>Share</span></a>
          <a href="https://twitter.com/intent/tweet?text=Install%20a%20browser%20extension%20and%20when%20you%20purchase%20stuff%20online%2C%20you%20help%20fight%20against%20climate%20change!%20Check%20out%3A%20http%3A%2F%2Fco2ok.ninja%2F" target="_blank" class="twitter"><img src="${chrome.extension.getURL('assets/img/twitter.svg')}"><span>Share</span></a>

        </div>

     </div>

   `;

   var date = new Date();
   var sec = date.getSeconds();



    if(sec % 4 == 0)
    // 4 chosen by fair dice roll; guaranteed to be random.
    {

       toolBarDuration = 5000;
       return icons;

    }else{

      return chrome.i18n.getMessage('topbarActivatedInfo');

    }

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

    let topbarActivated = activated;
    // let topbarclass = document.querySelector('#CO2okTopBar').id;
    // chrome.storage.sync.set({"topbarclass":topbarclass},function(){
    //   if (chrome.runtime.error) {
    //      console.log("Runtime error.");
    //    }
    //    console.log(`settopbar: ${topbarclass}`);
    // })
    //arabic should be displayed from the right to the left
    if (chrome.i18n.getUILanguage() == 'ar') {
        topbarElement.dir = 'rtl';
    }
    topbarElement.innerHTML = innerHTML;

    //moveWebsite('50px');

    document.documentElement.prepend(styleElement);
    document.documentElement.prepend(topbarElement);

    if(activated){

      let co2okgifs = document.getElementById('co2okgifs');
      let co2okgifsContainer = document.getElementById('co2okgifsContainer');

      chrome.storage.sync.get("gifCheckboxStatus",function(items){
        if (!chrome.runtime.error) {
            let gifCheckboxStatus = items.gifCheckboxStatus;
            console.log(`getter: ${gifCheckboxStatus}`);
            if(gifCheckboxStatus){

            }else{
              co2okgifs.style.display = 'none';

              let a = `<a  href='https://CO2ok.Ninja' class='logoLink'><img style="width: 200px; height: 170px;" src="${chrome.extension.getURL('assets/img/icon.png')}"></a>`;
              // let pInfo = `<p> ${chrome.i18n.getMessage('topbarActivatedInfo')} </p>`;
              co2okgifsContainer.innerHTML = a;

            }
         }
       })

        setInterval(function(){
            hideTopbar();
        }, toolBarDuration);
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

function hide_Top_Bar(){

   var co2okTopBar = document.getElementById('CO2okTopBar');
   var co2okTopBarActivated;

   if(co2okTopBar){
     co2okTopBarActivated = true;
     chrome.storage.sync.set({"co2okTopBarActivated":co2okTopBarActivated},function(){
       if (chrome.runtime.error) {
          console.log("Runtime error.");
        }
        console.log(`settopbar: ${co2okTopBarActivated}`);
     })
   }else{
     co2okTopBarActivated = false;
     chrome.storage.sync.set({"co2okTopBarActivated":co2okTopBarActivated},function(){
       if (chrome.runtime.error) {
          console.log("Runtime error.");
        }
        console.log(`settopbar: ${co2okTopBarActivated}`);
     })
   }
   // check of ninja topbar is active and hide de ninja option co2ok button

   co2okTopBar.style.display = 'none';

}
setInterval(hide_Top_Bar, 3000);


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
