import react from 'react'
import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { delay } from '../Utility/utility'

import './SignPage.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import EmailIcon from '@mui/icons-material/Email';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CodeIcon from '@mui/icons-material/Code';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Grow from '@mui/material/Grow';

import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { CREATE_AUTH_MUTATION, CREATE_ACCOUNT_MUTATION } from '../graphql/mutation'
import { LOGIN_QUERY, AUTH_QUERY, EXISTING_QUERY, GETUSER_QUERY } from '../graphql/query'

const SignPage = ( props ) => {
    /* interface */
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [mail, setMail] = useState('');
    const [mode, setMode] = useState(1);
    const [loadings, setLoading] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const [info, setInfo] = useState('info');
    const [infoMessage, setInfoMessage] = useState('Please enter your username and password!');
    const [icheck, setIcheck] = useState(true);

    /* focus ref */
    const refLUser = useRef();
    const refLPass = useRef();
    const refRUser = useRef();
    const refRPass = useRef();
    const refREmail = useRef();

    /* modal */
    const [code, setCode] = useState('');
    const [ModalMode, setModalMode] = useState(false);
    const [check, setCheck] = useState(false);
    const [modal_info, setModalInfo] = useState('info');
    const [modal_infoMessage, setModalInfoMessage] = useState('Please go to your email to check the authentication code');

    /* backend */
    const [getLogin, login_q] = useLazyQuery(LOGIN_QUERY)
    const [getExisting, existing_q] = useLazyQuery(EXISTING_QUERY);
    const [getAuth, auth_q] = useLazyQuery(AUTH_QUERY);
    const [getUser, user_q] = useLazyQuery(GETUSER_QUERY)
    
    const [addAuth] = useMutation(CREATE_AUTH_MUTATION);
    const [addUser] = useMutation(CREATE_ACCOUNT_MUTATION);

    const init = () => {
        setUser('');
        setPass('');
        setMail('');
        setIcheck(true);
        setInfo('info');
        setInfoMessage('Please enter your username and password!');
        setCode('');
    }

    const changeMode = async () => {
        setOpacity(0);
        await delay(300);
        init();
        if(mode === 1) setMode(2);
        else setMode(1);
        await delay(300);
        setOpacity(1);
    }
    
    const handleSignIn = async () => {
        setIcheck(false);
        await delay(200);
        if( !user || !pass ){
            setInfo('warning');
            setInfoMessage('No Blank Allowed :(');
            setIcheck(true);
            return;
        }
        const result = await getLogin({
            variables: {
                user_name: user,
                user_pass: pass,
            }
        })


        if(result.data.requestLogin != null){
            setInfo('success');
            setInfoMessage('Login Success, Welcome!');
            setIcheck(true);
            await delay(2000);
            
            /* here to switch effect */
            props.login(result.data.requestLogin);
            init();
        }

        else{
            setInfo('error');
            setInfoMessage('Username/Password not correct!');
            setIcheck(true);
            return;
        }

    }
    
    const handleSignUp = async () => {
        setIcheck(false);
        await delay(200);
        if( !mail || !pass || !user ){
            setInfo('warning');
            setInfoMessage('No Blank allowed (:');
            setIcheck(true);
            return;
        }

        setLoading(true);
        const result = await getExisting({
            variables:{
                user_name: user,
                user_email: mail,
            },
        });
        
        if(result.data.requestExisting){
            setInfo('error');
            setInfoMessage('Username/Email Found!');
            setLoading(false);
            setIcheck(true);
            return;
        }
        const { data } = await addAuth({
            variables:{
                user_email: mail,
            }
        })

        if(data.createAuth){
            setModalMode(true);    
            setModalInfo('info');
            setModalInfoMessage('Please go to your email to check the authentication code');
            setCheck(true);
            setIcheck(true);
        }
        else{
            /* failed process */
            setInfo('error');
            setInfoMessage('Something is wrong, please retry QQ');
            setIcheck(true);
        }

    }

    const handleClose = () => {
        init();
        setModalMode(false);
        setLoading(false);
    }

    const handleAuthRequest = async (e) => {
        if(e.key === 'Enter'){
            setCheck(false);
            await delay(500);
            if(!code) {
                setModalInfo('warning');
                setModalInfoMessage('Blank is not allowed >:');
                setCheck(true);
                return;
            }

            const result = await getAuth({
                variables:{
                    user_email: mail,
                    code: code,
                },
            });

            if(result.data.requestAuth){
                const { data } = await addUser({
                    variables:{
                        user_name: user,
                        user_pass: pass,
                        user_email: mail,
                    },
                });
                
                const login_user = data.createAccount;
                props.login(login_user);
                
            }
            
            else{
                setModalInfo('error');
                setModalInfoMessage('Authetication failed');
                setCheck(true);
                return;
            }

        }
    }

    const mode1 = (
        <div id = "interface" style = {{ opacity : opacity }}>
            <div id = "leftInterface" >
                <div id = "smallpanel"> 
                    <h1 id = "title"> Welcome Back! </h1>
                    <Grow in={icheck} style={{ transformOrigin: '0 0 0' }} {...(icheck ? { timeout : 1000 } : {})}>
                        <Alert variant = "filled" severity={info}>{infoMessage}</Alert>
                    </Grow>
                </div>
                <div id = "panel">
                    <TextField ref={refLUser} required id="outlined-required" InputProps={{ startAdornment: ( <InputAdornment position="start"> <AccountCircle /> </InputAdornment> ),}} label="Username" variant="filled" color="secondary" id ="user" sx = {{ width : '50ch' }}  value = {user} onChange = {(e) => { setUser(e.target.value); }} onKeyPress = {(e) => { if(e.key === 'Enter') { refLPass.current.focus(); } }}></TextField>
                    <TextField ref={refLPass} required id="outlined-required" InputProps={{ startAdornment: ( <InputAdornment position="start"> <VpnKeyIcon /> </InputAdornment> ),}} label="Password" type="password" variant="filled" color="secondary" id = "pass" sx = {{ width : '50ch' }} value = {pass} onChange = {(e) => { setPass(e.target.value); }}></TextField>
                    <Button variant="contained" sx = {{ width : '50ch'}} onClick = { handleSignIn }>Sign In </Button>
                </div>
            </div>
                <div id = "rightInterface">
                    <Button variant = "contained" startIcon={<AppRegistrationIcon />} id = "t_button" onClick={changeMode} > Sign Up </Button> 
                    <img src = "https://c.tenor.com/b69t7mKevb4AAAAC/hololive-vtuber.gif" width="70%"></img>
                </div>
        </div>
    )

    const mode2 = (
        <div id = "interface" style = {{ opacity : opacity }}>
            <div id = "rightInterface">
                <Button variant = "contained" startIcon={<AppRegistrationIcon />} id = "t_button" onClick = {changeMode} > Sign In </Button> 
                <img src = "https://c.tenor.com/b69t7mKevb4AAAAC/hololive-vtuber.gif" width="70%"></img>
            </div>
            <div id = "leftInterface" >
                <div id = "smallpanel"> 
                    <h1 id = "title"> Create your account!  </h1>
                    <Grow in={icheck} style={{ transformOrigin: '0 0 0' }} {...(icheck ? { timeout : 1000 } : {})}>
                        <Alert variant = "filled" severity={info}>{infoMessage}</Alert>
                    </Grow>
                </div>
                <div id = "panel" >
                    <TextField ref={refREmail} required id="outlined-required" InputProps={{ startAdornment: ( <InputAdornment position="start"> <EmailIcon /> </InputAdornment> ),}} label="Email" variant="filled" color="secondary" id ="mail" sx = {{ width : '50ch' }} value = {mail} onChange = {(e) => { setMail(e.target.value); }} ></TextField>
                    <TextField ref={refRUser} required id="outlined-required" InputProps={{ startAdornment: ( <InputAdornment position="start"> <AccountCircle /> </InputAdornment> ),}} label="Username" variant="filled" color="secondary" id ="user" sx = {{ width : '50ch' }} value = {user} onChange = {(e) => { setUser(e.target.value); }} ></TextField>
                    <TextField ref={refRPass} required id="outlined-required" InputProps={{ startAdornment: ( <InputAdornment position="start"> <VpnKeyIcon /> </InputAdornment> ),}} label="Password" type="password" variant="filled" color="secondary" id = "pass" sx = {{ width : '50ch' }} value = {pass} onChange = {(e) => { setPass(e.target.value); }}></TextField>
                    <LoadingButton loading={loadings} loadingIndicator= "Loading..." variant="contained" sx = {{ width : '50ch'}} onClick = {handleSignUp}> Continue </LoadingButton>
                    <Modal
                        open={ModalMode}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box id = "Modal">
                            <Grow in={check} style={{ transformOrigin: '0 0 0' }} {...(check ? { timeout : 1000 } : {})}>
                                <Alert variant = "filled" severity={modal_info} sx = {{ mt : 4 }}>{modal_infoMessage}</Alert>
                            </Grow>
                            <TextField required id="outlined-required" InputProps={{ startAdornment: ( <InputAdornment position="start"> <CodeIcon /> </InputAdornment> ),}} type="password" label="Autheritication Code" variant="filled" color="secondary" id ="code" sx = {{ width : '50ch', top : '5ch' }} value = {code} onChange = {(e) => { setCode(e.target.value); }} onKeyPress = {handleAuthRequest} ></TextField>
                        </Box>
                    </Modal>
                </div> 
            </div>
        </div>
    )

    return(
        mode === 1 ? mode1 : mode2
    )
}

export default SignPage