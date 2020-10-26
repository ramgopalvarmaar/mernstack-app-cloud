
import React, { Component } from "react";
export default class CommonMessage extends Component
{
    state = {
        messageText: this.props.messageText || "",
        messagetype:this.props.messagetype || "",
      };
    render()
    {  
        
       switch (this.state.messagetype) 
       {
            case 'success':
            return( 
            <div class="alert alert-success" role="alert"  aria-label="Close"  >
               {this.state.messageText}
          </div>
            );
            case 'error':
            return( 
                <div class="alert alert-danger  " role="alert"  aria-label="Close"  >
                   {this.state.messageText}
              </div>
                );
            case '':
            return(<div></div>);
             
          }
        
        
    }
}
