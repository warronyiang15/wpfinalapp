const Subscription = {
    roomJoined: {
        subscribe: (parent, args, { pubsub }) => {
            return pubsub.asyncIterator('ROOM_JOINED');
        }
    },
    userStateChange: {
        subscribe: (parent, args, { pubsub }) => {
            return pubsub.asyncIterator('USER_CHANGED');
        }
    },
    gameStateChange: {
        subscribe: (parent, args, { pubsub }) => {
            return pubsub.asyncIterator('GAME_CHANGED');
        }
    },
    roomStateChange: {
        subscribe: (parent, args, { pubsub }) => {
            return pubsub.asyncIterator('ROOM_CHANGED');
        }
    },
    mailStateChange: {
        subscribe: (parent, args, { pubsub }) => {
            return pubsub.asyncIterator('MAIL_CHANGED');
        }
    },
    userLeaved: {
        subscribe: (parent, args, { pubsub }) => {
            return pubsub.asyncIterator('USER_LEAVED');
        }
    }
}

export default Subscription