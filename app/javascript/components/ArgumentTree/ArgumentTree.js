import React, {Component} from 'react'
import PropTypes from 'prop-types'

import './ArgumentTree.scss'

import PremiseForm from '../PremiseForm/PremiseForm'

import {stratify, tree} from 'd3-hierarchy'
import * as d3 from "d3";
import _ from 'underscore'
import {Modal, Button} from 'react-bootstrap'
import {ajax} from 'jquery'

const stopBubbling = (event) => {
  event.stopPropagation()
  event.cancelBubble = true;
}

const getDepth = ({children}) => 1 +
(children ? Math.max(...children.map(getDepth)) : 0)

export default class ArgumentTree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      argument: this.props.argument,
      hiddenPremises: {},
      tree: this.props.tree[0],
      showModal: false,
      selectedPremise: null
    }

    this.node_height = 80
    this.node_width = 220
    this.tree_layout_width = 850
    this.tree_layout_height = 450
    this.leaf_node_margin = 40
    this.svg_layout_width = this.tree_layout_width + this.node_width + this.leaf_node_margin
    this.svg_layout_height = this.tree_layout_height + this.node_height + this.leaf_node_margin
    this.root_node_margin = 10
  }

  calculateLayoutHeight(treeDepth) {
    // TODO: This seems incorrect/stupid
    this.tree_layout_height = (this.node_height + this.leaf_node_margin) * treeDepth
    this.svg_layout_height = this.tree_layout_height + this.node_height + this.leaf_node_margin
  }

  handleModalSubmit() {
    this.setState({showModal: false}, this.fetchArgumentTree())
  }

  getNodeParent(childNode) {
    if (childNode.connection && childNode.connection.parent_premise_id) {
      const parentPremiseId = childNode.connection.parent_premise_id
      const parentNode = _.find(this.state.tree, (node) => node.premise.id === parentPremiseId)
      return parentNode.premise ? [parentNode.premise]: null
    }
  }

  fetchArgumentTree() {
    ajax({
      url: `/arguments/${this.props.argument.id}/argument_tree`
    }).done(
      argumentTree => {
        this.setState({tree: argumentTree[0]})
      }
    )
  }

  getSubTree(rootId, immediateChildrenOnly = false) {
    let children = []
    let queue = [rootId]
    const {tree} = this.state
    while (queue.length > 0) {
      let currentNode = queue.pop()
      let nodeChildren = tree.filter(node => (node.connection ? node.connection.parent_premise_id : null) === currentNode)
      children = children.concat(nodeChildren)
      queue = queue.concat(nodeChildren)

      if (immediateChildrenOnly) {
        break
      }
    }
    return _.isEmpty(children) ? null : children
  }

  toggleSubTreeVisibility(nodeId) {
    const {hiddenPremises} = this.state

    if (_.has(hiddenPremises, nodeId)) {
      const newHiddenPremises = _.omit(hiddenPremises, nodeId)
      this.setState({hiddenPremises: newHiddenPremises})
    }
    else {
      const subTree = this.getSubTree(nodeId)
      const subTreeIds = _.map(subTree, node => node.premise.id)
      if (subTreeIds) {
        let newHiddenPremises = {...hiddenPremises}
        newHiddenPremises[nodeId] = subTreeIds
        this.setState({hiddenPremises: newHiddenPremises})
      }
    }
  }

  handleShowModal(premiseId, event) {
    stopBubbling(event)
    this.setState({showModal: event.target.id})
    this.setState({selectedPremise: _.find(this.state.tree, (node) => node.premise.id === premiseId)})
  }

  generateRoot() {
    let {tree} = this.state

    return d3.stratify()
      .id((d) => d.premise.id)
      .parentId(d => d.connection ? d.connection.parent_premise_id : null)
      (tree);
  }

  generateDivNodes(nodes) {
    return nodes.map(node => {
      const premiseId = node.data.premise.id
      const premiseName = node.data.premise.name
      return (
        <foreignObject
          x={node.x}
          y={node.y}
          width={this.node_width}
          height={this.node_height}
          key={premiseId}
        >
          <div
            className="node-container"
            style={{
              width: this.node_width,
              height: this.node_height,
              display: this.getHiddenPremises().includes(premiseId) ? "none" : "inline-block"
            }}
            onClick={() => this.toggleSubTreeVisibility(premiseId)}
          >
            <h5 className="node-header">
              {premiseName}
            </h5>
            <div className="node-actions-container">
              <span
                id="create"
                onClick={(event) => this.handleShowModal(premiseId, event)}
                className="glyphicon glyphicon-plus node-action"
              />
              <span
                id="modify"
                onClick={(event) => this.handleShowModal(premiseId, event)}
                className="glyphicon glyphicon-pencil node-action"
              />
              <span
                id="destroy"
                onClick={(event) => this.handleShowModal(premiseId, event)}
                className="glyphicon glyphicon-trash node-action"/>
            </div>
          </div>
        </foreignObject>
      )
    })
  }

  getHiddenPremises() {
    return _.flatten(_.values(this.state.hiddenPremises))
  }

  generateLinkPaths(links) {
    const lineLink = d3.linkVertical()
      .x(d => d[0])
      .y(d => d[1]);

    return links.map((link, i) => {
      const modifiedLinkCoordinates = {
        source: [link.source.x + this.node_width / 2, link.source.y + this.node_height],
        target: [link.target.x + this.node_width / 2, link.target.y]
      }
      return (
        <path key={i}
              className="link" d={lineLink(modifiedLinkCoordinates)}
              visibility={this.getHiddenPremises().includes(link.target.data.premise.id) ? "hidden" : "visible"}
        />
      );
    });

  }

  destroyPremise(premiseId) {
    ajax({
      type: 'DELETE',
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      headers: { "Authorization": this.props.authenticity_token },
      url: `/premises/${premiseId}`
    }).done(_ => {
        this.handleModalSubmit()
      }
    )
  }

  generateTreeLayout() {
    const root = this.generateRoot()
    const treeDepth = getDepth(root)
    this.calculateLayoutHeight(treeDepth)
    return (
      <svg height={this.svg_layout_height} width={this.svg_layout_width}>
        {this.generateTree(root)}
      </svg>
    )
  }

  generateTree(root) {
    let treeLayout = d3.tree();
    treeLayout.size([this.tree_layout_width, this.tree_layout_height])
    const tree = treeLayout(root)
    let nodes = tree.descendants();
    nodes[0].y += this.root_node_margin
    const links = tree.links()

    const linkPaths = this.generateLinkPaths(links)
    const displayNodes = this.generateDivNodes(nodes)

    return (
      <g>
        {linkPaths}
        {displayNodes}
      </g>
    )
  }

  render() {
    const {showModal, selectedPremise, argument} = this.state
    const {authenticity_token} = this.props
    return (
      <div className="ArgumentTree">
        {this.generateTreeLayout()}

        {showModal === 'modify' &&
        <Modal show={showModal === 'modify'} onHide={() => this.setState({showModal: false})}>
          <Modal.Header closeButton>
            <Modal.Title>Modify premise</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PremiseForm
              premise={selectedPremise.premise}
              associatedArgument={selectedPremise.premise.argument_id ? argument: null}
              supportingPremises={_.pluck(this.getSubTree(selectedPremise.premise.id, true), 'premise') || []}
              authenticity_token={authenticity_token}
              handleModalSubmit={(newTree) => this.handleModalSubmit(newTree)}
              parentPremises={this.getNodeParent(selectedPremise)}
              argument_id={argument.id}
            />
          </Modal.Body>
        </Modal>
        }
        {showModal === 'create' &&
        <Modal show={showModal === 'create'} onHide={() => this.setState({showModal: false})}>
          <Modal.Header closeButton>
            <Modal.Title>Add premise</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PremiseForm
              premise={{id: null, name: null}}
              associatedArgument={null}
              supportingPremises={[]}
              parentPremises={[selectedPremise.premise]}
              handleModalSubmit={() => this.handleModalSubmit()}
              argument_id={argument.id}
              authenticity_token={authenticity_token}
            />
          </Modal.Body>
        </Modal>
        }
        {showModal === 'destroy' &&
        <Modal show={showModal === 'destroy'} onHide={() => this.setState({showModal: false})}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to delete this premise?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={() => this.destroyPremise(selectedPremise.premise.id)}>Confirm</Button>
          </Modal.Footer>
        </Modal>
        }

      </div>
    )
  }
}


ArgumentTree.propTypes = {
  argument: PropTypes.object.isRequired,
  tree: PropTypes.array
}

ArgumentTree.defaultProps = {
  tree: []
}
