import { useState, useEffect } from 'react'
import react from 'react'
import styled, { withTheme } from 'styled-components'
import { useQuery, useMutation, useLazyQuery, useSubscription } from '@apollo/client';
import { Fragment } from 'react';

import { Divider, Paper } from '@mui/material';
import { Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PeopleIcon from '@mui/icons-material/People';
import { Badge } from '@mui/material';

import Room from './Room';
import Game from './game';
import JoinModal from './Modal/joinModal';
import { CREATE_ROOM_MUTATION } from '../graphql/mutation';
import { GETHISTORY_QUERY, BACKROOM_QUERY } from '../graphql/query';
import { JOIN_ROOM_MUTATION } from '../graphql/mutation';

import History from './History';
import MailModal from './Modal/MailModal';

const Page = styled(Paper)`
    width:100%;
    height:100%;

    display:flex;
    flex-direction:column;
    justify-content: space-evenly;
    align-items: center;
`

const Header = styled.div`
    flex:2;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width:100%;
    height:100%;
`

const Body = styled.div`
    flex:8;
    display: flex;
    flex-direction:column;
    justify-content: space-evenly;
    align-items: center;
    width:100%;
    height:100%;
`

const Body2 = styled.div`
    flex:6;
    display: flex;
    flex-direction: row;
    flex-wrap:no-wrap;
    justify-content:space-evenly;
    align-items: center;
    width:100%;
    height:100%;
`

const HistoryArea = styled.div`
    flex: 4;
    width:80%;
    height:40ch;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    
`

const HistoryPage = styled(Paper)`
    width:100%;
    height:100%;
    position: relative;
    left: 10%;
`

const ButtonGroup = styled.div`
    flex: 4;
    width: 50ch;
    height: 30ch;
    display: flex;
    flex-direction: column;
    
`

const HistoryBlock = styled.div`
    flex: 1;
    width:100%;
    height:90%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    
`


const MainMenu = ( props ) => {

    const [mode, setMode] = useState(false); // false => main menu , true => room
    const [room, setRoom] = useState(null);
    const user = props.user;

    const [badge, setBadge] = useState(0);

    /* modal */
    const [openJoin, setJoin] = useState(false);
    const [openMail, setMail] = useState(false);

    const [addRoom] = useMutation(CREATE_ROOM_MUTATION);
    const [joinRoom] = useMutation(JOIN_ROOM_MUTATION);
    const { data ,loading , error, refetch } = useQuery(GETHISTORY_QUERY, {
        variables:{
            player_id: user.user_id,
        },
    });

    const [getbackroom, backroom_q] = useLazyQuery(BACKROOM_QUERY);

    const handleCreateRoom = async () => {
        const result = await addRoom({
            variables:{
                user_id: user.user_id,
            },
        });
        setRoom(result.data.createRoom);
    }

    useEffect(() => {
        if(room != null)
            setMode(true);
        else
            setMode(false);
    }, [room])

    const handleJoinRoom = () => {
        setJoin(true);
    }

    const handleEmail = () => {
        setBadge(0);
        setMail(true);
    }

    const handleBack = async () => {
        await refetch();
        setRoom(null);
    }
    
    /* first render */
    useEffect(() => {
        async function fetchData(){
            await refetch();
            setMode(false);
            setRoom(null);
            setJoin(false);
            setMail(false);
            const found = await getbackroom({
                variables:{
                    user_id: user.user_id,
                },
            });

            if(found.data.BackRoom == null) return;
            else{
                /* join room here */

                setRoom(found.data.BackRoom);
            }
        }
        fetchData();
    }, [])
    
    return !mode ? (<Page style = {{ backgroundImage: 'url(https://image.freepik.com/free-vector/abstract-simple-background_53876-99863.jpg)', backgroundSize: 'cover', backgroundRepeat:'no-repeat'}}>
    <JoinModal open={openJoin} setOpen={setJoin} joinRoom={setRoom} user={user}></JoinModal>
    <MailModal open={openMail} setOpen={setMail} user={user} addmail={setBadge} mail={badge} />
    <Header>
        <Typography style = {{ flex : 5 }} variant= "h3" component = "div" sx = {{ ml : 20, fontFamily:"Comic Sans MS, Comic Sans, cursive", fontWeightBold: '900' }} > Welcome back {user.user_name}! </Typography>
        <Badge badgeContent={badge} color="primary">
        <IconButton style = {{ flex : 1 }} sx = {{ width : '4ch' , height : '4ch' }} color="primary" aria-label="mail" onClick={handleEmail}>
            <EmailIcon sx = {{ width : '100%', height : '100%'}} />
        </IconButton>
        </Badge>
        <IconButton style = {{ flex : 1 }} sx = {{ width : '4ch' , height : '4ch' }} color="error" aria-label="logout" onClick={props.logout}>
            <LogoutIcon sx = {{ width : '100%', height : '100%'}} />
        </IconButton>
    </Header>
    <Divider style= {{width:'100%'}} />
    <Body>
        <Body2>
            <HistoryArea>
                <HistoryPage elevation={24} sx = {{ width : '80%'}}>
                    <AppBar position = "static" sx = {{ width : '100%' , height : '5ch', backgroundColor: 'black'}} style = {{ alignItems: 'center', justifyContent: 'center'}}>
                        <Typography variant= "h5" component = "div" sx = {{ fontFamily:"Comic Sans MS, Comic Sans, cursive", fontWeightBold: '900'}}> History </Typography>
                    </AppBar>
                    <HistoryBlock>
                        
                        {(data == null || data.getHistory == null) ? (<Fragment/>) : 
                        data.getHistory.map(
                            h => (<History user={user} key = {h.room_id} player1={h.player1} player2={h.player2} game_result={h.game_result} room_id={h.room_id}></History>)
                        )}
                    </HistoryBlock>
                </HistoryPage>
            </HistoryArea>
            <Divider  style={{ flex: 1 }}  orientation='vertical'/>
            <ButtonGroup>
                <Page style = {{position: 'relative', left: '80px', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundImage: 'url("https://getwallpapers.com/wallpaper/full/6/0/7/1085611-new-simple-backgrounds-2560x1440-pictures.jpg")' }} elevation = {24} sx = {{ width : '80%', height : '100%', }}>
                    <Button sx = {{ width : '40%' , height : '6ch' }} color="warning" variant="contained" onClick={handleCreateRoom}> <AddCircleIcon sx = {{ mr : 2 }} />createRoom</Button>
                    <Button  sx = {{ width : '40%', height : '6ch' }} variant="contained" onClick={handleJoinRoom}> <PeopleIcon sx = {{ mr : 2 }} /> joinRoom</Button>
                </Page>
            </ButtonGroup>
        </Body2>
    </Body>
</Page>) : (<Room room={room} back={handleBack} user={user}/>);
}

export default MainMenu