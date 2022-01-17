/* user who pending to registered */

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const PUserSchema = new Schema({
    email: String,
    code: String,
});

const Puser = mongoose.model('puser', PUserSchema);

export default Puser