var message = {"command":"CLOSE_TIME","params":{"url": location.href}};
var extensionURL = browser.extension.getURL('');
var extensionId = extensionURL.split("://")[1].split('/')[0];

window.onbeforeunload = function (e) {
  try{
    browser.runtime.sendMessage(message).then((data)=>{
      return;
    },(e)=>{
      return;
    })
  }catch(e){
    console.log(e);
    return;
  }
};

window.addEventListener('blur',function(){
  try{
      browser.runtime.sendMessage(message).then((data)=>{},(e)=>{})
  }catch(e){
    console.log(e);
  }
},false);

// window.onbeforeunload = function (e) {
//   try{
//     browser.runtime.sendMessage(message).then((data)=>{
//       return 'A'
//     },(e)=>{
//       return 'B'
//     })
//   }catch(e){
//     console.log(e);
//   }
//
// };


// var hidden, visibilityChange;  
// if (typeof document.hidden !== "undefined") {  
//   hidden = "hidden"; 
//   visibilityChange = "visibilitychange"; 
// } else if (typeof document.msHidden !== "undefined") { 
//   hidden = "msHidden"; 
//   visibilityChange = "msvisibilitychange"; 
// } else if (typeof document.webkitHidden !== "undefined") { 
//   hidden = "webkitHidden"; 
//   visibilityChange = "webkitvisibilitychange"; 
// } 
//
// // 判断浏览器的支持情况 
// if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") { 
//   consol.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API."); 
// } else { 
//   document.addEventListener(visibilityChange,()=>{
//     if (document[hidden]) { 
//       try{
//         browser.runtime.sendMessage(message).then((data)=>{},(e)=>{})
//       }catch(e){
//         console.log(e);
//       }
//
//     } else { 
//
//     } 
//   }, false); 
// }
