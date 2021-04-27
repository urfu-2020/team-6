class User {
    constructor(userName, avatarUrl) {
        this.userName = userName;
        this.avatarUrl = avatarUrl;
    }

    static createFromGitHubProfile(profile){
        const userName = profile["username"];
        const avatarUrl = profile["_json"]["avatar_url"];
        return new User(userName, avatarUrl);
    }
}

module.exports = User;