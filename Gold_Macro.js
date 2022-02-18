
const actorId = "ZTNiYWE5ZTJlNmE4";
const myActor = canvas.tokens.placeables.find(t => t.actor?.id === actorId)?.actor ?? game.actors.get(actorId);
//const receiverName = "Lance Crowlen"; //change name of receiver
//const receiver = canvas.tokens.placeables.find(t => t.actor?.name === receiverName)?.actor ?? game.actors.get(actorId);
const imgSrc = "https://assets.forge-vtt.com/620ad1fc7d7168ef1ace98fd/emotes/angery.png";

//function to create chat message that shows a disappointed pic of Lance and the amount of gold he lent
function postToChat(amount, recipient) {
    let chatData = { //create the chat object
        user: game.user._id,
        speaker: {actor: myActor},
        content: `<div style = "text-align: center">`
    };
    //append image and message
    chatData.content += `<img src = ${imgSrc} width = 50% height 30%> </img>  <br>Lance gives ${recipient} ${amount} gold. 💰</div>`;
    ChatMessage.create(chatData, {});
}

    //function to give amount of currency to specified receiver
    function giveCurrency(amount, actor) { 
        let newTotalGP = actor.data.data.currency.gp + Number(amount);
        actor.update( {"data.currency.gp" : newTotalGP} );
    };

//implement function to decrement amount of gold from Lance's dwindling currency

let form = '<form><input type="number" name="gp" id="gp" placeholder="Insert gold amount"><input type="text" name="receiver" id="receiver" placeholder="Recipient name"></form>';

new Dialog({ // dialog object creates new window with a button and text input
    title: "Lance's Reluctant Philanthropy",
    content: form,
    buttons: {
        go: {
            label: "Give gold 💰",
            callback: (html) => {
                let recipient = html.find('receiver');
                let receiver = canvas.tokens.placeables.find(t => t.actor?.name === recipient)?.actor ?? game.actors.get(actorId);
                let totalGP = html.find('#gp').val();
                giveCurrency(totalGP, receiver)
                postToChat(totalGP, receiver.name);
            }
        }
    },
    default: "go"
}).render(true);
