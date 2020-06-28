import React from 'react';
import Spinner from 'react-bootstrap/Spinner'

class LoadingMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayMessage: false,
    };

    this.timer = setTimeout(this.enableMessage, 500);
  }

  componentWillUnmount = () => {
    clearTimeout(this.timer);
  }

  enableMessage = () => {
    this.setState({displayMessage: true});
  }

  render = () => {
    const {displayMessage} = this.state;

    if (!displayMessage) {
      return null;
    }

    return (
      <div className='m-5 mx-auto'>
        <Spinner animation='border' variant='secondary' />
      </div>
    )
  }
}

export default LoadingMessage;
