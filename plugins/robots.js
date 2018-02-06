//////////////////////////////////////////////////////////////////////////////
//  interface functions

// 'craft' a new robot
var newrobot = function(name) {
    var bot;

    bot = buildbot(name);
    if (bot === null) {
        echo(self, 'could not instantiate a new robot');
        return;
    }

    robotai(self, bot);
}
exports.newrobot = newrobot;

var activaterobot = function(name) {
    var bot;
    var botstatus;

    bot = findrobot(self);
    if (bot === null) {
        echo(self, 'could not find a robot nearby');
        return;
    }

    botstatus = bot.getMetadata('botstatus')[0].value();
    if (botstatus === undefined) {
        botstatus = {
            name: name,
            command: 'idle',
            commandtick: 0,
            commandarg1: 0,
        };
    }
    bot.setMetadata('botstatus', new org.bukkit.metadata.FixedMetadataValue(__plugin, botstatus));

    robotai(self, bot);
}
exports.activaterobot = activaterobot;

// give the robot a tool
var giverobot = function() {
    var player = self;
    var playerinventory = player.getInventory();

    var bot = findrobot(self);
    var gift = playerinventory.getItemInMainHand();
    bot.setItemInHand(gift);
    playerinventory.setItemInMainHand(null);
}
exports.giverobot = giverobot;

// give a robot instructions
var commandrobot = function(name, command, duration, arg1) {
    var bot;
    var err;
    var rslt;

    if ((name === undefined) || (name === null)) {
        bot = findrobot(self);
        err = 'nearby';
    } else {
        bot = findrobotbyname(self, name);
        err = 'by that name';
    }
    if (bot === null) {
        echo(self, 'could not find a robot ' + err);
        return;
    }

    if (command  === undefined) { command  = 'idle'; }
    if (duration === undefined) { duration =      0; }

    rslt = setrobotcommand(bot, command, duration, arg1);
    if (! rslt) {
        echo(self, 'could not set the command for that robot');
        return;
    }
}
exports.commandrobot = commandrobot;

function setrobotcommand(bot, cmnd, dura, arg1) {
    if ((bot  === undefined) || (bot  === null)) { return false; }
    if ((cmnd === undefined) || (cmnd === null)) { return false; }
    if ((dura === undefined) || (dura === null)) { return false; }

    if (arg1 !== undefined)

    var botstatus;

    botstatus = bot.getMetadata('botstatus')[0].value();

    if (botstatus === undefined) {
        botstatus = {
            name: 'unknown',
            command: 'idle',
            commandtick: 0,
            commandarg1: 0,
        };
    }

    botstatus.command = cmnd;
    botstatus.commandtick = dura;

    if (arg1 !== undefined) { botstatus.commandarg1 = arg1; }

    bot.setMetadata('botstatus', new org.bukkit.metadata.FixedMetadataValue(__plugin, botstatus));

    return true;
}


//////////////////////////////////////////////////////////////////////////////
// provisioning

function buildbot(name) {
    // place the robot on top of and in the center of the block the player is looking at
    botlocation = self.getTargetBlock(null, 8).getLocation().add(0.5, 1.0, 0.5);

    var bot = self.getWorld().spawnEntity(botlocation, org.bukkit.entity.EntityType.ARMOR_STAND);
    bot.setArms(true);
    bot.setBasePlate(false);
    bot.setHelmet(new org.bukkit.inventory.ItemStack(org.bukkit.Material.COMMAND));

    if (name === null)      { name = randomString(8); }
    if (name === undefined) { name = randomString(8); }

    var botstatusinit = {
        name: name,
        command: 'idle',
        commandtick: 0,
        commandarg1: 0,
    };
    bot.setMetadata('botstatus', new org.bukkit.metadata.FixedMetadataValue(__plugin, botstatusinit));

    echo(self, 'instantiated a robot named ' + botstatusinit.name);

    return bot;
}

function robotai(person, bot) {
    echo(self, 'starting robot ai');

    continuouswithdelay(function() {

        if (bot.isDead()  == true) { return true; }
        if (bot.isValid() != true) { return true; }

        var botstatus = bot.getMetadata('botstatus')[0].value();

        botstatus.commandtick++;
        //console.log('commandtick ticker is : ' + botstatus.commandtick);

        // ... facenorth ...
        // ... mineforward ...
        // ... minedownward ...
        // ... mineoutwardspiral ...
        // ... mineoutwarddownwardspiral ...

        if (botstatus.command == 'idle') {

            botstatus.commandtick = 0;

        } else if (botstatus.command == 'turn90') {

            turninplace(bot, 90);
            botstatus.command = 'idle';

        } else if (botstatus.command == 'turnangle') {

            turninplace(bot, botstatus.commandarg);
            botstatus.command = 'idle';

        } else if (botstatus.command == 'stepforward') {

            stepfwd(bot);
            botstatus.command = 'idle';

        } else if (botstatus.command == 'wander') {

            if (botstatus.commandtick > 8) {
                turninplace(bot, (Math.random() * 180) - 90);
                botstatus.commandtick = 0;
            }

            stepfwd(bot);

        } else {
            console.log('bot ' + botstatus.name + ' is without instructions');
            botstatus.commandtick = 0;
        }

        bot.setMetadata('botstatus', new org.bukkit.metadata.FixedMetadataValue(__plugin, botstatus));

    }, 200);
}

//////////////////////////////////////////////////////////////////////////////
// simple commands, mainly for demonstration

var tellrobotmovefwd = function(dist) {
    if (dist === undefined) { dist = 1; }

    var bot = findrobot(self);

    stepfwd(bot, dist);
}
exports.tellrobotmovefwd = tellrobotmovefwd;

var tellrobotwalkfwd = function(dist, step) {
    if (dist === undefined) { dist = 1; }
    if (step === undefined) { step = 1; }

    var bot = findrobot(self);

    repeatwithdelay(function() {
        stepfwd(bot, (dist / step));
    }, 200, step, true, function() {});
}
exports.tellrobotwalkfwd = tellrobotwalkfwd;

var tellrobotrotate = function(angle) {
    if (angle === undefined) { angle = 90; }

    var bot = findrobot(self);

    turninplace(bot, angle);
}
exports.tellrobotrotate = tellrobotrotate;

var tellrobotturn = function(angle, step) {
    if (angle === undefined) { angle = 90; }
    if (step  === undefined) { step  = 10; }

    var bot = findrobot(self);

    repeatwithdelay(function() {
        turninplace(bot, (angle / step));
    }, 200, step, true, function() {});
}
exports.tellrobotturn = tellrobotturn;


//////////////////////////////////////////////////////////////////////////////
// higer-order commands
var tellrobotmineahead = function(repeat) {
    if (repeat === undefined) { repeat = 1; }

    var player = self;
    var bot = findrobot(player);
    if (bot === null) { return; }
    var flagX;

    repeatwithdelay(function() {
        var flagM;
        var flagS;

        if (flagX == true) { return; }

        flagM = mineahead(bot);
        if (flagM != true) {
            flagS = stepfwd(bot);
            if (flagS != true) {
                flagX = true;
            }
        }
    }, 200, repeat, true, function() {});
}
exports.tellrobotmineahead = tellrobotmineahead;

var tellrobotfindsheep = function(dist) {
    var player = self;
    var bot = findrobot(player);
    if (bot === null) { return; }

    var botstatusinit = {
        islookingforsheep: false,
        foundsheep: false,
        timeslookedforsheep: 0,
    };
    bot.setMetadata('botstatus', new org.bukkit.metadata.FixedMetadataValue(__plugin, botstatusinit));

    continuouswithdelay(function() {
        if (bot.isDead()  == true) { return true; }
        if (bot.isValid() != true) { return true; }

        var botstatus = bot.getMetadata('botstatus')[0].value();

        if (botstatus.islookingforsheep == false) {
            if (botstatus.foundsheep == false) {
                if (botstatus.timeslookedforsheep > 2) {
                    echo(player, 'could not find a sheep!');
                    return true;
                } else {
                    echo(player, 'looking for a sheep ...');
                    execrobotfindsheep(bot, dist);
                }
            } else {
                echo(player, 'found a sheep!');
                return true;
            }
        }

    }, 200);
}
exports.tellrobotfindsheep = tellrobotfindsheep;

var execrobotfindsheep = function(bot, dist) {
    if (bot === null)          { return false; }
    if (bot === undefined)     { return false; }
    if (bot.isDead()  == true) { return false; }
    if (bot.isValid() != true) { return false; }

    if (dist === undefined) { repeat = 4; }

    var botstatus = bot.getMetadata('botstatus')[0].value();
    botstatus.islookingforsheep = true;
    botstatus.foundsheep = false;

    bot.setMetadata('botstatus', new org.bukkit.metadata.FixedMetadataValue(__plugin, botstatus));

    var targetentity = null;
    var step = 2;

    repeatwithdelay(function() {
        if (bot.isDead()  == true) { return true; }
        if (bot.isValid() != true) { return true; }
        if (targetentity !== null) { return true; }

        targetentity = findentityahead(bot, org.bukkit.entity.EntityType.SHEEP, dist);
        if (targetentity !== null) {
            var botstatus = bot.getMetadata('botstatus')[0].value();
            botstatus.islookingforsheep = false;
            botstatus.foundsheep = true;

            bot.setMetadata('botstatus', new org.bukkit.metadata.FixedMetadataValue(__plugin, botstatus));

            return true;
        }

        turninplace(bot, step);
    }, 200, (360 / step), true, function() {
            var botstatus = bot.getMetadata('botstatus')[0].value();
            botstatus.islookingforsheep = false;
            botstatus.foundsheep = false;
            botstatus.timeslookedforsheep++;

            bot.setMetadata('botstatus', new org.bukkit.metadata.FixedMetadataValue(__plugin, botstatus));
    });
}


//////////////////////////////////////////////////////////////////////////////
// robot functionality

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

var findrobotbyname = function(player, name) {
    return null;
}

var stepfwd = function(bot) {
    if (bot === null)          { return false; }
    if (bot === undefined)     { return false; }
    if (bot.isDead()  == true) { return false; }
    if (bot.isValid() != true) { return false; }

    var botworld = bot.getWorld();
    var botlocation = bot.getLocation();
    var botdirection = botlocation.getDirection();
    var step = 0.6858;
    var blockAbove;
    var blockInFront;
    var blockAboveInFront;
    var blockBelowInFront;
    var moved = false;

    var calclocation;

    calclocation      = botlocation.clone()
    blockAbove        = botworld.getBlockAt(calclocation.add(0.0, 2.0, 0.0));
    calclocation      = botlocation.clone()
    blockInFront      = botworld.getBlockAt(calclocation.add(0.0, 1.0, 0.0).add(botdirection.normalize().multiply(step)));
    blockAboveInFront = botworld.getBlockAt(blockInFront.getLocation().add(0.0,  1.0, 0.0));
    blockBelowInFront = botworld.getBlockAt(blockInFront.getLocation().add(0.0, -1.0, 0.0));

    // if the two blocks immediately in front are clear, step forward
    if ((! blockInFront.getType().isSolid()) &&
        (! blockBelowInFront.getType().isSolid())) {
        moved = bot.teleport(botlocation.add(0.0, 0.0, 0.0).add(botdirection.normalize().multiply(step)));
    }

    // if the lower block ahead is solid and the two blocks above it are clear and the block overhead is clear, step up and forward
    if ((blockBelowInFront.getType().isSolid()) &&
        (! blockInFront.getType().isSolid()) &&
        (! blockAboveInFront.getType().isSolid()) &&
        (! blockAbove.getType().isSolid())) {
        moved = bot.teleport(botlocation.add(0.0, 1.0, 0.0).add(botdirection.normalize().multiply(step)));
    }

    // TODO
    // check for the step ahead being too far of a step down
    // check for the step ahead to be water or lava

    return moved;
}

var turninplace = function(bot, angle) {
    if (bot === null)          { return false; }
    if (bot === undefined)     { return false; }
    if (bot.isDead()  == true) { return false; }
    if (bot.isValid() != true) { return false; }

    if (angle === undefined)   { return false; }

    var botlocation = bot.getLocation();
    var turned = false;

    botlocation.setYaw(botlocation.getYaw() + angle);
    turned = bot.teleport(botlocation);

    return turned;
}

var mineahead = function(bot) {
    if (bot === null)          { return false; }
    if (bot === undefined)     { return false; }
    if (bot.isDead()  == true) { return false; }
    if (bot.isValid() != true) { return false; }

    // feedback to observe running
    //console.log(new Date() + ' : mineahead');

    var player = self;

    var botworld = bot.getWorld();
    var botlocation = bot.getLocation();
    var botdirection = botlocation.getDirection();
    var targetblock;

    var mined = false;
    var bottool = bot.getItemInHand();
    //echo(player, 'bot is using : ' + bottool.getType());

    targetblock = bot.getTargetBlock(null, 1);

    if (targetblock.getType() == org.bukkit.Material.AIR) {
        targetblock = botworld.getBlockAt(targetblock.getLocation().add(0.0, -1.0, 0.0));

        if (targetblock.getType() == org.bukkit.Material.AIR) {
            mined = false;
        } else {
            mined = targetblock.breakNaturally(bottool);
        }
    } else {
        mined = targetblock.breakNaturally(bottool);
    }

    return mined;
}

var findentityahead = function(bot, entity, dist) {
    if (bot === null)          { return null; }
    if (bot === undefined)     { return null; }
    if (bot.isDead()  == true) { return null; }
    if (bot.isValid() != true) { return null; }

    if (entity === undefined)  { return null; }
    if (dist === undefined)    { return null; }

    // feedback to observe running
    //console.log(new Date() + ' : findentityahead');

    var player = self;

    var botworld = bot.getWorld();
    var botlocation = bot.getLocation();
    var botdirection = botlocation.getDirection();

    var block;
    var found = null;
    var indxA;
    var indxB;

    for (indxA = 1; indxA < dist; indxA++) {
        block = bot.getTargetBlock(null, indxA);

        var nearby = botworld.getNearbyEntities(block.getLocation(), 1, 1, 1);
        var qty = nearby.length;
        for (indxB = 0; indxB < qty; indxB++) {
            if (nearby[indxB].getType() == entity) {
                found = nearby[indxB];
                break;
            }
        }
    }

    return found;
}


//////////////////////////////////////////////////////////////////////////////
//  utility functions

// https://codereview.stackexchange.com/questions/13046/javascript-repeat-a-function-x-times-at-i-intervals
// added check for 'cancel'
// added 'whendone' as a callback for when the repetitions are complete
//
function repeatwithdelay(callback, interval, repeats, immediate, whendone) {
    if (repeats < 1) { return; }

    var timer, trigger, cancel;
    trigger = function () {
        cancel = callback();

        repeats--;
        if ((repeats < 1) || (cancel)) {
            clearInterval(timer);
            whendone();
        }
    };

    interval = interval <= 0 ? 1000 : interval; // default: 1000ms
    repeats  = parseInt(repeats, 10) || 1;      // default: just once
    timer    = setInterval(trigger, interval);

    if( !!immediate ) { // coerce boolean
        trigger();
    }
}

// variation on the above, for continuous execution
//
function continuouswithdelay(callback, interval) {
    var timer, trigger, cancel;
    trigger = function () {
        cancel = callback();

        if (cancel) {
            clearInterval(timer);
        }
    };

    interval = interval <= 0 ? 1000 : interval; // default: 1000ms
    timer    = setInterval(trigger, interval);
}

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
//
function randomString(len, charset) {
    charset = charset || 'BCDFGHJKLMNPQRSTVWXZbcdfghjklmnpqrstvwxz0123456789';

    var rstr = '';
    for (var i = 0; i < len; i++) {
        var rpoz = Math.floor(Math.random() * charset.length);
        rstr += charset.substring(rpoz, rpoz + 1);
    }

    return rstr;
}

//////////////////////////////////////////////////////////////////////////////
