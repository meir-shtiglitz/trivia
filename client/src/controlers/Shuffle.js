
const Shuffle = (item) => {
    var answersShuffle = [];
    var answers = [
        {class:"atrue", value: item.atrue},
        {class:"afalse", value: item.afalse1},
        {class:"afalse", value: item.afalse2}, 
        {class:"afalse", value: item.afalse3}
    ];
    
    for (let spam = 0; spam < 4; spam++){
        var rand = Math.floor(Math.random() * answers.length);
        answersShuffle.push(answers[rand]);
        answers.splice(rand, 1);
    }
    return(
        answersShuffle
    )
}

export default Shuffle;