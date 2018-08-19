import React from 'react';
import './index.styl';
import {injectIntl} from 'react-intl';

 class PlayButton extends React.Component {
    constructor(props){
      super(props);
      this.state={
        isPlaying: false,
        autoPlay: false
      }
    }
    componentDidMount(){
      var self = this;
      var audio = document.querySelector('#appAudio');
      audio.addEventListener("playing", function(){
        self.setState({
          isPlaying: true
        })
      });
      audio.addEventListener("pause", function(){
        self.setState({
          isPlaying: false
        })
      });
      if(window.localStorage.getItem('autoPlay')==null){
        this.setState({autoPlay: true});
        window.localStorage.setItem('autoPlay',false)
      }
      const {intl} = this.props;
      let title = intl.formatMessage({id: 'app.title'});
      document.title = title;

    }
    playOrPause(){
      var audio = document.querySelector('#appAudio');
      if(this.state.isPlaying){
        audio.pause();
      }else{
        audio.play();
      }
    }
    onMouseOver(e){
      document.querySelector('.playButton').style.width='150px';
    }
    onMouseOut(e){
      document.querySelector('.playButton').style.width='50px';
    }
    render() {
      const {intl} = this.props;

      let src = intl.formatMessage({id: 'app.bg.url'});
      // let title = intl.formatMessage({id: 'app.title'});
      return (
          <div className='playButton' onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)}>
            <audio controls preload='preload' id='appAudio' autoPlay={this.state.autoPlay} src={src}>
            </audio>
          </div>
      );
    }
}
export default injectIntl(PlayButton);
