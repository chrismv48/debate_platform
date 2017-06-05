import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {stratify, tree} from 'd3-hierarchy'
import * as d3 from "d3";

let testData = [
  {id: 1, parentId: null},
  {id: 2, parentId: 1},
  {id: 3, parentId: 1},
  {id: 4, parentId: 2},
  {id: 5, parentId: 2},
]

export default class ArgumentTree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      argument: this.props.argument,
    };
  }

  render() {
    const root = stratify()(testData)
    const treeLayout = d3.tree().size([860, 500]);
    const tree = treeLayout(root)
    const nodesList = tree.descendants().reverse();
    const linksList = tree.links()//treeLayout.links(nodesList);
    const lineLink = d3.linkVertical()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });

    /* render the nodes */
    const nodes = nodesList.map(node => {
      return (
        <g key={node.id} className="node"
           transform={`translate(${node.x}, ${node.y})`}>
          <circle r="10" fill="blue"/>
          <text y="-19" dy=".35em" textAnchor="middle"
                fillOpacity="0.5">{node.id}</text>
        </g>
      );
    });

    /* render the links */
    const links = linksList.map(link => {
      return (
        <path key={`${link.source.id}-${link.target.id}`} className="link"
              d={lineLink(link)}/>
      );
    });
    return (
      <svg width="960" height="600">
        <g>
          {links}
          {nodes}
        </g>
      </svg>
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
