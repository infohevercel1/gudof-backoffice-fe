import React from 'react';
import { Input } from 'antd';

const Search = ({ selectPrevMatch, selectNextMatch, searchParams, inputChange}) => {
    let { searchFocusIndex, searchString, searchFoundCount } = searchParams;
    return (
        <form
            style={{ display: 'flex', width: '60%' }}
            onSubmit={event => {
                event.preventDefault();
            }}
        >
            <Input
                id="find-box"
                type="text"
                placeholder="Search..."
                value={searchString}
                onChange={inputChange}
            />
            <button
                type="button"
                disabled={!searchFoundCount}
                onClick={selectPrevMatch}
            >
                &lt;
            </button>
            <button
                type="submit"
                disabled={!searchFoundCount}
                onClick={selectNextMatch}
            >
                &gt;
            </button>
            <span>
                &nbsp;
                {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
                &nbsp;/&nbsp;
                {searchFoundCount || 0}
            </span>
        </form>
    )
}

export default Search;