import React, {useEffect, useState} from 'react';
import ListItems from './TodoItems'
import  store  from "../../store"
import {func} from "prop-types";

function TODO(props) {
 
  const[items, setItems] = useState([]);
  const[currentItem, setCurrentItem] = useState({currentItem: {
      toDoItem:'',
      doByDateTime:''
  }});

  useEffect(() => {
    fetchToDos()
  }, [setItems]);

  function fetchToDos() {
    fetch('/fetch-user-todos/'+store.getState().userProfile.userProf.name).then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;}).then(res => res.text())
        .then(res => {
          console.log("fetching todo for personal");
          console.log(JSON.parse(res));
          setItems(JSON.parse(res));
          let responeObj = JSON.parse(res);
          responeObj.forEach(data => {
            console.log("fetching todo for personal");
            console.log(data);

          });
        }).catch(console.log("No todo saved by user"))
  }
 
  function saveItem () {
    let newItem = currentItem;
    console.log(`item to save ${JSON.stringify(currentItem)}`)
    fetch('/create-todo', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userid : store.getState().userProfile.userProf.name,
        toDoItem: currentItem.currentItem.toDoItem,
        doByDateTime: currentItem.currentItem.doByDateTime
      })
      })
      .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;})
      .then(response => response.json())
      .then(success => {
        fetchToDos()
        console.log("saved todo successfully");
      })
      .catch(error => {console.log(error);}
    );
    console.log(newItem);
  }

  const handleInput = e =>{
    console.log("handleInput");
    console.log(e);
    setCurrentItem({
      currentItem:{
        toDoItem: e.target.value,
        doByDateTime: currentItem.currentItem.date,
      }
    })
  }

  const handleInputDate = e => {
    console.log("handleInputDate");
    console.log(e);
    setCurrentItem({
      currentItem:{
      toDoItem: currentItem.currentItem.toDoItem,
      doByDateTime: e.target.value,
    }})
  }
  
  function deleteItem(key){
    fetch(`/todo/${key}`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
         'Content-Type': 'application/json'
      }
    }).then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }).then(response => response.json())
    .then(success => {
      fetchToDos()
      console.log("saved todo successfully");
    })
    .catch(error => {console.log(error);}
    );
  }
  
  function setUpdate(text,key){
    console.log("items:"+items);
    items.map(item => {      
      if(item.key===key){
        console.log(item.key +"    "+key)
        item.text= text;
      }
    })
    setItems(items);
  }
  
  return (
    <div className="className='card work-card loading'"  style={{textAlign: 'center'}}>
      <h1>Plans for the Day</h1>
      <header>
        
          <input type="text" placeholder="Enter task" value= {currentItem.toDoItem} onChange={handleInput}></input>
          <input type="date" placeholder="Choose Date" min={new Date().toISOString().split('T')[0]} value= {currentItem.doByDateTime} onChange={handleInputDate}></input>
          <button onClick={() => saveItem()}>Add</button>
        <p>{items.text}</p>
        
          <ListItems items={items} deleteItem={deleteItem} setUpdate={setUpdate}/>
        
      </header>
    </div>
  );
}


export default TODO;
