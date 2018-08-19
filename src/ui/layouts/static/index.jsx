import React from 'react';
import Layout from '../../components/layout'
import Header from '../../components/header'
import Content from '../../components/content'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appAction from '../appAction'
import * as staticAction from './action'

import { hashHistory } from 'react-router';
import css from './index.styl'

import { HorizontalBar} from 'react-chartjs-2';

import moment from 'moment'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import {getTimeDurationStringV2,getValueWithGivenRegex} from '../../utils/time.js'
import { FormattedMessage } from 'react-intl';
import CommonHeader from '../common/header'


const barThickness = 30;
const scales = {
    xAxes: [{
        ticks: {
            min: 0
        }
    }]
}

class Static extends React.Component {
  constructor(props) {
    super(props);
    var weekOfday = moment().format('E');//计算今天是这周第几天
    var from = moment().subtract(weekOfday-1, 'days').startOf('day');//周一日期
    var to = moment().subtract(weekOfday-7, 'days').endOf('day');//周日日期
    this.state={
      data: [],
      from: from,
      to: to
    }
  }
  componentDidMount(){

    // var weekOfday = moment().format('E');//计算今天是这周第几天
    // var last_monday = moment().subtract(weekOfday-1, 'days').format('YYYY-MM-DD');//周一日期
    // var last_sunday = moment().subtract(weekOfday-7, 'days').format('YYYY-MM-DD');//周日日期
    // var begin = document.querySelector('#beginDate');
    // var clickHandler = function(){
    //   begin.innerHTML="<input type='text'  value='"+begin.innerText+"'/>";
    //   begin.removeEventListener('click',this);
    //   var beginInput = begin.querySelector('input');
    //   beginInput.datepicker({
    //     language: "zh-CN",
    //     autoclose: true,
    //     clearBtn: true,
    //     todayBtn: true,
    //     format: "yyyy-mm-dd"
    //   });
    //   beginInput.addEventListener('blur',function(){
    //     beginInput.removeEventListener('blur',this);
    //     begin.innerHTML=beginInput.value;
    //     begin.addEventListener('click',clickHandler,false)
    //   },false);
    //
    // }
    // begin.addEventListener('click',clickHandler,false)
    //
    // document.querySelector("#beginDate").value=last_monday;
    // document.querySelector("#endDate").value=last_sunday;


    this.query();
    // this.query(from, to);
    // this.timer=setInterval(this.query.bind(this),1000);
  }
  componentWillUnmount(){
    // if(this.timer){
    //   clearInterval(this.timer);
    //   this.timer=null;
    // }

  }
  query(){
    var self = this;

    var from = this.state.from.valueOf();
    var to = this.state.to.valueOf();
    if (browser &&  browser.runtime) { 
      browser.runtime.sendMessage({command:"QUERY_CURRENT",params:{from: from, to: to}}).then((json)=>{
        console.log(json);
        var data = json.data;
        var result = [];
        Object.keys(data).map(function(url){
          result.push( {x: url, y:data[url]});
        });
        result=result.sort(function (d1,d2) {
          if (d1.y < d2.y) {
              return 1;
          } else if (d1.y > d2.y) {
              return -1;
          } else {
              return 0;
          }
        })
        self.setState({data: result,from: moment(json.from), to: moment(json.to)});
      },(e)=>{
        self.props.appAction.toast(e,2000);
      });
    }
  }

  render() {
    var self = this;
    const {intl} = this.props;
    let chartLabel = intl.formatMessage({id: 'static.body.chart.label'});
    let timeUnits = intl.formatMessage({id: 'app.time.units'});


    var result = self.state.data;
    console.log(result);
    const data = {
      labels: result.map(function(d){return d.x}),
      datasets: [
        {
          label: chartLabel,
          // backgroundColor: 'rgba(255,99,132,0.2)',
          // borderColor: 'rgba(255,99,132,1)',
          // borderWidth: 1,
          hoverBackgroundColor: 'black',
          // hoverBorderColor: 'rgba(255,99,132,1)',
          data: result.map(function(d){return d.y})
        }
      ]
    };
    var dynamicChartHeight = (self.props.app.appHeight-44-44)*1;
    var dynamicScales = {
      ...scales
    }
    if(result.length>Math.ceil(dynamicChartHeight/barThickness)){
      dynamicChartHeight = barThickness * result.length;
      dynamicScales = {
        ...scales,
        yAxes: [{
           barThickness: barThickness-2
        }],

      }
    }
    return (
      <Layout className='home' bgColor='white'>
        <CommonHeader intl={intl} location={this.props.location} appAction={this.props.appAction} appLanguage={this.props.app.appLanguage}/>
        <Content style={{width:self.props.app.appWidth,height:self.props.app.appHeight-44}}>

            <h3 style={{ lineHeight:'44px', textAlign:'center' }}>
              <div style={{display:'inline-block'}}>
                <FormattedMessage
                  id='static.header.title'
                  description='static.header.title'
                  defaultMessage='static time-range'
                />
              </div>
              <div style={{display:'inline-block'}}>
                <DatePicker
                  dateFormat="YYYY-MM-DD HH:mm:ss"
                  selected={self.state.from}

                  onChange={(val)=>{self.setState({from:val.startOf('day')},function(){self.query()})}} />
              </div>
              <div style={{display:'inline-block'}}>  --  </div>
              <div style={{display:'inline-block'}}>
                <DatePicker
                  dateFormat="YYYY-MM-DD HH:mm:ss"
                  selected={self.state.to}

                  onChange={(val)=>{self.setState({to:val.endOf('day')},function(){self.query()})}} />
              </div>
            </h3>

            <div>
              <HorizontalBar
              key={self.props.app.appWidth+"_"+dynamicChartHeight}
              data={data}
              width={self.props.app.appWidth*1}
              height={dynamicChartHeight}
              options={{
                tooltips: {
                //     // Disable the on-canvas tooltip
                   enabled: false,
                   custom: function(tooltipModel) {
                     console.log(tooltipModel);
                     // if(tooltipModel.body){
                     //   tooltipModel.body[0].lines[0]=getTimeDurationStringV2(tooltipModel.dataPoints[0].xLabel);
                     // }
                     // Tooltip Element
                      var tooltipEl = document.getElementById('chartjs-tooltip');

                      // Create element on first render
                      if (!tooltipEl) {
                          tooltipEl = document.createElement('div');
                          tooltipEl.id = 'chartjs-tooltip';
                          tooltipEl.innerHTML = "<table></table>";
                          document.querySelector('.layout').appendChild(tooltipEl);
                      }

                      // Hide if no tooltip
                      if (tooltipModel.opacity === 0) {
                          tooltipEl.style.opacity = 0;
                          return;
                      }

                      // Set caret Position
                      tooltipEl.classList.remove('above', 'below', 'no-transform');
                      if (tooltipModel.yAlign) {
                          tooltipEl.classList.add(tooltipModel.yAlign);
                      } else {
                          tooltipEl.classList.add('no-transform');
                      }

                      function getBody(bodyItem) {
                          return bodyItem.lines;
                      }

                      // Set Text
                      if (tooltipModel.body) {
                          var titleLines = tooltipModel.title || [];
                          var bodyLines = tooltipModel.body.map(getBody);

                          var innerHtml = '<thead>';

                          titleLines.forEach(function(title) {
                              innerHtml += '<tr><th>' + title + '</th></tr>';
                          });
                          innerHtml += '</thead><tbody>';

                          bodyLines.forEach(function(body, i) {
                              var colors = tooltipModel.labelColors[i];
                              var style = 'background:' + colors.backgroundColor;
                              style += '; border-color:' + colors.borderColor;
                              style += '; border-width: 2px';
                              var span = '<span style="' + style + '"></span>';
                              innerHtml += '<tr><td>' + span + (getTimeDurationStringV2(getValueWithGivenRegex(body[i]),timeUnits)) + '</td></tr>';
                          });
                          innerHtml += '</tbody>';

                          var tableRoot = tooltipEl.querySelector('table');
                          tableRoot.innerHTML = innerHtml;
                      }

                      // `this` will be the overall tooltip
                      var position = this._chart.canvas.getBoundingClientRect();

                      // Display, position, and set styles for font
                      tooltipEl.style.opacity = 1;
                      tooltipEl.style.position = 'absolute';
                      tooltipEl.style.left = position.left + tooltipModel.caretX + 'px';
                      tooltipEl.style.top = position.top + tooltipModel.caretY + 'px';
                      tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                      tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                      tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                      tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';

                   }
                 },
                 maintainAspectRatio: false,

                 scales: dynamicScales

               }}
              getElementAtEvent={(elems)=>{
                if(elems!=null  && elems[0]!=null){
                  var host = elems[0]._view.label;
                  hashHistory.push('/detail?host='+host);
                }

              }}
           />
            </div>
        </Content>
      </Layout>
    );
  }
}
import {injectIntl} from 'react-intl';

export default connect(state => ({app: state.app, home: state.home}), dispatch => ({
  appAction: bindActionCreators(appAction, dispatch),
  staticAction: bindActionCreators(staticAction, dispatch)
}))(injectIntl(Static))
