db.createUser(
        {
            user: "jamgo",
            pwd: "jamgo",
            roles: [
                {
                    role: "readWrite",
                    db: "les-meves-ajudes"
                }
            ]
        }
);

