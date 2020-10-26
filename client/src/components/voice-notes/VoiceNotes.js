import React, { useState, useEffect} from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import shortid from "shortid";
import  store  from "../../store"
import { faShareAlt, faCheckCircle, faSave} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Skeleton from '@yisheng90/react-loading';
import Lottie from 'react-lottie';
import animationData from './styles/tick-pop3';
import erroranimationData from './styles/error-message';
import ReactDOM from 'react-dom';

const recorder = new MicRecorder({
  bitRate: 128
});

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

const VoiceNotes = () => {

    const [buttonText, setButtonText] = useState('Start recording');
    const [buttonClass, setButtonClass] = useState('btn btn-primary');
    const [shareIcon, setShareIcon] = useState(faShareAlt);
    const [audioElements, setAudioElements] = useState([]);
    const [voiceNotes, setVoiceNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [saved, setSaved] = useState();

    function startRecording() {
      recorder.start().then(() => {
        setButtonText('Stop recording');
        setButtonClass('btn btn-primary btn-danger');
      }).catch((e) => {
        console.error(e);
      });
    }

    function stopRecording() {
      recorder.stop().getMp3().then(([buffer, blob]) => {
        let file = new File(buffer, 'music.mp3', {
          type: blob.type,
          lastModified: Date.now()
        });
        console.log("voice personal");
        let audioData = {"audio":URL.createObjectURL(file), "audioId":shortid.generate()}
        setAudioElements(audioElements => audioElements.concat(audioData))
        setButtonText('Start recording');
        setButtonClass('btn btn-primary');
      }).catch((e) => {
        console.error(e);
      });
    }

    function clickHandler(){
      if(buttonText === "Start recording"){
        startRecording();
      } else if (buttonText === "Stop recording"){
        stopRecording();
      }
    }

    useEffect(() => {
      setIsLoading(true);
      fetch('/fetch-user-voice-notes/'+store.getState().userProfile.userProf.name)
      .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;})
      .then(res => res.text())
      .then(res => {
        let responeObj = JSON.parse(res);
        setVoiceNotes([]);
        responeObj.forEach(data => {
          console.log("fetching voice notes for personal");
          console.log(data);
          var base64Flag = 'data:audio/mp3;base64,';
          var audioStr = arrayBufferToBase64(data.data.data);
          let audioData = {"audio":base64Flag+audioStr, "audioId":data.audioId, "sharedTo":data.sharedTo}
          setVoiceNotes(voiceNotes => voiceNotes.concat(audioData))
          setIsLoading(false);
        });
      }).catch(console.log("No notes saved by user"));
    }, [saved]);
  
    function arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = [].slice.call(new Uint8Array(buffer));
      bytes.forEach((b) => binary += String.fromCharCode(b));
      return window.btoa(binary);
    };

    async function saveCard (audioData) {
        console.log(audioData.audioData.audioId)
        let blob = await fetch(audioData.audioData.audio).then(r => r.blob());
        var formData = new FormData();
        formData.append('myAudio', blob);
        formData.append('createdBy', store.getState().userProfile.userProf.name);
        formData.append('audioId', audioData.audioData.audioId);
        formData.append('sharedByUserImg', store.getState().userProfile.userProf.imageUrl);
  
        fetch('/save-voice-notes', {
          method: "POST", body: formData
          }).then(response => response.json())
          .then(success => {
            setSaved(true);
            //alert("saved successfully");
          })
          .catch(error => {console.log(error); alert("failed")}
        );
          
    };

    async function shareCard (audioData, divIndex, sharedFrom) {
      if(shareIcon !== faCheckCircle){
        let blob = await fetch(audioData.audioData.audio).then(r => r.blob());
        var formData = new FormData();
        formData.append('myAudio', blob);
        formData.append('sharedBy', store.getState().userProfile.userProf.name);
        formData.append('sharedByUserImg', store.getState().userProfile.userProf.imageUrl);
        formData.append('audioId', audioData.audioData.audioId);
        //Later we have to fetch the team neam probably have to used redux to store user's team
        formData.append('sharedTo', store.getState().teamName.teamName.teamName);
  
        fetch('/share-voice-notes', {
          method: "POST", body: formData
          })
          .then(response => response.json())
          .then((responseJson) => {
            let conffetti;
            if(sharedFrom === "topDiv"){
              conffetti = divIndex.index+"topDiv";
            } else {
              conffetti = divIndex.index+"confetti";
            }
            ReactDOM.render(<SuccessIcon />, document.getElementById(conffetti));
            console.log("Successfully shared notes "+responseJson )
          })
          .catch((error) => {
            let errorId;
            if(sharedFrom === "topDiv"){
              errorId = divIndex.index+"topDiv";
            } else {
              errorId = divIndex.index+"confetti";
            }
            ReactDOM.render(<ErrorIcon />, document.getElementById(errorId));
            console.log("error while sharing notes "+error)
          });
      }
    };
  
    
    return (
      <div>
      <div className="container text-center" style={{marginTop:"2%"}}>
      <button id="recordBtn" className={buttonClass} onClick={() => clickHandler()}>{buttonText}</button>
        <div>
              <div id="outerDiv" className="work-div">
              {audioElements.map((audioData, index) => 
              <div className="card work-card" id={shortid.generate()}>
                  <audio preload="auto" controls style={{width: '50%'}}>
                    <source src={audioData.audio} />
                  </audio>
                  <div id={index+"topDiv"} style={{float: 'right', marginLeft: 'auto', marginTop: "inherit"}}>
                      <FontAwesomeIcon id={index+"shareIcon"} icon={faShareAlt} onClick={() => shareCard({audioData},{index},"topDiv")}
                      style={{color:'#007bff', fontSize:'30px', marginRight: '15px'}}/>
                  </div>
                  {/* <FontAwesomeIcon  icon={shareIcon} onClick={() => shareCard({audioData})} 
                  style={{float: 'right', 
                  marginTop: "inherit", color:'#007bff', fontSize:'40px'}}/> */}
                  <FontAwesomeIcon icon={faSave} onClick={() => saveCard({audioData})} 
                  style={{float: 'left', 
                  marginTop: "inherit", color:'#007bff', fontSize:'40px'}}/>
                </div>
              )}
              </div>
        </div>
      </div>
      <h1 style={{textAlign: 'center'}}>Your saved cards</h1>
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
              <div className="container text-center" style={{marginTop:"2%"}}>
                <div>
                      <div id="outerDiv" className="work-div">
                      {voiceNotes.map((audioData, index) => 
                      <div className="card work-card" style={{clear: 'both'}}>
                          <audio preload="auto" controls style={{width: '50%'}}>
                            <source src={audioData.audio} />
                          </audio>
                          {audioData.sharedTo !== undefined ? 
                          <div style={{float: 'right'}}>
                          <Lottie style={{marginRight: "0%"}} options={defaultOptions} height={55} width={55} />
                          </div>
                          :
                          <div id={index+"confetti"} style={{float: 'right', marginLeft: 'auto', marginTop: "inherit"}}>
                          <FontAwesomeIcon id={index+"shareIcon"} icon={faShareAlt} onClick={() => shareCard({audioData},{index},"savedCards")}
                            style={{color:'#007bff', fontSize:'30px', marginRight: '15px'}}/>
                          </div>
                          }
                        </div>
                      )}
                      </div>
                </div>
              </div> )}
          </div>
          </div>
          </div>
    )
}

export default VoiceNotes;