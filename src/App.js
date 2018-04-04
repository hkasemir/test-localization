import React, { Component } from 'react';
import Widget from './components/widget';
import eerieImg from './images/brimham-rocks-3129664_640.jpg';
import dogImg from './images/dog-3071334_640.jpg';
import './App.css';

class App extends Component {
  state = {
    count: 0,
    text: ''
  }

  alertSomething = () => {
    const {
      count,
      text
    } = this.state;
    alert(`App_alertMessage`, {count, text});
  }

  increment = () => {
    this.setState(prevState => ({count: prevState.count + 1}));
  }

  decrement = () => {
    this.setState(prevState => ({count: prevState.count - 1}));
  }

  updateText = (evt) => {
    this.setState({
      text: evt.target.value
    });
  }

  render() {
    const {
      count,
      text
    } = this.state;
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className=''>Let's test some localization frameworks!</h1>
        </header>
        <p className=''>
          Localization can be hard - let's say you have <a href='https://www.reddit.com/'>some links</a> in
          the middle of your text.
        </p>
        <div>
          <p>Or maybe you have to manage something with plural rules...</p>
          <button onClick={this.increment}>Add</button>
          <button onClick={this.decrement}>Subtract</button>
          <p>{count} people have messaged you today.</p>
        </div>
        <div>
          <p>What about translating attributes on DOM elements, like the placeholder on this input?</p>
          <input
            type='text'
            placeholder='write something here'
            value={text}
            onChange={this.updateText}
          />
          <button onClick={this.alertSomething}>Let's see a pop up</button>
        </div>
        <div>
          <p>Or even better: What about translating props on React components?</p>
          <Widget
            category='weird stuff'
            description='these are things that are cool but also weird'
            pictureAlt='eerie landscape with strangley eroded rocks'
            picture={eerieImg}
          />
          <Widget
            category='cute stuff'
            description='A collection of the cutest things'
            pictureAlt='a really cute puppy making sorrowful eyes'
            picture={dogImg}
          />
        </div>
        <section>
          <p>Perhaps you want to format some dates, like today: {new Date().toLocaleString()}</p>
        </section>
      </div>
    );
  }
}

export default App;
