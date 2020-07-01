import React, { Component } from 'react';
import axios from 'axios';
import './Categories.css';
// after
import SortableTree from 'react-sortable-tree';
import { getTreeFromFlatData } from 'react-sortable-tree'
import "react-sortable-tree/style.css";
// import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails
} from "@material-ui/core";
import {ExpandMore, Sort } from "@material-ui/icons";

// const useStyles = makeStyles((theme) => ({
//     root: {
//         width: "50%",
//     },
//     heading: {
//         fontSize: theme.typography.pxToRem(15),
//         fontWeight: theme.typography.fontWeightRegular,
//     },
// }));

function CustomList ({name, children, hasChildren}) {
    const expandIcon = hasChildren ? (<ExpandMore />) : null
    return (
        <ExpansionPanel style={{width: '80%'}} key={Math.random()*10}>
        <ExpansionPanelSummary
          expandIcon={expandIcon}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
            {name}
            {/* <Button variant="contained" color="primary">+</Button> */}
        </ExpansionPanelSummary>
        {hasChildren ? <ExpansionPanelDetails style={{display: 'flex', flexDirection: 'column'}}>
            {children}
        </ExpansionPanelDetails> : null}
      </ExpansionPanel>
    );
}

// const classes = useStyles();
class Categories extends Component {
    constructor(props) {
        super(props)
        this.state = {
          categories: [],
        };
        // this.list = this.list.bind(this)
    }

    async componentDidMount () {
        const {data} = await axios.get("https://infohebackoffice.herokuapp.com/categories")
        let categories = data;
        for (var i = 0; i < categories.length; i++) {
            categories[i].title = categories[i].name
        }

        function getKey(node) {
          return node._id;
        }

        function getParentKey(node) {
          return node.parent_id
        }

        const tree = getTreeFromFlatData({flatData: categories, getKey, getParentKey, rootKey: null})
        console.log(tree)

        categories = tree; //populate this from API.
        this.setState({ categories });
    }

    render() {
        return (
          <div className="Categories">
            {/* <header className="Categories-header"> */}
              <Button variant="contained" color="primary">
                Create New Category
              </Button>
              <SortableTree
                treeData={this.state.categories}
                onChange={(treeData) => this.setState({ categories: treeData })}
              />
            {/* </header> */}
          </div>
          // generateNodeProps={({ node, path }) => ({
          //   buttons: [
          //     <button
          //       onClick={() =>
          //         this.setState((state) => ({
          //           treeData: addNodeUnderParent({
          //             treeData: state.treeData,
          //             parentKey: path[path.length - 1],
          //             expandParent: true,
          //             getNodeKey,
          //             newNode: {
          //               title: `${getRandomName()} ${
          //                 node.title.split(" ")[0]
          //               }sson`,
          //             },
          //             addAsFirstChild: state.addAsFirstChild,
          //           }).treeData,
          //         }))
          //       }
          //     >
          //       Add Child
          //     </button>,
          //     <button
          //       onClick={() =>
          //         this.setState((state) => ({
          //           treeData: removeNodeAtPath({
          //             treeData: state.treeData,
          //             path,
          //             getNodeKey,
          //           }),
          //         }))
          //       }
          //     >
          //       Remove
          //     </button>,
          //   ],
          // })}
        );
    }
}

export default Categories;
