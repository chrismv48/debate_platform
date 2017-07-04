import React, {Component} from 'react'
import {ajax} from 'jquery';
import Select from 'react-select';
import PropTypes from 'prop-types';
import _ from 'underscore'

export default class PremiseForm extends Component {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      ...this.props
    };

    if (_.isEmpty(this.state.sources)) {
      this.state.sources = this.getSources()
    }

    if (_.isEmpty(this.state.arguments_)) {
      this.state.arguments_ = this.getArguments()
    }

    if (_.isEmpty(this.state.premises)) {
      this.state.premises = this.getPremises()
    }
  }

  getSources() {
    ajax({
      url: '/sources.json'
    }).done(sources => {
      this.setState({sources})
    })
  }

  getArguments() {
    ajax({
      url: '/arguments.json'
    }).done(arguments_ => {
      this.setState({arguments_})
    })
  }

  getPremises() {
    ajax({
      url: '/premises.json'
    }).done(premises => {
      this.setState({premises})
    })
  }

  onSubmitForm(event) {
    event.preventDefault()
    const { handleModalSubmit, argument_id } = this.props
    const {premise, associatedSources, associatedArgument, supportingPremises, parentPremises} = this.state
    premise.argument_id = associatedArgument ? associatedArgument['id'] : null
    let data = {
      premise: premise,
      source_ids: associatedSources.map((source) => source.id),
      supporting_premise_ids: supportingPremises.map((sp) => sp.id),
      authenticity_token: this.props.authenticity_token,
      parent_premise_ids: parentPremises.map(pp => pp.id),
      argument_id: argument_id
    }
    let method = null
    let url = null
    if (premise.id) {
      method = 'PUT'
      url = `/premises/${premise.id}`
    }
    else {
      method = 'POST'
      url = '/premises'
    }

    ajax({
      url: url,
      method: method,
      contentType: "application/json",
      dataType: handleModalSubmit ? "json": null,
      data: JSON.stringify(data),
      beforeSend: () => {
        this.setState({loading: true})
      }
    }).done(_ => {
      this.setState({loading: false})
      if (handleModalSubmit) {
        handleModalSubmit()
      }
    })
  }

  handleInputChange(event) {
    let premise = this.state.premise;
    premise[event.target.name] = event.target.value;
    this.setState({premise: premise});
  }

  render() {
    const {premise, sources, associatedSources, arguments_, associatedArgument, premises, supportingPremises, parentPremises} = this.state
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
              name="argument"
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
            <label htmlFor="parentPremises">Parent Premise(s)</label>
            <Select
              name="parentPremises"
              options={premises}
              onChange={(value) => this.setState({parentPremises: value})}
              multi={true}
              value={parentPremises}
              labelKey="name"
              valueKey="id"
              searchable={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="supportingPremises">Supporting Premise(s)</label>
            <Select
              name="supportingPremises"
              options={premises}
              onChange={(value) => this.setState({supportingPremises: value})}
              multi={true}
              value={supportingPremises}
              labelKey="name"
              valueKey="id"
              searchable={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="premiseSources">Associated Source(s)</label>
            <Select
              name="premiseSources"
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


PremiseForm.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  premise: PropTypes.object.isRequired,
  authenticity_token: PropTypes.string.isRequired,
  premises: PropTypes.array,
  parentPremises: PropTypes.array,
  sources: PropTypes.array,
  associatedSources: PropTypes.array,
  arguments_: PropTypes.array,
  associatedArgument: PropTypes.object,
  supportingPremises: PropTypes.array
}

PremiseForm.defaultProps = {
  associatedSources: [],
  supportingPremises: [],
  parentPremises: []
}
