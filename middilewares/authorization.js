const Users = require("../model/usersSchema");

const restrict = (role) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;

         
            if (role === 'admin') {
              let user = await Users.findById(userId);
                if (!user || user.role !== 'admin') {
                    return res.status(403).json({ message: 'Access Denied: Admins only' });
                }
            } else {
                // Directly check the role for non-admin
                if (req.user.role !== role) {
                    return res.status(401).json({ message: 'Access Denied: Role mismatch' });
                }
            }
            next();
        } catch (error) {
            console.error('Error in role restriction middleware:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};

module.exports = restrict;
