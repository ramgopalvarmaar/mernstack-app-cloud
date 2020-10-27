import React, {useEffect} from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, CardHeader
} from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";

function ListItems(props){
    const itemArray = props.items.sort(function(a,b){
        return new Date(a.doByDateTime) - new Date(b.doByDateTime);
    });
    console.log("inside list items");
    console.log(itemArray);

return ( 
<div>
{itemArray.map(item =>
                   <div className="list" key={item._id}>
                       <Card body inverse color={calculateColor(item.doByDateTime)}>
                           <CardHeader tag="h3" className="text-left">{item.toDoItem}</CardHeader>
                           <CardBody>
                               <CardTitle className="text-left"><strong>{calculateRemainingDays(item.doByDateTime)}</strong> Days remaining</CardTitle>
                               <CardSubtitle className="text-left">To be done by {new Date(item.doByDateTime).toDateString()}</CardSubtitle>
                               <FontAwesomeIcon className="text-right" onClick={() => {props.deleteItem(item._id)}} icon={faTrashAlt}/>
                           </CardBody>
                       </Card>
                   </div>
// <div className="list" key={item._id}>
//      <p>
//          <input type="text" value={item.toDoItem} onChange={(e)=>{
//              props.setUpdate(e.target.value,item.toDoItem)}}/>
//         <input type="hidden" value={item.toDoItem}/>
//         <span>
//
//         <FontAwesomeIcon className="faicons" onClick={() => {
//             props.deleteItem(item._id)
//         }} icon={faTrashAlt} style={{marginLeft: "10px"}}/>
//         </span>
//      </p>
//
//     </div>
    )}
</div>
)
}

function calculateRemainingDays(dateString) {
    let date = new Date(dateString);
    let today = new Date();
    let diffInTime = date.getTime() - today.getTime();
    return Math.round(Math.abs((diffInTime / (1000 * 3600 * 24))));

}

function calculateColor(dateString) {
    let days = calculateRemainingDays(dateString);
    if(days < 3) {
        return "danger"
    }
    if (days < 6) {
        return "warning"
    }
    if (days < 10) {
        return "info"
    }
    return "success"
}
export default ListItems;
