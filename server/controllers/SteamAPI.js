const SteamUser=require("../model/SteamUser")
let currentAPICalls=0;

let currentFailures=0;
const maxFailures=5;

async function apiFriendsList(mainSteamID)
{
    const url ="http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=" + process.env.API_KEY + "&steamid=" + mainSteamID + "&relationship=friend";
    let response = await fetch(url, {
      method: 'GET'
    });
    currentAPICalls++;
    currentFailures=0;
    while(!response.ok && currentFailures<maxFailures)
    {
        currentFailures++;   
        await new Promise(r => setTimeout(r, 100*currentFailures^2));
        response = await fetch(url, {
            method: 'GET'
            });
        currentAPICalls++;
    }
        if(response.ok)
        {
            if(currentFailures!==0)
            {
                console.log("Request Validated after "+currentFailures+" attempts")
            }
            const data=await response.json();
            return data;
        }
        else
        {
            console.log("Timeout at getting friend list");
        }
        currentFailures=0;
        return null;

} 

async function apiPlayerSummaries(friendIds)
{
    let url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + process.env.API_KEY + "&steamids=" + friendIds;
    let response = await fetch(url, {
        method: 'GET'
        });
        currentAPICalls++;
        currentFailures=0;
        while(!response.ok && currentFailures<maxFailures)
        {
            currentFailures++;   
            await new Promise(r => setTimeout(r, 100*currentFailures^2));
            response = await fetch(url, {
                method: 'GET'
                 });
            currentAPICalls++;
        }

        if(response.ok)
        {
            if(currentFailures!==0)
            {
                console.log("Request Validated after "+currentFailures+" attempts")
            }
             const data= await response.json();
             const players=data.response.players;
             return players;
        }
        else
        {
            console.log("Timeout at loading player summaries");
        }
        currentFailures=0;
        return null;

}

async function apiRequestOwnedGames(steamId) 
    {
        const url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + process.env.API_KEY + "&steamid=" + steamId ;
         let response = await fetch(url, {
            method: 'GET'
        });
        currentAPICalls++;
        currentFailures=0;
        while (!response.ok && currentFailures < maxFailures) {
            currentFailures++;
            await new Promise(r => setTimeout(r, 500 * currentFailures ^ 2));
            response = await fetch(url, {
                method: 'GET'
            });
            currentAPICalls++;
        }

        if (response.ok) {
            if (currentFailures !== 0) {
                console.log("Request Validated after " + currentFailures + " attempts");
            }
            const data = await response.json();
            return data.response.games;
        }
        else {
            console.log("Timeout at loading owned games");
        }
        currentFailures = 0;
        return null;
    }


 
module.exports ={apiFriendsList, apiPlayerSummaries, apiRequestOwnedGames}