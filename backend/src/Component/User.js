import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_id: String,
    user_name: String,
    user_pass: String,
    user_email: String,
    user_rating: String,
    user_online: Boolean,
});

const User = mongoose.model('user', UserSchema);

export default User;