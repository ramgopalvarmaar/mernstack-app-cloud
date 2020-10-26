import "../styles/App.css";

import React, { useState } from "react";
import Header from './HeaderComponent';
import { Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {GoogleLogin} from 'react-google-login';
import store from "../store";
import SideBar from './SideBar';

import { refreshTokenSetup } from '../utils/refreshToken';

const clientId= "365890450292-2cpvutu0t85nbale2sdhqp87r949ifv7.apps.googleusercontent.com";


function App() {
  
  const [menuItem, setActiveMenu] = useState("notes");
  const [modal, setModal] = useState(true);

  const toggle = () => setModal(!modal);

  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    refreshTokenSetup(res);
    store.dispatch({
      type: "USER_LOGIN",
      payload: {userEmail:res.profileObj.email,name:res.profileObj.name,imageUrl:res.profileObj.imageUrl}
    });
    createUser(res);
    toggle();
  };

  function createUser(userDetails) {
    console.log("Creating user in DB ");
    console.log(userDetails.profileObj.name);
    console.log(userDetails.profileObj.imageUrl);
    
    fetch('/create-new-user', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userid: userDetails.profileObj.name, 
        userImg: userDetails.profileObj.imageUrl
      }) 
    }).then(function(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;})
    .then(response => {console.log("user creation in DB is successfull")})
    .catch(error => console.log("user creation failed"));
  }

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  };

  return (
    <div id="outer-container">
      <Header menuItem={menuItem}/>
      <SideBar setActiveMenu={setActiveMenu}/>
      <Modal isOpen={modal} toggle={toggle} backdrop={false} keyboard={false} fade={false}>
        <ModalHeader>Login with Google</ModalHeader>
        <ModalBody>
          Please Click the below button to login using your Google Credentials
        </ModalBody>
        <ModalFooter>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          style={{ marginTop: '100px' }}
          isSignedIn={true}
          scope={'https://www.googleapis.com/auth/calendar.readonly'}
        />
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;