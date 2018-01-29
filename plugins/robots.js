var newrobot = function() {
    var player = self;
    var playerlocation = player.getLocation();
    var targetblock = player.getTargetBlock(null, 16);
    var blocklocation = targetblock.getLocation();
    var playerworld = player.getWorld();

    // place the robot on top of and in the center of the target block
    blocklocation = blocklocation.add(0.5, 1.0, 0.5);

    bot = playerworld.spawnEntity(blocklocation, org.bukkit.entity.EntityType.ARMOR_STAND);
    bot.setArms(true);
    bot.setBasePlate(false);
    bot.setHelmet(new org.bukkit.inventory.ItemStack(org.bukkit.Material.COMMAND));
}
exports.newrobot = newrobot;

var findrobot = function(player) {
    var playerlocation = player.getLocation();
    var playerdirection = playerlocation.getDirection();
    var playerworld = player.getWorld();
    var indx;

    var aheadofplayer = playerlocation.add(0.0, 1.0, 0.0).add(playerdirection.normalize().multiply(2));

    var nearby = playerworld.getNearbyEntities(aheadofplayer, 2, 2, 2);
    var qty = nearby.length;
    var bot = null;
    for (indx = 0; indx < qty; indx++) {
        if (nearby[indx].getType() == org.bukkit.entity.EntityType.ARMOR_STAND) {
            bot = nearby[indx];
        }
    }
    if (bot === null) {
        echo(player, 'did not find a robot nearby');
    }

    return bot;
}

var walkfwd = function(bot, step, dist) {
    if (bot  === null)      { return; }
    if (bot  === undefined) { return; }
    if (step === undefined) { return; }
    if (dist === undefined) { return; }

    var botlocation = bot.getLocation();
    var botdirection = botlocation.getDirection();

    var stepfwd;
    for (indx = 0; indx < dist; indx++) {
        stepfwd = botlocation.add(0.0, 0.0, 0.0).add(botdirection.normalize().multiply(step));
        bot.teleport(stepfwd);
    }
}

var tellrobotwalkfwd = function(step, dist) {
    if (step === undefined) { step = 1; }
    if (dist === undefined) { dist = 1; }

    var bot = findrobot(self);

    walkfwd(bot, step, dist);
}
exports.tellrobotwalkfwd = tellrobotwalkfwd;

var findandmine = function(bot, repeat) {
    if (bot    === null)      { return; }
    if (bot    === undefined) { return; }
    if (repeat === undefined) { return; }

    var player = self;
    var playerworld = player.getWorld();

    var botlocation = bot.getLocation();
    var botdirection = botlocation.getDirection();
    var targetblock;
    var bottool = new org.bukkit.inventory.ItemStack(org.bukkit.Material.DIAMOND_PICKAXE);
    var indx;
    var mined;

    for (indx = 0; indx < repeat; indx++) {
        targetblock = bot.getTargetBlock(null, 1);
        echo(player, 'bot is facing block : ' + targetblock.getType());

        if (targetblock.getType() == org.bukkit.Material.AIR) {
            targetblock = playerworld.getBlockAt(targetblock.getLocation().add(0.0, -1.0, 0.0));
            echo(player, 'bot is facing air block above : ' + targetblock.getType());

            if (targetblock.getType() == org.bukkit.Material.AIR) {
                walkfwd(bot, 1, 1);
            } else {
                mined = targetblock.breakNaturally(bottool);
                if (mined == false) {
                    echo(player, 'bot mining lower block FAILED!');
                    return;
                }
            }
        } else {
            mined = targetblock.breakNaturally(bottool);
            if (mined == false) {
                echo(player, 'bot mining upper block FAILED!');
                return;
            }
        }
    }
}

var tellrobotfindandmine = function(repeat) {
    if (repeat === undefined) { repeat = 1; }

    var player = self;
    echo(player, 'repeat is : ' + repeat);

    var bot = findrobot(player);

    findandmine(bot, repeat);
}
exports.tellrobotfindandmine = tellrobotfindandmine;
