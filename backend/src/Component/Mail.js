import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const MailSchema = new Schema({
    from_email: String,
    to_email: String,
    content: String,
    id: String,
})

const Mail = mongoose.model('mail', MailSchema);

export default Mail