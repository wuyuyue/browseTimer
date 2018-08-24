const url = require('url');
var extensionURL = browser.extension.getURL('');

var currentRoundsStartTime = new Date().getTime();
var roundsMap={

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
  getCurrentRoundTime(){
    return currentRoundsStartTime;
  },
  setCurrentRoundTime(roundTime){
    currentRoundsStartTime=roundTime;
  },
  saveMemoryData(cb){
    // browser.storage.local.get('memory').then((data)=>{
    //   browser.storage.local.set({'memory':{
    //     ...roundsMap,
    //     ...data.memory
    //   }}).then(()=>{cb(null,true)},(e)=>{cb(e,false)});
    //   // cb(null,true)
    // },(e)=>{
    //   cb(e,false)
    // });

    if(process.env.VENDOR === 'edge'){
      browser.storage.local.set({'memory':roundsMap},()=>{cb(null,true)});

    } else{
      browser.storage.local.set({'memory':roundsMap}).then(()=>{cb(null,true)},(e)=>{cb(e,false)});

    }

  },
  loadMemoryData(cb){
    var getSuccess = function(data){
      roundsMap={
        ...roundsMap,
        ...data.memory
      };
      cb(null,true)
    }
    if(process.env.VENDOR === 'edge'){
      browser.storage.local.get('memory',getSuccess);
    } else{
      browser.storage.local.get('memory').then(getSuccess,(e)=>{cb(e,false)});
    }

  },
  existGivenRoundTime(roundsTime){
    return roundsMap[roundsTime];
  },
  existGivenRoundTimeHost(roundsTime,host){
    return roundsMap[roundsTime][host];
  },
  // closeTimeOnGivenWindow(roundsTime){
  //   if(this.existGivenWindow(roundsTime)){
  //     Object.keys(roundsMap[roundsTime]).map(function(h){
  //       for(var i=0;i<roundsMap[roundsTime][h].length;i++){
  //         if(!roundsMap[roundsTime][h][i].endTime){
  //           roundsMap[roundsTime][h][i].endTime= new Date().getTime();
  //         }
  //       }
  //     })
  //   }
  // },
  closeTimeOnCurrentRoundUrl(urlString){
    var roundsTime=this.getCurrentRoundTime();
    var urlObject = url.parse(urlString);
    var host = urlObject.host;
    if(roundsMap[roundsTime]&&roundsMap[roundsTime][host]&&roundsMap[roundsTime][host].length-1>=0){
      if(!roundsMap[roundsTime][host][roundsMap[roundsTime][host].length-1].endTime){
        roundsMap[roundsTime][host][roundsMap[roundsTime][host].length-1].endTime= new Date().getTime();
      }
    }
  },
  updateTimeOnCurrentRoundUrl(urlString){
    var roundsTime=this.getCurrentRoundTime();
    if(!this.existGivenRoundTime(roundsTime)){
      roundsMap[roundsTime]={
      };
    }else{
      var urlObject = url.parse(urlString);
      var host = urlObject.host;
      if(!this.existGivenRoundTimeHost(roundsTime,host)){
        roundsMap[roundsTime][host]=[];
      }
      // Object.keys(roundsMap).map(function(w){
      //   Object.keys(roundsMap[w]).map(function(h){
      //     if(roundsMap[w][h].length-1>=0){
      //       if(!roundsMap[w][h][roundsMap[w][h].length-1].endTime){
      //         roundsMap[w][h][roundsMap[w][h].length-1].endTime= new Date().getTime();
      //       }
      //
      //     }
      //   })
      // })

      var hostKeys=Object.keys(roundsMap[roundsTime]);
      for(var j=0;j<hostKeys.length;j++){
        var h = hostKeys[j];
        var ss= roundsMap[roundsTime][h];
        if(ss.length-1>=0){
          if(ss[ss.length-1].endTime===undefined){
            ss[ss.length-1].endTime=new Date().getTime();
          }

        }
      }

      roundsMap[roundsTime][host].push({
        startTime: new Date().getTime()
      })
    }
  },
  fetchDataByHost(host){
    var result=[];
    Object.keys(roundsMap).forEach(function(w){
      Object.keys(roundsMap[w]).forEach(function(h){
        if(h==host){
          result=result.concat(roundsMap[w][h]);
        }
      })
    });
    return {
      data: result,
      host: host
    }
  },
  fetchAllDataByHosts(){
    var result={};
    Object.keys(roundsMap).forEach(function(w){
      Object.keys(roundsMap[w]).forEach(function(h){
        if(!result[h]){
          result[h]=[];
        }
        result[h]=result[h].concat(roundsMap[w][h]);
      })
    });
    return {
      data: result
    }
  },
  staticDataByHost(filter = true,from = null,to = null){

    if(from==null)from=this.getCurrentRoundTime();
    
      //console.log(from,"staticDataByHost");
      //console.log(roundsMap,"staticDataByHost");
    var result={};
    var hostMap={};
    Object.keys(roundsMap).forEach(function(w){
      // if(from!=null){
      //   if(w<from){
      //     break;
      //   }
      // }
      Object.keys(roundsMap[w]).forEach(function(h){
        if(!hostMap[h]){
          hostMap[h]=[];
        }
        hostMap[h]=hostMap[h].concat(roundsMap[w][h])
      })
    });
    //console.log(hostMap,"hostMap");
    Object.keys(hostMap).forEach(function(h){
      var timeSections = hostMap[h].filter(function(t){
          if(!t.endTime)return false;


          // filter by from
          if(from!=null){
            if(t.endTime<from){
              return false;
            }
          }

          return true;
      });

      // adjust by from
      //console.log(timeSections,"before adjust time",h);
      if(from!=null){
        timeSections=timeSections.map(function(t){
          // if(t.startTime<from && t.endTime>from){
          //   t.startTime=from;
          // }
          return {
            ...t,
            startTime: t.startTime<from && t.endTime>from? from: t.startTime
          };
        })
      }
      // adjust by to, fix for 2.0.0
      //console.log(timeSections,"before adjust time",h);
      if(to!=null){
        timeSections=timeSections.map(function(t){
          // if(t.startTime<from && t.endTime>from){
          //   t.startTime=from;
          // }
          return {
            ...t,
            endTime: t.endTime>to? to: t.endTime
          };
        })
      }
    //  console.log(timeSections,"after adjust time",h);
      result[h]=calculateTimeSpace(timeSections.sort(timeSectionCompare));
    })
    if(filter){
      var filterResult={
        ...result
      }
      Object.keys(filterResult).forEach(function(h){
        // if((h.indexOf('.')==-1 && extensionURL.indexOf(h)==-1) || !filterResult[h]>0 ){
        if( !(filterResult[h]>0) ){

          delete filterResult[h];
        }
      })
      return  {
        data: filterResult,
        from: from,
        to: to
      }

    }

    return {
      data: result,
      from: from,
      to: to
    };
  },


}

module.exports = dataAPI ;
