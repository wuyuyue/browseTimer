import moment from 'moment'
export function getValueWithGivenRegex(label,re=/\: (\d+)/g) {
  var result=re.exec(label)
  if(result)return parseInt(result[1]);
  return 0;
}
// export function getTimeDurationString(timeduration,timeUnits) {
//   // console.log(timeduration,typeof timeduration);
//   var result=timeduration;
//   var unitLabel='毫秒';
//   result=moment.duration(timeduration).asMilliseconds();
//   if(result>1000){
//     result=moment.duration(timeduration).asSeconds();
//     unitLabel='秒';
//     if(result>60){
//       result=moment.duration(timeduration).asMinutes();
//       unitLabel='分钟';
//       if(result>60){
//         result=moment.duration(timeduration).asHours();
//         unitLabel='小时';
//         if(result>24){
//           result=moment.duration(timeduration).asDays();
//           unitLabel='天';
//           if(result>31){
//             result=moment.duration(timeduration).asMonths();
//             unitLabel='月';
//             if(result>12){
//               result=moment.duration(timeduration).asYears();
//               unitLabel='年';
//             }
//           }
//         }
//       }
//     }
//   }
//   return result+unitLabel;
// }
export function getTimeDurationStringV2(timeduration,timeUnits) {
  var timeUnitsArray = timeUnits.split('/');
  // console.log(timeduration,typeof timeduration);
  var result="";
  var unitLabel=timeUnitsArray[6];
  var left = timeduration;
  var years=moment.duration(left).asYears();
  if(years>1){
    result+=Math.floor(years) + " "+ timeUnitsArray[0];
    left = moment.duration(left-Math.floor(years)*365*24*60*60*1000);

  }
  var months = moment.duration(left).asMonths();
  if(months>1){
    result+=Math.floor(months) + " "+ timeUnitsArray[1];
    left = moment.duration(left-Math.floor(months)*30*24*60*60*1000);

  }
  var days = moment.duration(left).asDays();
  if(days>1){
    result+=Math.floor(days) + " "+ timeUnitsArray[2];
    left = moment.duration(left-Math.floor(days)*24*60*60*1000);

  }
  var hours = moment.duration(left).asHours();
  if(hours>1){
    result+=Math.floor(hours) + " "+ timeUnitsArray[3];
    left = moment.duration(left-Math.floor(hours)*60*60*1000);

  }
  var minutes = moment.duration(left).asMinutes();
  if(minutes>1){
    result+=Math.floor(minutes) + " "+ timeUnitsArray[4];
    left = moment.duration(left-Math.floor(minutes)*60*1000);

  }
  var seconds = moment.duration(left).asSeconds();

  result+=seconds.toFixed(2) + " "+ timeUnitsArray[5];

  return result;
}
