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
    const treeLayout = d3.tree();
    treeLayout.size([950,450])
    // treeLayout.nodeSize([400, 200])
    const tree = treeLayout(root)
    const nodesList = tree.descendants().reverse();
    console.log(nodesList)
    let linksList = tree.links()//treeLayout.links(nodesList);
    console.log(linksList)
    const linksList2 = linksList.map(link => {
      return {source: [link.source.x + 100, link.source.y + 100],
      target: [link.target.x + 100, link.target.y]}
    })
    console.log(linksList2)
    const lineLink = d3.linkVertical()
      .x(function(d) { console.log(d); return d[0]; })
      .y(function(d) { return d[1]; });
      // .source((d) => )

    /* render the nodes */
    const nodes = nodesList.map(node => {
      return (
        <g key={node.id} className="node"
           transform={`translate(${node.x}, ${node.y})`}>
          <rect width="200" height="100" strokeWidth="1" fillOpacity={0.1} fill="grey" stroke="black"/>
          <text x="100" y="50" dy=".35em" textAnchor="middle"
                fillOpacity="0.5">{node.id}</text>
        </g>
      );
    });

    /* render the links */
    const links = linksList2.map((link, i) => {
      console.log(link)
      return (
        <path key={i} className="link"
              d={lineLink(link)}/>
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
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  argument: PropTypes.object.isRequired,
  tree: PropTypes.array
}

ArgumentTree.defaultProps = {
  tree: []
}
