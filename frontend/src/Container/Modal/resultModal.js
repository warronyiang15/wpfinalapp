import { useState, useEffect } from 'react'
import react from 'react'
import styled, { withTheme } from 'styled-components'
import { useQuery, useMutation, useLazyQuery, useSubscription } from '@apollo/client';
import { Fragment } from 'react';

import { IconButton, Paper } from '@mui/material';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Modal } from '@mui/material';
import { Box, compose } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';

const MyPaper = styled(Paper)`
    width:70ch;
    height:30ch;
    display: flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    position:relative;
    left: 25%;
    top: 200px;
`

const ResultModal = ( props ) => {
    return (
        <Modal sx = {{ width : '80ch', height : '30ch'}} open={props.open} aria-labelledby="result">
         <Box sx = {{ flexGrow : 1 }}>
             <MyPaper>
                <Typography  variant= "h1" component = "div" sx = {{ m: 8, fontFamily:"Comic Sans MS, Comic Sans, cursive", fontWeightBold: '900' }} > { props.game_result === '' ? 's' : (props.user.user_id === props.game_result ? 'You Win' : 'You Lose')} </Typography>
                <Typography  variant= "p" component = "div" sx = {{ fontFamily:"Comic Sans MS, Comic Sans, cursive", fontWeightBold: '900' }} > Redirecting to room... </Typography>
             </MyPaper>
         </Box>
        </Modal>
    )
}

export default ResultModal;