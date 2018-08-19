import React from 'react';
import './index.styl';
import { hashHistory } from 'react-router';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import moment from 'moment'

export default class Header extends React.Component {
    constructor(props){
      super(props);
      this.state={

      }
    }
    componentDidMount(){
      console.log();
    }

    onChangeLanguage(e){
      var value = e.nativeEvent.target.value;
      this.props.appAction.switchLanguage(value);
      moment.locale(value)
    }
    render() {
      const {intl} = this.props;

      var title = intl.formatMessage({id: 'app.name'});
      var menu1 = intl.formatMessage({id: 'app.menu.realtime'});
      var menu2 = intl.formatMessage({id: 'app.menu.static'});
      var languages = intl.formatMessage({id: 'app.languages'});
      return (
        <div className='commonHeader' style={{backgroundColor:'black'}}>
            <img className='logo' src='logo.png' style={{ marginTop: 7, marginLeft: 10, width: 30, height: 30, cursor: 'pointer' }}/>

            <span className='title'>{title}</span>
            <span className={'menu' + (this.props.location && this.props.location.pathname && this.props.location.pathname==='/'?' selected':'')} onClick={()=>{hashHistory.push('/')}}>{menu1}</span>
            <span className={'menu' + (this.props.location && this.props.location.pathname && this.props.location.pathname==='/static'?' selected':'')} onClick={()=>{hashHistory.push('/static')}}>{menu2}</span>
            <select
                value={this.props.appLanguage}
                style={{ width: 80, position:'absolute', right:10, top:12 }}
                onChange={this.onChangeLanguage.bind(this)}
              >

              {
                languages.split('/').map(function(language,i){
                  var v = language.split(',')[1];
                  var text = language.split(',')[0];
                  return   <option key={i} value={v}>{text}</option>
                })
              }

            </select>
        </div>
      );
    }
}
