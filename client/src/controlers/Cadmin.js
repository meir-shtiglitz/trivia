

export const editInputVal = (live, status, updateState, eTarget) => {
    // console.log(live + status)
    if(eTarget.name === 'live'){
        // console.log("fro controler live", live)
        if(!live && status === 'public') return alert("משחק ציבורי לא יכול להיות משחק לייב");
        updateState({live: !live})
    } else{
        // console.log("fro controler !live", live)
        if(live && eTarget.value === "public"){
            updateState({status: 'privte'})
            eTarget.checked = false;
            return alert("משחק ציבורי לא יכול להיות משחק לייב")
        };
        updateState({[eTarget.name]: eTarget.value})
    }
}

// export const copyLink = (eTarget) => {
//     const link = eTarget.id
//     navigator.clipboard.writeText(link);
//     eTarget.previousSibling.style.display = 'block';
//     setTimeout(function(){
//         eTarget.previousSibling.style.display = 'none';
//     },1000)
// }