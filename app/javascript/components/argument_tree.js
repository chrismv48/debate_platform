import React, {Component} from 'react'
import {ajax} from 'jquery';
import Select from 'react-select';
import PropTypes from 'prop-types';


export default class ArgumentTree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      argument: this.props.argument,
    };
  }

  render() {
    return (
      <div>
        Hello world!
      </div>
    )
  }
}


ArgumentTree.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  argument: PropTypes.object.isRequired,
  tree: PropTypes.array
}

ArgumentTree.defaultProps = {
  tree: []
}
