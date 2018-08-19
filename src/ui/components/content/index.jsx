import React from 'react'
import PropTypes from 'prop-types';
import css from './index.styl'

class Content extends React.Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    style: PropTypes.object,
    onScroll: PropTypes.func,
    onScrollEnd: PropTypes.func
  }

  static defaultProps = {
    style: {},
    onScroll: null,
    onScrollEnd: null
  }
  static scrollLatency = 300

  static scrollEndTimer = null

  scrollHandler(event) {
    var nativeEvent = event.nativeEvent;

    if (nativeEvent.target.className !== 'scrollContent') {
      return;
    }

    // response on scroll
    if (this.props.onScroll !== null) {
      this.props.onScroll(nativeEvent);
    }
    // response on scrollEnd
    if (this.props.onScrollEnd !== null) {
      if (Content.scrollEndTimer) {
        clearTimeout(Content.scrollEndTimer);
      }
      var self = this;
      Content.scrollEndTimer = setTimeout(function() {
        Content.scrollEndTimer = null;
        self.props.onScrollEnd(nativeEvent);
      }, Content.scrollLatency);
    }
  }

  render() {
    return (
      <div className='scrollContent' onScroll={ this.scrollHandler.bind(this) }>
        <div style= {{ width: '100%', position: 'absolute', ...this.props.style }} >
         {this.props.children}
        </div>
      </div>
    )
  }
}

export default Content;
