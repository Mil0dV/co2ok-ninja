
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
document.getElementById('add_top_bar').addEventListener('click',
    save_options);


    function CO2okTopBarButton()
    {

      const DOMAIN = extractDomain(location.href);
      let co2logo = chrome.extension.getURL('assets/img/logo.svg');
      let co2logowhite = chrome.extension.getURL('assets/img/logo_wit.svg');
      let url;

      if(DOMAIN.indexOf('ebay') !== -1) {

        url = 'confirm.php';

      }
      else {

          url = 'redirect.php';
      }

      let confirmButt = `


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

          </div>

      `;

      return confirmButt;

      // let innerHTML = template({
      //     ASSETS_PATHS: ASSETS_PATHS,
      //     content: confirmButt,
      // });

    }

    let ninjaBtn = document.getElementById('ninja-btn');
    ninjaBtn.innerHTML = CO2okTopBarButton();
