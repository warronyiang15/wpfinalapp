import { useState, useEffect } from 'react'
import react from 'react'
import styled, { withTheme } from 'styled-components'
import { useQuery, useMutation, useLazyQuery, useSubscription } from '@apollo/client';
import { Fragment } from 'react';
import { Paper,Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';

const MyPaper = styled(Paper)`

    flex: 1;
    width : 80%;
    opacity: 0.3;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    transition: opacity 200ms, backgroundColor 1s;
    :hover{
        opacity: 0.5;
    }
`

const Player = ( props ) => {

    const handleClick = () => {
        if( props.room != null && props.user_role && props.ready ){
            props.handleUnReady0();
        }
        else{
            props.handleReady0();
        }
    }

    return (
        <MyPaper onClick={handleClick} sx = {{ backgroundColor: props.room != null && props.user_role && props.ready ? 'green' : 'gray'}}>
            <Avatar style = {{ flex : 3, opacity:1, fontSize: '150px' }} sx = {{ border:'3px solid black', width : '80%', mt: 8 }}>{props.player == null ? 'E' : props.player.user_name[0]}</Avatar>
            <Typography style = {{ position: 'relative', top:'20px',flex : 1, opacity:1 }} variant= "h6" component = "div" sx = {{ fontFamily:"Comic Sans MS, Comic Sans, cursive", fontWeightBold: '900', flexGrow : 1 , color : 'black'}}> {props.player == null ? 'Empty' : props.player.user_name} </Typography>
        </MyPaper>
    )
}

export default Player