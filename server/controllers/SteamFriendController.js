require('dotenv').config();





class Friend {

    constructor(steamID, username, profileImageURl) 
    {
        this.id = steamID;
        this.username = username;
        this.imageURL = profileImageURl;
        this.orderedGenres = [];
        this.friendList=[];
    }

    async loadFriendList(ids)
    {
    
    }


}