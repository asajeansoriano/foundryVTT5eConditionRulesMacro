// HotbarUses5e: ActorID="ZTNiYWE5ZTJlNmE4" ItemID="YWFiMWJhODg1ZmY4"
const actorId = "ZTNiYWE5ZTJlNmE4";
const itemId = "YWFiMWJhODg1ZmY4";
const actorToRoll = canvas.tokens.placeables.find(t => t.actor?.id === actorId)?.actor ?? game.actors.get(actorId);
const itemToRoll = actorToRoll?.items.get(itemId);

if (game.modules.get('itemacro')?.active && itemToRoll?.hasMacro() && game.settings.get('itemacro', 'defaultmacro')) {
	return itemToRoll.executeMacro();
}


const effect_name = "Shield of Faith";
const effect_list = token.actor.effects.contents;
//Find effect in contents and store in val
var effect = effect_list.find( e => e.data.label === effect_name);
const effect_id = effect.data._id;
const status = effect.data.disabled;
//toggle disable if effect is active
if (status === false) { 
token.actor.updateEmbeddedDocuments("ActiveEffect", [{"_id": effect_id, "disabled": true}] );
}
//else toggle enable if effect is inactive
else {
    token.actor.updateEmbeddedDocuments("ActiveEffect", [{"_id": effect_id, "disabled": false}] );
};

//Item not found warning
if (!itemToRoll) {
	return ui.notifications.warn(game.i18n.format("DND5E.ActionWarningNoItem", { item: itemId, name: actorToRoll?.name ?? "[Not Found]" }));
}

if (status === true) itemToRoll.roll({ vanilla: false });