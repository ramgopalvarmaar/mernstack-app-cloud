import "../styles/Board.css";

import React, { useState, useEffect } from "react";
import Skeleton from '@yisheng90/react-loading';
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  store  from "../../../store"
import { useSelector } from "react-redux";
import Lottie from 'react-lottie';
import animationData from '../../notes/styles/tick-pop3.json';
import erroranimationData from '../../notes/styles/error-message';
import ReactDOM from 'react-dom';

const defaultOptions = {
   loop: 0,
   autoplay: true,
   animationData: animationData,
   rendererSettings: {
     preserveAspectRatio: "xMidYMid slice"
   }
};

const errorOptions = {
   loop: 0,
   autoplay: true,
   animationData: erroranimationData,
   rendererSettings: {
     preserveAspectRatio: "xMidYMid slice"
   }
};

export function SuccessIcon() {
  return <Lottie style={{marginRight: "0%"}} options={defaultOptions} height={55} width={55} />;
}

export function ErrorIcon() {
  return <Lottie style={{marginRight: "0%"}} options={errorOptions} height={55} width={55} />;
} 

const Board = (props) => {

  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const cards = useSelector(state => state.cardsById);

  function sharedCard(link, divIndex){
    console.log(divIndex);
    fetch('/create-link', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
          },
          body: JSON.stringify({linkTitle: link.link.linkTitle, 
            linkUrl: link.link.linkUrl, isShared: true, 
            teamName: store.getState().teamName.teamName.teamName,
            userId : store.getState().userProfile.userProf.name,
            userImg : store.getState().userProfile.userProf.imageUrl
          })   
        }).then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((responseJson) => {
          let conffetti = divIndex.index+"confetti";
          ReactDOM.render(<SuccessIcon />, document.getElementById(conffetti));
          console.log("Successfully shared links "+responseJson )
        })
        .catch((error) => {
          let errorId = divIndex.index+"confetti";
          ReactDOM.render(<ErrorIcon />, document.getElementById(errorId));
          console.log("error while sharing links "+error)
        });

  };


  useEffect(() => {
    console.log("cardsById from store");
    console.log(Object.keys(cards).length);
    setIsLoading(true);
    fetch('/fetch-user-saved-links/'+store.getState().userProfile.userProf.name)
    .then(res => res.text())
    .then(res => {
      let linksObj = JSON.parse(res);
      console.log(linksObj);
      setLinks(linksObj);
      setIsLoading(false);
    }).catch((error)=> console.log(error));
  }, [cards]);
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
      <div className="work-div">
      {links.map((link, index) => 
        <div className="card work-card">
            {link.linkUrl}
            {link.isShared ? 
              <div style={{float: 'right'}}>
              <Lottie style={{marginRight: "0%"}} options={defaultOptions} height={55} width={55} />
              </div>
              :
              <div id={index+"confetti"} style={{float: 'right'}}>
              <FontAwesomeIcon id={index+"shareIcon"} icon={faShareAlt} onClick={() => sharedCard({link},{index})}
                style={{color:'#007bff', fontSize:'30px', marginRight: '15px'}}/>
              </div>
              }
        </div>
        )}
      </div>
    )}
    </div>
    </div>
  )
}

export default Board;
