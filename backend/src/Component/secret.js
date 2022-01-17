import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const SecretSchema = new Schema({
    user: String,
    password: String,
});

const Secret = mongoose.model('secret', SecretSchema);

export default Secret;

