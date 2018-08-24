const url = require('url');
import dataAPI from './dataAPI.js';



browser.tabs.onActivated.addListener(function(activeInfo){
  console.log("browser.tabs.onActivated");
  var windowId = activeInfo.windowId;
  var tabId= activeInfo.tabId;
  browser.tabs.query({windowId: windowId,active:true}).then(function(tabInfo){
    if(tabInfo&&tabInfo.length>0){
      var urlString = tabInfo[0].url;
      console.log(urlString);
      if (urlString) {
        dataAPI.updateTimeOnGivenWindowUrl(windowId,urlString);
      }
      console.log(dataAPI.staticDataByHost());
    }

  })


});
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tabInfo) {
    console.log("browser.tabs.onUpdated");
  var windowId = tabInfo.windowId;
  var urlString = changeInfo.url;
  if (urlString) {
    dataAPI.updateTimeOnGivenWindowUrl(windowId,urlString);
  }
  console.log(dataAPI.staticDataByHost());
});
browser.windows.onFocusChanged.addListener(function(windowId){
  console.log("browser.windows.onFocusChanged");
  browser.tabs.query({windowId: windowId,active:true}).then(function(tabInfo){
    if(tabInfo&&tabInfo.length>0){
      var urlString = tabInfo[0].url;
      if (urlString) {
        dataAPI.updateTimeOnGivenWindowUrl(windowId,urlString);
      }
      console.log(dataAPI.staticDataByHost());
    }

  })

});
browser.windows.onRemoved.addListener(function(windowId){
  // console.log(windowId+"browser.windows.onRemoved");

})


browser.runtime.onStartup.addListener(function () {
  console.log("extension started: " + Date.now());

});



browser.runtime.onMessage.addListener(function(request, sender){
  // console.log(request);
  // console.log(sender);
  if(request.command === 'CLOSE_TIME') {
    var params = request.params;
    var urlString = params.url;
    var windowId = sender.tab.windowId;
    if(windowId && urlString){
      dataAPI.closeTimeOnGivenWindowUrl(windowId,urlString);
      dataAPI.saveMemoryData(function(error,result){
          return Promise.resolve("Dummy response to keep the console quiet");
      });

    }
  }else if(request.command === 'QUERY_CURRENT') {
    return Promise.resolve(dataAPI.staticDataByHost());
  }


});

var extensionURL = browser.extension.getURL('')+"index.html";
// var title = 'browserTime';
browser.browserAction.onClicked.addListener(function(tab) {
  browser.tabs.query({ url: extensionURL, currentWindow: true }).then(function(tabs){
    console.log(tabs);
    if(tabs&&tabs.length>0){
      chrome.tabs.update(tabs[0].id,{active: true})
    } else {
      chrome.tabs.create({
        url: extensionURL
      })
    }

  });
});

browser.runtime.onStartup.addListener(function () {
  console.log("extension started: " + Date.now());
  dataAPI.loadMemoryData();
});

browser.runtime.onInstalled.addListener(function () {
  console.log("extension installed: " + Date.now());
  browser.tabs.query({ url: extensionURL, currentWindow: true }).then(function(tabs){
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

  });
});


browser.runtime.onSuspend.addListener(function () {
  console.log("Suspending event page");


});
browser.idle.onStateChanged.addListener(function () {
  console.log("idle.onStateChanged");
  // handle cleanup


})
browser.runtime.onUpdateAvailable.addListener(function () {
  console.log("runtime.onUpdateAvailable");


});
