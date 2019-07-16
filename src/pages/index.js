// Externals
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

// Styles
// import './index.scss';

/**
 * Landing page controller component
 *
 * @route /
 * @class IndexPage
 * @extends {Component}
 */
@inject('store') @observer
class IndexPage extends Component {
  componentDidMount () {
    setTimeout(() => {
      this.props.store.setLoading(false);
    }, 2000);
  }

  render () {
    const { isLoading } = this.props.store;

    return (
      <div className='index-container'>
        <h1>Hello world!</h1>
        {isLoading && <p>loading...</p>}
      </div>
    );
  }
}

export default IndexPage;
