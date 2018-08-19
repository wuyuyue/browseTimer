import React from 'react'
import PropTypes from 'prop-types'
import css from './index.styl'
export default class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    style: PropTypes.object
  }

  static defaultProps = {
    style: {}
  }

  render() {
    return (
      <div className='footer' style = {{ ...this.props.style }}>
        {this.props.children}
      </div>
    )
  }

}