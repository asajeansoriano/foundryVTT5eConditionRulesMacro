function yeyego () {

    let actorId = "ZTNiYWE5ZTJlNmE4";
    let myActor = game.actors.get(actorId);
    let imgSrc = "https://assets.forge-vtt.com/620ad1fc7d7168ef1ace98fd/emotes/angery.png";

    //function to create chat message that shows a disappointed pic of Lance and the amount of gold he lent
    function postToChat(amount, recipient) {
        let chatData = { //create the chat object
            user: game.user._id,
            speaker: {actor: myActor},
            content: `<div style = "text-align: center">`
        };
        //if recipient is npc
        let recipientName = recipient.name;
        let theirNewTotal = recipient.data.data.currency.gp;
        //append image and message
        chatData.content += `<img src = ${imgSrc} width = 50% height 30%> </img><br><i>"Let me get my purse..."</i><br>Lance gives ${recipientName} ${amount} gold. 💰<br>${recipientName} now has ${theirNewTotal} gold.</div>`;
        ChatMessage.create(chatData, {});
    }


        //function to give amount of currency to specified receiver
        function giveCurrency(amount, actor) { 
            let theirNewTotal = actor.data.data.currency.gp + Number(amount);
            //add to recipient's gold
            actor.update( {"data.currency.gp" : theirNewTotal} ); 
        };

        //function to decrement from Lance's dwindling gold
        function deductCurrency(amount) {
            let myNewTotal = myActor.data.data.currency.gp - Number(amount);
            myActor.update( {"data.currency.gp" : myNewTotal});
        }


    let form = `
    <form>
    <div style="display: flex; width: 100%; margin: 5px 0px 5px 0px">
        <input type="number" 
        oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" 
        name="gp" id="gp" placeholder="Gold amount" size="6px" maxlength="3" style="margin: 0px 5px 0px 5px" />
        <input type="text" name="receiver" id="receiver" placeholder="Recipient name" style="margin: 0px 5px 0px 5px" />
    </div>
    </form> 
    `

    new Dialog({ // dialog object creates new window with a button and text input
        title: "Lance's Reluctant Philanthropy",
        content: form,
        buttons: {
            yes: {
                label: "Give gold 💰",
                callback: (html) => {
                    let receiver = html.find('#receiver').val();
                    let receiverID = game.actors.find(t => t.name === receiver);
                    let totalGP = html.find('#gp').val();
                    //check to see if Lance has enough money to give
                    if (myActor.data.data.currency.gp < totalGP) {
                        ui.notifications.warn("Not enough gold!");
                        return;
                    }
                    //check if amount entered is null or negative
                    if (totalGP == null || totalGP < 0) {  
                        ui.notifications.warn("Enter valid amount!");
                        return;
                    }
                    giveCurrency(totalGP, receiverID);
                    deductCurrency(totalGP);
                    postToChat(totalGP, receiverID);
                }
            },
            no: {
                icon: "<i class='fas fa-times'></i>",
                label: "Cancel"
            }
        },
        default: "yes",
    }).render(true);

}

yeyego();