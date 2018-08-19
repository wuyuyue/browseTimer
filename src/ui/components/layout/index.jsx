import React from 'react'
import PropTypes from 'prop-types'
import css from './index.styl'

class FloatAboveLayout extends React.Component {

  static propTypes = {
    style: PropTypes.object
  }
  static defaultProps = {
    style: {

    }
  }
  render() {
    return (
        <div className='layout_floatAboveLayout' style={this.props.style}>
          {this.props.children}
        </div>
    )
  }
}

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: this.props.drawerOpen || false
    }
  }
  static propTypes = {
    bgColor: PropTypes.string,
    drawer: PropTypes.element,
    drawerStyle: PropTypes.object,
    className: PropTypes.string
  }

  static defaultProps = {
    bgColor: '#F6F6F6',
    drawer: null,
    drawerOpen: false,
    drawerStyle: {
      width: '80%'
    },
    className: null
  }
  switchDrawer(){
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }
  closeDrawer(){
    if(this.state.drawerOpen === true){
      this.setState({ drawerOpen: false });
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.drawerOpen !== nextProps.drawerOpen){
      this.setState({ drawerOpen: nextProps.drawerOpen });
    }
  }
  render() {
    var hasDrawer = this.props.drawer ? true: false;
    var drawerUI = null;

    var layoutHasDrawerStyle = {};


    if(hasDrawer){
      var style = {};
      if (this.state.drawerOpen) {
        var outTransition = {
          WebkitTransition: 'transform 600ms ease-out'
        }
        layoutHasDrawerStyle = {
          ...outTransition,
          transform: 'translateX(' + this.props.drawerStyle.width + ')',
        };
        style = {
          ...outTransition,
          transform: 'translateX(0)'
        }
      } else {
        var inTransition = {
          WebkitTransition: 'transform 600ms ease-in-out'
        }
        layoutHasDrawerStyle = {
          ...inTransition,
          transform: 'translateX(0)'
        };
        style = {
          ...inTransition,
          transform: 'translateX(-100%)'
        }
      }
      drawerUI =  <div className='layout_drawer' style={{ ...style, ...this.props.drawerStyle }}>
                    {this.props.drawer}
                  </div>


    }
    var drawerSwitch = null;
    if (hasDrawer) {
      drawerSwitch = (
        <div className='layout_drawer_menu' onClick={this.switchDrawer.bind(this)}>
          <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30" focusable="false"><title>Menu</title><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" d="M4 7h22M4 15h22M4 23h22"></path></svg>
        </div>
      )
    }
    return (
      <div className={this.props.className?'layout_container ' + this.props.className: 'layout_container'} >
        <div className='layout' style={{ ...layoutHasDrawerStyle, backgroundColor: this.props.bgColor}} onFocus={this.closeDrawer.bind(this)}>
          {drawerSwitch}
          {this.props.children}
        </div>
        {drawerUI}
      </div>
    )
  }
}

exports.FloatAboveLayout = FloatAboveLayout;
