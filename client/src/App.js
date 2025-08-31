import './App.css';
import "./pie.css"
import FriendChart from './FriendChart';
import React from 'react';
import {useState,useEffect} from 'react';
import loadingGIF from './loading.gif'

function App() {
// Add new state for transition
const [isTransitioning, setIsTransitioning] = useState(false);
const [steamID, setSteamID] = useState(-1);
const [mainUserData, setMainData] = useState(-1);
const [sortedFriendData, setSortedData] = useState(-1);
const [sessionID, setSessionID] = useState(-1);

const [eventSource, setEventSource] = useState(null);
const [proccessing, setProccessing] = useState(false);



//const baseURL='https://steam-friends-forever-uf6oi.ondigitalocean.app';
const baseURL='http://localhost:8080';

const friendStack=[];

async function startFriendProcessing()
{
    console.log("Starting Friend Processing")
    setSessionID(-1);
    try 
     {
        const response = await fetch(`${baseURL}`+"/friendBatches/start", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            } ,
            body: JSON.stringify(mainUserData),
        });
        const json = await response.json();
        console.log(json);
        setSessionID(json.id);
        
        const friendSource = new EventSource(baseURL+`/friendBatches?sessionID=${json.id}`);
        
        friendSource.onmessage = function(event) 
        {

            const data = JSON.parse(event.data);
            console.log(data);
            //data is a json object that contains various keys to genres with the 
            //friends inside of them
            //THis code effectively appends the friends genre and their user data to the friend
            //stack, with the intent that the friendChart will one by one pop these off and add them
            if(data.genres)
            {
                if(!proccessing)
                {
                    setProccessing(true);
                }
                Object.keys(data.genres).forEach(genreName => 
                {
                    data.genres[genreName].forEach(friendUser => 
                    {
                        friendStack.push([genreName,friendUser])
                    });
                });      
            }
            else
            {
                console.log(data)
                if(data.type && data.type==="complete")
                {
                    setProccessing(false);
                }
            }
           
        };

        setEventSource(friendSource);
      } catch (error) 
      {
        setSessionID(-1);
        console.error(error);
      }
  }
    
function stopFriendProcessing()
{
    if (eventSource) 
        {
            eventSource.close();
            setEventSource(null);
        }
}

//this will dissapear soon enough
useEffect(() => {

    if (mainUserData && mainUserData !== -1 &&
         typeof mainUserData === 'object' && mainUserData.data) {
        startFriendProcessing();
         //requestSortedFriends();
    }
}, [mainUserData]); // This will trigger when mainUserData updates

  async function startNetworking(steamID) {
    setIsTransitioning(true);
    setSteamID(steamID);
    try {
        await requestMainUser(steamID);
    } catch (error) {
        console.error("Error in networking:", error);
    } finally {
        setIsTransitioning(false);
    }
}


  async function requestMainUser(steamID)
  {
    console.log("Requesting main user")
    try 
     {
        const response = await fetch(
          `${baseURL}`+"/requestMainUser?steamid="+steamID,
        );
        const json = await response.json();
        setMainData(json);
      } catch (error) 
      {
        setMainData(-1);
        console.error(error);
      }
  }

  //this should use the main user thats already been sent
  async function requestSortedFriends()
  {
    setSortedData(-1);
    try 
     {
        const response = await fetch(`${baseURL}`+"/requestFriends", 
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            } ,
            body: JSON.stringify(mainUserData),
        })
        const json = await response.json();
        setSortedData(json);
    
        console.log(json);
      } catch (error) 
      {
        setSortedData(-1);
        console.error(error);
      }
  }
    
  async function sendDataRequest(steamID)
  {
    console.log("Request Sent");
    setSteamID(steamID);
    
    try 
     {
        const response = await fetch(
          `${baseURL}`+"/requestFriends?steamid="+steamID,
        );
        const json = await response.json();
        //setUserData(json);
      } catch (error) 
      {
        //setUserData(-1);
        console.error(error);
      }
  }
  
  return (
  <div className="App">
    <h2>Steam Friends Forever</h2>
    <form onSubmit={e => {
      e.preventDefault();
      startNetworking(steamID);
    }}>
      <input
        className='idInput'
        type="text"
        id="steamID"
        name="steamID"
        required
        minLength="17"
        maxLength="17"
        size="20"
        onChange={e => setSteamID(e.target.value)}
        placeholder="Enter Steam ID"
      />
      <button type="submit">Submit</button>
    </form>
    {(mainUserData !== -1 && steamID !== -1) ? 
      <FriendChart 
        mainUserJSON={mainUserData} 
        sortedFriendsJSON={sortedFriendData} 
        sendDataFunction={startNetworking} 
        friendArray={friendStack}
      /> 
      : (<div>
<p className="error-message">Please submit a steam id of a profile with public data on! </p>
<p className="error-message">For an example, you can use my ID: 76561198283655599</p>
    </div>
)
    }
    
    <div className="status-message">
      {isTransitioning ? (
        <h3><b>Loading New Profile...</b></h3>
      ) : proccessing ? (
        <h3><b>Loading Friends...</b></h3>
      ) : mainUserData !== -1 ? (
        <h3><b>Click on any friend to delve into their friend chart</b></h3>
      ) : null}
    </div>
  </div>
  );
}

export default App;
