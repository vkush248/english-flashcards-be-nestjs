/*

async login(userData): Promise < object > {
    const user = await this.getUser(userData);
    const isValid = await user.validPassword(userData.password);
    const message = isValid ? 'Welcome' : 'Access denied';
    return { isValid, message, username: userData.username };
    // when user logs in we send userid and array of cards' ids of this user
    // and keep it in store
    // get rid of password and salt.
}

async getUser(userData): Promise < any > {
    return await this.userModel.findOne({ username: userData.username }).lean();
}

*/