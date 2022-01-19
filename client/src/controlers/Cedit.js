export const getNext = (q_num, questions, updateState) => {
    if (q_num < questions.length-1){
       q_num++
       updateState({q_num: q_num, arowRight: true, new_q: questions[q_num]});
       if(q_num === questions.length-1) updateState({arowLeft:false});
   }
}


export const getBack = (q_num, questions, updateState) => {
    if (q_num > 0){
        q_num--;
        updateState({q_num: q_num, arowLeft:true, new_q: questions[q_num]});
        if( q_num === 0 ) updateState({arowRight:false});
    }
}
