const SteamUser=require("../model/SteamUser");
const api=require("../controllers/SteamAPI");
const game= require("../model/Game");

async function requestFriends(req,res)
{
    if(game.allGames.size===0)
    {
        await game.readGameCSV();
    }

	const queries = req.query;
    const mainSteamID=queries["steamid"]
    const data= await api.apiFriendsList(mainSteamID);
    console.log("Friends List Loaded");
        if(data!==null)
        {
            let friendsSteamIds=[]
            friendsSteamIds.push(mainSteamID);
        // The friends list is usually at data.friendslist.friends
            if (data.friendslist && data.friendslist.friends) 
            {
            data.friendslist.friends.forEach(element => {
                friendsSteamIds.push(element.steamid);
            });

            //TODO Replace this with other function
            let mainUser=await loadSteamUsers(friendsSteamIds);
            mainUser.orderedGenres=await getSortedCategories(mainUser.id,4);
            
            let sortedFriendUsers= await sortFriendsToCat(mainUser);

            let completeData = {};
            completeData.mainUser = mainUser; // Keep as object, not string
            completeData.genres = {}; // Initialize genres as an object

            mainUser.orderedGenres.forEach(genre => {
                // genre[0] is the genre name
                // Get the array of friends for this genre from the Map
                const friends = sortedFriendUsers.get(genre[0]) || [];
                // Convert each friend (SteamUser) to a plain object if needed
                completeData.genres[genre[0]] = friends.map(friend => ({
                    id: friend.id,
                    username: friend.username,
                    imageURL: friend.imageURL
                }));
            });
            //completeData.push(sortedFriendUsers);
            res.status(200).json({ success: "Friend List and main user loaded", data: completeData});
            } else {
                res.status(404).json({ error: "No friends found" });
            }
    
        }
} 

//this load all the of users and their data into SteamUser.allSteamUsers map
//It will also return a main user 
async function loadSteamUsers(friendIds) {
    let ids = "";
    friendIds.forEach(id => {
        ids = ids + id + ",";
    });
    
    const players = await api.apiPlayerSummaries(ids);
    
    if (players !== null) {
        // First pass - add all players to the map
        players.forEach(player => {
            if (!SteamUser.allSteamUsers.has(player.steamid)) {
                let newUser = new SteamUser.SteamUser(player.steamid, player.personaname, player.avatarfull);
                SteamUser.allSteamUsers.set(player.steamid, newUser);
            }
        });
        
        // Second pass - create main user from the map (so it already exists) and add friends
        let mainUser = SteamUser.allSteamUsers.get(friendIds[0]);
        if (!mainUser) {
            console.log("Error: Main user not found in map! ID:", friendIds[0]);
            return null;
        }
        
        // Add friends to main user
        players.forEach(player => {
            if (player.steamid !== mainUser.id) {  // Don't add self as friend
                mainUser.addFriend(player.steamid);
            }
        });
        
        return mainUser;
    } else {
        console.log("Timeout at loading player summaries");
        return null;
    }    
}

//this should return an arraylist of pair with the game
async function getUsersGames(steamId){
    let gameWHours=[];
    const ownedGames = await api.apiRequestOwnedGames(steamId);
    if(ownedGames!=null)
    {
        ownedGames.forEach((game) =>{
            let gameID=game["appid"];
            let playtime= +game["playtime_forever"];
            gameWHours.push([gameID,playtime]);
        });
        gameWHours.sort((a, b) => b[1] - a[1]);
        return gameWHours;
    }
    else
    {
        //probably if the player has private on
        return null;
    }
}

async function getSortedCategories(steamId, numCat)
{
    if(game.allGames.size!=0)
    {
        let gamesWHours= await getUsersGames(steamId);
        let categoriesTotal= new Map();
        if(gamesWHours!=null)
        {
            gamesWHours.forEach((entry) => {
            let id=entry[0];
            if(game.allGames.has(id+""))
            {
                 game.allGames.get(id+"").inputCategories.forEach((category) =>
                {
                    if(!categoriesTotal.has(category))
                    {
                        categoriesTotal.set(category,0);
                    }
                    categoriesTotal.set(category,categoriesTotal.get(category)+Math.round(entry[1]/60))
                });
            }
        });
        let topCategories = [];
        for(i=0;i<numCat;i++)
        {
            let topHours=0;
            let topCategory;

            categoriesTotal.forEach((value,key) =>{
                if(value>topHours)
                {
                    topHours=value;
                    topCategory=key;
                }
            });
            topCategories.push([topCategory,topHours]);
            categoriesTotal.delete(topCategory);
        }
       
        return topCategories;
        }
        return null;
        
    }
    else
    {
        console.log("You didn't load the games yet bruv")
    }
}

//this should return an array the matches the number of categories defined by the main user
//with all the friends of the main user sorted into whatever fits their category the best
async function sortFriendsToCat(mainUser)
{
    //Key should be category, and the value should be an array of steam users
    let sortedFriends= new Map();
    mainUser.orderedGenres.forEach(genre => {
        sortedFriends.set(genre[0],[]);
    });


    for (const friendId of mainUser.friendList) 
    {
        let categories = await getSortedCategories(friendId, 10);
        if(categories!=null)
        {
        let foundCat=false;
         categories.forEach(friendCat => {
            if(sortedFriends.has(friendCat[0]) && foundCat===false)
            {
                sortedFriends.get(friendCat[0]).push(SteamUser.allSteamUsers.get(friendId));
                foundCat=true;
            }
        });
        }
       
    }
    return sortedFriends;

}







 
module.exports ={requestFriends}