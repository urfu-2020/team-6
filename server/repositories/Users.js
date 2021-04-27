const User = require("../models/User.js");

class Users{
    #users = new Map();

    constructor() {
    }

    getByName(name){
        if (!this.#users.has(name))
            return null;
        return this.#users.get(name)
    }

    getAll(){
        return Array.from(this.#users.values())
    }

    findOrCreate(profile){
        const user = User.createFromGitHubProfile(profile);
        if (! this.#users.has(user.userName)){
            this.#users.set(user.userName, user);
            return user;
        }
        return this.#users.get(user.userName);
    }
}

module.exports = Users;