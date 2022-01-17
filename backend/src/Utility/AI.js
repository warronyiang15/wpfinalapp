
//import { isWin, isTie } from "./board"

const max = (a, b) => {
    return a > b ? a : b;
}

const min = (a , b) => {
    return a < b ? a : b;
}
 const printBoard = ( chess ) => {
    console.log(chess);
}

 const isTie = ( ) => {
    for(let i = 0;i < chess.length;i++){
        for(let j = 0;j < chess[i].length;j++){
            if(chess[i][j] === '.') return false;
        }
    }
    return true;
}

 const hortcount = ( chess, i , j, bit ) => {
    // left []
    let res = 0;
    let tmp_j = j;
    while(tmp_j >= 0){
        if(chess[i][tmp_j] === bit){
            res++;
            tmp_j--;
        }
        else break;
    }
    tmp_j = j;
    while(tmp_j < 15){
        if(chess[i][tmp_j] === bit){
            res++;
            tmp_j++;
        }
        else break;
    }
    return res - 1;
}

 const vertcount = ( chess, i , j, bit ) => {
    let res = 0;
    let tmp_i = i;
    while( tmp_i >= 0 ){
        if(chess[tmp_i][j] === bit){
            res++;
            tmp_i--;
        }
        else break;
    }

    tmp_i = i;
    while( tmp_i < 15 ){
        if(chess[tmp_i][j] === bit){
            res++;
            tmp_i++;
        }else break;
    }

    return res - 1;
}

 const ldiagcount = ( chess , i , j, bit ) => {
    let res = 0;
    let tmp_i = i;
    let tmp_j = j;
    while( tmp_i >= 0 && tmp_j >= 0 ){
        if(chess[tmp_i][tmp_j] === bit){
            res++;
            tmp_i--;
            tmp_j--;
        }
        else break;
    }

    tmp_i = i;
    tmp_j = j;
    while( tmp_i < 15 && tmp_j < 15 ){
        if(chess[tmp_i][tmp_j] === bit){
            res++;
            tmp_i++;
            tmp_j++;
        }
        else break;
    }

    return res - 1;
}

 const rdiagcount = ( chess, i , j, bit ) => {
    let res = 0;
    let tmp_i = i;
    let tmp_j = j;
    while( tmp_i < 15 && tmp_j >= 0 ){
        if(chess[tmp_i][tmp_j] === bit){
            res++;
            tmp_i++;
            tmp_j--;
        }
        else break;
    }

    tmp_i = i;
    tmp_j = j;
    while( tmp_i >= 0 && tmp_j < 15 ){
        if(chess[tmp_i][tmp_j] === bit){
            res++;
            tmp_i--;
            tmp_j++;
        }
        else break;
    }

    return res - 1;
}

 const isWin = ( chess , i , j, bit ) => {
    const res1 = hortcount(chess, i, j, bit);
    const res2 = vertcount(chess, i, j, bit);
    const res3 = ldiagcount(chess, i, j, bit);
    const res4 = rdiagcount(chess, i, j, bit);

    if(res1 >= 5 || res2 >= 5 || res3 >= 5 || res4 >= 5){    
        return true;
    }

    return false;
}


const INF = 100000000
let chess = [
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
];
let AIpattern = ['.....', '....x', '...x.', '..x..', '.x...', 'x....', '...xx', '..x.x', '..xx.', '.x..x', '.x.x.', '.xx..', 'x...x', 'x..x.', 'x.x..', 'xx...', '..xxx', '.x.xx', '.xx.x', '.xxx.', 'x..xx', 'x.x.x', 'x.xx.', 'xx..x', 'xx.x.', 'xxx..', '.xxxx', 'x.xxx', 'xx.xx', 'xxx.x', 'xxxx.', 'xxxxx', ];
let HUpattern = ['.....', '....o', '...o.', '..o..', '.o...', 'o....', '...oo', '..o.o', '..oo.', '.o..o', '.o.o.', '.oo..', 'o...o', 'o..o.', 'o.o..', 'oo...', '..ooo', '.o.oo', '.oo.o', '.ooo.', 'o..oo', 'o.o.o', 'o.oo.', 'oo..o', 'oo.o.', 'ooo..', '.oooo', 'o.ooo', 'oo.oo', 'ooo.o', 'oooo.', 'ooooo', ];
let price =     [  0    ,   100  ,   100  ,    100 ,    100 ,    100 ,    400 ,    400 ,    400 ,    400 ,    400 ,    400 ,   400  ,   400  ,    400 ,    400 ,   1000 ,   1000 ,   1000 ,   1000 ,    1000,    1000,   1000 ,   1000 ,   1000 ,   1000 ,   5000 ,   5000 ,   5000 ,    5000,   5000  ,  INF  , ];


const canWin = (turn) => {
    for(let i = 0;i < 15;i++){
        for(let j = 0;j < 15;j++){
            if(chess[i][j] !== '.') continue;
            const move = {i : i, j : j };
            put(move, turn);
            const ret = isWin(chess, i, j, turn ? 'x' : 'o');
            take(move, turn);
            if(ret) return move;
        }
    }
    return -1;
}

const random_move = () => {
    for(let i =0;i < 15;i++){
        for(let j = 0;j < 15;j++){
            if(chess[i][j] ===  '.') return {i : i, j : j};
        }
    }
    return 'wtf';
}

const hldiag = ( move, turn , arr) => {
    let i = move.i;
    let j = move.j;
    let left = [-1, -1]
    let right = [-1, -1]
    if(i - 4 >= 0 && j - 4 >= 0){
        left[0] = i - 4
        left[1] = j - 4
        right[0] = i
        right[1] = j
    }
    else if(i - 3 >= 0 && j - 3 >= 0){
        if(i + 1 >= 15 || j + 1 >= 15) return;
        left[0] = i - 3;
        left[1] = j - 3;
        right[0] = i + 1;
        right[1] = j + 1;
    }
    else if(i - 2 >= 0 && j - 2 >= 0){
        if(i + 2 >= 15 || j + 2 >= 15) return;
        left[0] = i - 2;
        left[1] = j - 2;
        right[0] = i + 2;
        right[1] = i + 2;
    }
    else if(i - 1 >= 0 && j - 1 >= 0){
        if(i + 3 >= 15 || j + 3 >= 15 ) return;
        left[0] = i - 1;
        left[1] = j - 1;
        right[0] = i + 3;
        right[1] = j + 3;
    }
    else{
        if(i + 4 >= 15 || j + 4 >= 15) return;
        left[0] = i;
        left[1] = j;
        right[0] = i + 4;
        right[1] = j + 4;
    }
    while(right[0] < 15 && right[1] < 15){
        let current_pattern = chess[left[0]][left[1]] + chess[left[0] + 1][left[1] + 1] + chess[left[0] + 2][left[1] + 2] + chess[left[0] + 3][left[1] + 3] + chess[left[0] + 4][left[1] + 4];
        for(let i= 0 ;i < AIpattern.length;i++){
            if(turn){
                if(current_pattern[i] === AIpattern[i]) arr[i] = true;
            }
            else{
                if(current_pattern[i] === HUpattern[i]) arr[i] = true;
            }
        }
        left[0] += 1;
        left[1] += 1;
        right[0] += 1;
        right[1] += 1;
    }
}

const hrdiag = ( move, turn, arr ) => {
    let left = [-1, -1], right= [-1, -1];
    let i = move.i;
    let j = move.j;
    if(i + 4 < 15 && j - 4 >= 0){
        left[0] = i + 4;
        left[1] = j - 3;
        right[0] = i;
        right[1] = j;
    }
    else if(i + 3 < 15 && j - 3 >= 0){
        if(i - 1 < 0 || j + 1 >= 15) return;
        left[0] = i + 3;
        left[1] = j - 3;
        right[0] = i - 1;
        right[1] = j + 1;
    }
    else if(i + 2 < 15 && j - 2 >= 0){
        if(i - 2 < 0 || j + 2 >= 15) return;
        left[0] = i + 2;
        left[1] = j - 2;
        right[0] = i - 2;
        right[1] = j + 2;
    }
    else if(i + 1 < 15 && j - 1 >= 0){
        if(i - 3 < 0 || j + 3 >= 15) return;
        left[0] = i + 1;
        left[1] = j - 1;
        right[0] = i - 3;
        right[1] = j + 3;
    }
    else{
        if(i - 4 < 0 || j + 4 >= 15) return;
        left[0] = i;
        left[1] = j;
        right[0] = i - 4;
        right[1] = j + 4;
    }

    while( right[0] >= 0 && right[1] < 15){
        let current_pattern = chess[left[0]][left[1]] + chess[left[0] - 1][left[1] + 1] + chess[left[0] - 2][left[1] + 2] + chess[left[0] - 3][left[0] + 3] + chess[left[0] - 4][left[0] + 4];
        for(let i= 0 ;i < AIpattern.length;i++){
            if(turn){
                if(current_pattern[i] === AIpattern[i]) arr[i] = true;
            }
            else{
                if(current_pattern[i] === HUpattern[i]) arr[i] = true;
            }
        }
        left[0] -= 1;
        left[1] += 1;
        right[0] -= 1;
        right[1] += 1;
    }
}

const hvert = ( move, turn, arr ) => {
    let left = [-1, -1], right= [ -1, -1];
    let i = move.i;
    let j = move.jl;
    left[1] = right[1] = j;
    if(i - 4 >= 0){
        left[0] = i - 4;
        right[0] = i;
    }
    else if(i - 3 >= 0){
        if(i + 1 >= 15) return;
        left[0] = i - 3;
        right[0] = i + 1;
    }
    else if(i - 2 >= 0){
        if(i + 2 >= 15) return;
        left[0] = i - 2;
        right[0] = i + 2;
    }
    else if(i - 1 >= 0 ){
        if(i + 3 >= 15) return;
        left[0] = i - 1;
        right[0] = i + 3;
    }
    else{
        if(i + 4 >= 15) return;
        left[0] = i;
        right[0] = i + 4;
    }

    while(right[0] < 15){
        let current_pattern = chess[left[0]][left[1]] + chess[left[0] + 1][left[1]] + chess[left[0] + 2][left[1]] + chess[left[0] + 3][left[1]] + chess[left[0] + 4][left[1]];
        for(let i= 0 ;i < AIpattern.length;i++){
            if(turn){
                if(current_pattern[i] === AIpattern[i]) arr[i] = true;
            }
            else{
                if(current_pattern[i] === HUpattern[i]) arr[i] = true;
            }
        }
        left[0] += 1;
        right[0] += 1;
    }
    return;
}

const hhort = ( move, turn, arr ) => {
    let left = [-1 , -1], right = [-1 , -1];
    let i = move.i;
    let j = move.j;
    left[0] = i;
    right[0] = i;
    if(j - 4 >= 0){
        left[1] = j - 4;
        right[1] = j;
    }
    else if(j - 3 >= 0){
        if(j + 1 >= 15) return;
        left[1] = j - 3;
        right[1] = j + 1;
    }
    else if(j - 2 >= 0){
        if(j + 2 >= 15) return;
        left[1] = j - 2;
        right[1] = j+ 2;
    }
    else if(j - 1 >= 0){
        if(j + 3 >= 15) return;
        left[1] = j - 1;
        right[1] = j + 3;
    }
    else{
        if(j + 4 >= 15) return;
        left[1] = j ;
        right[1] = j + 4;
    }

    while(right[1] < 15){
        let current_pattern = chess[left[0]][left[1]] + chess[left[0]][left[1] + 1] + chess[left[0]][left[1] + 2] + chess[left[0]][left[1] + 3] + chess[left[0]][left[1] + 4];
        for(let i= 0 ;i < AIpattern.length;i++){
            if(turn){
                if(current_pattern[i] === AIpattern[i]) arr[i] = true;
            }
            else{
                if(current_pattern[i] === HUpattern[i]) arr[i] = true;
            }
        }
        left[1] += 1;
        right[1] += 1;
    }
    return;
}

const getWeight = (move, turn) => {
    let total = 0;
    let ld = [false, false, false,false, false, false,false, false, false,false, false, false,false, false, false,];
    let rd = [false, false, false,false, false, false,false, false, false,false, false, false,false, false, false,];
    let v = [false, false, false,false, false, false,false, false, false,false, false, false,false, false, false,];
    let h = [false, false, false,false, false, false,false, false, false,false, false, false,false, false, false,];
    hldiag(move, turn, ld);
    hrdiag(move, turn, rd);
    hvert(move, turn , v);
    hhort(move, turn ,h);
    for(let i =0 ;i < ld.length;i++){
        if(ld[i]) total += price[i];
        if(rd[i]) total += price[i];
        if(v[i]) total += price[i];
        if(h[i]) total += price[i];
    }
    return turn ? total : -total;
}

const best_move = ( turn ) => {
    if(turn){
        const test = canWin(!turn);
        if( test != -1 ) return [test, INF];
        let cur_move = [{i : -1, j : -1} , -INF];
        for(let i = 0;i < 15;i++){
            for(let j= 0 ;j < 15;j++){
                if(chess[i][j] !== '.') continue;
                const move = {i : i, j : j};
                put(move, turn);
                if(canWin(!turn) != -1){
                    take(move, turn);
                    continue;
                }
                let value = getWeight(move ,turn);

                enemyBest = INF;
                for(let e_i = 0;e_i < 15;e_i++){
                    for(let e_j = 0; e_j < 15;e_j++){
                        if(chess[e_i][e_j] !== '.') continue;
                        const enemy_move = {i : e_i , j : e_j };
                        put(enemy_move, !turn);
                        enemyBest = min(enemyBest, getWeight(enemy_move, !turn));
                        take(enemy_move, !turn);
                    }
                }

                value += enemyBest;
                take(move, turn);

                if(value > cur_move[1]){
                    cur_move[1] = value;
                    cur_move[0] = move;
                }
            }
        }
        if(cur_move[0] === -1) cur_move[0] = random_move();
        return cur_move;
    }
    else{
        let test = canWin(!turn);
        if( test != -1 ) return [test, -INF];
        let cur_move = [{i : -1, j : -1} , INF];
        for(let i = 0; i< 15;i++){
            for(let j= 0 ;j < 15;j++){
                if(chess[i][j] !== '.') continue;
                const move = {i : i, j : j};
                put(move, turn);
                if(canWin(!turn) != -1){
                    take(move, turn);
                    continue;
                }
                let value = getWeight(move, turn);
                let AIbest = -INF;
                for(let e_i = 0;e_i < 15;e_i++){
                    for(let e_j = 0; e_j < 15;e_j++){
                        if(chess[e_i][e_j] !== '.') continue;
                        const enemy_move = {i : e_i , j : e_j };
                        put(enemy_move, !turn);
                        AIbest = max(AIbest, getWeight(enemy_move, !turn));
                        take(enemy_move, !turn);
                    }
                }

                value += AIbest;
                take(move, turn);

                if(value < cur_move[1]){
                    cur_move[1] = value;
                    cur_move[0] = move;
                }
            }
        }
        return cur_move;
    }
}

const put = ( move , turn ) => {
    const i = move.i;
    const j = move.j;
    chess[i][j] = turn ? 'x' : 'o';
    return;
}

const take = ( move, turn ) => {
    const i = move.i;
    const j = move.j;
    chess[i][j] = '.';
    return;
}

const minMax = (depth, alpha, beta, turn) => {
    console.log(depth);
    if(isTie()) return [{ i : -1, j : -1 }, 0];
    const islast = canWin(turn);
    if(islast != -1) return [islast, turn == true ? INF : -INF]    
    if(depth === 0){
        console.log('hi');
        const ret = best_move(turn);
        return ret;
    }

    if(turn){
        let cur_move = [{i : -1, j : -1}, -INF]
        for(let i = 0;i < 15;i++){
            for(let j = 0;j < 15;j++){
                if(chess[i][j] !== '.') continue;
                const move = {i : i, j : j }
                put(move, turn);
                const next_move = minMax(depth - 1, alpha, beta, !turn);
                take(move, turn);
                if( next_move[1] > cur_move[1] ){
                    cur_move[0] = move;
                    cur_move[1] = next_move[1];
                }
                alpha = max(alpha, cur_move[1]);
                if(beta <= alpha) break;
            }
            if(beta <= alpha) break;
        }
        return cur_move
    }

    else{
        let cur_move = [{i : -1, j : -1}, -INF]
        for(let i = 0;i < 15;i++){
            for(let j =0 ;j < 15;j++){
                if(chess[i][j] !== '.') continue;
                const move = {i : i, j : j }
                put(move ,turn)
                const next_move = minMax(depth - 1, alpha, beta, !turn);
                take(move, turn);
                if( next_move[1] < cur_move[1] ){
                    cur_move[0] = move
                    cur_move[1] = next_move[1];
                }
                beta = min(beta, cur_move[1]);
                if( beta <= alpha ) break;
            }
            if(beta <= alpha) break;
        }
        return cur_move
    }
}

const decide = ( chessNOW ) =>{
    for(let i = 0; i < 15;i++){
        for(let j =0 ;j < 15;j++){
            chess[i][j] = chessNOW[i][j];
        }
    }
    const result = minMax(1, -INF, INF, true);
    console.log(result[0], result[1]);
}

const mychess = [
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',],
];

decide(mychess);