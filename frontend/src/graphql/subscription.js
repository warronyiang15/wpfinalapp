import { gql } from '@apollo/client'

export const ROOM_JOINED_SUBSCRIPTION = gql`
    subscription roomJoined{
        roomJoined{
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

export const USER_STATE_CHANGED = gql`
    subscription userStateChange{
        userStateChange{
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
export const GAME_STATE_CHANGED = gql`
    subscription gameStateChange{
        gameStateChange{
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

export const ROOM_STATE_CHANGED = gql`
    subscription roomStateChange{
        roomStateChange{
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

export const MAIL_STATE_CHANGED = gql`
    subscription mailStateChange{
        mailStateChange{
            from_email
            to_email
            content
            id
        }
    }
`

export const USER_LEAVED_SUBSCRIPTION = gql`
    subscription userLeaved{
        userLeaved{
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

