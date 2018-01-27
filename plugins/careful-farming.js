//  import ScriptCraft modules
//
var utils = require('utils');
var events = require('events');
var items = require('items');
var inventory = require('inventory');

function realisticWheat(event) {
    var block = event.getBlock();
    var player = farmer.getPlayer();

    var playerlocation = player.location;
    var playerworld = playerlocation.world;

    // we are only interested in wheat
    if (block.getType() != '' + 'WHEAT') {
        return;
    }

    block.setDropItems(false);

    var dropitem;
    var dropamount;
    var dropstack;

    var growth = block.getData();
    if (growth < 4) {
        return;
    } else if (growth == 4) {
        dropitem = org.bukkit.Material.WHEAT_SEED;
        dropamount = 1;
    } else if (growth == 5) {
        dropitem = org.bukkit.Material.WHEAT_SEED;
        dropamount = Math.ceil(Math.random() * 2);
    } else if (growth == 6) {
        dropitem = org.bukkit.Material.WHEAT_SEED;
        dropamount = 2;
    } else if (growth == 7) {
        dropitem = org.bukkit.Material.WHEAT;
        dropamount = 1;
    }

    dropstack = new Packages.org.bukkit.inventory.ItemStack(dropitem, dropamount);
    playerworld.dropItem(player.getLocation(), dropstack);
}

function plantInGoodSoil(event) {
    if (! event.hasBlock()) { return; }
    if (! event.hasItem()) { return; }
    if (! event.getAction() == org.bukkit.event.block.Action.RIGHT_CLICK_BLOCK) { return; }

    var block = event.getClickedBlock();
    var item = event.getItem();

    if (item != org.bukkit.Material.WHEAT_SEED) { return; }
    if (block.getData() < 7) { return; }
}

events.blockBreak(realisticWheat);
events.playerInteract(plantInGoodSoil);
