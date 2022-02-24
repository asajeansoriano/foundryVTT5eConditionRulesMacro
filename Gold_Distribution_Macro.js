let actors = canvas.tokens.controlled.map(({ actor }) => actor);
let actorCount = actors.length;
let actorIncrement = 0;
let randomActor = Math.floor(Math.random() * actorCount);
let winningActor = '';

let permissionCheck = false;
if (game.user.isGM == true || game.user.isTrusted == true) { permissionCheck = true; }

function awardCurrency(totalPP, totalGP, totalEP, totalSP, totalCP)
{
    let splitPP = Math.floor(totalPP / actorCount);
    let splitGP = Math.floor(totalGP / actorCount);
    let splitEP = Math.floor(totalEP / actorCount);
    let splitSP = Math.floor(totalSP / actorCount);
    let splitCP = Math.floor(totalCP / actorCount);
    
    let leftoverPP = totalPP % actorCount;
    let leftoverGP = totalGP % actorCount;
    let leftoverEP = totalEP % actorCount;
    let leftoverSP = totalSP % actorCount;
    let leftoverCP = totalCP % actorCount;
        
    actors.forEach(actor =>
    {
		let newTotalPP = actor.data.data.currency.pp + splitPP;
		let newTotalGP = actor.data.data.currency.gp + splitGP;
		let newTotalEP = actor.data.data.currency.ep + splitEP;
		let newTotalSP = actor.data.data.currency.sp + splitSP;
		let newTotalCP = actor.data.data.currency.cp + splitCP;
		
        if(actorIncrement == randomActor)
        {
			newTotalPP += leftoverPP;
			newTotalGP += leftoverGP;
			newTotalEP += leftoverEP;
			newTotalSP += leftoverSP;
			newTotalCP += leftoverCP;
			
            winningActor = actor.data.name;
			actor.update({"data.currency.pp" : newTotalPP, "data.currency.gp" : newTotalGP, "data.currency.ep" : newTotalEP, "data.currency.sp" : newTotalSP, "data.currency.cp" : newTotalCP});
        }
        else
        {
			actor.update({"data.currency.pp" : newTotalPP, "data.currency.gp" : newTotalGP, "data.currency.ep" : newTotalEP, "data.currency.sp" : newTotalSP, "data.currency.cp" : newTotalCP});
        }
        actorIncrement++;
    });
    
    let strOutput = "<b>Gave " + actorCount + " players each</b>:<br />";
    if (splitPP > 0) { strOutput += "<span style='color:#90A2B6'>" + splitPP + "pp</span>"; if (splitGP > 0 || splitEP > 0 || splitSP > 0 || splitCP > 0) { strOutput += ", "; } }
    if (splitGP > 0) { strOutput += "<span style='color:#B08C34'>" + splitGP + "gp</span>"; if (splitEP > 0 || splitSP > 0 || splitCP > 0) { strOutput += ", "; } }
    if (splitEP > 0) { strOutput += "<span style='color:#617480'>" + splitEP + "ep</span>"; if (splitSP > 0 || splitCP > 0) { strOutput += ", "; } }
    if (splitSP > 0) { strOutput += "<span style='color:#717773'>" + splitSP + "sp</span>"; if (splitCP > 0) { strOutput += ", "; } }
    if (splitCP > 0) { strOutput += "<span style='color:#9D5934'>" + splitCP + "cp</span>"; }
    
    if (leftoverPP > 0 || leftoverGP > 0 || leftoverEP > 0 || leftoverSP > 0 || leftoverCP > 0)
    { 
        strOutput = strOutput + "<hr /><b>" + winningActor + " gets the remainder</b>:<br />";
		
	    if (leftoverPP > 0) { strOutput += "<span style='color:#90A2B6'>" + leftoverPP + "pp</span>"; if (leftoverGP > 0 || leftoverEP > 0 || leftoverSP > 0 || leftoverCP > 0) { strOutput += ", "; } }		
		if (leftoverGP > 0) { strOutput += "<span style='color:#B08C34'>" + leftoverGP + "gp</span>"; if (leftoverEP > 0 || leftoverSP > 0 || leftoverCP > 0) { strOutput += ", "; } }
		if (leftoverEP > 0) { strOutput += "<span style='color:#617480'>" + leftoverEP + "ep</span>"; if (leftoverSP > 0 || leftoverCP > 0) { strOutput += ", "; } }
		if (leftoverSP > 0) { strOutput += "<span style='color:#717773'>" + leftoverSP + "sp</span>"; if (leftoverCP > 0) { strOutput += ", "; } }
		if (leftoverCP > 0) { strOutput += "<span style='color:#9D5934'>" + leftoverCP + "cp</span>"; }
    }
    
    ChatMessage.create({content: strOutput});
};

let currencyTotals = permissionCheck ? `
<b>Currency Totals:</b><br />
<div style="display: flex; width: 100%; margin: 10px 0px 10px 0px">
    <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">PP:</label>
    <input type="number" id="pp" name="pp" />
    <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">GP:</label>
    <input type="number" id="gp" name="gp" />
    <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">EP:</label>
    <input type="number" id="ep" name="ep" />
    <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">SP:</label>
    <input type="number" id="sp" name="sp"/ >
    <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">CP:</label>
    <input type="number" id="cp" name="cp"/ >
</div>
` : '';

new Dialog({
    title: `Distribute Currency`,
    content: `
        <form>
            ${currencyTotals}
        </form>
    `,
    buttons: {
        yes: {
            icon: "<i class='fas fa-check'></i>",
            label: `Distribute`,
            callback: (html) => {
                let totalPP = html.find('#pp').val();
                let totalGP = html.find('#gp').val();
                let totalEP = html.find('#ep').val();
                let totalSP = html.find('#sp').val();
                let totalCP = html.find('#cp').val();
                
                if (totalPP == null || Number.isInteger(+totalPP) == false) { totalPP = 0; }
                if (totalGP == null || Number.isInteger(+totalGP) == false) { totalGP = 0; }
                if (totalEP == null || Number.isInteger(+totalEP) == false) { totalEP = 0; }
                if (totalSP == null || Number.isInteger(+totalSP) == false) { totalSP = 0; }
                if (totalCP == null || Number.isInteger(+totalCP) == false) { totalCP = 0; }
                
                if (permissionCheck) {
                    awardCurrency(totalPP, totalGP, totalEP, totalSP, totalCP);
                }
            }
        },
        no: {
            icon: "<i class='fas fa-times'></i>",
            label: `Cancel`
        },
    },
    default: "yes"
}).render(true)