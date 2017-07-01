import React, {Component} from 'react'
import PropTypes from 'prop-types'

import EditNewPremise from '../components/edit_new_premise'

import {stratify, tree} from 'd3-hierarchy'
import * as d3 from "d3";
import _ from 'underscore'
import {Modal} from 'react-bootstrap'

const NODE_HEIGHT = 50
const NODE_WIDTH = 180
const TREE_LAYOUT_WIDTH = 850
const TREE_LAYOUT_HEIGHT = 450
const SVG_LAYOUT_WIDTH = 900
const SVG_LAYOUT_HEIGHT = 500
const ROOT_NODE_MARGIN = 10

export default class ArgumentTree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      argument: this.props.argument,
      premiseHovered: null,
      hiddenPremises: {},
      tree: this.props.tree[1],
      showModal: false,
      selectedPremise: null
    }
  }

  getSubTree(rootId) {
    let children = []
    let queue = [rootId]
    while (queue.length > 0) {
      let currentNode = queue.pop()
      let nodeChildren = this.state.tree.filter(node => (node.connection ? node.connection.parent_premise_id : null) === currentNode)
      let nodeChildrenIds = _.map(nodeChildren, node => node.premise.id)
      children = children.concat(nodeChildrenIds)
      queue = queue.concat(nodeChildrenIds)
    }
    return _.isEmpty(children) ? null : children
  }

  toggleSubTreeVisibility(nodeId) {
    const {hiddenPremises} = this.state

    if (_.has(hiddenPremises, nodeId)) {
      const newHiddenPremises = _.omit(hiddenPremises, nodeId)
      console.log(newHiddenPremises)
      this.setState({hiddenPremises: newHiddenPremises})
    }
    else {
      const subTreeIds = this.getSubTree(nodeId)
      if (subTreeIds) {
        let newHiddenPremises = {...hiddenPremises}
        newHiddenPremises[nodeId] = subTreeIds
        this.setState({hiddenPremises: newHiddenPremises})
      }
    }
  }

  handleModifyPremise(premiseId) {
    this.setState({showModal: true})
    this.setState({selectedPremise: _.find(this.state.tree, (node) => node.premise.id === premiseId).premise})
  }

  generateRoot() {
    let {tree} = this.state

    return d3.stratify()
      .id((d) => d.premise.id)
      .parentId(d => d.connection ? d.connection.parent_premise_id : null)
      (tree);
  }

  generateTreeNodes(nodes) {
    return nodes.map(node => {
      const premiseId = node.data.premise.id
      const premiseName = node.data.premise.name
      const {premiseHovered} = this.state
      return (
        <g key={premiseId} className="node"
           transform={`translate(${node.x}, ${node.y})`}
           fill={premiseHovered === premiseId ? "yellow" : "grey"}
           onMouseEnter={(event) => this.setState({premiseHovered: premiseId})}
           onMouseLeave={() => this.setState({premiseHovered: null})}
           onClick={() => this.toggleSubTreeVisibility(premiseId)}
           visibility={this.getHiddenPremises().includes(premiseId) ? "hidden" : "visible"}
        >
          <rect id={premiseId}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                strokeWidth="1"
                fillOpacity={0.1}
                stroke="black"
          />
          <text
            x={NODE_WIDTH / 2}
            y={NODE_HEIGHT / 2}
            textAnchor="middle"
            fill="black">{premiseName}
          </text>
          <foreignObject x={NODE_WIDTH - 50} y={NODE_HEIGHT - 20} width="45" height="20">
            <span onClick={() => this.handleModifyPremise(premiseId)}
                  style={{position: "static"}}
                  className="glyphicon glyphicon-plus"/>
            <span style={{position: "static"}} className="glyphicon glyphicon-pencil"/>
            <span style={{position: "static"}} className="glyphicon glyphicon-trash"/>
          </foreignObject>
        </g>
      );
    });

  }

  generateDivNodes(nodes) {
    return nodes.map(node => {
      return (
        <foreignObject x={node.x} y={node.y} width={NODE_WIDTH} height={NODE_HEIGHT}>
          <div style={{
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
            borderStyle: "solid",
            display: "inline-block"
          }}
          >
            {node.data.premise.name}
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
        source: [link.source.x + NODE_WIDTH / 2, link.source.y + NODE_HEIGHT],
        target: [link.target.x + NODE_WIDTH / 2, link.target.y]
      }
      return (
        <path key={i}
              className="link" d={lineLink(modifiedLinkCoordinates)}
              visibility={this.getHiddenPremises().includes(link.target.data.premise.id) ? "hidden" : "visible"}
        />
      );
    });

  }

  generateTree() {
    const root = this.generateRoot()
    let treeLayout = d3.tree();
    treeLayout.size([TREE_LAYOUT_WIDTH, TREE_LAYOUT_HEIGHT])
    const tree = treeLayout(root)
    let nodes = tree.descendants();
    nodes[0].y += ROOT_NODE_MARGIN
    const links = tree.links()

    const linkPaths = this.generateLinkPaths(links)
    const displayNodes = this.generateTreeNodes(nodes)

    return (
      <g>
        {linkPaths}
        {displayNodes}
      </g>
    )
  }

  render() {
    const {showModal, selectedPremise} = this.state
    return (
      <div>
        <svg height={SVG_LAYOUT_HEIGHT} width={SVG_LAYOUT_WIDTH}>
          {this.generateTree()}
        </svg>
        <Modal show={showModal} onHide={() => this.setState({showModal: false})}>
          <Modal.Header closeButton>
            <Modal.Title>Heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditNewPremise premise={selectedPremise}/>
          </Modal.Body>
        </Modal>
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
