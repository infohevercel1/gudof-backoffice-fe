import React, { useState } from 'react';
import {TreeView, TreeItem } from '@material-ui/lab';
import { Button } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, ChevronRight as ChevronRightIcon} from '@material-ui/icons';

const Tree = ({code, onChange}) => {
    let [treeCode, setTreeCode] = useState(code)

    const onInputChange = (key, property, e) => {
        treeCode.properties[key][property]=e.target.value
        setTreeCode(treeCode)
        onChange(treeCode)
    } 

    const list = (code) => {
        return Object.keys(code).map(key => {
            return (
              <TreeItem nodeId={key} label={key} key={key}>
                {Object.keys(code[key]).map((property) => {
                  return (
                    <div key={property} style={{display: 'flex'}}>
                        <p>{property}</p>
                        <input 
                            type="text" 
                            onChange={(e) => onInputChange(key, property, e)} 
                            defaultValue={code[key][property]}
                        />
                    </div>
                  );
                })}
              </TreeItem>
            );
        })
    }

    return (
        <>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                {list(code.properties)}
            </TreeView>
        </>
    )
}

export default Tree;