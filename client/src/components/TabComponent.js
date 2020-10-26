import React, { useState, useEffect } from 'react';
import { Button,Modal,TabContent, TabPane, Nav, NavItem, NavLink,Row, Col,ModalHeader, ModalBody, 
  ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import classnames from 'classnames';
import PersonalContent from "./notes/PersonalContent"
import PersonalLink from "./links/PersonalLink"
import OrganizationContent from "./notes/OrganizationContent"
import OrganizationLink from "./links/OrganizationLink"
import VoiceNotes from './voice-notes/VoiceNotes';
import WorkVoiceNotes from './voice-notes/WorkVoiceNotes';
import Calendar from './CalenderComponent';
import store from "../store";
import Calender from './CalenderComponent';

const Tab = (props) => {
  let user = store.getState().userProfile;
  //const userid = store.getState().userProfile.userProf.name;
  const userid = (undefined !== user)?user.userProf.name:"";

  const [activeTab, setActiveTab] = useState('1');
  const [teamName, setTeamName] = useState(callGetTeamName());
  const [workTabTitle, setWorkTabTitle] = useState('Work');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tabEnabled, setTabEnabled] = useState(true);
  const toggleDropDown = () => setDropdownOpen(prevState => !prevState);
 
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const toggle = tab => {
    if(activeTab !== tab) {
      if(tab === '2'){
        callGetTeamName();
        console.log("teamName "+teamName);
        if(teamName == undefined || teamName == ""){
          setWorkTabTitle("Join a team");
          console.log("No teams are assoiciated to your account");
          //opening modal to select your team
          toggleModal();
        }else{
          setActiveTab(tab);
          setWorkTabTitle("Work "+"("+teamName+")");
        }
      }else{
        setActiveTab(tab);
      }
    }
  }

  function callGetTeamName() {
    fetch('/teams/'+userid)
    .then(function(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;})
    .then(res => res.text())
    .then(res => {
      let data = JSON.parse(res);
      if(data.teams !== undefined){
        console.log(data.teams[0])
        setTeamName(data.teams[0]);
        setWorkTabTitle("Work "+"("+data.teams[0]+")");
        storeTeamName(data.teams[0]);
      } 
    })
    .catch(error => console.log("callGetTeamName failed"));
  }

  function storeTeamName(team){
    store.dispatch({
      type: "GET_TEAM",
      payload: {teamName:team}
    });
  }

  function addToTeam(team) {
   fetch('/teams/'+userid+'/'+team)
   .then(function(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;})
   .then(res => console.log("Successfully added to the team "+team))
   .catch(error => console.log("Adding to team failed")); 
   callGetTeamName(userid);
    toggleModal();
    setWorkTabTitle("Work "+"("+team+")");
  }

  let activeMenu = props.activeMenu;
  
  useEffect(() => {
    if(props.activeMenu === "calendar"
    || props.activeMenu === "to-do"){
      setTabEnabled(false);
      console.log("tabEnabled "+tabEnabled);
    }else{
      setTabEnabled(true);
    }
  }, [props.activeMenu]);
  

  return (
    <div>
      <Nav tabs justified>
        <NavItem aria-expanded>
          <NavLink 
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
            style={{fontWeight: "bold"}}
          >
            Personal
          </NavLink>
        </NavItem>
        {tabEnabled &&
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
            style={{fontWeight: "bold"}}
          >
            {workTabTitle}
          </NavLink>
        </NavItem>}
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
          <div style={{ width: "100%", marginLeft:"3%"}}>
          {activeMenu === "notes" && <PersonalContent/>}
          {activeMenu === "voice-notes" && <VoiceNotes />}
          {activeMenu === "reminder" && <h1> Personal Reminders here </h1>}
          {activeMenu === "to-do" && <h1> Personal To-Do here </h1>}
          {activeMenu === "calendar" && <Calender />}
          {activeMenu === "links" && <PersonalLink/>}
          </div>
          </Row>
        </TabPane>
        <TabPane tabId="2" >
          <Row>
          <div style={{ width: "100%", marginLeft:"3%"}}>
          {activeMenu === "notes" && <OrganizationContent activeTab={activeTab}/>}
          {activeMenu === "voice-notes" && <WorkVoiceNotes activeTab={activeTab}/>}
          {activeMenu === "reminder" && <h1> Work Reminders here </h1>}
          {activeMenu === "to-do" && <h1> Work To-Do here </h1>}
          {activeMenu === "calendar" && <Calender />}
          {activeMenu === "links" && <OrganizationLink activeTab={activeTab}/>}
          </div>
          </Row>
        </TabPane>
      </TabContent>
      

      <Modal isOpen={modal} toggle={toggleModal} backdrop="static">
        <ModalHeader toggle={toggleModal}>Your Teams</ModalHeader>
        <ModalBody style={{ textAlign: 'Center' }}>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropDown}>
            <DropdownToggle caret>
              Select your team
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => addToTeam("Expedia")}>Expedia</DropdownItem>
              <DropdownItem divider/>
              <DropdownItem onClick={() => addToTeam("IBS")}>IBS</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>


    </div>
  );
}

export default Tab;