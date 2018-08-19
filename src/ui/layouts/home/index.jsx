import React from 'react';

import Layout,{FloatAboveLayout} from '../../components/layout'
import Header from '../../components/header'
import Content from '../../components/content'


import CommonHeader from '../common/header'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appAction from '../appAction'
import * as homeAction from './action'

import { hashHistory } from 'react-router';
import css from './index.styl'

import { HorizontalBar,Pie} from 'react-chartjs-2';

import moment from 'moment'
import {getTimeDurationStringV2,getValueWithGivenRegex} from '../../utils/time.js'


import { FormattedMessage } from 'react-intl';

const barThickness = 30;
const scales = {
    xAxes: [{
        ticks: {
            min: 0
        }
    }]
}
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      data: [],
      from: null,
      to: null,
      totalUsed: 0,
      dynamicTotalUsed: 0
    }
  }
  componentDidMount(){
    var today=moment();

    this.timer=setInterval(this.query.bind(this),1000);

  }
  componentWillUnmount(){
    if(this.timer){
      clearInterval(this.timer);
      this.timer=null;
    }

  }
  query(){
    var self = this;
    if (browser &&  browser.runtime) { 
      browser.runtime.sendMessage({command:"QUERY_CURRENT",params:{}}).then((json)=>{
        //console.log(json);
        var data = json.data;
        var result = [];
        var totalUsed=0;
        Object.keys(data).map(function(url){
          totalUsed+=data[url];
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
        var dynamicTotalUsed = 0;
        if(totalUsed!=0 && totalUsed!==this.state.totalUsed ){
          dynamicTotalUsed  = totalUsed
        }else{
          dynamicTotalUsed=this.state.dynamicTotalUsed+(1*1000);
        }
        console.log({data: result,from: json.from, to: new Date().getTime(),totalUsed:totalUsed,dynamicTotalUsed:dynamicTotalUsed});
        self.setState({data: result,from: json.from, to: new Date().getTime(),totalUsed:totalUsed,dynamicTotalUsed:dynamicTotalUsed});
      },(e)=>{
        self.props.appAction.toast(e,2000);
      });
    }
  }

  render() {
    var self = this;
    const {intl} = this.props;

    let timeUnits = intl.formatMessage({id: 'app.time.units'});

    let totalUsedLabel = intl.formatMessage({id: 'home.body.rightchart.totalUsed'},{time: getTimeDurationStringV2(self.state.to-self.state.from,timeUnits)});

    let browserUsedLabel = intl.formatMessage({id: 'home.body.rightchart.browserUsed'},{time: getTimeDurationStringV2(this.state.dynamicTotalUsed,timeUnits)});
    let otherUsedLabel = intl.formatMessage({id: 'home.body.rightchart.otherUsed'},{time: getTimeDurationStringV2(this.state.to-this.state.from-this.state.dynamicTotalUsed,timeUnits)});
    let leftChartLabel = intl.formatMessage({id: 'home.body.leftchart.label'});




    var result = self.state.data;
    //console.log(result);
    const data = {
      labels: result.map(function(d){return d.x}),
      datasets: [
        {
          label: leftChartLabel,
          backgroundColor: 'rgba(0,0,0,0.7)',
          // borderColor: 'rgba(255,99,132,1)',
          // borderWidth: 1,
          hoverBackgroundColor: 'rgba(0,0,0,0.7)',
          // hoverBorderColor: 'rgba(255,99,132,1)',
          data: result.map(function(d){return d.y})
        }
      ]
    };
    var dynamicChartHeight = (self.props.app.appHeight-44)*1;
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
    // console.log(this.props);

    return (
      <Layout className='home' bgColor='white'>
        <CommonHeader intl={intl} location={this.props.location} appAction={this.props.appAction} appLanguage={this.props.app.appLanguage}/>

        <Content style={{width:self.props.app.appWidth,height:self.props.app.appHeight-44}}>

          <div className='withRow' style={{ width:self.props.app.appWidth, minHeight:self.props.app.appHeight-44}}>
            <div className='withRowLeftAuto'  style={{ width: self.props.app.appWidth * 0.6 }}>
              <HorizontalBar
                  key={self.props.app.appWidth+"_"+dynamicChartHeight}
                  ref='barChart'
                  data={data}
                  width={(self.props.app.appWidth*0.6)*1}
                  height={dynamicChartHeight}
                  options={{
                    tooltips: {
                    //     // Disable the on-canvas tooltip
                       enabled: false,
                       custom: function(tooltipModel) {
                         //console.log(tooltipModel);
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
                      document.querySelector("#chartjs-tooltip").style.opacity=0;
                      var host = elems[0]._view.label;
                      hashHistory.push('/detail?host='+host);
                    }

                  }}

               />
            </div>
            <div style={{ width: self.props.app.appWidth * 0.4 }}>
                <div style={{ marginTop: 10}}>
                  {totalUsedLabel}
                  <FormattedMessage
                    id='home.header.title'
                    description='home.header.title'
                    defaultMessage=', browsing start at { beginTime } '
                    values={{
                      beginTime: this.state.from?moment(this.state.from).format('YYYY-MM-DD HH:mm:ss:SSS'):'--'
                    }}
                    />
                </div>
                <Pie data={{
                    datasets: [{
                        data: [this.state.dynamicTotalUsed,this.state.to-this.state.from-this.state.dynamicTotalUsed],
                        backgroundColor: [
                      		'rgba(0,0,0,0.7)',

                      	],
                      	hoverBackgroundColor: [
                      		'rgba(0,0,0,0.7)',

                      	]
                    }],

                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: [
                        browserUsedLabel,
                        otherUsedLabel
                    ]
                  }}
                  options={{
                    tooltips: {
                        // Disable the on-canvas tooltip
                       enabled: false,
                       custom: function(tooltipModel) {
                          // console.log(tooltipModel);

                          // if(tooltipModel.body){
                          //   tooltipModel.body[0].lines[0]=getTimeDurationStringV2(tooltipModel.dataPoints[0]);
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
                    }
                  }}

                />
            </div>
          </div>
        </Content>

      </Layout>
    );
  }
}
import {injectIntl} from 'react-intl';

export default connect(state => ({app: state.app, home: state.home}), dispatch => ({
  appAction: bindActionCreators(appAction, dispatch),
  homeAction: bindActionCreators(homeAction, dispatch)
}))(injectIntl(Home))
