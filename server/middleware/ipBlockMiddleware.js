const BlockedIP = require('../models/BlockedIP');
const { getClientIp, isPrivateIp } = require('../utils/ipHelper');

const checkBlockedIp = async (req, res, next) => {
    const ip = getClientIp(req);
    
    // TEMPORARY FIX: Allow admin to clear blocklist by passing ?unblock=true in the request
    if (req.query.unblock === 'true') {
        try {
            await BlockedIP.deleteMany({});
            console.log('All blocked IPs cleared via query parameter!');
        } catch (err) {
            console.error('Error clearing blocked IPs:', err);
        }
    }

    if (ip && !isPrivateIp(ip)) {
        try {
            const blocked = await BlockedIP.findOne({ ip });
            if (blocked) {
                console.log(`[BLOCKED] Request from blocked IP attempted: ${ip}`);
                return res.status(403).json({ message: 'Your IP address has been blocked from accessing this site.' });
            }
        } catch (error) {
            console.error('Error checking blocked IP:', error);
        }
    }
    
    next();
};

module.exports = { checkBlockedIp };
