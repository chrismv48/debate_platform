import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {stratify, tree} from 'd3-hierarchy'
import * as d3 from "d3";
import _ from 'underscore'


export default class ArgumentTree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      argument: this.props.argument,
      premiseHovered: null,
      hiddenPremises: {},
      tree: this.props.tree[1]
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
    if (_.has(this.state.hiddenPremises, nodeId)) {
      const newHiddenPremises = _.omit(this.state.hiddenPremises, nodeId)
      this.setState({hiddenPremises: newHiddenPremises})
    }
    else {
      const subTreeIds = this.getSubTree(nodeId)
      if (subTreeIds) {
        let newHiddenPremises = {...this.state.hiddenPremises}
        newHiddenPremises[nodeId] = subTreeIds
        this.setState({hiddenPremises: newHiddenPremises})
      }
    }
  }

  render() {
    const nodeHeight = 50
    const nodeWidth = 180
    const hiddenPremises = _.flatten(_.values(this.state.hiddenPremises))
    const root = d3.stratify()
      .id((d) => d.premise.id)
      .parentId(d => d.connection ? d.connection.parent_premise_id : null)
      (this.state.tree);

    const treeLayout = d3.tree();
    treeLayout.size([950,450])
    const tree = treeLayout(root)
    let nodesList = tree.descendants();
    nodesList[0].y += 10
    let linksList = tree.links()
    const lineLink = d3.linkVertical()
      .x(d => d[0])
      .y(d => d[1]);

    /* render the nodes */
    const nodes = nodesList.map(node => {
      return (
        <g key={node.data.premise.id} className="node"
           transform={`translate(${node.x}, ${node.y})`}
           fill={this.state.premiseHovered === node.data.premise.id ? "yellow" : "grey"}
           onMouseEnter={(event) => this.setState({premiseHovered: node.data.premise.id})}
           onMouseLeave={() => this.setState({premiseHovered: null})}
           onClick={() => this.toggleSubTreeVisibility(node.data.premise.id)}
           visibility={hiddenPremises.includes(node.data.premise.id) ? "hidden" : "visible"}
        >
          <rect id={node.data.premise.id}
                width={nodeWidth}
                height={nodeHeight}
                strokeWidth="1"
                fillOpacity={0.1}
                stroke="black"
          />
          <text x={nodeWidth / 2} y={nodeHeight / 2} textAnchor="middle" fill="black">{node.data.premise.name}</text>
        </g>
      );
    });

    /* render the links */
    const links = linksList.map((link, i) => {
      const modifiedLinkCoordinates = {
        source: [link.source.x + nodeWidth / 2, link.source.y + nodeHeight],
        target: [link.target.x + nodeWidth / 2, link.target.y]
      }
      return (
        <path key={i}
              className="link" d={lineLink(modifiedLinkCoordinates)}
              visibility={hiddenPremises.includes(link.target.data.premise.id) ? "hidden" : "visible"}
        />
      );
    });

    return (
      <svg width="1000" height="1000">
        <g>
          {links}
          {nodes}
        </g>
      </svg>
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
