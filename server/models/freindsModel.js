const {pool} = require("../db")

const Friends = {
    // Add a friend in both directions
    add: async (alumni_id, friend_id) => {
        const query = `
            INSERT IGNORE INTO friends (alumni_id, friend_id) VALUES (?, ?), (?, ?);
        `;
        try {
            const [result] = await pool.execute(query, [alumni_id, friend_id, friend_id, alumni_id]);
            return result.affectedRows > 0; // Returns true if at least one row was inserted
        } catch (error) {
            throw new Error("Error adding friend: " + error.message);
        }
    },

    // List all friends for a given alumni_id
    list: async (alumni_id) => {
        const query = `
            SELECT a.id, a.username, a.name , a.profile_photo
            FROM friends f
            JOIN Alumni a ON a.id = f.friend_id
            WHERE f.alumni_id = ?;
        `;
        try {
            const [rows] = await pool.execute(query, [alumni_id]);
            return rows; // Returns the list of friends
        } catch (error) {
            throw new Error("Error retrieving friends: " + error.message);
        }
    },

    // Remove a friend relationship in both directions
  remove: async (alumni_id, friend_id) => {
    const query = `
      DELETE FROM friends 
      WHERE (alumni_id = ? AND friend_id = ?) 
         OR (alumni_id = ? AND friend_id = ?);
    `;
    try {
      const [result] = await pool.execute(query, [alumni_id, friend_id, friend_id, alumni_id]);
      return result.affectedRows > 0; // Returns true if at least one row was deleted
    } catch (error) {
      throw new Error("Error removing friend: " + error.message);
    }
  },

  // Check if two users are friends
  isFriend: async (alumni_id, friend_id) => {
    const query = `
      SELECT 1 
      FROM friends 
      WHERE (alumni_id = ? AND friend_id = ?) 
         OR (alumni_id = ? AND friend_id = ?)
      LIMIT 1;
    `;
    try {
      const [rows] = await pool.execute(query, [alumni_id, friend_id, friend_id, alumni_id]);
      return rows.length > 0; // Returns true if they are friends
    } catch (error) {
      throw new Error("Error checking friendship: " + error.message);
    }
  },

  // List mutual friends between two users
  mutual: async (alumni_id, other_alumni_id) => {
    const query = `
      SELECT a.id, a.username, a.name, a.profile_photo
      FROM friends f1
      JOIN friends f2 ON f1.friend_id = f2.friend_id
      JOIN Alumni a ON a.id = f1.friend_id
      WHERE f1.alumni_id = ? AND f2.alumni_id = ?;
    `;
    try {
      const [rows] = await pool.execute(query, [alumni_id, other_alumni_id]);
      return rows; // Returns the list of mutual friends
    } catch (error) {
      throw new Error("Error retrieving mutual friends: " + error.message);
    }
  },

  // Count the number of friends for a given alumni_id
  count: async (alumni_id) => {
    const query = `
      SELECT COUNT(*) AS total_friends
      FROM friends
      WHERE alumni_id = ?;
    `;
    try {
      const [rows] = await pool.execute(query, [alumni_id]);
      return rows[0].total_friends; // Returns the total number of friends
    } catch (error) {
      throw new Error("Error counting friends: " + error.message);
    }
  },
  // Get all friends' IDs for a given alumni
  getFriendsIds: async (alumni_id) => {
    const query = `
      SELECT friend_id 
      FROM friends 
      WHERE alumni_id = ?;
    `;
    try {
      const [rows] = await pool.execute(query, [alumni_id]);
      return rows.map(row => row.friend_id); // Return only friend IDs
    } catch (error) {
      throw new Error("Error retrieving friends' IDs: " + error.message);
    }
  },
}

module.exports = Friends;