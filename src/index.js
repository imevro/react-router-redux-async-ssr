import React from 'react';
import { render } from 'react-dom';

class HelloWorld extends React.Component {
  render() {
    return (
      <div>1</div>
    );
  }
}

render(<HelloWorld />, document.getElementById(`app`));
