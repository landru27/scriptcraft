//  import ScriptCraft modules
//
var utils = require('utils');
var events = require('events');
var items = require('items');
var inventory = require('inventory');

function reportDeathAndDropDiamods(event) {
    var killed = event.getEntity();
    var player = killed.getKiller();

    var playerlocation = player.location;
    var playerworld = playerlocation.world;

    echo(player, 'the player ' + player.name + ' killed a ' + killed.getType());

    // use this to limit this logic to only certain mobs
    if (killed.getType() != '' + 'ZOMBIE') {
        return;
    }

    // would it be nice if ... ?
    var dropstack = new Packages.org.bukkit.inventory.ItemStack(org.bukkit.Material.DIAMOND, 3);

    // drop something in addition to what the mob normally drops ...
    playerworld.dropItem(killed.getLocation(), dropstack);

    // -- OR --

    // replace what the mob normally drops with something else ...
    event.drops.clear();
    event.drops.add(dropstack);
}

events.entityDeath(reportDeathAndDropDiamods);
