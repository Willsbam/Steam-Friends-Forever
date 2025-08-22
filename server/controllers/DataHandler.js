const SteamUser=require("../model/SteamUser");
const api=require("../controllers/SteamAPI");
const game= require("../model/Game");
const {batchSortFriendsToCat,sortFriendsToCat,getSortedCategories,loadSteamUsers}=require("./HelperMethods");
async function requestMainUser(req,res)
{
    const queries = req.query;
    const mainSteamID=queries["steamid"]
    const data= await api.apiFriendsList(mainSteamID);
    console.log("Main User Friends Loaded");
        if(data!==null)
        {
            let friendsSteamIds=[]
            friendsSteamIds.push(mainSteamID);
            let mainUserJSON= {};
        // The friends list is usually at data.friendslist.friends
            if (data.friendslist && data.friendslist.friends) 
            {
                data.friendslist.friends.forEach(element => {
                    friendsSteamIds.push(element.steamid);
                });

                //what this does load all the basic data on the main user, and then the categories
                //  associated with that user
                let mainUser=await loadSteamUsers(friendsSteamIds);
                mainUser.orderedGenres=await getSortedCategories(mainUser.id,4);
                mainUserJSON.mainUser=mainUser;
                console.log("Main User JSON Created");
            }

            res.status(200).json({ success: "Main user fully loaded", data: mainUserJSON});
        }
        else
        {
            res.status(404).json({ error: "Issue with loading main user" });
        }
        
}

async function requestFriends(req,res)
{
    console.log("Request Friend Recieved")
     const mainJSON=req.body.data.mainUser;
        if(mainJSON!==null)
        {
            const mainSteamID=mainJSON.id;
            let friendsSteamIds=[]
            friendsSteamIds.push(mainSteamID);
        // The friends list is usually at data.friendslist.friends
            if (mainJSON.friendList && mainJSON.friendList) 
            {
            mainJSON.friendList.forEach(id => {
                friendsSteamIds.push(id);
            });

            let mainUser=await loadSteamUsers(friendsSteamIds);
            mainUser.orderedGenres=await getSortedCategories(mainSteamID,4);
            
            let sortedFriendUsers= await sortFriendsToCat(mainUser);

            let completeData = {};
            //completeData.mainUser = mainUser; // Keep as object, not string
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



async function batchRequestFriends(req,res,mainJSON,batchAmount)
{

        if(mainJSON)
        {
           batchSortFriendsToCat(mainJSON,3,res);
        }
}

module.exports ={requestFriends,requestMainUser,batchRequestFriends}