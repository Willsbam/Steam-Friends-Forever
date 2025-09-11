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
const [mainUserIssue, setMUserIssue] = useState(-1);



//const baseURL='http://localhost:3000';
const baseURL='https://steam-friends-forever.com';

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
        setSessionID(json.id);
        
        const friendSource = new EventSource(baseURL+`/friendBatches?sessionID=${json.id}`);
        
        friendSource.onmessage = function(event) 
        {

            const data = JSON.parse(event.data);
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
                  friendSource.close();
                if(data.type && data.type==="complete")
                {
                    setProccessing(false);
                }
                stopFriendProcessing();

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
    if (eventSource!=null) 
        {
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
        setMUserIssue(false);
        console.log(json);
        if (("error" in json) || 
            !json.data || 
            !json.data.mainUser || 
            json.data.mainUser.orderedGenres === null || 
            (json.data.mainUser.friendList && json.data.mainUser.friendList.length === 0))
        {
            setMUserIssue(true);
        } 
        else 
        {
            setMainData(json);
        }
      } catch (error) 
      {
         setMUserIssue(true);
         setMainData(-1)
        console.log("Request Main User Error")
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
      : (
        <div className="info-box">
          <h3 className="info-title">How to Find Your Steam ID</h3>
          <div className="info-content">
            <p>Please submit a steam id of a profile with public data.</p>
            <p>Example ID: <code>76561198283655599</code></p>
            <p>Find your Steam ID at: <a href="https://steamidfinder.com" target="_blank" rel="noopener noreferrer">steamidfinder.com</a></p>
          </div>
        </div>
      )
    }
    {(mainUserIssue===true) && (
      <div className="error-box">
        <h3 className="error-title">Error Loading Profile</h3>
        <div className="error-content">
          <p><b>Unable to load Steam profile because:</b></p>
          <ul>
            <li>The Steam ID may be invalid, or</li>
            <li>The profile's games and friends list are private</li>
          </ul>
          <p>Please try a different Steam ID with public settings.</p>
        </div>
      </div>
      
    )}
    
    <div className="status-message">
      {isTransitioning ? (
        <h3><b>Loading New Profile...</b></h3>
      ) : proccessing ? (
        <h3><b>Loading Friends...</b></h3>
      ) : mainUserData !== -1 && friendStack.length > 0 ? (
        <h3><b>Click on any friend to delve into their friend chart</b></h3>
      ) : mainUserData !== -1 ? (
        <h3><b>Loading Friends...</b></h3>
      ) : null}
    </div>
  </div>
  );
}

export default App;
