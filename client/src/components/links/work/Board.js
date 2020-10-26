import "../styles/Board.css";

import React, { useState, useEffect } from "react";
import Skeleton from '@yisheng90/react-loading';
import  store  from "../../../store"

const Board = (props) => {

  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);

  const handleChange = e => {
    setSearchTerm(e.target.value);
  };
  
  useEffect(() => {
    const results = links.filter(link =>
      link.linkUrl.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
    console.log(results);
  }, [searchTerm]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/fetch-team-links/${store.getState().teamName.teamName.teamName}`)
    .then(res => res.text())
    .then(res => {
      let linksObj = JSON.parse(res);
      setLinks(linksObj);
      setSearchResults(linksObj);
      setIsLoading(false);
    }).then( json => {
      console.log("Successfully shared links")
    })
    .catch((error) => {
      console.log("error while sharing links")
    });
  }, [props.activeTab]);
  //{isLoading && <Skeleton width={250} row={6} />}
  return (  
  <div>
    <div>
    {isLoading && (
       <div className="work-div">
          <div className="card work-card loading">
           <Skeleton row={1} />
          </div>
          <div className="card work-card loading">
           <Skeleton row={1} />
          </div>
          <div className="card work-card loading">
           <Skeleton row={1} />
          </div>
          <div className="card work-card loading">
           <Skeleton row={1} />
          </div>
          <div className="card work-card loading">
           <Skeleton row={1} isLoading={!isLoading} />
          </div>
        </div>
    )}
    </div>
    <div>
    {!isLoading && (
      <div>
      <div className="form search">
      <input type="text" name="search" value={searchTerm} onChange={handleChange} placeholder="Search links.."/>
      </div>
      <div className="work-div">
      {searchResults.map(link => 
        <div className="card work-card">
          <div>
            {link.linkUrl}
            <img id="Avatar" alt="User Image" className="work-notes-img" src={link.sharedByUserImg}/>
          </div>
        </div>
        )}
      </div>
      </div>
    )}
    </div>
    </div>
  )
}

export default Board;
