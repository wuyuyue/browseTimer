import React from 'react';
import ReactDOM from 'react-dom';

import Layout from '../../components/layout'
import Header,{HeaderBackButton} from '../../components/header'
import Content from '../../components/content'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appAction from '../appAction'
import { hashHistory } from 'react-router';
import moment from 'moment'
import css from './index.styl'
import Timeline from 'react-timelinejs';
import CommonHeader from '../common/header'

import { FormattedMessage,FormattedDate } from 'react-intl';

// import TimelineExample from '../common/timeline/TimelineExample.jsx'
//
// const data2 = () => {
//
//     // const today = moment('2018-07-14');
//
//     const arr = [];
//     for (let i = 0; i < 1; i++) {
//
//         // const start = today.clone().add(Math.round(Math.random() * 100) * (10 + Math.random() * 10), 'milliseconds').add(i * 20, 'milliseconds');
//         // const factor = Math.random() < 0.1 ? 1000 : 100;
//         // const end = start.clone().add(Math.round(Math.random() * factor + 10), 'milliseconds');
//         // const duration = end.toDate().getTime() - start.toDate().getTime();
//         arr.push({
//             start: new Date(+1533467264063),
//             end: new Date(+1533467266317),
//             label: `event ${i}`,
//             steps: [
//                 // {
//                 //     start: new Date(start.toDate().getTime() + duration / 10),
//                 //     end: new Date(start.toDate().getTime() + duration / 10 * 3),
//                 //     label: 'sub event 1',
//                 //     className: 'custom_1'
//                 // },
//                 // {
//                 //     start: new Date(start.toDate().getTime() + duration / 10 * 4),
//                 //     end: new Date(start.toDate().getTime() + duration / 10 * 5),
//                 //     label: 'sub event 2',
//                 //     className: 'custom_1'
//                 // },
//                 // {
//                 //     start: new Date(start.toDate().getTime() + duration / 10 * 5.5),
//                 //     end: new Date(start.toDate().getTime() + duration / 10 * 7.5),
//                 //     label: 'sub event 3',
//                 //     className: 'custom_1'
//                 // }
//             ]
//         })
//
//     }
//     return arr;
//
// };

// const data3 = (data) => {
//     const arr = [];
//     for (let i = 0; i < data.length; i++) {
//
//         const start = data[i].startTime;
//         const end = data[i].endTime;
//         arr.push({
//             start: new Date(+start),
//             end: new Date(+end),
//             label: data[i].label,
//             steps: data[i].data.map(function(d2,j){
//               return {
//                 start: new Date(+d2.startTime),
//                 end: new Date(+d2.endTime),
//                 label: "sub_"+j
//               }
//             })
//         })
//     }
//     return arr;
// };

const timeOption = {
  year:'numeric',
  month:'long',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12  : false,
  timeZoneName:'long',
  era: 'long',
  weekday     : 'long'
}

class DetailPage  extends React.Component {
  constructor(props) {
    super(props);
    var from = moment().subtract(1, 'days').startOf('day');
    var to = moment().endOf('day');
    this.state = {
        data: [],
        domain: [from.toDate(),to.toDate()],
    }
  }
  componentDidMount(){
    var location= this.props.location;
    var host = location.query.host;
    this.query(host);
    // this._startTimer();
    //
    // window.addEventListener('mousedown',()=>{this._stopTimer()},false)
    // window.addEventListener('mouseup',()=>{this._startTimer()},false)
  }
  // _startTimer(){
  //   var location= this.props.location;
  //   var host = location.query.host;
  //   this.timer=setInterval(this.query.bind(this,host),1000);
  // }
  // _stopTimer(){
  //   if(this.timer){
  //     clearInterval(this.timer);
  //     this.timer=null;
  //   }
  // }
  // componentWillUnmount(){
  //   this._stopTimer();
  // }
  query(host, from, to){
    var self = this;
    if (browser &&  browser.runtime) { 
      browser.runtime.sendMessage({command:"QUERY_HOST",params:{host: host}}).then((json)=>{
        console.log(json);
        var data = json.data;
        var result = data;
        // var from = this.state.domain[0].getTime();
        // var to = this.state.domain[1].getTime();
        if(result.length>0){
          var minTime = result[0].startTime;
          var maxTime =  result[0].endTime;
          result.forEach(function(item){
           if(item.startTime<minTime){
             minTime = item.startTime;
           }
           if(item.endTime>maxTime){
             maxTime = item.endTime
           }
         });
          self.setState({host: host, data: result,from: json.from, to: json.to,   domain: [new Date(minTime),new Date(maxTime)]});
        }

      },(e)=>{
        self.props.appAction.toast(e,2000);
      });
    }
  }
  // queryAll(host, from, to){
  //   var self = this;
  //   if (browser &&  browser.runtime) { 
  //     browser.runtime.sendMessage({command:"QUERY_ALL_HOSTS",params:{}}).then((json)=>{
  //       console.log(json);
  //       var data=[];
  //       var result = json.data;
  //       var hosts=Object.keys(result);
  //       var from = this.state.domain[0].getTime();
  //       var to = this.state.domain[1].getTime();
  //       hosts.forEach(function(host,i){
  //         var obj = {
  //             label: host
  //         };
  //         var begin = result[host][0].startTime;
  //         var end =  result[host][0].endTime;
  //         result[host].forEach(function(item){
  //           if(item.startTime<begin){
  //             begin = item.startTime;
  //           }
  //           if(item.endTime>end){
  //             end = item.endTime
  //           }
  //         });
  //         if(begin<from){
  //           from=begin
  //         }
  //         if(end>to){
  //           to =end;
  //         }
  //         obj.startTime=begin;
  //         obj.endTime=end;
  //         obj.data=result[host];
  //         if(obj.endTime>obj.startTime){
  //           data.push(obj)
  //         }
  //
  //       })
  //       console.log(new Date(from),new Date(to));
  //       self.setState({host: host, data: data,from: json.from, to: json.to, domain: [new Date(from),new Date(to)]});
  //     },(e)=>{
  //       self.props.appAction.toast(e,2000);
  //     });
  //   }
  // }
  handleBrush(domain){
    console.log(domain);
     this.setState({domain})
  }
  render() {
    var self = this;
    const {intl} = this.props;
    var data=this.state.data.map(function(d,i){
      var startTime = new Date(d.startTime);
      var endTime =  new Date(d.endTime);
      return {
          start: startTime,
          end: endTime,
          label: intl.formatMessage({id: 'detail.body.slice'})+i,
          steps: [
                // {
                //    start: startTime,
                //    end: endTime,
                //    label: 'slice'+i,
                // }
          ]
      }
    })
    // var data=this.state.data.map(function(d,i){
    //   var startTime = new Date(+d.startTime);
    //   var endTime =  new Date(+d.endTime);
    //   return {
    //       start: startTime,
    //       end: endTime,
    //       label: "event"+d.label,
    //       steps: []
    //   }
    // })
    // var d = data2();
    // var data = data3(this.state.data);
    // console.log(d,"d2");
    // console.log(data,"d3");
    var key = JSON.stringify(data) + '_' + self.props.app.appWidth + '_' + self.props.app.appHeight;


    return (
      <Layout className='detail' bgColor='white'>

        <CommonHeader intl={intl} location={this.props.location} appAction={this.props.appAction} appLanguage={this.props.app.appLanguage}/>

        <Content style={{width:self.props.app.appWidth,height:self.props.app.appHeight-44}}>

            <div style={{ lineHeight:'44px',textAlign:'center', height: 44}}>
              <HeaderBackButton onBack={()=>{hashHistory.goBack()}}/>
              <h3>
                {this.state.host}
                &nbsp;
                <FormattedMessage
                  id='detail.header.title'
                  description='detail.header.title'
                  defaultMessage='all visited time-slices'
                  />
              </h3>
            </div>

            <div style={{position:'relative',width:self.props.app.appWidth*1,height:self.props.app.appHeight-44-44,overflow: 'hidden'}}>
              {
                  // <TimelineExample/>
              }

                <Timeline key={key+'1'} data={data} id={'t1'}
                   ref="main"
                   width={self.props.app.appWidth*1}
                   height={(self.props.app.appHeight-44-44-40)}
                   range={this.state.domain}
                   tooltips={true}
                   tooltipContent={(val)=>{
                     return val.label + ":\n\r"+ intl.formatDate(val.start,timeOption) + ' -- ' +  intl.formatDate(val.end,timeOption)
                   }}
                   label={true}
                   />
                 <Timeline key={key+'2'} data={data} id={'t2'}
                   width={self.props.app.appWidth*1}
                   height={80}
                   trackHeight={6}
                   label={true}
                   tooltips={false}
                   brush={true}
                   onBrush={this.handleBrush.bind(this)}/>

            </div>
        </Content>
      </Layout>
    );
  }
}
import {injectIntl} from 'react-intl';

export default connect(state => ({app: state.app}), dispatch => ({
  appAction: bindActionCreators(appAction, dispatch)
}))(injectIntl(DetailPage))
