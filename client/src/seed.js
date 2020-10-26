import shortid from "shortid";

export default store => {
  console.log("Insert first list");
  const firstListId = shortid.generate();

  store.dispatch({
    type: "ADD_LIST",
    payload: { listId: firstListId, listTitle: "Create your notes" }
  });

  store.dispatch({
    type: "ADD_CARD",
    payload: {
      listId: firstListId,
      cardId: shortid.generate(),
      cardText: "First card"
    }
  });

  store.dispatch({
    type: "ADD_CARD",
    payload: {
      listId: firstListId,
      cardId: shortid.generate(),
      cardText: "Second card"
    }
  });

  store.dispatch({
    type: "LINKS_ADD_LIST",
    payload: { listId: firstListId, listTitle: "Create your notes" }
  });

  store.dispatch({
    type: "LINKS_ADD_CARD",
    payload: {
      listId: firstListId,
      cardId: shortid.generate(),
      cardText: "First Link"
    }
  });

  store.dispatch({
    type: "LINKS_ADD_CARD",
    payload: {
      listId: firstListId,
      cardId: shortid.generate(),
      cardText: "Second Link"
    }
  });

  store.dispatch({
    type:"USER_LOGIN",
    payload:{
      userEmail:"",
      name:"",
      imageUrl:"https://www.w3schools.com/howto/img_avatar2.png"
    }
  });

};
