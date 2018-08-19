import React, { Component } from 'react'
import PropTypes from 'prop-types'
import css from './index.styl'

class HeaderBackButton extends Component {

  static propTypes = {
    onBack: PropTypes.func
  }

  onBack() {
    if (this.props.onBack) {
      this.props.onBack();
    }
  }

  render() {
    return (
        <div className='header_backButtonArea' onClick={this.onBack.bind(this)}>
          <div className='header_backButton'>
          </div>
        </div>
    )
  }
}

class Header extends Component {

  static propTypes = {
    bgColor: PropTypes.string,
    title: PropTypes.object,
    onBack: PropTypes.func,
    style: PropTypes.object
  }

  static defaultProps = {
    bgColor: 'white',
    title: 'Hello, world',
    onBack: null,
    style: {

    }
  }

  onBack() {
    if (this.props.onBack) {
      this.props.onBack();
    }
  }

  render() {
    return (
      <div className='header' style = {{ ...this.props.style, backgroundColor: this.props.bgColor }}>
        <HeaderBackButton onBack={this.onBack.bind(this)}></HeaderBackButton>
        <div className='header_title'>
          {this.props.title}
        </div>
      </div>
    )
  }
}

export default Header;
exports.HeaderBackButton = HeaderBackButton;
