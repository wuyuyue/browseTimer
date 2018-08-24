const url = require('url');
import dataAPI from './dataAPI2.js';



browser.tabs.onActivated && browser.tabs.onActivated.addListener(function(activeInfo){
  console.log("browser.tabs.onActivated");
  var windowId = activeInfo.windowId;
  var tabId= activeInfo.tabId;

  var querySuccess = function(tabInfo){
    if(tabInfo&&tabInfo.length>0){
      var urlString = tabInfo[0].url;
      console.log(urlString);
      if (urlString) {
        dataAPI.updateTimeOnCurrentRoundUrl(urlString);
      }
      // console.log(dataAPI.staticDataByHost());
    }
  }
  if(process.env.VENDOR === 'edge'){
    browser.tabs.query({windowId: windowId,active:true},querySuccess);
  } else{
    browser.tabs.query({windowId: windowId,active:true}).then(querySuccess,(error)=>{console.log(`Error: ${error}`);});
  }


});
browser.tabs.onUpdated && browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tabInfo) {
    console.log("browser.tabs.onUpdated");
  var windowId = tabInfo.windowId;
  var urlString = changeInfo.url;
  if (urlString) {
    dataAPI.updateTimeOnCurrentRoundUrl(urlString);
  }
  // console.log(dataAPI.staticDataByHost());
});
browser.windows.onFocusChanged && browser.windows.onFocusChanged.addListener(function(windowId){
  console.log("browser.windows.onFocusChanged");
  var querySuccess = function(tabInfo){
    if(tabInfo&&tabInfo.length>0){
      var urlString = tabInfo[0].url;
      if (urlString) {
        dataAPI.updateTimeOnCurrentRoundUrl(urlString);
      }
      // console.log(dataAPI.staticDataByHost());
    }
  }
  if(process.env.VENDOR === 'edge'){
    browser.tabs.query({windowId: windowId,active:true},querySuccess);
  } else{
    browser.tabs.query({windowId: windowId,active:true}).then(querySuccess,(error)=>{console.log(`Error: ${error}`);});
  }

});
browser.windows.onRemoved && browser.windows.onRemoved.addListener(function(windowId){
  // console.log(windowId+"browser.windows.onRemoved");

})


browser.runtime.onStartup && browser.runtime.onStartup.addListener(function () {
  console.log("extension started: " + Date.now());

});



browser.runtime.onMessage.addListener(function(request, sender){
  console.log("onMessage");
  // console.log(sender);

  if(request.command === 'CLOSE_TIME') {
    var params = request.params;
    var urlString = params.url;
    var windowId = sender.tab.windowId;
    if(windowId &&  urlString){
        dataAPI.closeTimeOnCurrentRoundUrl(urlString);
        dataAPI.saveMemoryData(function(error,result){
            return Promise.resolve(result);
        });
    }
  }else if(request.command === 'QUERY_CURRENT') {
    var params = request.params;
    var from = params.from;
    var to = params.to;
    return Promise.resolve(dataAPI.staticDataByHost(true,from,to));
  }else if(request.command === 'QUERY_HOST') {
    var params = request.params;
    var host = params.host;
    return Promise.resolve(dataAPI.fetchDataByHost(host));
  }else if(request.command === 'QUERY_ALL_HOSTS') {
    var params = request.params;
    return Promise.resolve(dataAPI.fetchAllDataByHosts());
  }





});

var extensionURL = browser.extension.getURL('')+"index.html";
// var title = 'Where does the time go?';
browser.browserAction.onClicked && browser.browserAction.onClicked.addListener(function(tab) {
  var querySuccess = function(tabs){
    console.log(tabs);
    if(tabs&&tabs.length>0){
      chrome.tabs.update(tabs[0].id,{active: true})
    } else {
      chrome.tabs.create({
        url: extensionURL
      })
    }
  }
  if(process.env.VENDOR === 'edge'){
    browser.tabs.query({ url: extensionURL, currentWindow: true },querySuccess);
  } else{
    browser.tabs.query({ url: extensionURL, currentWindow: true }).then(querySuccess,(error)=>{console.log(`Error: ${error}`);});
  }
});

browser.runtime.onStartup && browser.runtime.onStartup.addListener(function () {
  console.log("extension started: " + Date.now());
  dataAPI.setCurrentRoundTime(new Date().getTime());
  dataAPI.loadMemoryData();
});

browser.runtime.onInstalled && browser.runtime.onInstalled.addListener(function () {
  console.log("extension installed: " + Date.now());
  dataAPI.loadMemoryData(function(err, result){
    console.log(err,"loadMemoryData");
    console.log(result,"loadMemoryData");
    var querySuccess = function(tabs){
      console.log(tabs);
      if(tabs&&tabs.length>0){
        browser.tabs.update(tabs[0].id,{active: true}).then(function(tab){
            // browser.tabs.sendMessage(tab.id,{'command':'FETCH_DATA_FROM_INDEXDB'}).then(()=>{},()=>{});
        })
      } else {
        browser.tabs.create({
          url: extensionURL
        }).then(function(tab){
          // browser.tabs.sendMessage(tab.id,{'command':'FETCH_DATA_FROM_INDEXDB'}).then(()=>{},()=>{});
        })
      }
    }
    if(process.env.VENDOR === 'edge'){
      browser.tabs.query({ url: extensionURL, currentWindow: true },querySuccess);
    } else{
      browser.tabs.query({ url: extensionURL, currentWindow: true }).then(querySuccess,(error)=>{console.log(`Error: ${error}`);});
    }

  });

});


browser.runtime.onSuspend && browser.runtime.onSuspend.addListener(function () {
  console.log("Suspending event page");


});
browser.runtime.onStateChanged && browser.idle.onStateChanged.addListener(function () {
  console.log("idle.onStateChanged");
  // handle cleanup


})
browser.runtime.onUpdateAvailable && browser.runtime.onUpdateAvailable.addListener(function () {
  console.log("runtime.onUpdateAvailable");


});
