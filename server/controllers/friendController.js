const AlumniModel = require('../models/alumniModel');
const Friends = require('../models/freindsModel')




const connectToFriend = async (req, res) => {
    const { username, friend_id } = req.body;

    if (!username || !friend_id) {
        return res.status(400).json({
            message: "Username and Friend ID are required",
        });
    }

    try {
        const alumni = await AlumniModel.findAlumniByUsername(username);

        if (!alumni) {
            return res.status(404).json({
                message: "Alumni not found",
            });
        }

        if(alumni.id === friend_id){
            return res.status(400).json({
                message: "Cant send friend request to yourself"
            })
        }

        const isAdded = await Friends.add(alumni.id, friend_id);

        if (!isAdded) {
            return res.status(400).json({
                message: "Friendship could not be created",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Friend added successfully",
        });
    } catch (error) {
        console.error("Error connecting to friend:", error.message);
        return res.status(500).json({
            message: "An internal server error occurred",
            error: error.message,
        });
    }
};

const displayAllFriends = async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({
            message: "Username is required",
        });
    }

    try {
        const alumni = await AlumniModel.findAlumniByUsername(username);
        if (!alumni) {
            return res.status(404).json({
                message: "Alumni not found",
            });
        }
        const friends = await Friends.list(alumni.id);

        return res.status(200).json({
            success: true,
            friends,
        });
    } catch (error) {
        console.error("Error displaying all friends:", error.message);
        return res.status(500).json({
            message: "An internal server error occurred",
            error: error.message,
        });
    }
};

const searchFriend = async (req, res) => {
    //Make it such that it is called for every 2 seconds as user puts input 
}


module.exports = { connectToFriend , displayAllFriends}