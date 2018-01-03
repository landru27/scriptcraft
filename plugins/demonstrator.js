var utils = require('utils');

command('demonstration', function(parameters, player) {
    echo(player, 'hello there, ' + player.name);

    var targetPos = utils.getMousePos(player.name);
    echo(player, 'target X is : ' + targetPos.x);
    echo(player, 'target Y is : ' + targetPos.y);
    echo(player, 'target Z is : ' + targetPos.z);

    var targetBlock = utils.blockAt(targetPos);
    var blockState = targetBlock.getState();

    echo(player, 'target block is : ' + targetBlock.typeId);
    echo(player, 'target block is : ' + targetBlock.getType());

    if (parameters[0] !== undefined) { echo(player, 'parameter 1 is : ' + parameters[0]); }
    if (parameters[1] !== undefined) { echo(player, 'parameter 2 is : ' + parameters[1]); }
    
    var playerinventory = player.getInventory().getContents();
    for (var prop in playerinventory) {
        console.log('playerinventory.' + prop + ' = ' + playerinventory[prop]);
    }
    
    echo(player, 'playerinventory[0].getType() : ' + playerinventory[0].getType());

    var allenchantments = org.bukkit.enchantments.Enchantment.values();
    for (var prop in allenchantments) {
        console.log('allenchantments.' + prop + ' = ' + allenchantments[prop]);
    }

    var blockChunk = blockState.getChunk();
    var blockWorld = blockChunk.getWorld();
    var blockDiff = blockWorld.getDifficulty();
    echo(player, 'difficulty of world of target block is : ' + blockDiff);

    echo(player, 'player exhaustion is : ' + player.getExhaustion());
    echo(player, 'player exp is        : ' + player.getExp());
    echo(player, 'player fly speed is  : ' + player.getFlySpeed());
    echo(player, 'player food level is : ' + player.getFoodLevel());
    echo(player, 'player level is      : ' + player.getLevel());
});
