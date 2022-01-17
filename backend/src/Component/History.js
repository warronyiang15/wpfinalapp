import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    room_id: String,
    game_result: String,
    player1: String,
    player2: String,
})

const History = mongoose.model('history', HistorySchema)

export default History