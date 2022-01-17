import { gql } from '@apollo/client'

export const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccount($user_name: String!, $user_pass: String!, $user_email: String!){
        createAccount(user_name:$user_name, user_pass:$user_pass, user_email:$user_email){
            user_id
            user_name
            user_email
            user_rating
            user_online       
        }
    }
`

export const CREATE_AUTH_MUTATION = gql`
    mutation createAuth($user_email: String!){
        createAuth(user_email: $user_email)
    }
`

export const CREATE_ROOM_MUTATION = gql`
    mutation createRoom($user_id: String!){
        createRoom(user_id: $user_id){
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

export const DELETE_ROOM_MUTATION = gql`
    mutation deleteRoom($room_id: String!){
        deleteRoom(room_id:$room_id)
    }
`

export const USER_READY_MUTATION = gql`
    mutation userReady($user_id: String, $room_id: String){
        userReady(user_id:$user_id, room_id:$room_id){
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

export const USER_UNREADY_MUTATION = gql`
    mutation userunReady($user_id: String, $room_id: String){
        userunReady(user_id:$user_id, room_id:$room_id){
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

export const LEAVE_ROOM_MUTATION = gql`
    mutation leaveRoom($user_id: String, $room_id: String){
        leaveRoom(user_id:$user_id, room_id:$room_id)
    }
`


export const JOIN_ROOM_MUTATION = gql`
    mutation joinRoom($user_id: String!, $room_link:String!){
        joinRoom(user_id:$user_id, room_link:$room_link){
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

export const CREATE_GAME_MUTATION = gql`
    mutation createGame($room_id: String,$player1: String,$player2: String){
        createGame(room_id:$room_id, player1:$player1, player2:$player2){
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

export const TAKE_ACTION_MUTATION = gql`
    mutation action($game_id: String,$player_id: String!, $player_move: [Int]){
        action(game_id:$game_id,player_id:$player_id,player_move:$player_move){
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

export const SEND_MAIL_MUTATION = gql`
    mutation sendMail($from_email: String, $to_email: String, $room_link: String){
        sendMail(from_email:$from_email, to_email:$to_email, room_link:$room_link){
            from_email
            to_email
            content
            id
        }
    }
`

export const REMOVE_MAIL_MUTATION = gql`
    mutation removeMail($id: String){
        removeMail(id:$id)
    }
`

export const LOCK_ROOM_MUTATION = gql`
    mutation lockRoom($room_id: String){
        lockRoom(room_id: $room_id){
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

export const CREATE_HISTORY_MUTATION = gql`
    mutation createHistory($player1: String, $player2: String, $room_id: String, $game_result: String){
        createHistory(player1:$player1,player2:$player2,room_id:$room_id,game_result:$game_result){
            room_id
            game_result
            player1
            player2
        }
    }
`

export const FINISH_GAME_MUTATION = gql`
    mutation FinishGame($game_id: String, $player1: String, $player2: String, $room_id: String, $game_result: String){
        FinishGame(game_id:$game_id, player1:$player1, player2:$player2, room_id:$room_id, game_result:$game_result){
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

export const END_GAME_MUTATION = gql`
    mutation EndGame($game_id:String , $game_result:String){
        EndGame(game_id:$game_id, game_result:$game_result){
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