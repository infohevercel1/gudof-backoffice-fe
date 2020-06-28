import React, { Component } from 'react';
import axios from 'axios';
import './Categories.css';

// import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails
} from "@material-ui/core";
import {ExpandMore } from "@material-ui/icons";

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
            rootCategories: []
        }
        // this.list = this.list.bind(this)
    }

    async componentDidMount () {
        const {data} = await axios.get("https://infohebackoffice.herokuapp.com/categories")
        let rootCategories = [], categories = data;
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].parent_id === null) {
                rootCategories.push(categories[i]._id);
            }
            let parent_id = categories[i]._id
            categories[i].children = []                     // Can be done on the back-end while data addition itself
            for(var j = 0; j < categories.length; j++) {
                if(categories[j].parent_id === parent_id) {
                    categories[i].children.push(categories[j]._id)
                }
            }
        }
        this.setState({ rootCategories, categories });
    }
    
    getCategory = (id) => {
        const category = this.state.categories.filter(cat => cat._id === id)
        if (category.length === 0) {
            return ""
        } else {
            return category[0]
        }
    }

    renderCategory = (category_id) => {
        const {name, children} = this.getCategory(category_id)
        let hasChildren = true;
        if(children.length === 0) {
            hasChildren=false;
        }
        return (
            <CustomList name={name} hasChildren={hasChildren} key={Math.random()*10}>
                {children.map(id => {
                        return this.renderCategory(id)
                    })}
            </CustomList>
            // <li key={Math.random()*10}>
            //     {name}
            //     <ul className="list-of-categories">
                    
            //     </ul>
            // </li>
        )
    }

    render() {
        return (
          <div className="Categories">
            <header className="Categories-header">
              <div style={{width: '50%', marginLeft: '10%', marginBottom: '1%'}}>
                {this.state.rootCategories.map((category) => {
                    return this.renderCategory(category);
                })}
              </div>
              <Button variant="contained" color="primary">
                Create New Category
              </Button>
            </header>
          </div>
        );
    }
}

export default Categories;
