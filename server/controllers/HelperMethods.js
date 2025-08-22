
const SteamUser=require("../model/SteamUser");
const api=require("../controllers/SteamAPI");
const game= require("../model/Game");


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

//so instead of returning all the sorted friends at once in a map, we are going to return a fresh map every time
//This map will 
async function batchSortFriendsToCat(mainUser, batchAmount, res) {
    // Key should be category, and the value should be an array of steam users
    let sortedFriends = new Map();
    let count = 0;
    
    // Initialize the map with empty arrays for each genre
    mainUser.orderedGenres.forEach(genre => {
        sortedFriends.set(genre[0], []);
    });
    
    // Use for...of instead of forEach to properly handle async/await
    for (const friendID of mainUser.friendList) {
        count++;
        try {
            const categories = await getSortedCategories(friendID, 10);
            
            if (categories && categories.length > 0) 
            {
                let foundCat = false;
                // Try to find a matching category
                for (const friendCat of categories) {
                    if (sortedFriends.has(friendCat[0]) && !foundCat) {
                        const user = SteamUser.allSteamUsers.get(friendID);
                        if (user) 
                        {
                            sortedFriends.get(friendCat[0]).push(user);
                            foundCat = true;
                        }
                    }
                }
            }
            
            // Send batch when we've processed enough friends
            if (count % batchAmount === 0) 
            {                
                let batchedData = {};
                batchedData.genres = {};

                // Prepare data for each genre
                mainUser.orderedGenres.forEach(genre => {
                    const friends = sortedFriends.get(genre[0]) || [];
                    batchedData.genres[genre[0]] = friends.map(friend => ({
                        id: friend.id,
                        username: friend.username,
                        imageURL: friend.imageURL
                    }));
                });
                
                // Send the data
                res.write(`data: ${JSON.stringify(batchedData)}\n\n`);
                
                // Clear the sorted friends for the next batch
                mainUser.orderedGenres.forEach(genre => {
                    sortedFriends.set(genre[0], []);
                });
            }
        } catch (error) {
            console.error(`Error processing friend ${friendID}:`, error);
        }
    }
    
    // Send any remaining friends (if count % batchAmount != 0)
    if (count % batchAmount !== 0) {
        
        let batchedData = {};
        batchedData.genres = {};
        
        mainUser.orderedGenres.forEach(genre => {
            const friends = sortedFriends.get(genre[0]) || [];
            batchedData.genres[genre[0]] = friends.map(friend => ({
                id: friend.id,
                username: friend.username,
                imageURL: friend.imageURL
            }));
        });
        
        res.write(`data: ${JSON.stringify(batchedData)}\n\n`);
    }
    
    res.write(`data: ${JSON.stringify({
        type: 'complete',
        message: 'All friend data processed'
    })}\n\n`);
}

module.exports ={batchSortFriendsToCat,sortFriendsToCat,getSortedCategories,getUsersGames,loadSteamUsers}