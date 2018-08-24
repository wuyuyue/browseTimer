import React from 'react';
import ReactDOM from 'react-dom';
import css from './app.styl'
import Loading from '../components/loading'
import Toast from '../components/toast'
import Modal from '../components/modal'
import PlayButton from './common/playbutton'
import { hashHistory } from 'react-router';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appAction from './appAction'

import moment from 'moment'

import { IntlProvider, addLocaleData } from 'react-intl';

import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';

addLocaleData(enLocaleData);
addLocaleData(zhLocaleData);



import zh_CN from '../../locale/zh_CN.js';
import en_US from '../../locale/en_US.js';

// import "babel-polyfill";

// import {renderToString} from 'react-dom/server'

function chooseLocale(language){
  var obj = en_US;
  if(language.indexOf('zh')>-1){
    obj= zh_CN;
  }else if(language.indexOf('en')>-1){
    obj= en_US;
  }
  return obj;
}




class AnimationOnPage extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.location.pathname!== nextProps.location.pathname ||  this.props.location.search!== nextProps.location.search;
  }
  render() {
    var pageUI = this.props.children;
    return pageUI;
  }
}
class App extends React.Component {
  componentDidMount() {
    //
    // $(window).on('focus', '.textInput input', (ev) => {
    //
    //   var target = ev.currentTarget;
    //
    //   setTimeout(function() {
    //
    //
    //     target.scrollIntoView();
    //
    //   }, 500);
    // })

    moment.locale(navigator.language)

    var self = this;
    self.props.appAction.resize(window.innerWidth,window.innerHeight);

    window.addEventListener('resize',function(){
      self.props.appAction.resize(window.innerWidth,window.innerHeight);
    },false)

  }
  componentWillUnmount () {

  }
  render() {
    var modalUI = null;
    var modalUIShow = false;
    var modalUIStyle = {};
    var maskTopPoz = 0;
    var maskColor = 'rgba(0,0,0,0.7)';
    if (this.props.app.modal.ui !== null) {
      if (this.props.app.modal.uiProps && this.props.app.modal.uiProps.maskTopPoz) {
        maskTopPoz = this.props.app.modal.uiProps.maskTopPoz;
      }
      if (this.props.app.modal.uiProps && this.props.app.modal.uiProps.maskColor) {
        maskColor = this.props.app.modal.uiProps.maskColor;
      }
      modalUI = React.createElement(this.props.app.modal.ui, this.props.app.modal.uiProps, null);
      modalUIShow = true;
      modalUIStyle = this.props.app.modal.uiProps.style;
    }


    return (
      <IntlProvider locale={this.props.app.appLanguage} key={this.props.app.appLanguage} messages={chooseLocale(this.props.app.appLanguage)}>
        <div className='root'>
          <AnimationOnPage location={this.props.location}>{this.props.children}</AnimationOnPage>
          <PlayButton/>
          <Toast toastMessage={this.props.app.toast}/>
          <Modal style={modalUIStyle} show={modalUIShow} maskTopPoz={maskTopPoz} maskColor={maskColor} hasClose={false}>
            {modalUI}
          </Modal>
          <Loading show={this.props.app.showLoading}/>

        </div>
      </IntlProvider>

    );
  }
}

export default connect(
  (state) => ({
    app: state.app
  }),
  dispatch => ({
    appAction: bindActionCreators(appAction, dispatch)
  })
)(App)
