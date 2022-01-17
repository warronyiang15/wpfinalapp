import { useState, useEffect } from 'react'
import react from 'react'
import styled, { withTheme } from 'styled-components'
import { useQuery, useMutation, useLazyQuery, useSubscription } from '@apollo/client';
import { Fragment } from 'react';

import Button from '@mui/material/Button';
import { Divider, Paper, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import { GETGAME_QUERY, GETROOM_QUERY } from '../graphql/query';
import { GAME_STATE_CHANGED } from '../graphql/subscription';
import { TAKE_ACTION_MUTATION, FINISH_GAME_MUTATION, END_GAME_MUTATION } from '../graphql/mutation';
import PlayerBadge from '../Component/PlayerBadge';
import { delay } from '../Utility/utility';
import ResultModal from './Modal/resultModal';

const Page = styled(Paper)`
    width:130ch;
    height:65ch;
    position:relative;
    top:10px;
    left:5px;

    display:flex;
    flex-direction:row;
    justify-content: space-evenly;
    align-items: center;
`

const Area = styled.div`
    flex:1;
    display:flex;
    flex-direction:column;
    justify-content:space-evenly;
    position: relative;
    top:12px;
`

const Row = styled.div`
    flex:1;
    display: flex;
    flex-direction: row;
    align-items: center;
`


const Cell = styled.div`
    flex:1;
    width: 50px;
    height: 50px;
    background-color: green;
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    transition: background-color 200ms;
    &:hover{
        background-color: ${props => props.disabled ? 'green' : 'white'};
    }
`

const Chess = styled.div`
    width: 40px;
    height:40px;
    background-color: ${props => props.color === 'true' ? 'white' : 'black'};
    border-radius: 100%;
`

const Info = styled.div`
    flex:1;
    display: flex;
    flex-direction: column;
    width:100%;
    height:100%;
    background-color:gray;
    justify-content: space-around;
    align-items:center;
`

const Game = ( props ) => {

    
    const [game, setGame] = useState(null);
    const [isEnd, setEnd] = useState(false);
    const [timerLeft, setTimerLeft] = useState(120);
    const user = props.user;
    const room = props.room;

    /* modal */
    const [open, setOpen] = useState(false);
   
    const { loading, data, error, refetch, subscribeToMore } = useQuery(GETGAME_QUERY, {
        variables:{
            game_id: game == null ? '' : game.id,
        }
    });

    const [getRoom, room_q] = useLazyQuery(GETROOM_QUERY);

    const [take_action] = useMutation(TAKE_ACTION_MUTATION);
    const [finish_game] = useMutation(FINISH_GAME_MUTATION)
    const [end_game] = useMutation(END_GAME_MUTATION);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setTimerLeft(timerLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
    });

    useEffect(() => {
        async function fetchData(){
            const result = await end_game({
                variables:{
                    game_id: game.id,
                    game_result: game.turn === game.player1 ? game.player2: game.player1,
                },
            });

            setEnd(true);
            setGame(result.data.EndGame);
        }
        if(timerLeft === 0){
            /* timeout , whos turn whos lose */
            fetchData();
        }
    }, [timerLeft, game, isEnd])
    
    useEffect( () => {
        subscribeToMore({
            document: GAME_STATE_CHANGED,
            variables: { game_id: game == null ? '' : game.id },
            updateQuery: async (prev, { subscriptionData }) => {
                if(!subscriptionData.data) return prev;
                while(game == null){
                    await delay(1000);
                }
                if(subscriptionData.data.gameStateChange.id == game.id){
                    setTimerLeft(120);
                    setGame(subscriptionData.data.gameStateChange);
                    if(!isEnd && game.isEnd){
                        setEnd(true);
                    };
                }
                return{
                    getGame: subscriptionData.data.gameStateChange,
                }
            }
        })
    }, [game, isEnd])

    useEffect(() => {
        async function fetchData(){
            if(isEnd){
                setOpen(true);
                await delay(8000);
                if(user.user_id === room.owner){
                    const result = await finish_game({
                        variables: {
                            game_id: game.id,
                            player1: game.player1,
                            player2: game.player2,
                            room_id: room.room_id,
                            game_result: game.isEnd,
                        },
                    });
                    
                    setGame(null);
                    props.setRoom(result.data.FinishGame);
                    setOpen(false);
                    props.setRoomGame(null);
                    props.setMode(false);
                }
                else{
                    const result = await getRoom({
                        variables:{
                            room_id: room.room_id,
                        },
                    });
                    
                    setGame(null);
                    setOpen(false);
                    props.setRoom(result.data.getRoom);
                    props.setRoomGame(null);
                    props.setMode(false);
                }
            }
        }
        fetchData();
    }, [isEnd])

    
    useEffect(() => {
        async function fetchData(){
            
            const data = props.room.room_game;
            const result = await refetch( { game_id : data });
            
            setGame(result.data.getGame);
        }
        fetchData();
    }, [])

    const handlePlace = async (e) => {
       if( game.turn !== user.user_id ) return;
       let index = e.target.id.split(',');
       for(let i =0;i < index.length;i++){
           index[i] = parseInt(index[i]);
       }
       if( game.chess[index[0]][index[1]] !== '.' ) return;
       
       const result = await take_action({
           variables:{
               game_id: game.id,
               player_id: user.user_id,
               player_move: index,
           },
       });       
       
    }

    
    return(
        <Page sx = {{ backgroundColor:'black'}}>
            <ResultModal open={open} setOpen={setOpen} user={user} game_result={game == null ? 'f' : game.isEnd} />
            <Area>
                {game == null ? (<Fragment />) : game.chess.map(
                    (row, i) => (<Row key={uuidv4()}>
                        {row.map( (c, j) => (
                            <Cell id ={`${i},${j}`} key={uuidv4()} disabled = {c === '.' ? false : true} onClick = {handlePlace} >
                                { c !== '.' ? (<Chess id = {`${i},${j}`} color={c === 'o' ? 'false' : 'true'}></Chess>) : (<Fragment />)}
                            </Cell>
                        ))}
                    </Row>)
                )}
            </Area>
            <Divider orientation='vertical'></Divider>
            <Info>
                <PlayerBadge turn={game == null ? '' : game.turn === game.player1} first={true} player= {game == null ? '' : game.player1}></PlayerBadge>
                <Typography  variant= "h3" component = "div" sx = {{ fontFamily:"Comic Sans MS, Comic Sans, cursive", fontWeightBold: '900' }} > Left time : { timerLeft}  </Typography>
                <PlayerBadge turn={game == null ? '' : game.turn === game.player2} first={false} player={game == null ? '' : game.player2}></PlayerBadge>
            </Info>
        </Page>
    )
    
}

/*<Typography variant="h6" component="div" sx= {{flexGrow : 1}}>{game.turn === game.player1 ? game.turn : game.turn}</Typography>*/

export default Game;