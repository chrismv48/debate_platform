import React, {Component} from 'react'
import $ from 'jquery';
import Select from 'react-select';
import PropTypes from 'prop-types';


export default class EditNewSource extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      ...this.props
    };
  }

  onSubmitForm(event) {
    event.preventDefault()
    const {source, associatedPremises} = this.state
    let data = {
      source: source,
      premise_ids: associatedPremises.map((p) => p.id),
      authenticity_token: this.props.authenticity_token
    }
    let method = null
    let url = null
    if (window.location.pathname.search('edit') >= 0) {
      method = 'PUT'
      url = `/sources/${source.id}`
    }
    else {
      method = 'POST'
      url = '/sources'
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
    let source = this.state.source;
    source[event.target.name] = event.target.value;
    this.setState({source: source});
  }

  render() {
    const {source, associatedPremises, premises} = this.state
    return (
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="sourceName">Name</label>
            <input type="text"
                   id="sourceName"
                   name="name"
                   value={source.name || ''}
                   onChange={(event) => this.handleInputChange(event)}
                   className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="premiseSources">Associate Premise(s)</label>
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


EditNewSource.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  source: PropTypes.object.isRequired,
  premises: PropTypes.array,
  associatedPremises: PropTypes.array,
}

EditNewSource.defaultProps = {
  premises: [],
  associatedPremises: [],
}