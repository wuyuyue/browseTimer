import React, { Component } from 'react'
import PropTypes from 'prop-types'
import css from './index.styl'

class ToastItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 1
    }
  }
  static propTypes = {
    disappearDuration: PropTypes.number,
    data: PropTypes.object,
    style: PropTypes.object
  }
  static defaultProps = {
    disappearDuration: 2000,
    data: {},
    style: {
      bottom: 50
    }
  }
  componentDidMount() {
    var self = this;
    setTimeout(function() {
      var maxFrame = self.props.disappearDuration / 1000 * 40; // suppose fps = 40
      var count = 0;
      var update = function() {
        count++;
        self.setState(function(prevState, props) {
          // console.log(count / maxFrame);
          return { opacity: 1 - count / maxFrame }
        });
        if (count < maxFrame) {
          self._animationFun = window.requestAnimationFrame(update);
        } else {
          self.props.willLeave();
        }
      }
      update();
    }, this.props.data.timeout)
  }
  componentWillUnmount() {
    if (this._animationFun) {
      window.cancelAnimationFrame(this._animationFun);
    }
  }
  render() {
    var item = this.props.data;
    return (
      <div className='toast_item_container' key={'toast_' + item.id} style={{ ...this.props.style, opacity: this.state.opacity }}>
        <div className='toast_item_text'>{item.text}</div>
      </div>
    )
  }
}
class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }
  static propTypes = {
    toastMessage: PropTypes.object
  }
  static defaultProps = {
    toastMessage: {
      id: -1,
      text: 'Hello,world',
      timeout: 2000
    }
  }
  addMessage(toastMessage) {
    var self = this;
    self.setState(function(prevState, props) {
      return { items: prevState.items.concat([toastMessage]) }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.toastMessage !== nextProps.toastMessage) {
      this.addMessage(nextProps.toastMessage);
    }
  }

  willLeave(id) {
    this.setState(function(prevState, props) {
      var newItems = prevState.items;
      for (var i = 0; i < newItems.length; i++) {
        if (newItems[i].id === id) {
          newItems.splice(i, 1);
          break;
        }
      }
      return { items: newItems }
    });
  }
  render() {
    var data = this.state.items || [];
    if (data.length === 0) return null;
    data = data.reverse();
    var self = this;
    return (
      <div className='toast'>
        {
          data.map(item => {
            return (
                      <ToastItem willLeave={self.willLeave.bind(self, item.id)} key={item.id} data={item} style={self.props.style}></ToastItem>
                    )
          })
        }
      </div>

    )
  }
}

export default Toast
