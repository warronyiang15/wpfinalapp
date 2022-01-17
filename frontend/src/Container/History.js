import { useState, useEffect } from 'react'
import react from 'react'
import styled, { withTheme } from 'styled-components'
import { useQuery, useMutation, useLazyQuery, useSubscription } from '@apollo/client';
import { Fragment } from 'react';


import { Divider, Paper, Typography } from '@mui/material';
import { GET_USER_NAME_QUERY } from '../graphql/query';

const MyPaper = styled(Paper)`
    height : 130px;
    background-image: url('https://img.freepik.com/free-vector/black-desktop-background-geometric-pattern-design-vector_53876-140229.jpg?size=338&ext=jpg');
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 0.6;
    transition: opacity 200ms;
    &:hover{
        opacity: 0.8;
    }
`

const History = ( props ) => {

    const { data, loading , error, refetch } = useQuery(GET_USER_NAME_QUERY, {
        variables:{
            user_id: props.user == null ? '' : (props.user.user_id === props.player1 ? props.player2 : props.player1 ),
        },
    });

    useEffect(() => {
        async function fetchData(){
            await refetch();
        }
        fetchData();
    }, [])

    return(
        <MyPaper  elevation={24} sx = {{ width : '100%' }}>
            <Typography variant="p" component="div" sx = {{ color: 'white', fontFamily:"Comic Sans MS, Comic Sans, cursive", fontWeightBold: '900', ml : 5 }}> Room_id : {props.room_id} </Typography>
            <Typography variant="p" component="div" sx = {{ color: 'white', fontFamily:"Comic Sans MS, Comic Sans, cursive", fontWeightBold: '900', ml : 5 }}> Opponent_name : { data == null ? '' : data.getUserName == null ? '' : data.getUserName  } </Typography>
            <Typography variant="p" component="div" sx = {{ color: 'white', fontFamily:"Comic Sans MS, Comic Sans, cursive", fontWeightBold: '900', ml : 5 }}> result : {props.user == null ? '' : (props.user.user_id === props.game_result ? 'You Win' : 'You Lose' )} </Typography>
        </MyPaper>    
    )
}

export default History