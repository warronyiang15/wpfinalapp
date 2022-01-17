import { useState, useEffect } from 'react'
import react from 'react'
import styled, { withTheme } from 'styled-components'
import { useQuery, useMutation, useLazyQuery, useSubscription } from '@apollo/client';
import { Fragment } from 'react';
import { Paper,Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';

import { GET_USER_NAME_QUERY } from '../graphql/query';

const MyPaper = styled(Paper)`
    width : 80%;
    height:10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    transition: opacity 200ms;
`

const Chess = styled.div`
    background-color:white;
    border-radius:100%;
    border: 1px solid black;
    width:100ch:
    height:100ch;
`

const PlayerBadge = ( props ) => {

    const { data , loading , error , refetch } = useQuery(GET_USER_NAME_QUERY, {
        variables:{
            user_id: props.player,
        },
    });

    useEffect(() => {
        async function fetchData(){
            await refetch();
        }
        if(props.player != null && data == null){
            fetchData();
        }
    }, [props.player]);

    return(
       <MyPaper style = {{ opacity : props.turn ? '0.8' : '0.2' }} sx = {{backgroundColor: 'white', height : '20ch'}}>
            {props.first ? (<Avatar style = {{ opacity:1, fontSize: '150px', backgroundColor: 'black'}} sx = {{ ml : 5, border:'3px solid black', width : '40%', height: '90%'}}></Avatar>) : 
            (<Avatar style = {{ opacity:1, fontSize: '150px'}} sx = {{ ml: 5, border:'3px solid black', width : '40%', height: '90%'}}></Avatar>)
            }
            <Typography style = {{ position: 'relative', opacity:1 }} variant= "h6" component = "div" sx = {{ fontFamily:"Comic Sans MS, Comic Sans, cursive", fontWeightBold: '900', flexGrow : 1 , color : 'black', ml :20}}> {data == null ? 'Empty' : data.getUserName} </Typography>
       </MyPaper>
    )
}

export default PlayerBadge