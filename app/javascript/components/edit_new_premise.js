import React, {Component} from 'react'
import $ from 'jquery';
import Select from 'react-select';
import PropTypes from 'prop-types';


export default class EditNewPremise extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      ...this.props
    };
  }

  onSubmitForm(event) {
    event.preventDefault()
    const {premise, associatedSources, associatedArgument, supportingPremises} = this.state
    premise.argument_id = associatedArgument ? associatedArgument['id']: null
    let data = {
      premise: premise,
      source_ids: associatedSources.map((source) => source.id),
      supporting_premise_ids: supportingPremises.map((sp) => sp.id),
      authenticity_token: this.props.authenticity_token
    }
    let method = null
    let url = null
    if (window.location.pathname.search('edit') >= 0) {
      method = 'PUT'
      url = `/premises/${premise.id}`
    }
    else {
      method = 'POST'
      url = '/premises'
    }
    $.ajax({
      url: url,
      method: method,
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      beforeSend: () => {
        this.setState({loading: true})
      }
    }).done((data) => {
      this.setState({loading: false})
    })
  }


  handleInputChange(event) {
    let premise = this.state.premise;
    premise[event.target.name] = event.target.value;
    this.setState({premise: premise});
  }

  render() {
    console.log(this.state)
    const {premise, sources, associatedSources, arguments_, associatedArgument, premises, supportingPremises} = this.state
    return (
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="premiseName">Name</label>
            <input type="text"
                   id="premiseName"
                   name="name"
                   value={premise.name || ''}
                   onChange={(event) => this.handleInputChange(event)}
                   className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="argument">Associated Argument</label>
            <Select
              name="form-field-name"
              options={arguments_}
              onChange={(value) => this.setState({associatedArgument: value})}
              value={associatedArgument}
              autosize={true}
              labelKey="name"
              valueKey="id"
              searchable={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="supportingPremises">Supporting Premise(s)</label>
            <Select
              name="form-field-name"
              options={premises}
              onChange={(value) => this.setState({supportingPremises: value})}
              multi={true}
              value={supportingPremises}
              autosize={true}
              labelKey="name"
              valueKey="id"
              searchable={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="premiseSources">Associated Source(s)</label>
            <Select
              name="form-field-name"
              options={sources}
              onChange={(value) => this.setState({associatedSources: value})}
              multi={true}
              value={associatedSources}
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


EditNewPremise.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  premise: PropTypes.object.isRequired,
  sources: PropTypes.array,
  associatedSources: PropTypes.array,
  arguments_: PropTypes.array,
  associatedArgument: PropTypes.object,
  supportingPremises: PropTypes.array
}

EditNewPremise.defaultProps = {
  sources: [],
  associatedSources: [],
  arguments_: [],
  associatedArgument: {},
  supportingPremises: []
}