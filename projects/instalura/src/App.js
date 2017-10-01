import React, { Component } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import TimelineStore from './stores/TimelineStore';

const timelineStore = new TimelineStore([]);

class App extends Component {

  render() {
    return (
      <div id="root">
        <div className="main">
          <Header/>
          <Timeline login={this.props.match.params.login} timelineStore={timelineStore}/>
        </div>
      </div>
    );
  }
}

export default App;
