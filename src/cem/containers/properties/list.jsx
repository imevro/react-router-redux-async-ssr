import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PropertiesActions from 'cem/actions/properties';

class List extends Component {
  static load(dispatch) {
    const actions = bindActionCreators(PropertiesActions, dispatch);

    return Promise.all([
      dispatch(actions.loadProperties)
    ]);
  }

  componentDidMount() {
    this.constructor.load(this.props.dispatch);
  }

  render() {
    if (this.props.state.properties.data) {
      return (
        <section>
          list of properties
          {JSON.stringify(this.props.state.properties.data.items)}
        </section>
      )
    } else {
      return <div>loading</div>
    }
  }
}

const pickState = ({ properties }) => ({
  state: { properties },
});

const pickActions = (dispatch) => ({
  actions: bindActionCreators(PropertiesActions, dispatch),
  dispatch,
});

export default connect(pickState, pickActions)(List);
