import styled from "styled-components";
import { Paper } from '@mui/material'
import { useState, useEffect } from 'react'

/* containers */

import SignPage from "./SignPage";
import MainMenu from "./MainMenu";

document.body.style.backgroundImage = `url("https://i.ibb.co/BgnNrJ0/813534-background-simple-tumblr-3000x2000-for-lockscreen.jpg")`;
document.body.style.backgroundSize = "cover";

const Back = styled(Paper)`
  height: 820px;
  width: 1600px;
  position: relative;
  left: 12px;
  top: 12px;
  background-image: url("https://i.ibb.co/BgnNrJ0/813534-background-simple-tumblr-3000x2000-for-lockscreen.jpg");
  background-size: cover;
`

function App() {
  const [user, setUser] = useState({});
  const [mode, setMode] = useState(false);
  
  const handleLogin = ( login_user ) => {
    /* 登錄成功 */
    setUser(login_user);
    setMode(true);
  }

  const handleLogout = () => {
    setUser({});
    setMode(false);
  }

  return mode ? (<Back> <MainMenu user={user} logout={handleLogout}/> </Back>) : (<Back>
    <SignPage login={handleLogin} />
  </Back>);
  
  
}


/*
<Page sx = {{ml : 10, mt : 2, backgroundColor: 'black'}} elevation={24}>
      <SignPage login={handleLogin}></SignPage>
  </Page>
*/
export default App;
