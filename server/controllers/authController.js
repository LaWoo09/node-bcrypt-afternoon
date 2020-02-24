const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res, next) => {
        const { username, password, isAdmin } = req.body;
        const db = req.app.get('db');
        const result = await db.get_user(username);
        const existingUser = result[0];
        if(existingUser){
            res.status(409).send("Username Taken");
        } 
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            const registeredUser =  await db.register_user(isAdmin, username, hash);
            const user = registeredUser[0];
            req.session.user = {
                isAdmin: user.is_admin,
                id: user.id,
                username: user.username
            };
        
        res.status(201).send(req.session.user);
    },

    login: async (req, res, next) => {
        const { username, password } = req.body;
        const db = req.app.get('db');
        const userFound = await db.get_user(username);
        const user = userFound[0];
        if(!user) {
            res.status(401).send("User Not Found");
        } else {
            bcrypt.compare(password, user.hash).then(authenticated => {
                if(authenticated) {
                    req.session.user = { 
                        isAdmin: user.is_admin, 
                        id: user.id, 
                        username: user.username 
                    }
                    res.status(200).send(req.session.user)
                } else {
                    res.status(403).send("incorrect information")
                }
                
            })
        } 
    },

    logout: async (req, res, next) => {
        req.session.destroy();
        res.sendStatus(200);
    }


}