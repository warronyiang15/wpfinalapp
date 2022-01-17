# Command Install
```bash=
cd frontend
yarn install
```
```bash=
cd backend
yarn install
```
***
# Command use to install in project

## FrontEnd
```bash=
yarn add axios @material-ui/core styled-components
yarn add @apollo/client @apollo/react-hooks @emotion/react @emotion/styled @mui/icons-material @mui/lab @mui/material apollo-link-ws graphql moment react-apollo react-beautiful-dnd subscriptions-transport-ws uuid
yarn add @mui/material @emotion/react @emotion/styled
yarn add uuidv4
yarn add uuid
yarn add @types/uuid
```

***
## BackEnd
```bash=
yarn add bcrypt
yarn add nodemailer
yarn add uuidv4
yarn add -D cypress dotenv-defaults mongoose
yarn add cors express nodemon
yarn add -D @babel/cli @babel/core @babel/node @babel/preset-env @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread @babel/plugin-transform-arrow-functions dotenv-defaults mongoose
yarn add dotenv-defaults graphql-yoga mongoose nodemon
yarn add -D @babel/cli @babel/core @babel/node @babel/preset-env
yarn add uuid
```
***
# MONGODB .env
```bash=
MONGO_URL=mongodb+srv://wzdarkopen:cool2001@wp.quio7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```
***
# 負責項目

B09902078 楊偉倫 - 全部項目

***
# 專題說明
完全從0開始自行實作

*** 
# 專案介紹

實作簡單的網頁桌遊遊戲機制，利用Graphql同步玩家之間的互動。
目前功能：
* 註冊/登錄帳號
  * 使用者註冊時需提供帳號密碼及郵件，而後會發authentication code至該郵件，使用者需輸入該code才能成功註冊
  * 若使用者已經有帳號便可以直接登錄進入主頁面
* 主頁面
  * 使用者可以查詢遊玩紀錄（ 裡面會紀錄那一場的遊戲ID, 對手及遊玩結果）
  * 創建房間
  * 加入房間
    * 可以選擇輸入房間ID加入該房間
    * 可以選擇隨機加入 ***沒被鎖上且不滿人*** 的房間
  * 信箱
    * 使用者可以查詢信件（其他使用者的邀請函）
  * 登出
    * 返回登錄頁面
* 房間
  * 上方會顯示房間的ID，點擊後便可以複製房間ID (方便debug)
  * 畫面會有兩個大框分別紀錄玩家的資訊，點擊後便可準備（準備後框的顏色會變成青色）
  * 可以選擇返回主頁面
    * 若房主返回主頁面，則房間會被銷毀，加入者會同時返回主頁面
    * 反之，若加入者返回主頁面，則對房間沒影響
  * 可以選擇邀請其他使用者
    * 點擊後會顯示輸入框，輸入 ***已註冊*** 的帳號email便可寄出邀請函
  * 可以選擇鎖房間
    * 房主若不想被人隨機闖入，可以選擇鎖上房間，而其他使用者將不會隨機進入該房間
  * 開始遊戲
    * 當雙方已經準備時才能開始遊戲
* 遊戲
  * 畫面左方為遊戲
  * 畫面右方為詳情
  * 玩家只能在自己的回合執行動作
  * 有時間限制，過了120秒（預設）後沒動作，將會視為投降
  * 遊玩結束後會出現遊戲結果，並且在10秒後（預設）同時返回房間
* 其他機制
  * 玩家若在房間或遊戲中關閉遊戲，重新刷新後再次登錄遊戲，則會在進入主頁面後自動導向原來的房間/遊戲

***
# 使用框架
### Frontend 
* React.js
* ApolloGraphql
* Mui-Design
### Backend
* Graphql
* mongoose
* bcrypt
* uuid
* nodemailer
### Database
* mongodb
***
# Demo video
https://youtu.be/T5e1aVXOgzY
***
# FB Post link
https://www.facebook.com/groups/NTURicWebProg/permalink/1562827977398450/
***
# Bug

* 遊戲時會有些卡頓，有時候會出現黑棋方可以覆蓋白旗方的奇怪bug --> graphql subscription 的bug
* 畫面設計很差QQ
* 隨機加入房間後有時會無法檢測出有玩家加入，再做了某些動作後才會檢測出來

