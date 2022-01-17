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

import { SEND_MAIL_MUTATION } from '../../graphql/mutation';

const MyPaper = styled(Paper)`
    width:70ch;
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

const InviteModal = ( props ) => {
    const [email, setEmail] = useState('');

    const [sendMail] = useMutation(SEND_MAIL_MUTATION);

    const handleClose = () => {
        props.setOpen(false);
    }

    const handleClick = async () => {
        
        if( props.user.user_email === email ) {
            alert('error');
        }
        else{
            /* process email here */
            const result = await sendMail({
                variables:{
                    from_email: props.user.user_email,
                    to_email: email,
                    room_link: props.room_link,
                },
            });
           
            if(result.data.sendMail != null)
                handleClose();
            
        }
    }

    return(
        <Modal sx = {{ width : '80ch', height : '30ch'}} open={props.open} onClose={handleClose} aria-labelledby="invite">
            <Box sx = {{ flexGrow : 1 }}>
                <MyPaper>
                    <IconButton onClick={handleClose} sx = {{ width : '5%', position:'relative', left:'380px', bottom: '30px' }} aria-label="remove" color="error" >
                        <CloseIcon />
                    </IconButton>
                    <TextField id="invites" label="Invition email" fullWidth sx = {{ width :'80%', m : 1 }} value = {email} onChange = { (e) => setEmail(e.target.value)} />
                    <Button sx = {{ width : '50%' , height: '15%'}} variant='contained' onClick={handleClick}>Invite</Button>
                </MyPaper>
            </Box>
        </Modal>
    )
}

export default InviteModal;