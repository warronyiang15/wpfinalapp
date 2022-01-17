import User from "../Component/User";
import Puser from "../Component/pUser";
import Room from "../Component/Room";
import Game from "../Component/Game";
import History from "../Component/History";
import Mail from "../Component/Mail";

import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import sendCode from "../Utility/mail";
import { Random_Generate } from '../Utility/mail'
import { printBoard, isTie, isWin } from "../Utility/board";

const Mutation = {
    async createAccount(parent, { user_name , user_pass , user_email }, { db , pubsub }, info){
        const saltRounds = 10;
        const userID = uuid();
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(user_pass, saltRounds, function(err, hash) {
                if(err) reject(err)
                resolve(hash)
            });
        })

        const newUser = new User({
            user_id: userID,
            user_name: user_name,
            user_pass: hashedPassword,
            user_email: user_email,
            user_rating: '0',
            user_online: false,
        });

        const result = newUser.save();
        await Puser.deleteMany({ email : user_email });
        return result;
    },

    async createAuth(parent, { user_email }, { db, pubsub }, info){
        const result = await sendCode( user_email );
        if(result === null) return false;
        const saltRound = 10;
        bcrypt.hash(result, saltRound, async( err, hash ) => {
            const newPuser = new Puser({
                email: user_email,
                code: hash,
            });
            await newPuser.save();
        })
        return true;
    },

    async createRoom(parent, { user_id } , { db, pubsub }, info){
        const newid = uuid();
        const newRoom = new Room({
            owner: user_id,
            joiner: '',
            room_id: newid,
            room_link: newid,
            room_game: '',
            room_onready: [false, false],
            room_lock: false,
        });
        const result = await newRoom.save();
        return result;
    },

    async joinRoom(parent ,{ user_id , room_link } , { db, pubsub } , info){
        const room = await Room.findOne({ room_link : room_link });
        if(!room) return null;
        if(room.joiner) return null;
        room.joiner = user_id;
        const result = await room.save();
        pubsub.publish('ROOM_JOINED', {
            roomJoined: room,
        });
        return result;
    },

    async deleteRoom(parent, { room_id }, { db, pubsub }, info){
        await Room.deleteOne({ room_id : room_id });
        return true;
    },

    async leaveRoom(parent, { user_id, room_id }, { db, pubsub }, info){
        const room = await Room.findOne({ room_id : room_id });

        if(!room) return false;
        if(room.owner === user_id){
            room.owner = '';
            await room.save();
            await Room.deleteOne({ room_id : room_id });
            pubsub.publish('USER_LEAVED', {
                userLeaved: room,
            })
        }
        else if(room.joiner === user_id){
            room.joiner = '';
            room.room_onready[1] = false;
            await room.save();
            pubsub.publish('USER_LEAVED', {
                userLeaved: room,
            });
        }

        return true;
    },

    async userReady(parent, { user_id , room_id }, { db , pubsub }, info){
        const room = await Room.findOne({room_id : room_id});
        if(!room) return null;
        if( room.owner === user_id ){
            room.room_onready[0] = true;
        }
        else if(room.joiner === user_id){
            room.room_onready[1] = true;
        }
        const result = await room.save();
        pubsub.publish('USER_CHANGED', {
            userStateChange: result,
        })
        return result;
    },
    
    async userunReady(parent, { user_id, room_id }, { db , pubsub } ,info){
        const room = await Room.findOne({ room_id : room_id });
        if(!room) return null;
        if(room.owner === user_id){
            room.room_onready[0] = false;
        }
        else if(room.joiner === user_id){
            room.room_onready[1] = false;
        }
        const result = await room.save();
        pubsub.publish('USER_CHANGED', {
            userStateChange: result,
        })
        return result;
    },

    async createGame(parent, { room_id, player1, player2 } , { db , pubsub }, info){
        const room = await Room.findOne({ room_id : room_id });
        if(!room){
            
            return null;
        }
        const newGame = new Game({
            player1: player1,
            player2: player2,
            room_id: room_id,
            turn: player1,
            chess: [
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
            ],
            isEnd: '',
            id: uuid(),
        });
        const result = newGame.save();
        room.room_game = newGame.id;
        await room.save();
        pubsub.publish('ROOM_CHANGED', {
            roomStateChange: room,
        })
        return result;
    },
    async action(parent, { game_id, player_id, player_move }, { db , pubsub }, info){
        
        let game = await Game.findOne({ id : game_id });
        if(!game) return null;
        const i = player_move[0];
        const j = player_move[1];

        const bit = game.turn === game.player1 ? 'o' : 'x';

        if(game.turn === game.player1){

            game.chess[i][j] = 'o';
            game.turn = game.player2
            await Game.updateOne(
                {id: game.id},
                {$set: {turn: game.turn, chess: game.chess }},
            );
            
        }
        else{
            game.chess[i][j] = 'x';
            game.turn = game.player1;
            await Game.updateOne(
                {id: game.id},
                {$set: {turn: game.turn, chess: game.chess }},
            );
            
        }

        if(isWin(game.chess, i, j, bit )){
            game.isEnd = player_id;
            await Game.updateOne(
                {id: game.id},
                {$set: {isEnd : player_id} },
            )
        }

        pubsub.publish('GAME_CHANGED', {
            gameStateChange: game,
        });

        return game;
    },

    async sendMail(parent, { from_email, to_email, room_link }, { db, pubsub }, info){
        const existing = await User.findOne({ user_email: to_email });
        /* if the user not existing , don send */
        if(!existing) return null;
        const context = `Hi ${to_email}, room invitation link ${room_link} from ${from_email}`;
        const newMail = new Mail({
            from_email: from_email,
            to_email: to_email,
            content: context,
            id: uuid(),
        });
        const result = await newMail.save();
        pubsub.publish('MAIL_CHANGED', {
            mailStateChange: newMail,
        });
        return result;
    },

    async removeMail(parent, { id } , { db , pubsub }, info){
        await Mail.deleteOne({ id : id });
        return true;
    },

    async lockRoom(parent, { room_id }, { db, pubsub }, info){
        const room = await Room.findOne({ room_id : room_id });
        if(!room) return null;
        room.room_lock = !room.room_lock;
        const result = await room.save();
        pubsub.publish('ROOM_CHANGED', {
            roomStateChange: room,
        });
        return result;
    },

    async createHistory(parent, { player1, player2 , room_id ,game_result} , { db, pubsub }, info){
        const newHistory = new History({
            player1: player1,
            player2: player2,
            room_id: room_id,
            game_result: game_result,
        });
        const result = await newHistory.save();
        return result;
    },

    async FinishGame(parent, { game_id , player1, player2, room_id, game_result }, { db, pubsub }, info){
        const newHistory = new History({
            player1: player1,
            player2: player2,
            room_id: game_id,
            game_result: game_result,
        });
        await newHistory.save();
        const room = await Room.findOne({ room_id : room_id });
        
        room.room_game = '';
        room.room_onready[0] = room.room_onready[1] = false;
        const result = await room.save();
        await Game.deleteOne({ game_id : game_id });
        pubsub.publish('ROOM_CHANGED', {
            roomStateChange: room,
        })
        return result;
    },

    async EndGame(parent, { game_id, game_result }, { db, pubsub }, info){
        const game = await Game.findOne({ id : game_id });
        if(!game) return null;
        game.isEnd = game_result;
        await Game.updateOne(
            {id: game.id},
            {$set: {isEnd : game_result} },
        )
        pubsub.publish('GAME_CHANGED', {
            gameStateChange: game,
        });
        return game;
    }
}

export { Mutation as default }