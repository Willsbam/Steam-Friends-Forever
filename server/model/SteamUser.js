require('dotenv').config();


//This should contain the mapping of every steamID to it's steamUSer
let allSteamUsers=new Map();

class SteamUser {

    constructor(steamID, username, profileImageURl) 
    {
        this.id = steamID;
        this.username = username;
        this.imageURL = profileImageURl;
        this.orderedGenres = [];
        //this should only contain IDS, is an array because we will need to traverse everything regardless
        this.friendList=[];
    }
    
    addFriend(friendID)
    {
        if(!this.friendList.includes(friendID))
        {
            this.friendList.push(friendID);
        }
    }

    
}
module.exports={SteamUser,allSteamUsers}