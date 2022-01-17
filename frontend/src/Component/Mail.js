import { useState, useEffect } from 'react'
import react from 'react'
import styled, { withTheme } from 'styled-components'
import { useQuery, useMutation, useLazyQuery, useSubscription } from '@apollo/client';
import { Fragment } from 'react';

import { Paper } from '@mui/material';
import { TextField,Typography } from '@mui/material';
import { Button } from '@mui/material';
import { Modal } from '@mui/material';
import { Box, compose } from '@mui/system';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';



const Block = styled(Paper)`
    display: flex;
    flex-direction:column;
    align-items: left;
    justify-content: center;
    height : 200px;
    background-image: url('https://img.freepik.com/free-vector/black-desktop-background-geometric-pattern-design-vector_53876-140229.jpg?size=338&ext=jpg');
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 0.6;
    transition: opacity 200ms;
    &:hover{
        opacity: 0.8;
    }
`

const Mail = ( props ) => {

    const handleClick = async () => {
        await props.handleRemove(props.id);
    }
    return(
        <Block elevation={24} sx = {{ width : '100%'}}>
            <IconButton onClick={handleClick} sx = {{ width : '5%' }} aria-label="remove" color="error" >
                <CloseIcon />
            </IconButton>
            <Typography variant="p" component="div" sx = {{ color: 'white', fontFamily:"Comic Sans MS, Comic Sans, cursive", fontWeightBold: '900', m : 2 }}>  From : {props.fromEmail} </Typography>
            <Typography variant="p" component="div" sx = {{ color: 'white', fontFamily:"Comic Sans MS, Comic Sans, cursive", fontWeightBold: '900', m : 2 }}>  Content : {props.content} </Typography>
        </Block>
    )
}

export default Mail