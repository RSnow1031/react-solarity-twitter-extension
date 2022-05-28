var version = "2.0";
var uiSettings = {

};

var twitterApp = {
  onExtMessage: function(message, sender, sendResponse){ 
    twitterApp.message = message;
    switch (message.command) {
      case "getInfoByWalletAddress":
      twitterApp.getInfoByWalletAddress(message.data, sender, sendResponse)
      break;
      case "getAllTokenPrices":
      twitterApp.getAllTokenPrices(message.data, sender, sendResponse)
      break;
    }
    return true;
  },
  getAllTokenPrices:function(data, sender, sendResponse){
    var tokens=[{"type":'solana',"api":"https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"},{"type":"usdc","api":"https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd"}]

      var all_push_data_arr = [];
      var promise_all_urls_arr = [];
      for (var i = 0; i < tokens.length; i++) {
        var api = tokens[i]['api'];
        var type = tokens[i]['type'];
        promise_all_urls_arr.push(
          getProductReviewAsync(api,type).then((apiResponse) => {
            all_push_data_arr.push(apiResponse);
          }) 
          .catch(error => {
            console.error("error", error);
          })
          );
      }
      Promise
      .all(promise_all_urls_arr)
      .then(() => {
        console.log(all_push_data_arr)
        sendResponse(all_push_data_arr);
      }); 
    
  },
getInfoByWalletAddress:function(address,sender, sendResponse){
  $.ajax({
    method: "GET",
    url: 'https://solarity-server.herokuapp.com/api/users/'+address,
    success:function(response) {
      sendResponse({
        'success':true,
        "solanaAddress" : response.user.solanaAddress,
        "response" : response.user.rooms,
        "username" : response.user.username
      });
    },
    error:function(response) {
      sendResponse({
        'success':false,
        "response" : response.responseJSON.message
      });

    }
  });

}  

};

 function getProductReviewAsync(api,type) {
    return new Promise((resolve, reject) => {
      $.get( api, function( data ) {
        console.log(data)
        var rs={'type':type,'result':data}
        resolve(rs);
      });
    });
  }
chrome.runtime.onMessage.addListener(twitterApp.onExtMessage);
//twitterApp.load();

function sendMessage1(msg, callbackfn) {
  if(callbackfn!=null) {
    callback.push(callbackfn);
    msg.callback = "yes";
  }
  chrome.runtime.sendMessage(msg,callbackfn);
}

function sendMessage(tabId, msg){
  if(tabId) chrome.tabs.sendMessage(tabId, msg);
  else chrome.runtime.sendMessage(sender.id, msg);
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  sendMessage(tabId, {"command": "initTwitterBtns"});

}); 

