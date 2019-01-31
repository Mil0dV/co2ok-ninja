
function extractDomain(url) {
    var domain;
    url = url.toString();
    url = url.toLowerCase();

    //find & remove protocol
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    //remove www.
    domain = domain.replace(/^www\./, "");


    //find & remove subdomains
    var parts = domain.split('.');
    if(parts.length > 2){
        //co.* and com.* exceptions (eg. example.com.au)
        if(domain.indexOf('.co.') !== -1 || domain.indexOf('.com.') !== -1){
            domain = parts.slice(-3).join('.');
        }
        else {
            domain = parts.slice(-2).join('.');
        }
    }

    return domain;
}


function replace_i18n(obj, tag) {
  var msg = tag.replace(/__MSG_(\w+)__/g, function(match, v1) {
      return v1 ? chrome.i18n.getMessage(v1) : '';
  });

  if(msg != tag) {
    obj.innerHTML = msg;
    //arabic should be displayed from the right to the left
    if(chrome.i18n.getUILanguage() == 'ar') {
      obj.dir = 'rtl';
      //fix sliders position
      var sliders = document.getElementsByClassName('col-25');
      for(var i = 0; i < sliders.length; i++) {
        sliders[i].style.textAlign = 'left';
      }
    }
  }
}

function localizeHtmlPage() {
  // Localize everything else by replacing all __MSG_***__ tags
  var page = document.getElementsByTagName('html');

  for (var j = 0; j < page.length; j++) {
      var obj = page[j];
      var tag = obj.innerHTML.toString();

      replace_i18n(obj, tag);
  }
}

function save_options() {
  var addSuggestionBox = document.getElementById('add_suggestion_box').checked;
  var addTopBar = document.getElementById('add_top_bar').checked;

  chrome.storage.sync.set({
    addSuggestionBox: addSuggestionBox,
    addTopBar: addTopBar
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options updated.';
    status.style.display = 'block';
    setTimeout(function() {
      status.style.display = 'none';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // chrome.storage.sync.get({
  //   addSuggestionBox: false,
  //   addTopBar: true
  // }, function(items) {
  //   document.getElementById('add_suggestion_box').checked = items.addSuggestionBox;
  //   document.getElementById('add_top_bar').checked = items.addTopBar;
  // });
}

localizeHtmlPage();

document.addEventListener('DOMContentLoaded', restore_options);
// document.getElementById('add_suggestion_box').addEventListener('click',
//     save_options);
// document.getElementById('add_top_bar').addEventListener('click',
//     save_options);


    function CO2okTopBarButton()
    {

      let co2logo = chrome.extension.getURL('assets/img/logo.svg');

      let confirmButt = `


          <div id=CO2okTopBarCTA>

            <a href='' target="_blank" class='confirmButt' style='text-decoration: none;' >

              <div class="shopText">${chrome.i18n.getMessage('topbarActivateButton')}</div>
              <img src='${co2logo}' alt=''>

            </a>

          </div>

      `;

      return confirmButt;
    }

    let ninjaBtn = document.getElementById('ninja-btn');
    ninjaBtn.innerHTML = CO2okTopBarButton();
    let confirmBtn = document.querySelector('#ninja-btn .confirmButt');

    function ninjaOption_btlUrl()
    {

      chrome.storage.sync.get("current_shopUrl",function(items){
        if (!chrome.runtime.error) {

            console.log(`geturl: ${items.current_shopUrl}`);
            const DOMAIN = extractDomain(items.current_shopUrl);
            let url;

            if(DOMAIN.indexOf('ebay') !== -1) {

              url = 'confirm.php';

            }
            else {

                url = 'redirect.php';
            }

            confirmBtn.setAttribute('href', `https://api.co2ok.ninja/dojo/${url}?url=${items.current_shopUrl}&lang=${chrome.i18n.getUILanguage()}`);
            console.log(confirmBtn.href);

         }
      })

    }
    ninjaOption_btlUrl();

    function optionNinja_btnHover()
    {

      let co2oklogo = document.querySelector('#ninja-btn img');
      let co2oklogo_src = chrome.extension.getURL('assets/img/logo.svg');
      let co2oklogo_srcwhite = chrome.extension.getURL('assets/img/logo_wit.svg');

       confirmBtn.addEventListener('mouseover', function(){
          co2oklogo.src = co2oklogo_srcwhite;
       })

       confirmBtn.addEventListener('mouseout', function(){
          co2oklogo.src = co2oklogo_src;
       })

    }
    optionNinja_btnHover();

   function gifCheckbox_status(){
      let gifStatusTxt = document.getElementById('gif-status');
      let gifCheckboxStatus = gifCheckbox.checked;
      return gifCheckboxStatus;
    }

    let gifCheckbox = document.getElementById('gif-checkbox');
    function turnGif_onOff(status)
    {

      let gifStatusTxt = document.getElementById('gif-status');
      let gifCheckboxStatus = gifCheckbox.checked;

      if(gifCheckboxStatus)
      {
        gifStatusTxt.innerHTML = 'GIF AAN';
      }else{
        gifStatusTxt.innerHTML = 'GIF UIT';
      }

      chrome.storage.sync.set({"gifCheckboxStatus":status},function(){
        if (chrome.runtime.error) {
           console.log("Runtime error.");
         }
         console.log(`set: ${gifCheckboxStatus}`);
      })

      chrome.storage.sync.get("gifCheckboxStatus",function(items){
        if (!chrome.runtime.error) {
             console.log(`get1: ${items.gifCheckboxStatus}`);
             // gifCheckbox.checked = items.gifCheckboxStatus;
             if(items.gifCheckboxStatus){
               gifCheckbox.setAttribute('checked','checked');
             }else{
               gifCheckbox.removeAttribute('checked');
             }
         }
      })

    }

    turnGif_onOff(gifCheckbox.checked);

    gifCheckbox.addEventListener('change', function(){

       let gifCheckboxStatus = gifCheckbox.checked;
       turnGif_onOff(gifCheckboxStatus);

    });
