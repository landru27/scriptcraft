//////////////////////////////////////////////////////////////////////////////
////    interface functions    ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// standard interface

var newrobot = function(botname) {
    var playername = self.getName();

    var bot = buildbot(playername, botname);
    if (bot === null) {
        echo(self, 'could not build a new robot');
        return;
    }
};
exports.newrobot = newrobot;

var robotname = function() {
    var bot = findrobot(self);
    if (bot === null) {
        echo(self, 'could not find a robot nearby');
        return;
    }

    var botstatus = bot.getMetadata('botstatus')[0].value();
    if (botstatus === null) {
        echo(self, 'this robot has an empty databank');
        return;
    }

    if ((botstatus.name === undefined) ||
        (botstatus.name === null) ||
        (botstatus.name === "")) {
        echo(self, 'this robot has no name');
        return;
    }

    echo(self, 'this robot is named : ' + botstatus.name);
};
exports.robotname = robotname;

var robotmeta = function() {
    var bot = findrobot(self);
    if (bot === null) {
        echo(self, 'could not find a robot nearby');
        return;
    }

    var botstatus = bot.getMetadata('botstatus')[0].value();
    if (botstatus === null) {
        echo(self, 'this robot has an empty databank');
        return;
    }

    echo(self, 'this robot was built by : ' + botstatus.player);
    echo(self, 'this robot is named     : ' + botstatus.name);
    echo(self, 'this robot command is   : ' + botstatus.command);
};
exports.robotmeta = robotmeta;

var namerobot = function(botname) {
    var bot = findrobot(self);
    if (bot === null) {
        echo(self, 'could not find a robot nearby');
        return;
    }

    if ((botname === undefined) ||
        (botname === null) ||
        (botname === "")) {
        echo(self, 'you must supply a name as a parameter');
        return;
    }

    if (typeof botname !== 'string') {
        echo(self, 'the name parameter must be a string');
        return;
    }

    var botstatus = bot.getMetadata('botstatus')[0].value();
    if (botstatus === null) {
        echo(self, 'initializing databank for this robot');
        botstatus = {};
    }

    botstatus.name = botname;
    echo(self, 'named this robot : ' + botstatus.name);

    bot.setMetadata('botstatus', new org.bukkit.metadata.FixedMetadataValue(__plugin, botstatus));
};
exports.namerobot = namerobot;

var commandrobot = function(botcommand, botname) {
    var err = 'undef';
    var idx = 'undef';
    var bot = null;

    if ((botname === undefined) ||
        (botname === null) ||
        (botname === "") ||
        (typeof botname !== 'string')) {
        err = 'nearby';
        idx = 'nearby';
        bot = findrobot(self);
    } else {
        err = 'by that name';
        idx = ': ' + botname;
        bot = findrobotbyname(self, botname);
    }
    if (bot === null) {
        echo(self, 'could not find a robot ' + err);
        return;
    }

    if ((botcommand === undefined) ||
        (botcommand === null) ||
        (botcommand === "")) {
        echo(self, 'you must supply a command as a parameter');
        return;
    }

    if (typeof botcommand !== 'string') {
        echo(self, 'the command parameter must be a string');
        return;
    }

    var botstatus = bot.getMetadata('botstatus')[0].value();
    if (botstatus === null) {
        echo(self, 'initializing databank for this robot');
        botstatus = {};
    }

    botstatus.command = botcommand;
    echo(self, 'gave command to robot ' + idx + ' : ' + botcommand);

    bot.setMetadata('botstatus', new org.bukkit.metadata.FixedMetadataValue(__plugin, botstatus));
};
exports.commandrobot = commandrobot;

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
////    AI routines    ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// this section is for more involved AI routines that would be cumbersome to
// include directly in the  'botcommandlibrary' object;  see 'wander' e.g.

var botexecwander = function(botstatus) {
    if (botstatus.wandertick === undefined) { botstatus.wandertick = 0; }
    if (botstatus.wandertick ===      null) { botstatus.wandertick = 0; }

    botstatus.wandertick++;

    if (botstatus.wandertick > 8) {
        turninplace(this, (Math.random() * 180) - 90);
        botstatus.wandertick = 0;
    }

    stepfwd(this);

    return botstatus;
};

// looking for entities ...
//
// ... targetentity = findentityahead(bot, org.bukkit.entity.EntityType.SHEEP, dist); ...
// ... if (targetentity !== null) { ... }


//////////////////////////////////////////////////////////////////////////////
// base robot functionality

function buildbot(playername, botname) {
    if (playername === undefined) { return null; }
    if (playername ===      null) { return null; }

    // place the robot on top of and in the center of the block the player is looking at
    botlocation = self.getTargetBlock(null, 8).getLocation().add(0.5, 1.0, 0.5);

    var bot = self.getWorld().spawnEntity(botlocation, org.bukkit.entity.EntityType.ARMOR_STAND);
    bot.setArms(true);
    bot.setBasePlate(false);
    bot.setHelmet(new org.bukkit.inventory.ItemStack(org.bukkit.Material.COMMAND));

    if (botname === undefined) { botname = randomString(8); }
    if (botname ===      null) { botname = randomString(8); }

    var botstatusinit = {
        player: playername,
        name: botname,
        command: 'idle',
    };
    bot.setMetadata('botstatus', new org.bukkit.metadata.FixedMetadataValue(__plugin, botstatusinit));

    console.log(self, 'instantiated a robot named ' + botstatusinit.name);

    return bot;
}

function findrobot(player) {
    var playerlocation = player.getLocation();
    var playerdirection = playerlocation.getDirection();
    var playerworld = player.getWorld();
    var indx;

    var aheadofplayer = playerlocation.add(0.0, 1.0, 0.0).add(playerdirection.normalize().multiply(2));

    // NOTE: this can/will turn any nearby armor stand into a robot; add logic here
    // to filter out ordinary armor stands ...

    var nearby = playerworld.getNearbyEntities(aheadofplayer, 2, 2, 2);
    var qty = nearby.length;
    var bot = null;
    for (indx = 0; indx < qty; indx++) {
        if (nearby[indx].getType() == org.bukkit.entity.EntityType.ARMOR_STAND) {
            bot = nearby[indx];
        }
    }

    return bot;
}

function findrobotbyname(player, name) {
    var entities = server.worlds.get(0).getEntities();
    var botmeta;
    var botname;
    var indx, qty;

    qty = entities.length;
    for(indx = 0; indx < qty; indx++) {
        if (entities[indx].getType() == org.bukkit.entity.EntityType.ARMOR_STAND) {
            botmeta = entities[indx].getMetadata('botstatus')[0].value();
            if (botmeta !== null) {
                if ((botmeta.player === undefined) ||
                    (botmeta.player === null)) {
                    playername = 'unknown';
                } else {
                    playername = botmeta.player;
                }

                if ((botmeta.name === undefined) ||
                    (botmeta.name === null)) {
                    botname = 'unknown';
                } else {
                    botname = botmeta.name;
                }

                if ((playername == player.getName()) &&
                    (botname == name)) {
                    return entities[indx];
                }
            }
        }
    }

    return null;
}

function stepfwd(bot) {
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
        moved = bot.teleport(botlocation.add(0.0, 0.0, 0.0).add(botdirection.normalize().multiply((step / 2.0))));
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

function turninplace(bot, angle) {
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

function mineahead(bot) {
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

function findentityahead(bot, entity, dist) {
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
////    utility functions    /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//
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

//
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

//
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
////    the collection of robot AI commands    ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//
//  the AI defined below are general purpose;  this should be left as-is, but
//  the object 'botcommandlibrary' can be extended to add more AI commands
//
//////////////////////////////////////////////////////////////////////////////

var botcommandlibrary = {
    // this command has no 'logic' property, to halt all processing
    'halt': {
    },

    'idle': {
        logic: function(botstatus) {
                   if (botstatus.idletick === undefined) { botstatus.idletick = 0; }
                   if (botstatus.idletick ===      null) { botstatus.idletick = 0; }

                   botstatus.idletick++;

                   if (botstatus.idletick > 32) {
                       console.log('bot ' + botstatus.name + ' is idle');
                       botstatus.idletick = 0;
                   }

                   return botstatus;
               },
    },

    'facenorth': {
        logic: function(botstatus) {
                   var botlocation = this.getLocation();

                   botlocation.setYaw(0);
                   this.teleport(botlocation);

                   botstatus.command = 'idle';

                   return botstatus;
               },
    },

    'turn90': {
        logic: function(botstatus) {
                   turninplace(this, 90);

                   botstatus.command = 'idle';

                   return botstatus;
               },
    },

    'stepforward': {
        logic: function(botstatus) {
                   stepfwd(this);

                   botstatus.command = 'idle';

                   return botstatus;
               },
    },

    'wander': {
        logic: botexecwander,
    },

    // ... mineforward ...
    // ... minedownward ...
    // ... mineoutwardspiral ...
    // ... mineoutwarddownwardspiral ...
};


//////////////////////////////////////////////////////////////////////////////
////    core functionality    ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//  master control

function botmastercontrol() {
    var entities = server.worlds.get(0).getEntities();
    var botmeta;
    var playername;
    var botname;
    var indx, qty;

    qty = entities.length;
    for(indx = 0; indx < qty; indx++) {
        if (entities[indx].getType() == org.bukkit.entity.EntityType.ARMOR_STAND) {
            botmeta = entities[indx].getMetadata('botstatus')[0].value();
            if (botmeta !== null) {
                if ((botmeta.command !== undefined) &&
                    (botmeta.command !== null)) {

                    if ((botmeta.player === undefined) ||
                        (botmeta.player === null)) {
                        playername = 'unknown';
                    } else {
                        playername = botmeta.player;
                    }

                    if ((botmeta.name === undefined) ||
                        (botmeta.name === null)) {
                        botname = 'unknown';
                    } else {
                        botname = botmeta.name;
                    }

                    console.log('activating robot : ' + botname + ' for ' + playername);

                    if ((playername != 'unknown') &&
                        (botname != 'unknown')) {
                        echo(server.getPlayer(playername), 'activating your robot : ' + botname);
                    }

                    activaterobotai(entities[indx]);
                }
            }
        }
    }
}

function activaterobotai(bot) {
    continuouswithdelay(function() {
        var botstatus;

        if (bot.isDead()  == true) { return true; }
        if (bot.isValid() != true) { return true; }

        botstatus = bot.getMetadata('botstatus')[0].value();

        if (botstatus !== null) {
            if ((botstatus.command !== undefined) &&
                (botstatus.command !== null)) {

                if ((botcommandlibrary[botstatus.command] !== undefined) &&
                    (botcommandlibrary[botstatus.command] !== null)) {

                    cmndfunc = botcommandlibrary[botstatus.command].logic;

                    if ((cmndfunc !== undefined) &&
                        (cmndfunc !== null)) {

                        botstatus = cmndfunc.call(bot, botstatus);
                    }
                }
            }
        }

        bot.setMetadata('botstatus', new org.bukkit.metadata.FixedMetadataValue(__plugin, botstatus));

    }, 200);
}

// make it so!
botmastercontrol();

//////////////////////////////////////////////////////////////////////////////
