
let currentAPICalls=0;
async function requestFriends(req,res)
{
console.log(process.env.API_KEY)
const url ="http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=" + process.env.API_KEY + "&steamid=" + "76561198283655599" + "&relationship=friend";
    const response = await fetch(url, {
      method: 'GET'
    });
    console.log("A");

    currentAPICalls++;
    if(response.ok)
    {
    console.log("A");
    const data=await response.json();

            // The friends list is usually at data.friendslist.friends
            if (data.friendslist && data.friendslist.friends) {
                data.friendslist.friends.forEach(element => {
                    console.log(element);
                });
                res.status(200).json({ success: "Friends list retrieved", friends: data.friendslist.friends });
            } else {
                res.status(404).json({ error: "No friends found" });
            }
      
    }
    else{
    
    }
} 
module.exports ={requestFriends}