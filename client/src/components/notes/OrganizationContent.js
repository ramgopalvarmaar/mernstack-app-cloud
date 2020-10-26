import React from 'react';
import Board from './work/Board';

function OrganizationContent(props) {
  return (
        <Board activeTab={props.activeTab}/>
  );
}

export default (OrganizationContent);
