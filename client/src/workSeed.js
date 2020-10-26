import shortid from "shortid";

export default store => {
  console.log("Insert first list");
  const firstListId = shortid.generate();

  fetchAndCreateNotes();

  function fetchAndCreateNotes() {
    console.log("Inside workseed.js")
    //fetching the notes from DB
    fetch('/api/notes')
    .then(res => res.text())
    .then(res => {
      let notesObj = JSON.parse(res);
      //looping over the notesobject
      notesObj.forEach((listData) => {
        store.dispatch({
          type: "ADD_WORK_CARD",
          payload: {
            listId: firstListId,
            cardId: listData.noteTitle,
            cardText: listData.noteDesc,
            cardImg : listData.sharedByUserImg
          }
        });
      })
    });
  }

  store.dispatch({
    type: "ADD_WORK_LIST",
    payload: { listId: firstListId, listTitle: "First list" }
  });
};
