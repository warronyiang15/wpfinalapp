import { useState, useEffect } from 'react'
import react from 'react'
import styled, { withTheme } from 'styled-components'
import { useQuery, useMutation, useLazyQuery, useSubscription } from '@apollo/client';
import { Fragment } from 'react';

import { Paper } from '@mui/material';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Modal } from '@mui/material';
import { Box, compose } from '@mui/system';

import { JOIN_ROOM_MUTATION } from '../../graphql/mutation';
import { GETWAITINGROOM_QUERY } from '../../graphql/query';

/*
<TextField fullWidth sx = {{ m : 1 }} value = {id} onChange = { (e) => setID(e.target.value)} />
<Button variant='contained' onClick={handleClick}>Join!</Button>
*/

const MyPaper = styled(Paper)`
    width:60ch;
    height:30ch;
    display: flex;
    flex-direction:column;
    flex-wrap:wrap;
    justify-content:space-evenly;
    align-items:center;
    position:relative;
    left: 25%;
    top: 200px;
`

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items:center;
    justify-content:space-between;
    width:100%;
`

const JoinModal = ( props ) => {
    const [ID, setID] = useState('');

    
    const [joinRoom] = useMutation(JOIN_ROOM_MUTATION);
    const {data, loading, refetch, error} = useQuery(GETWAITINGROOM_QUERY);
    

    const handleClose = () => {
        props.setOpen(false);
    }

    const handleClick = async () => {
        
        const result = await joinRoom({
            variables:{
                user_id: props.user.user_id,
                room_link: ID,
            },
        });

        
        const data = result.data;
        
        if(data.joinRoom == null){
            alert('room not found');
        }
        else{
            setID('');
            props.setOpen(false);
            props.joinRoom(data.joinRoom);
        }
        
    }

    const handleRjoin = async () => {
        
        const result = await refetch();
        if(result.data.requestWaitingRoom == null){
            alert('No Waiting Room');
        }
        else{
            const res = await joinRoom({
                variables: {
                    user_id: props.user.user_id,
                    room_link: result.data.requestWaitingRoom,
                },
            })
            const data = res.data;
            
            if(data.joinRoom == null){
                alert('room full')
            }else{
                setID('');
                props.setOpen(false);
                props.joinRoom(data.joinRoom);
            }
        }
    }

    return(
        <Modal open={props.open} onClose={handleClose} aria-labelledby="join">
            <Box sx = {{ flexGrow : 1}}>
                <MyPaper>
                    <TextField id="joinID" label="Room ID" fullWidth sx = {{ width: '80%', m : 1 }} value = {ID} onChange = { (e) => setID(e.target.value)} />
                    <ButtonGroup>
                    <Button variant='contained' sx = {{ width: '30ch', ml: 4 }} color="warning" onClick={handleRjoin}>Random_join</Button>
                        <Button variant='contained' sx = {{ width: '30ch', mr: 4 }} onClick={handleClick}>Join!</Button>                        
                    </ButtonGroup>
                </MyPaper>
            </Box>
        </Modal>
    )
}

export default JoinModal