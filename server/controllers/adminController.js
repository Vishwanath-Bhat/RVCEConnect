const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const Pending = require('../models/pendingModel');
const AlumniModel = require('../models/alumniModel');


const createToken = (adminId, role) => {
    return jwt.sign({ _id: adminId, role: role }, process.env.SECRET, { expiresIn: '1d' });
};

const cookieOptions = {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: false,
   // Ensures cookies are sent over HTTPS
    sameSite: "lax", // Adjust if cross-site requests are involved ('none' for full cross-origin cookies)
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  };

const adminLogin = async (req, res) => {
    const { email, password, role} = req.body;

    try {
        const admin = await Admin.findByEmail(email);

        if (!admin) {
            return res.status(400).json({ error: 'Invalid email or Unauthorized access' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password or Unauthorized access' });
        }

        
        const token = createToken(admin.id, role);
        res.cookie("token", token, cookieOptions).status(200).json({ token, message: 'Admin login successful',username: "Admin", role});
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const approveOrReject = async (req, res) => {
    const { id, action, reason } = req.body; // `action` can be 'approve' or 'reject'

    try {
        const pendingAlumni = await AlumniModel.findById(id);
        if (!pendingAlumni) {
            return res.status(404).json({ error: 'Pending alumni not found.' });
        }
    
        if (action === 'approve') {
            // Approve: Update isPending to false
            await AlumniModel.updatePendingStatus(id, false);
            res.status(201).json({ message: 'Alumni approved successfully.' });
        } else if (action === 'reject') {
            // Reject: Update isRejected to true and also update isPending to false
            await AlumniModel.updatePendingStatus(id, false);
            await AlumniModel.updateRejectedStatus(id, true);
            res.status(200).json({ message: 'Alumni rejected successfully.', reason });
        } else {
            res.status(400).json({ error: 'Invalid action.' });
        }
    } catch (err) {
        console.error('Error approving/rejecting alumni:', err);
        res.status(500).json({ error: 'Failed to process the request.' });
    }
    
}

const pendingRequests = async (req, res) => {
    try {
        // Fetch all pending alumni requests
        const pendingRequests = await AlumniModel.findPendingRequests();

        if (!pendingRequests || pendingRequests.length === 0) {
            return res.status(404).json({ message: 'No pending requests found.' });
        }

        // Respond with the list of pending requests
        res.status(200).json(pendingRequests);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: 'Server error. Unable to fetch pending requests.' });
    }
};

module.exports = { adminLogin , approveOrReject, pendingRequests};
