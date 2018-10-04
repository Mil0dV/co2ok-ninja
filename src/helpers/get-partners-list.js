/**
 * Get the list of partner stores' domain and save it locally
 */
export function getPartnersList(){
    var xhr = new XMLHttpRequest();
<<<<<<< HEAD
    xhr.open("GET", "https://co2ok.ninja/api/partners");
=======
    xhr.open("GET", "https://co2ok.ninja/dojo/partners");
>>>>>>> 5e5482ddb1ea072353d7b5b5e974ab77e2585120
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4){
            if(xhr.responseText){
                var partners = JSON.parse(xhr.responseText);
                chrome.storage.local.remove(['partners']);
                chrome.storage.local.set({'partners': partners});
            }
        }
    }
    xhr.send();
}