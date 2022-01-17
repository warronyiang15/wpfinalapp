import { gql } from '@apollo/client'


export const LOGIN_QUERY = gql`
    query requestLogin($user_name:String!, $user_pass:String!){
        requestLogin(user_name:$user_name, user_pass:$user_pass){
            user_id
            user_name
            user_email
            user_rating
            user_online
        }
    }
`

export const AUTH_QUERY = gql`
    query requestAuth($user_email: String!, $code: String!){
        requestAuth(user_email:$user_email, code:$code)
    }
`

export const EXISTING_QUERY = gql`
    query requestExisting($user_name: String!, $user_email: String!){
        requestExisting(user_name:$user_name, user_email:$user_email)
    }
`

export const GETROOM_QUERY = gql`
    query getRoom($room_id: String){
        getRoom(room_id:$room_id){
            owner
            joiner
            room_id
            room_link
            room_game
            room_onready
            room_lock
        }
    }
`

export const GETUSER_QUERY = gql`
    query requestUser($user_id: String){
        requestUser(user_id:$user_id){
            user_id
            user_name
            user_email
            user_rating
            user_online
        }
    }
`

export const GETGAME_QUERY = gql`
    query getGame($game_id: String){
        getGame(game_id:$game_id){
            player1
            player2
            turn
            chess
            isEnd
            id
            room_id
        }
    }
`

export const GETMAIL_QUERY = gql`
    query getMail($email: String){
        getMail(email:$email){
            from_email
            to_email
            content
            id
        }
    }
`

export const GETWAITINGROOM_QUERY = gql`
    query requestWaitingRoom{
        requestWaitingRoom
    }
`

export const GETHISTORY_QUERY = gql`
    query getHistory($player_id:String){
        getHistory(player_id:$player_id){
            room_id
            game_result
            player1
            player2
        }
    }
`

export const BACKROOM_QUERY = gql`
    query BackRoom($user_id:String){
        BackRoom(user_id:$user_id){
            owner
            joiner
            room_id
            room_link
            room_game
            room_onready
            room_lock
        }
    }
`

export const GET_USER_NAME_QUERY = gql`
    query getUserName($user_id:String){
        getUserName(user_id:$user_id)
    }
`