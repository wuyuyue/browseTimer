import React from 'react';
import Layout from '../../components/layout'
import Header from '../../components/header'
import Content from '../../components/content'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appAction from '../appAction'
import { hashHistory } from 'react-router';
import css from './index.styl'
import CommonHeader from '../common/header'

class NotFoundPage  extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
  }
  render() {
    var self = this;
    const {intl} = this.props;
    return (
      <Layout className='error' bgColor='white'>
        <CommonHeader intl={intl} location={this.props.location} appAction={this.props.appAction} appLanguage={this.props.app.appLanguage}/>
        <Content>
          <div className='vhCenter' style={{ marginTop: 257}}>
            <img src='images/404.png' srcSet="images/404@2x.png 2x, 404/logo@3x.png 3x" style={{ width: 130, height: 48}}/>
          </div>
          <div style={{ color: '#333333', textAlign: 'center', marginTop: 17, fontFamily: 'PingFang-SC-Heavy', fontSize: 18, fontWeight: 900,lineHeight: '18px' }}>
            404！
          </div>

          <div style={{ paddingLeft: 92, paddingRight: 92, marginTop: 37,height: 55, width: '100%' }}>
            <div onClick={()=>(hashHistory.push('/'))} className='vhCenter' style={{ height: 49, fontFamily: 'PingFang-SC-Heavy', fontSize: 15, fontWeight: 900, width: '100%', textAlign: 'center', color: 'white', WebkitBorderRadius: '24px 24px', backgroundColor: 'black' }}>
              回首页
            </div>
          </div>
        </Content>
      </Layout>
    );
  }
}
import {injectIntl} from 'react-intl';

export default connect(state => ({app: state.app}), dispatch => ({
  appAction: bindActionCreators(appAction, dispatch)
}))(injectIntl(NotFoundPage))
