import "../styles/Card.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import CardEditor from "./CardEditor";
import  store  from "../../../store"
import CommonMessage from '../../CommonMessage';

class Card extends Component {
  constructor(props) {
    super(props);
  this.state = {
    hover: false,
    editing: false,
    sharing:false,
    message_type:'',
    message_text:''
  };
}

  startHover = () => this.setState({ hover: true });
  endHover = () => this.setState({ hover: false });

  startEditing = () =>
    this.setState({
      hover: false,
      editing: true,
      sharing:false,
      text: this.props.card.text
    });

  endEditing = () => this.setState({ hover: false, editing: false });

  editCard = async text => {
    const { card, dispatch } = this.props;

    this.endEditing();

    dispatch({
      type: "CHANGE_CARD_TEXT",
      payload: { cardId: card._id, cardText: text }
    });
  };
 
  endSharing = () => this.setState({ hover: true, sharing: false });
  shareCard =  async text => {  // We cac call Share API call here
   
   
    const { card, dispatch,alert_mesaage } = this.props;

   
    await fetch('/create-note', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({noteTitle: card._id, 
        noteDesc: card.text, isShared: true, 
        teamName: store.getState().teamName.teamName.teamName,
        userId : store.getState().userProfile.userProf.name,
        userImg : store.getState().userProfile.userProf.imageUrl
      })   
    }).then( json => {
      this.setState({message_type:"success",message_text:card.text+"  Shared successfully"});
    })
    .catch((error) => {
      this.setState({message_type:"error",message_text:"Error occured in shared functionality"});
    });
    
    this.endSharing();
  };

  saveCard =  async () => {  // We cac call Share API call here
    const { listId, card, dispatch } = this.props;
    
    await fetch('/create-user-note', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {noteTitle: card._id, 
        noteDesc: card.text, 
        isShared: false, 
        userId : store.getState().userProfile.userProf.name,
        })   
    }).then( json => {
      this.setState({message_type:"success",message_text:"Saved successfully"});
    })
    .catch((error) => {
      this.setState({message_type:"error",message_text:"Error occured in while saving notes"});
    });
    this.endSharing();
    dispatch({
      type: "DELETE_CARD",
      payload: { cardId: card._id, listId }
    });
  };

  deleteCard = async () => {
    const { listId, card, dispatch } = this.props;

    dispatch({
      type: "DELETE_CARD",
      payload: { cardId: card._id, listId }
    });
  };


  render() {
    const { card, index } = this.props;
    const { hover, editing,sharing,message_type,message_text } = this.state;

    if ((!editing && !sharing) ||(!editing && sharing)) {
      return (
        <Draggable draggableId={card._id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="Card"
              onMouseEnter={this.startHover}
              onMouseLeave={this.endHover}
            > 
            
              {hover && (
                <div className="Card-Icons">
                  <div className="Card-Icon" onClick={this.startEditing}>
                    <ion-icon name="create" /> </div>
                    <div className="Card-Icon" onClick={this.shareCard}>
                    <ion-icon name="share" /> </div>
                    <div className="Card-Icon" onClick={this.saveCard}>
                    <ion-icon name="save" /> </div>
                  </div>
              )}
      
      {message_type!=""?<CommonMessage messageText={message_text} messagetype={message_type}/>:null}
              {card.text}
            </div>
          )}
        </Draggable>
      );
    } 
     if(!sharing && editing)
     {
      return (
        <CardEditor
          text={card.text}
          onSave={this.editCard}
          onDelete={this.deleteCard}
          onCancel={this.endEditing}
        />
      );
    }
  }

}

const mapStateToProps = (state, ownProps) => ({
  card: state.cardsById[ownProps.cardId]
});

export default connect(mapStateToProps)(Card);
