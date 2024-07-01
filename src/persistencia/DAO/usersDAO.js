import userModel from "../models/usersModel.js";

class UsersDAO {
    async getUserByEmail(email) {
        return await userModel.findOne({ email });
    }

    async getUserById(userId) {
        return await userModel.findById(userId);
    }

    async createUser(newUser) {
        return await userModel.create(newUser);
    }

    async updateUser(userId, updatedUser) {
        return await userModel.findByIdAndUpdate(userId, updatedUser, { new: true });
    }

    async deleteUser(userId) {
        return await userModel.findByIdAndDelete(userId);
    }
}

export default new UsersDAO();