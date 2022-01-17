import mongoose from 'mongoose'

const Schema = mongoose.Schema

const GameSchema = new Schema({
    player1 : String,
    player2 : String,
    turn : String,
    isEnd : String,
    id : String,
    room_id : String,
    chess: [[String]],
});

const Game = mongoose.model('game', GameSchema);

export default Game;