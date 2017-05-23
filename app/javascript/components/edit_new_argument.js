import React, {Component} from 'react'
import { ajax } from 'jquery';
import Select from 'react-select';
import PropTypes from 'prop-types';


const options = [
  {value: 'one', label: 'One'},
  {value: 'two', label: 'Two'}
];

export default class EditNewArgument extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      argument: this.props.argument,
      premises: this.props.premises,
      associatedPremises: this.props.associatedPremises
    };
  }

  onSubmitForm(event) {
    event.preventDefault()
    const {argument, associatedPremises} = this.state

    const data = {
      argument: argument,
      premise_ids: associatedPremises.map((p) => p.id),
      authenticity_token: this.props.authenticity_token
    }
    let method = null
    let url = null
    if (window.location.pathname.search('edit') >= 0) {
      method = 'PUT'
      url = `/arguments/${argument.id}`
    }
    else {
      method = 'POST'
      url = '/arguments'
    }
    ajax({
      url: url,
      method: method,
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      beforeSend: () => {
        // disable the submit button it's clicked so that we don't get a double-submit
        this.setState({loading: true})
      }
    }).done((data) => {
      this.setState({loading: false})
    })
  }


  handleInputChange(event) {
    let argument = this.state.argument;
    argument[event.target.name] = event.target.value;
    this.setState({argument: argument});
  }

  render() {
    const {argument, premises, associatedPremises} = this.state
    return (
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="argumentName">Name</label>
            <input type="text"
                   id="argumentName"
                   name="name"
                   value={argument.name || ''}
                   onChange={(event) => this.handleInputChange(event)}
                   className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="argumentPremises">Associate Premise(s)</label>
            <Select
              name="form-field-name"
              options={premises}
              onChange={(value) => this.setState({associatedPremises: value})}
              multi={true}
              value={associatedPremises}
              autosize={true}
              labelKey="name"
              valueKey="id"
              searchable={true}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary" onClick={(event) => this.onSubmitForm(event)}>Save
            </button>
          </div>
        </form>
      </div>
    )
  }
}


EditNewArgument.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  argument: PropTypes.object.isRequired,
  premises: PropTypes.array,
  associatedPremises: PropTypes.array
}

EditNewArgument.defaultProps = {
  premises: [],
  associatedPremises: []
}