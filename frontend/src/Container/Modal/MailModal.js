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

import { v4 as uuidv4 } from 'uuid';

import Mail from '../../Component/Mail';
import { GETMAIL_QUERY } from '../../graphql/query';
import { REMOVE_MAIL_MUTATION } from '../../graphql/mutation';
import { MAIL_STATE_CHANGED } from '../../graphql/subscription';

const MyPaper = styled(Paper)`
    width:60ch;
    height:55ch;
    display: flex;
    flex-direction:column;
    flex-wrap:wrap;
    align-items:center;
    position:relative;
    left: 25%;
    top: 100px;
    overflow: auto;
`

const MailModal = ( props ) => {

    const { data, error, loading, subscribeToMore, refetch } = useQuery(GETMAIL_QUERY, {
        variables:{
            email: props.user.user_email,
        },
    });

    const [deleteMail] = useMutation(REMOVE_MAIL_MUTATION);
    
    const handleClose = () => {
        props.setOpen( false );
    }
    const handleRemove = async ( id ) => {
        
        const result = await deleteMail({
            variables:{
                id: id,
            },
        });
        
        if(result.data.removeMail) {
            await refetch();
        }
        else{
            alert('something wrong QQ');
        }
    }

    useEffect(() => {
        subscribeToMore({
            document: MAIL_STATE_CHANGED,
            variables: { email : props.user.user_email },
            updateQuery: (prev, { subscriptionData }) => {
                if(!subscriptionData.data) return prev;
                for(let i = 0;i < prev.getMail.length;i++){
                    if(prev.getMail[i].id === subscriptionData.data.mailStateChange.id){
                        return prev;
                    }
                }
                props.addmail(props.mail + 1)
                return{
                    getMail: [...prev.getMail, subscriptionData.data.mailStateChange],
                }
            }
        })
    }, [data, props.mail])

    return(
        <Modal open = { props.open } onClose = {handleClose} aria-labelledby="mail">
            <Box sx = {{ flexGrow : 1 }}>
                <Button onClick={handleClose} variant="contained" sx = {{ position:'absolute', left:'120ch', top:'3ch',width : '5%', height: '8ch', borderRadius:'100%' }} aria-label="remove" color="error" >
                    <CloseIcon sx = {{ width : '100%'}} />
                </Button>
                <MyPaper>
                    {data == null || data.getMail == null ? (<Fragment />) : 
                        data.getMail.map(
                            m => (<Mail handleRemove={handleRemove} key={uuidv4()} id={m.id} fromEmail={m.from_email} content={m.content} />)
                        )
                    }
                    
                </MyPaper>
            </Box>
        </Modal>
    )
}

export default MailModal