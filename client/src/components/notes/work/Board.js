import "../styles/Board.css";

import React, { useState, useEffect } from "react";
import Skeleton from '@yisheng90/react-loading';
import  store  from "../../../store"

const Board = (props) => {

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);

  const handleChange = e => {
    setSearchTerm(e.target.value);
  };
  
  useEffect(() => {
    const results = notes.filter(note =>
      note.noteDesc.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
    console.log(results);
  }, [searchTerm]);

  useEffect(() => {
    setIsLoading(true);
    let team = store.getState().teamName.teamName;
    console.log("fetch-team-notes");
    console.log(team);
    let url = "/fetch-team-notes/"+ (team !== undefined ? team.teamName :"");
    console.log(url);
    fetch(url)
    .then(res => res.text())
    .then(res => {
      let notesObj = JSON.parse(res);
      setNotes(notesObj);
      setSearchResults(notesObj);
      setIsLoading(false);
    }).then( json => {
      console.log("Successfully fetched notes")
    })
    .catch((error) => {
      console.log("error while fetching notes")
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
      <input type="text" name="search" value={searchTerm} onChange={handleChange} placeholder="Search notes.."/>
      </div>
      <div className="work-div">
      {searchResults.map(note => 
        <div className="card work-card">
          <div>
            {note.noteDesc}
            <img id="Avatar" alt="User Image" className="work-notes-img" src={note.sharedByUserImg}/>
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
