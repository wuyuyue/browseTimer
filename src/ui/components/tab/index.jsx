import React, { Component } from 'react'
import PropTypes from 'prop-types'
import css from './index.styl'

const style = {
  tabs: {
    base: {
      boxSizing: 'border-box',
      width: '100%',
      position: 'relative'
    }
  },
  tabHeader: {
    base: {
      width: '100%',
      height: 45,
      overflowX: 'auto',
      overflowY: 'hidden'
    },
    navbar: {
      boxSizing: 'inherit',
      borderTop: '1px solid rgb(238, 238, 238)',
      borderBottom: '1px solid rgb(238, 238, 238)',
      //display: '-ms-flexbox',
    //  display: 'flex',
    //  display: '-webkit-box',
    //  MsFlexDirection: 'row',
    //  WebkitFlexDirection: 'row',
    //  WebkitBoxOrient: 'horization'
    },
    item: {
      base: {
        boxSizing: 'inherit',
        textAlign: 'center',
        padding: '0 10px',
        lineHeight: '44px',
        color: '#999',
        width: 100,
        borderBottom: '1px solid transparent'

      },
      selected: {
        color: '#434343',
        borderBottom: '1px solid #f0594e'
      }
    }
  },
  tabContent: {
    base: {
      // width: '96%',
      // margin: '0 2% '
    }
  }
};

class Tab extends Component {

  static propTypes = {
    title: PropTypes.string
  }

  render() {
    return (
        <div>
          {this.props.children}
        </div>
    )
  }
}
class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIndex: 0
    }
  }
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.instanceOf(Tab)),
    style: PropTypes.object,
    headerDirection: PropTypes.oneOf(['top', 'bottom']),
    headerWidthUnit: PropTypes.oneOf(['percent', 'fixed']),
    onTabSwitchCallBack: PropTypes.func
  }

  static defaultProps = {
    headerDirection: 'top',
    headerWidthUnit: 'percent',
    style: {
    },
    onTabSwitchCallBack: null
  }

  switchTab(tabIndex, event) {
    var self = this;
    try {
      if (self.props.headerWidthUnit === 'fixed') {
        // console.log(event.currentTarget);
        //  console.log(self.refs.tabHeader.scrollLeft);
        // console.log(event.currentTarget.offsetLeft);
        // console.log(event.currentTarget.clientWidth);
        self.refs.tabHeader.scrollLeft = event.currentTarget.offsetLeft - self.refs.tabHeader.clientWidth / 2 + event.currentTarget.clientWidth / 2;
      }
    } catch (e) {
      // console.log(e);
    } finally {
      self.setState({ 'selectIndex': tabIndex }, function() {
        if (self.props.onTabSwitchCallBack) {
          self.props.onTabSwitchCallBack(tabIndex);
        }
      });
    }
  }
  render() {
    var tabHeader = [];
    var tabContent = [];
    var self = this;
    var children = React.Children.toArray(self.props.children || []);

    children.forEach(function(child, i) {
      // console.log(child);
      var title = child.props.title;
      var tabHeaderItemStyle = { ...style.tabHeader.item.base };
      var tabHeaderClassNames = 'tabHeader';
      if (self.props.headerWidthUnit === 'percent') {
        tabHeaderItemStyle.width = (100 / children.length) + '%';
      }
      if (i === self.state.selectIndex) {
        tabHeaderClassNames = 'tabHeader tabHeaderSelected';
        tabHeaderItemStyle = { ...tabHeaderItemStyle, ...style.tabHeader.item.selected };
      }

      tabHeader.push(<div className={tabHeaderClassNames} key={'tabHeader_' + i} style={{ ...tabHeaderItemStyle }} onClick={self.switchTab.bind(self, i)}>
                      <span>{title}</span>
                    </div>);

      if (i === self.state.selectIndex) {
        tabContent.push(<div key={'tabContent_' + i} style={{ width: '100%' }}>
                        {child.props.children}
                      </div>);
      }
    });

    var tabsStyle = {
      ...style.tabs.base,
      ...this.props.style
    };
    var tabHeaderStyle = {
      ...style.tabHeader.base
    };
    var tabContentStyle = {
      ...style.tabContent.base
    };
    if (self.props.headerDirection === 'bottom') {
      if (tabsStyle.height === undefined) {
        tabsStyle.height = window.innerHeight;
      }
      tabHeaderStyle.position = 'absolute';
      tabHeaderStyle.bottom = 0;
      tabHeaderStyle.zIndex = 9999;

      tabContentStyle.height = tabsStyle.height - tabHeaderStyle.height;
      tabContentStyle.overflowY = 'auto';
    }
    return (
      <div style={{ ...tabsStyle }}>
        <div style={{ ...tabHeaderStyle }}>
          <div className='tabHeaderContainer' ref='tabHeader' style={{ ...style.tabHeader.base, ...style.tabHeader.navbar }}>
            {tabHeader}
          </div>
        </div>
        <div style={{ ...tabContentStyle }}>
          {tabContent}
        </div>
      </div>
    )
  }
}

export default Tabs;
exports.Tab = Tab;
