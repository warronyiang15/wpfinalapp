import mongoose from 'mongoose'

const Schema = mongoose.Schema

const RoomSchema = new Schema({
    owner: String,
    joiner: String,
    room_id: String,
    room_link: String,
    room_game: String,
    room_onready: [Boolean],
    room_lock: Boolean,
});

const Room = mongoose.model('room', RoomSchema);

export default Room