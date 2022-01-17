import User from "../Component/User";
import Puser from "../Component/pUser";
import Room from '../Component/Room'

import bcrypt from 'bcrypt'
import Game from "../Component/Game";
import Mail from "../Component/Mail";
import History from "../Component/History";
import Secret from "../Component/secret";

const Query = {
    async requestLogin(parent, { user_name , user_pass }, { db, pubsub }, info){
        const user = await User.findOne({ user_name : user_name });
        if(!user) return null;

        const matching = await bcrypt.compare(user_pass, user.user_pass );

        if(matching) return user;
        else return null;
    },

    async requestAuth(parent, { user_email, code }, { db, pubsub } ,info){
        const existing = await Puser.find( { email : user_email });
        if(!existing) return false;
        for(let i = 0;i < existing.length;i++){
            const result = await bcrypt.compare(code, existing[i].code);
            if(result) return true;
        }
        return false;
    },
    
    async requestExisting(parent, { user_name , user_email } , { db , pubsub } , info){
        const existing = await User.findOne( { user_name : user_name });
        if(existing) return true;
        const existing2 = await User.findOne( { user_email : user_email });
        if(existing2) return true;
        return false;
    },

    async requestUser(parent, { user_id } , { db, pubsub } , info){
        if(!user_id) return null;
        const user = User.findOne({ user_id : user_id });
        return user;
    },

    async getRoom(parent, { room_id } , { db , pubsub } , info){
        const room = await Room.findOne({ room_id : room_id });
        return room;
    },

    async getGame(parent, { game_id }, { db, pubsub }, info){
        const game = await Game.findOne({ id : game_id });
        return game;
    },

    async getMail(parent, { email }, { db, pubsub }, info){
        const result = await Mail.find({ to_email: email });
        return result;
    },
    async requestWaitingRoom(parent, {} , {db ,pubsub} , info){
        const result = await Room.find({ room_joiner : '' });
        if(result == null) return null;
        for(let i = 0;i < result.length;i++){
            
            if(!result[i].room_lock){
                return result[i].room_id;
            }
        }
        return null;
    },

    async getHistory(parent, { player_id }, { db, pubsub }, info){
        const result = await History.find({ player1 : player_id });
        const result2 = await History.find({ player2: player_id });
        let final_result = []
        if(result != null){
            for(let i =0 ;i < result.length;i++){
                final_result.push(result[i]);
            }
        }
        if(result2 != null){
            for(let i =0 ;i < result2.length;i++){
                final_result.push(result2[i]);
            }
        }
        return final_result.length === 0 ? null : final_result;
    },

    async BackRoom(parent, { user_id }, { db , pubsub } , info){
        const existing = await Room.findOne({ owner: user_id });
        if(existing) return existing;
        const existing2 = await Room.findOne({ joiner: user_id });
        if(existing2) return existing2;
        return null;
    },

    async getUserName(parent, { user_id }, {db , pubsub } , info){
        const user = await User.findOne({ user_id : user_id });
        if(!user) return null;
        return user.user_name;
    }
}


export { Query as default }