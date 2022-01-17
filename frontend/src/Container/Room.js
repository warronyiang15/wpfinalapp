import { useState, useEffect } from 'react'
import react from 'react'
import styled, { withTheme } from 'styled-components'
import { useQuery, useMutation, useLazyQuery, useSubscription } from '@apollo/client';
import { Fragment } from 'react';

import { Divider, Paper, Typography } from '@mui/material';
import { Button } from '@mui/material';

import { GETROOM_QUERY, GETUSER_QUERY , GETGAME_QUERY} from '../graphql/query';
import { ROOM_JOINED_SUBSCRIPTION, USER_STATE_CHANGED, ROOM_STATE_CHANGED, USER_LEAVED_SUBSCRIPTION } from '../graphql/subscription';
import { DELETE_ROOM_MUTATION, USER_READY_MUTATION, USER_UNREADY_MUTATION, CREATE_GAME_MUTATION, LEAVE_ROOM_MUTATION, LOCK_ROOM_MUTATION } from '../graphql/mutation';
import Game from './game';
import { delay } from '../Utility/utility';
import Player from '../Component/Player';
import InviteModal from './Modal/InviteModal';

const Page = styled(Paper)`
    width:100%;
    height:100%;

    display:flex;
    flex-direction:column;
    justify-content: space-evenly;
    align-items: center;
`

const Header = styled.div`
    flex: 1;
    width:100%;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
`

const Body = styled.div`
    flex: 8;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width:100%;
    height:100%;
`

const PArea = styled.div`
    flex: 4;
    width:100%;
    height:100%;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
`

const PBlock = styled.div`
    flex: 1;
    width:10%;
    height: 40ch;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    
`

const Footer = styled.div`
    flex: 2;
    width: 85%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const ButtonGroup = styled.div`
    flex: 2;
    width: 100%;
    height: 100%;
    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const ButtonPage = styled(Paper)`
    display: flex;
    flex-direction: column;
    justify-content:space-evenly;
    align-items: center;
    opacity: 0.3
    transition: opacity 200ms;
    &:hover{
        opacity: 0.6;
    }
`


const Room = ( props ) => {
    const [room ,setRoom] = useState(props.room);
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);
    const [mode, setMode] = useState(false);
    const [game ,setGame] = useState(null);
    const user = props.user;
    
    /* modal */
    const [open, setOpen] = useState(false);

    const { data, error, loading, refetch, subscribeToMore } = useQuery(GETROOM_QUERY, {
        variables:{
            room_id : room == null ? null : room.room_id,
        },
    });

    const room_q = useQuery(GETROOM_QUERY, {
        variables:{
            room_id : room == null ? null : room.room_id
        },
    });

    const [ getUser1, user1_q ] = useLazyQuery(GETUSER_QUERY);
    const [ getUser2, user2_q ] = useLazyQuery(GETUSER_QUERY);
    const [ getGame, game_q ] = useLazyQuery(GETGAME_QUERY);

    const [deleteRoom] = useMutation(DELETE_ROOM_MUTATION);
    const [getReady] = useMutation(USER_READY_MUTATION);
    const [getunReady] = useMutation(USER_UNREADY_MUTATION);
    const [createGame] = useMutation(CREATE_GAME_MUTATION);
    const [leaveRoom] = useMutation(LEAVE_ROOM_MUTATION)
    const [lockRoom] = useMutation(LOCK_ROOM_MUTATION);

    useEffect(() => {
        async function fetchData(){
            setRoom(props.room);
            await refetch();
            user1_q.refetch();
            user2_q.refetch();
            game_q.refetch();
            if(player1 == null && props.room.owner){
                let p1 = await getUser1({
                    variables:{
                        user_id: props.room.owner,
                    },
                });

                setPlayer1(p1.data.requestUser);
            }
            if(player2 == null && props.room.joiner){
                let p2 = await getUser2({
                    variables:{
                        user_id: props.room.joiner,
                    },
                });
                setPlayer2(p2.data.requestUser);   
            }
            else if(player2 != null && !props.room.joiner){
                setPlayer2(null);
            }
            setOpen(false);
            if( !props.room.room_game ){
                const continue_game = await getGame({
                    variables: {
                        game_id: props.room.room_game,
                    },
                });
                if(continue_game.data.getGame == null){
                    setGame(null);
                }
                else{
                    setGame(continue_game.data.getGame);
                    setMode(true);
                }
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        subscribeToMore({
            document: ROOM_JOINED_SUBSCRIPTION,
            variables: { room_id : room == null ? null : room.room_id },
            updateQuery: (prev, { subscriptionData }) => {
            
                if(!subscriptionData.data) return prev;
                if(room != null && subscriptionData.data.roomJoined.room_id === room.room_id){
                    setRoom(subscriptionData.data.roomJoined);
                }
                return {
                    getRoom : subscriptionData.data.roomJoined,
                }
            }
        })
    }, [room])

    useEffect(() => {
        subscribeToMore({
            document: USER_STATE_CHANGED,
            variables: { room_id : room == null ? null : room.room_id },
            updateQuery: (prev, { subscriptionData }) => {
                
                if(!subscriptionData.data) return prev;
                if(room != null && subscriptionData.data.userStateChange.room_id === room.room_id){
                    setRoom(subscriptionData.data.userStateChange);
                }
                return{
                    getRoom: subscriptionData.data.userStateChange,
                }
            }
        })
    }, [room])

    
    useEffect(() => {
         room_q.subscribeToMore({
            document: ROOM_STATE_CHANGED,
            variables: { room_id : room == null ? null : room.room_id },
            updateQuery: (prev, { subscriptionData }) => {

                if(!subscriptionData.data) return prev;

                if(subscriptionData.data.roomStateChange == null){
                    setRoom(null);
                    props.back();
                }

                if(room != null && subscriptionData.data.roomStateChange.room_id === room.room_id){   
                    setRoom(subscriptionData.data.roomStateChange);
                }
                return{
                    getRoom: subscriptionData.data.roomStateChange,
                }
            }
        })
    }, [room])

    useEffect(() => {
        subscribeToMore({
            document: USER_LEAVED_SUBSCRIPTION,
            variables: { room_id : room == null ? null : room.room_id },
            updateQuery: (prev, { subscriptionData }) => {
                if(!subscriptionData.data) return prev;

                const data = subscriptionData.data.userLeaved;

                if(data.room_id === room.room_id){
                    if(!data.owner){
                        setRoom(null);
                        props.back();
                    }
                    else{
                        setRoom(data);
                    }
                }
                return{
                    getRoom : data,
                }
            }
        })
    }, [room])
    

    useEffect(() => {
        if(room == null) return;
        async function fetchData(){
            if(player1 == null && room.owner){
                let p1 = await getUser1({
                    variables:{
                        user_id: room.owner,
                    },
                });

                setPlayer1(p1.data.requestUser);
            }

            if(player2 == null && room.joiner){
                let p2 = await getUser2({
                    variables:{
                        user_id: room.joiner,
                    },
                });
                setPlayer2(p2.data.requestUser);
                
            }
            else if(player2 != null && !room.joiner){
                setPlayer2(null);
            }
        }
        fetchData();
    }, [room, player1, player2]);

    const handleBack = async () => {

        const result = await leaveRoom({
            variables:{
                user_id: user.user_id,
                room_id: room == null ? null : room.room_id,
            },
        });

        if(result.data.leaveRoom){
            setRoom(null);
            props.back();
        }
        else{
            alert('something wrong');
        }
    }

    const handleInvite = () => {
        setOpen(true);
    }

    const handleStart = async () => {
        if(room.room_onready[0] && room.room_onready[1]){
                
            const result = await createGame({
                variables:{
                    room_id: room == null ? null : room.room_id,
                    player1: room.owner,
                    player2: room.joiner,
                },
            });

            setGame(result.data.createGame);
            
            setMode(true);
        }
    }

    useEffect(() => {
        async function fetchData(){
            if(game == null && room != null && room.room_game != '' && mode === false){
                const result = await getGame({
                    variables:{
                        game_id: room.room_game,
                    },
                });
                setGame(result.data.getGame);
                setMode(true);
            }   
        }
        fetchData();
    }, [game, room])
    
    const handleReady0 = async () => {
        if(player1 == null || user.user_id !== player1.user_id) return;
        const result = await getReady({
            variables: {
                user_id: user.user_id,
                room_id: room == null ? null : room.room_id,
            },
        });
        
        setRoom(result.data.userReady);
    }

    const handleUnReady0 = async () => {
        if(player1 == null || user.user_id !== player1.user_id) return;
        const result = await getunReady({
            variables: {
                user_id: user.user_id,
                room_id: room == null ? null : room.room_id,
            },
        });
        
        setRoom(result.data.userunReady);
    }

    const handleReady1 = async () => {
        if(player2 == null || user.user_id !== player2.user_id) return;

        const result = await getReady({
            variables: {
                user_id: user.user_id,
                room_id: room == null ? null : room.room_id,
            },
        });
        
        setRoom(result.data.userReady);
    }

    const handleUnReady1 = async () => {
        if(player2 == null || user.user_id !== player2.user_id) return;
        const result = await getunReady({
            variables: {
                user_id: user.user_id,
                room_id: room == null ? null : room.room_id,
            },
        });
        
        setRoom(result.data.userunReady);
    }

    const handleLock = async () => {
        const result = await lockRoom({
            variables:{
                room_id: room == null ? null : room.room_id,
            },
        });
        if(result.data.lockRoom == null) return;
        else{
            setRoom(result.data.lockRoom);
        }

    }

    const handleCopy = () => {
        navigator.clipboard.writeText(room.room_id);
    }
    
    return  room == null ? (<Fragment />) : (mode ? (<Game game={game} user={user} room={room} setRoom={setRoom} setMode={setMode} setRoomGame={setGame}></Game>) : 
    (<Fragment>
        <InviteModal open={open} setOpen={setOpen} user={user} room_link={room == null ? '' : room.room_link}/>
        <Page elevation = {24} sx = {{ backgroundImage: 'url("https://i.ibb.co/BgnNrJ0/813534-background-simple-tumblr-3000x2000-for-lockscreen.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
            <Header>
                <Button onClick={handleCopy} variant="filled">
                    <Typography  variant= "h6" component = "div"  color = "white"> Room id : {room == null ? null : room.room_id} </Typography>
                </Button>
            </Header>
            <Divider orientation='horizontal' style = {{ width : '100%' }} />
            <Body>
                <PArea>
                    <PBlock>
                        <Player player={player1} room = {room} user_role={room == null ? '' : room.owner} ready={room == null ? false : room.room_onready[0]} handleUnReady0={handleUnReady0} handleReady0={handleReady0}/> 
                    </PBlock>
                    <PBlock>
                        <Player player={player2} room = {room} user_role={room == null ? '' : room.joiner} ready={room == null ? false : room.room_onready[1]} handleUnReady0={handleUnReady1} handleReady0={handleReady1}/>
                    </PBlock>
                </PArea>
                <Divider orientation='vertical'  />
                <ButtonGroup>
                    <ButtonPage evaluation ={24} sx = {{ position: 'relative', bottom : '25px', width : '80%' , height : '60ch', backgroundColor: 'gray', opacity: 0.3}}>
                        <Button onClick ={handleBack} style = {{ width : '50%', height : '10ch' }}  variant="contained">back</Button>
                        <Button onClick ={handleInvite} style = {{ width : '50%', height : '10ch'}} variant="contained">Invite</Button>
                        <Button onClick = {handleStart} style = {{ width : '50%', height : '10ch' }} variant="contained" color= { room == null ? 'error' : room.room_onready[0] && room.room_onready[1] ? 'success' : 'error'}>Start</Button>
                        <Button onClick ={handleLock} style = {{ width : '50%', height : '10ch' }} variant="contained" color={room == null ? 'primary' : room.room_lock ? 'error' : 'primary'}>{ room == null ? 'LOCK ROOM' : room.room_lock ? 'UNLOCK ROOM' : 'LOCK ROOM' } </Button>
                    </ButtonPage>
                </ButtonGroup>
            </Body>
        </Page>
    </Fragment>)
    );
}

export default Room