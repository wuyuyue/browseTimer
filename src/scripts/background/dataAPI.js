const url = require('url');

var currentRoundStartTime = new Date().getTime();
var windowsMap={

};
var timeSectionCompare = function (time1, time2) {
  if (time1.startTime < time2.startTime) {
      return -1;
  } else if (time1.startTime > time2.startTime) {
      return 1;
  } else {
      if (time1.endTime < time2.endTime) {
          return -1;
      } else if (time1.endTime > time2.endTime) {
          return 1;
      } else {
          return 0;
      }
  }
};
var calculateTimeSpace= function(timeSections){
  var result =0;
  if(timeSections.length>=1){
    result = timeSections[0].endTime- timeSections[0].startTime;
  }
  for(var i=1;i<timeSections.length;i++){
    var timeSection = timeSections[i];
    var preTimeSection = timeSections[i-1];

    if(timeSection.startTime>=preTimeSection.endTime){
      result += timeSection.endTime- timeSection.startTime
    }else{
      if(timeSection.endTime>preTimeSection.endTime){
        result += timeSection.endTime - preTimeSection.endTime;
      }
    }

  }
  return result;
}

var dataAPI = {
  saveMemoryData(cb){
    browser.storage.local.set({'memory':windowsMap}).then(()=>{cb(null,true)},(e)=>{cb(e,false)});
  },
  loadMemoryData(cb){
    browser.storage.local.get({'memory':windowsMap}).then((data)=>{
      windowsMap=data||{};
      cb(null,true)
    },(e)=>{
      cb(e,false)
    });
  },
  existGivenWindow(windowId){
    return windowsMap[windowId];
  },
  existGivenWindowHost(windowId,host){
    return windowsMap[windowId][host];
  },
  // closeTimeOnGivenWindow(windowId){
  //   if(this.existGivenWindow(windowId)){
  //     Object.keys(windowsMap[windowId]).map(function(h){
  //       for(var i=0;i<windowsMap[windowId][h].length;i++){
  //         if(!windowsMap[windowId][h][i].endTime){
  //           windowsMap[windowId][h][i].endTime= new Date().getTime();
  //         }
  //       }
  //     })
  //   }
  // },
  closeTimeOnGivenWindowUrl(windowId,urlString){
    var urlObject = url.parse(urlString);
    var host = urlObject.host;
    if(windowsMap[windowId]&&windowsMap[windowId][host]&&windowsMap[windowId][host].length-1>=0){
      if(!windowsMap[windowId][host][windowsMap[windowId][host].length-1].endTime){
        windowsMap[windowId][host][windowsMap[windowId][host].length-1].endTime= new Date().getTime();
      }
    }
  },
  updateTimeOnGivenWindowUrl(windowId,urlString){
    if(!this.existGivenWindow(windowId)){
      windowsMap[windowId]={
      };
    }else{
      var urlObject = url.parse(urlString);
      var host = urlObject.host;
      if(!this.existGivenWindowHost(windowId,host)){
        windowsMap[windowId][host]=[];
      }
      Object.keys(windowsMap).map(function(w){
        Object.keys(windowsMap[w]).map(function(h){
          if(windowsMap[w][h].length-1>=0){
            if(!windowsMap[w][h][windowsMap[w][h].length-1].endTime){
              windowsMap[w][h][windowsMap[w][h].length-1].endTime= new Date().getTime();
            }

          }
        })
      })
      windowsMap[windowId][host].push({
        startTime: new Date().getTime()
      })
    }
  },
  staticDataByHost(filter = true){
    var result={};
    var hostMap={};
    Object.keys(windowsMap).map(function(w){
      Object.keys(windowsMap[w]).map(function(h){
        if(!hostMap[h]){
          hostMap[h]=[];
        }
        hostMap[h]=hostMap[h].concat(windowsMap[w][h])
      })
    });
    Object.keys(hostMap).forEach(function(h){
      var timeSections = hostMap[h].filter(function(t){
          if(!t.endTime)return false;
          return true;
      });
      result[h]=calculateTimeSpace(timeSections.sort(timeSectionCompare));
    })
    if(filter){
      var filterResult={
        ...result
      }
      Object.keys(filterResult).forEach(function(h){
        if(h.indexOf('.')==-1 || !filterResult[h]>0){
          delete filterResult[h];
        }
      })
      return filterResult
    }

    return result;
  },


}

module.exports = dataAPI ;
