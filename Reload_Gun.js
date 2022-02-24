function go() {
    let actor = token.actor;
    // reloading pepperbox
    actor.update({"data.resources.primary.value" : 2});
    // reloading years hand grenade
    actor.update({"data.resources.secondary.value" : 2});
    // reloading bad news
    actor.update({"data.resources.tertiary.value" : 2});
}
go();