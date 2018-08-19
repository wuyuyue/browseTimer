import React, { Component } from 'react'
import PropTypes from 'prop-types'
import css from './index.styl'

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 0,
      show: this.props.show ? true: false
    }
  }
  static propTypes = {
    maskColor: PropTypes.string,
    maskTopPoz: PropTypes.number,
    show: PropTypes.bool,
    hasClose: PropTypes.bool,
    style: PropTypes.object
  }
  static defaultProps = {
    maskColor: 'rgba(0, 0, 0, 0.7)',
    maskTopPoz: 0,
    show: false,
    hasClose: true,
    style: {}
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.show !== this.props.show){
      this.setState({
        show: nextProps.show ? true: false
      });
    }
  }
  closeModal(){
    // this.setState({ show: false });
    this.props.closeModal && this.props.closeModal();
  }
  stopPropagation(event){
    event.stopPropagation();
  }
  render() {
    if (this.state.show === false) return null;
    // console.log(this.props);
    return (
      <div className='modal' onClick={()=>this.closeModal()}>
        <div className='modal_content vhCenter' style={{ marginTop: this.props.maskTopPoz ,backgroundColor: this.props.maskColor }}>
          <div style={this.props.style} onClick={(e)=>this.stopPropagation(e)}>
            {this.props.children}
            <div className='modal_close' style={{ display: this.props.hasClose? 'block': 'none' }} onClick={this.closeModal.bind(this)}>x</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Modal
