import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {stratify, tree} from 'd3-hierarchy'
import * as d3 from "d3";

let testData = [
  {id: 1, parentId: null, title: 'Marijuana should be legal'},
  {id: 2, parentId: 1, title: 'MJ is good for you'},
  {id: 3, parentId: 1, title: 'MJ is good for the economy'},
  {id: 4, parentId: 2, title: "MJ doesn't cause cancer"},
  {id: 5, parentId: 2, title: "MJ will raise tax revenue osijsdo over flow yeah owooo"}
]

export default class ArgumentTree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      argument: this.props.argument,
      premiseHovered: null
    };
  }


  render() {
    const nodeHeight = 50
    const nodeWidth = 180
    const root = stratify()(testData)
    const treeLayout = d3.tree();
    treeLayout.size([950,450])
    const tree = treeLayout(root)
    const nodesList = tree.descendants().reverse();
    console.log(nodesList)
    let linksList = tree.links()
    const lineLink = d3.linkVertical()
      .x(d => d[0])
      .y(d => d[1]);

    /* render the nodes */
    const nodes = nodesList.map(node => {
      return (
        <g key={node.id} className="node"
           transform={`translate(${node.x}, ${node.y})`}
           fill={this.state.premiseHovered == node.id ? "yellow" : "grey"}
           onMouseEnter={(event) => this.setState({premiseHovered: node.id})}
           onMouseLeave={() => this.setState({premiseHovered: null})}
        >
          <rect id={node.id}
                width={nodeWidth}
                height={nodeHeight}
                strokeWidth="1"
                fillOpacity={0.1}
                stroke="black"
          />
          <text x={nodeWidth / 2} y={nodeHeight / 2} textAnchor="middle" fill="black">{node.data.title}</text>
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
        <path key={i} className="link" d={lineLink(modifiedLinkCoordinates)}/>
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
