import './App.css';
import "./pie.css"
import FriendChart from './FriendChart';
import React from 'react';
import {useState} from 'react';
import loadingGIF from './loading.gif'

function App() {
const [steamID, setSteamID] = useState(-1);
const [mainUserData, setMainData] = useState(-1);
const [sortedFriendData, setSortedData] = useState(-1);


  let baseURL="http://localhost:8080";


   

  async function startNetworking(steamID) {
    setSteamID(steamID);
    try {
        const mainUserResponse = await requestMainUser(steamID);
        if (mainUserResponse) {
            await requestSortedFriends();
        }
    } catch (error) {
        console.error("Error in networking:", error);
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
        console.log(json);
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
        const response = await fetch(`${baseURL}`+"/requestFriends", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'

      },
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
    //setUserData(-1);
    //setUserData(testDataRequest())
    try 
     {
        const response = await fetch(
          `${baseURL}`+"/requestFriends?steamid="+steamID,
        );
        const json = await response.json();
        //setUserData(json);
        console.log(json);
      } catch (error) 
      {
        //setUserData(-1);
        console.error(error);
      }
  }
  function testDataRequest()
  {
    return {
    "success": "Friend List and main user loaded",
    "data": {
        "mainUser": {
            "id": "76561198283655599",
            "username": "Willsbam",
            "imageURL": "https://avatars.steamstatic.com/a41301d4b9e1d39dda8f88f1c057b74f846482c7.jpg",
            "orderedGenres": [
                [
                    "Action",
                    190857
                ],
                [
                    "Multiplayer",
                    188882
                ],
                [
                    "Co-op",
                    157461
                ],
                [
                    "Singleplayer",
                    156210
                ]
            ],
            "friendList": [
                "76561198043432235",
                "76561198111708439",
                "76561198199821871",
                "76561198313493134",
                "76561198325178386",
                "76561197976842022",
                "76561198268944083",
                "76561198290585790",
                "76561198178360461",
                "76561198088071740",
                "76561198058479852",
                "76561198066639517",
                "76561198166595914",
                "76561198271163129",
                "76561198099476217",
                "76561198170026903",
                "76561198355001014",
                "76561198283681279",
                "76561198279733039",
                "76561198058939656",
                "76561198225449360",
                "76561198122406355",
                "76561198116595130",
                "76561198115335216",
                "76561198269674729",
                "76561199378113081",
                "76561198060067302",
                "76561197993828619",
                "76561198106456793",
                "76561198238823584",
                "76561198203134783",
                "76561198976087166",
                "76561198119377453",
                "76561198126572998",
                "76561198254496718",
                "76561198220618449",
                "76561199082935598",
                "76561198820226185",
                "76561198299331463",
                "76561198353857246",
                "76561198836690475",
                "76561199166727346",
                "76561198080337289",
                "76561198303817337",
                "76561198320795255",
                "76561198397375917",
                "76561199207342580",
                "76561197999288486",
                "76561198284297758",
                "76561198102854454",
                "76561199550527401",
                "76561198825291521",
                "76561199095629871",
                "76561199122935154",
                "76561198450120285",
                "76561199094331418",
                "76561199053057193",
                "76561198396547204",
                "76561198016067705",
                "76561198341220570",
                "76561198981164195",
                "76561198037257306",
                "76561199059586020",
                "76561198355884286",
                "76561198170874057",
                "76561199014348848",
                "76561198337672954",
                "76561198830403360",
                "76561198898447953",
                "76561198077261140",
                "76561199080494291",
                "76561197995460081",
                "76561199353308992",
                "76561198061361560",
                "76561199126343105",
                "76561199135440411",
                "76561199007501571",
                "76561199110896733",
                "76561198998356313",
                "76561198196697889",
                "76561198208635508",
                "76561198329284099",
                "76561199077003737",
                "76561198358109768"
            ]
        },
        "genres": {
            "Action": [
                {
                    "id": "76561198111708439",
                    "username": "Bistdocs",
                    "imageURL": "https://avatars.steamstatic.com/a63a5f3c291cb39bedbd5db22e0f200bdf332fa3.jpg"
                },
                {
                    "id": "76561198199821871",
                    "username": "tsj",
                    "imageURL": "https://avatars.steamstatic.com/c40b1d51873567cb2c4d7ab9ccafc6776ecca3d5.jpg"
                },
                {
                    "id": "76561198313493134",
                    "username": "Free Wifi",
                    "imageURL": "https://avatars.steamstatic.com/758152542f8e671aac889ef6dc1f11310c197e22.jpg"
                },
                {
                    "id": "76561198268944083",
                    "username": "frenzberry",
                    "imageURL": "https://avatars.steamstatic.com/25673396bf4adf2d36dd387124e68d20ffb648c1.jpg"
                },
                {
                    "id": "76561198290585790",
                    "username": "inluv",
                    "imageURL": "https://avatars.steamstatic.com/55b2dc93ece7ea2a6d6db96920e4dcd23c240aa8.jpg"
                },
                {
                    "id": "76561198271163129",
                    "username": "CaptainBear",
                    "imageURL": "https://avatars.steamstatic.com/2ffbaf698822ccf8b5537e78a8f054a52372d79c.jpg"
                },
                {
                    "id": "76561198170026903",
                    "username": "Eon",
                    "imageURL": "https://avatars.steamstatic.com/d1c68323e48d80e5ba3d2eb75b0c79b1c7d9f00a.jpg"
                },
                {
                    "id": "76561198058939656",
                    "username": "Kenny McCormick",
                    "imageURL": "https://avatars.steamstatic.com/cee55e74d2dae5428689f82542673507c820e0e4.jpg"
                },
                {
                    "id": "76561198122406355",
                    "username": "lmao",
                    "imageURL": "https://avatars.steamstatic.com/232dc9994ba94f6acc5f7e8d8b383bb0c005cbcf.jpg"
                },
                {
                    "id": "76561198116595130",
                    "username": "halo255xbox",
                    "imageURL": "https://avatars.steamstatic.com/7bf62c46d78662eccb956d2e5a0dc75a8e37c091.jpg"
                },
                {
                    "id": "76561198115335216",
                    "username": "Happy Feet",
                    "imageURL": "https://avatars.steamstatic.com/0ddcea1eeeb519821fb52c55f9c336331666bc66.jpg"
                },
                {
                    "id": "76561198397375917",
                    "username": "Cybele74",
                    "imageURL": "https://avatars.steamstatic.com/87818f60a72021992c99dada714871c0f215ff70.jpg"
                },
                {
                    "id": "76561197999288486",
                    "username": "boojapho",
                    "imageURL": "https://avatars.steamstatic.com/3e4be698bd3b40cbaa780083e22243f4424cce0e.jpg"
                },
                {
                    "id": "76561199550527401",
                    "username": "张若辰",
                    "imageURL": "https://avatars.steamstatic.com/0ba83d66c6ef6132b99473e708332cfac5e69d23.jpg"
                },
                {
                    "id": "76561198825291521",
                    "username": "Sploober",
                    "imageURL": "https://avatars.steamstatic.com/4bca9c1ec7afe81a5097ff2abc3aaf5ff864ff72.jpg"
                },
                {
                    "id": "76561199122935154",
                    "username": "ChXmp7",
                    "imageURL": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                },
                {
                    "id": "76561198450120285",
                    "username": "Bunalin",
                    "imageURL": "https://avatars.steamstatic.com/f0f28a43e0d2c26b7337d6f28216d28c4ccafc7c.jpg"
                },
                {
                    "id": "76561198981164195",
                    "username": "BlackThanos",
                    "imageURL": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                },
                {
                    "id": "76561198037257306",
                    "username": "Just Jesus",
                    "imageURL": "https://avatars.steamstatic.com/f4c1d0865f39acf9f419711ae9d272d3ca61f603.jpg"
                },
                {
                    "id": "76561199059586020",
                    "username": "ruberine",
                    "imageURL": "https://avatars.steamstatic.com/a485780339eff26ac51b6a0d2bca94759e9df6d2.jpg"
                },
                {
                    "id": "76561199014348848",
                    "username": "gulf",
                    "imageURL": "https://avatars.steamstatic.com/235e6e10cd66af9a6c42020f8053cf3a32508522.jpg"
                },
                {
                    "id": "76561198830403360",
                    "username": "Echoingdown",
                    "imageURL": "https://avatars.steamstatic.com/3217b583c51c79e2b571fc8914b11478782b6454.jpg"
                },
                {
                    "id": "76561199080494291",
                    "username": "AgelessLeaf5055",
                    "imageURL": "https://avatars.steamstatic.com/0ec9c398cffbab74248ef4e916e75cd8c2eb000d.jpg"
                },
                {
                    "id": "76561197995460081",
                    "username": "Reaper",
                    "imageURL": "https://avatars.steamstatic.com/7fd118ca7b6d7dcdd2e8430f8765fa61240aaedc.jpg"
                },
                {
                    "id": "76561199353308992",
                    "username": "DareDevil Frog",
                    "imageURL": "https://avatars.steamstatic.com/3c5818a8cd1a9804d125d8b0d99015182547a729.jpg"
                },
                {
                    "id": "76561199135440411",
                    "username": "gavgrag",
                    "imageURL": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                },
                {
                    "id": "76561199007501571",
                    "username": "chopstx",
                    "imageURL": "https://avatars.steamstatic.com/0ea4f6af1138f9935448607147cce133074a1e0e.jpg"
                },
                {
                    "id": "76561198998356313",
                    "username": "sven",
                    "imageURL": "https://avatars.steamstatic.com/53c5047805cd7299a6306372f742261612b34fa4.jpg"
                },
                {
                    "id": "76561198196697889",
                    "username": "Light The Espeon Medic",
                    "imageURL": "https://avatars.steamstatic.com/09975b48f2db84d2bdab88d4afb4d4b3e57d2ee0.jpg"
                },
                {
                    "id": "76561198208635508",
                    "username": "Charco",
                    "imageURL": "https://avatars.steamstatic.com/ce02821797e20cc6576935f93bc08168cea2bcec.jpg"
                },
                {
                    "id": "76561198358109768",
                    "username": "elonguta",
                    "imageURL": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                }
            ],
            "Multiplayer": [
                {
                    "id": "76561198166595914",
                    "username": "Moka",
                    "imageURL": "https://avatars.steamstatic.com/3f5e9daea59216d7fe13df4e031d3537580e5e21.jpg"
                },
                {
                    "id": "76561198225449360",
                    "username": "Mishteveous",
                    "imageURL": "https://avatars.steamstatic.com/bf5ff64b13a39548955cc79b4c5f866bb6b7cf5e.jpg"
                },
                {
                    "id": "76561198269674729",
                    "username": "Ninjagamer1979",
                    "imageURL": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                },
                {
                    "id": "76561198060067302",
                    "username": "RedX992",
                    "imageURL": "https://avatars.steamstatic.com/1fa48f3adeb9594213eb5579244b70f7430ff46e.jpg"
                },
                {
                    "id": "76561198203134783",
                    "username": "KiwiViper",
                    "imageURL": "https://avatars.steamstatic.com/e241e912c639e21ef1c054145d36bed1cefcadfa.jpg"
                },
                {
                    "id": "76561198119377453",
                    "username": "Pablo",
                    "imageURL": "https://avatars.steamstatic.com/91a7ea174f19ceaf2f73cb0775c04ef52b4bf297.jpg"
                },
                {
                    "id": "76561198126572998",
                    "username": "Slade.WV",
                    "imageURL": "https://avatars.steamstatic.com/3e662c52ef2829a538694acb7ede085ef38d5463.jpg"
                },
                {
                    "id": "76561199082935598",
                    "username": "zzhama",
                    "imageURL": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                },
                {
                    "id": "76561198820226185",
                    "username": "Loserking33",
                    "imageURL": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                },
                {
                    "id": "76561198836690475",
                    "username": "DatsunGuy",
                    "imageURL": "https://avatars.steamstatic.com/b877cd873d1eae634e91ca67085b54b9025afacc.jpg"
                },
                {
                    "id": "76561198080337289",
                    "username": "Loppylop",
                    "imageURL": "https://avatars.steamstatic.com/950f9f3147d4c8530a5072825d01c34ee3f1afa1.jpg"
                },
                {
                    "id": "76561198284297758",
                    "username": "Yibdo",
                    "imageURL": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                },
                {
                    "id": "76561198102854454",
                    "username": "BagBreaker67",
                    "imageURL": "https://avatars.steamstatic.com/5625fddf8a31e3cffd7fffb5fc5e59a8183cfc5c.jpg"
                },
                {
                    "id": "76561198396547204",
                    "username": "landy",
                    "imageURL": "https://avatars.steamstatic.com/28c5d9783ed598a5e309ed2ed49bc88f5f91bbc8.jpg"
                },
                {
                    "id": "76561198170874057",
                    "username": "Pluto",
                    "imageURL": "https://avatars.steamstatic.com/34966e89066b62abe376472f73605b35d8bc1ec1.jpg"
                },
                {
                    "id": "76561198898447953",
                    "username": "Khallan",
                    "imageURL": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                },
                {
                    "id": "76561198077261140",
                    "username": "Brentøn",
                    "imageURL": "https://avatars.steamstatic.com/ccdad17e8db7fdd4a7b760684ffe7ab21f819141.jpg"
                },
                {
                    "id": "76561199110896733",
                    "username": "TinyPeaks",
                    "imageURL": "https://avatars.steamstatic.com/6ee2b77f5c79d32797c2910524431b93bdd3837c.jpg"
                },
                {
                    "id": "76561198329284099",
                    "username": "TiTiRex",
                    "imageURL": "https://avatars.steamstatic.com/2a4057bb2d1a5dd0f743e308cec2e546647e0a58.jpg"
                }
            ],
            "Co-op": [
                {
                    "id": "76561197976842022",
                    "username": "Aphid",
                    "imageURL": "https://avatars.steamstatic.com/e1a771ea326e5120c198128f7191dd3c05120f6b.jpg"
                },
                {
                    "id": "76561198353857246",
                    "username": "firegodofwar846",
                    "imageURL": "https://avatars.steamstatic.com/994f87672655bab44b3b738fc661d47258c6b09c.jpg"
                },
                {
                    "id": "76561199077003737",
                    "username": "kahanna1908",
                    "imageURL": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                }
            ],
            "Singleplayer": [
                {
                    "id": "76561198043432235",
                    "username": "MaxDestructor",
                    "imageURL": "https://avatars.steamstatic.com/f9b0d637974220d5fad27d9486bb49e4dae77cb3.jpg"
                },
                {
                    "id": "76561198178360461",
                    "username": "DeycallmeKoles",
                    "imageURL": "https://avatars.steamstatic.com/ea999136211ab03cc74e8e3fa7ca368a4bdc4497.jpg"
                },
                {
                    "id": "76561198355001014",
                    "username": "Tactical bacon",
                    "imageURL": "https://avatars.steamstatic.com/a543cc7b45ba6891cfa80265a8e5e39432c318f5.jpg"
                },
                {
                    "id": "76561197993828619",
                    "username": "Cypher",
                    "imageURL": "https://avatars.steamstatic.com/aaa0ca86a72f8db474f505c75e1329c2749cc648.jpg"
                },
                {
                    "id": "76561198106456793",
                    "username": "Jangonett",
                    "imageURL": "https://avatars.steamstatic.com/387507c8bb0c50eb7481209ea1c0f07c53f2fad7.jpg"
                },
                {
                    "id": "76561198976087166",
                    "username": "The13thWatcher",
                    "imageURL": "https://avatars.steamstatic.com/609cc70b1555e2e07da8421173aac6fb046930d2.jpg"
                },
                {
                    "id": "76561198254496718",
                    "username": "maxriley38",
                    "imageURL": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                },
                {
                    "id": "76561198299331463",
                    "username": "AjaxAkermann",
                    "imageURL": "https://avatars.steamstatic.com/00901426990d646cde49954d6c3abe897d0fecad.jpg"
                },
                {
                    "id": "76561198303817337",
                    "username": "gamma guy",
                    "imageURL": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                },
                {
                    "id": "76561198320795255",
                    "username": "panda706",
                    "imageURL": "https://avatars.steamstatic.com/c5da13940a3d4a9e6b84a5d7dc8527e57dcfe942.jpg"
                },
                {
                    "id": "76561199207342580",
                    "username": "manda",
                    "imageURL": "https://avatars.steamstatic.com/5fc7d3d4b0a115f4e20b7247e56d95d532904dce.jpg"
                },
                {
                    "id": "76561199094331418",
                    "username": "P1ayboy",
                    "imageURL": "https://avatars.steamstatic.com/a5381a196033e1d7b648bfb32a8fd2f3faeb8006.jpg"
                },
                {
                    "id": "76561198016067705",
                    "username": "Tekniques",
                    "imageURL": "https://avatars.steamstatic.com/62db523113ead59276315c699257d9a49fc6f04d.jpg"
                },
                {
                    "id": "76561198355884286",
                    "username": "Phantom",
                    "imageURL": "https://avatars.steamstatic.com/1454c7d29372359bf8b4b3f42b4158b837f41c9c.jpg"
                },
                {
                    "id": "76561198061361560",
                    "username": "iMercenarification",
                    "imageURL": "https://avatars.steamstatic.com/667a49a7ad5930e68f04d6ca2e0233d4edea1c93.jpg"
                },
                {
                    "id": "76561199126343105",
                    "username": "domp06",
                    "imageURL": "https://avatars.steamstatic.com/40f14705ee2f36e993cd16f97bd1406ee08e3132.jpg"
                }
            ]
        }
    }
  };
  }
  
  return (
    <div className="App">
       <h2 style={{fontFamily:"Sans-serif",color:'white'}}>Steam Friends Forever</h2>
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
  minlength="17"
  maxlength="17"
  size="20"  onChange={e =>
    setSteamID(e.target.value)
  }/>
  <button>Submit</button>
       </form >
      {(mainUserData!==-1 && steamID!==-1) ? <FriendChart mainUserJSON={mainUserData} sortedFriendsJSON={sortedFriendData} sendDataFunction={sendDataRequest}/> 
        : <p>Please submit a steam id of a profile with public data on!</p>}
    </div>
  );
}

export default App;
