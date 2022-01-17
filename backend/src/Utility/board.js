export const printBoard = ( chess ) => {
    console.log(chess);
}

export const isTie = ( chess ) => {
    for(let i = 0;i < chess.length;i++){
        for(let j = 0;j < chess[i].length;j++){
            if(chess[i][j] === '.') return false;
        }
    }
    return true;
}

export const hortcount = ( chess, i , j, bit ) => {
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

export const vertcount = ( chess, i , j, bit ) => {
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

export const ldiagcount = ( chess , i , j, bit ) => {
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

export const rdiagcount = ( chess, i , j, bit ) => {
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

export const isWin = ( chess , i , j, bit ) => {
    const res1 = hortcount(chess, i, j, bit);
    const res2 = vertcount(chess, i, j, bit);
    const res3 = ldiagcount(chess, i, j, bit);
    const res4 = rdiagcount(chess, i, j, bit);

    if(res1 >= 5 || res2 >= 5 || res3 >= 5 || res4 >= 5){    
        return true;
    }

    return false;
}
