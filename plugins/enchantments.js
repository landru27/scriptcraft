var utils = require('utils');

var dru_enchantments = {
    'DepthStrider': {
        name: 'Depth Strider',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DEPTH_STRIDER'),
        maxLevel: 3,
        reagent: {
            item: org.bukkit.Material.INK_SACK,
            amount: 8
        },
        targetItem: org.bukkit.Material.LEATHER_BOOTS
    },
    'Efficiency': {
        name: 'Efficiency',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DIG_SPEED'),
        maxLevel: 5,
        reagent: {
            item: org.bukkit.Material.QUARTZ,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'FeatherFalling': {
        name: 'Feather Falling',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('PROTECTION_FALL'),
        maxLevel: 4,
        reagent: {
            item: org.bukkit.Material.FEATHER,
            amount: 16
        },
        targetItem: org.bukkit.Material.IRON_LEGGINGS
    },
    'FireAspect': {
        name: 'Fire Aspect',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('FIRE_ASPECT'),
        maxLevel: 2,
        reagent: {
            item: org.bukkit.Material.GUNPOWDER,
            amount: 4
        },
        targetItem: org.bukkit.Material.DIAMOND_SWORD
    },
    'Flame': {
        name: 'Flame',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('ARROW_FIRE'),
        maxLevel: 1,
        reagent: {
            item: org.bukkit.Material.MAGMA_CREAM,
            amount: 16
        },
        targetItem: org.bukkit.Material.BOW
    },
    'Fortune': {
        name: 'Fortune',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('LOOT_BONUS_BLOCKS'),
        maxLevel: 3,
        reagent: {
            item: org.bukkit.Material.RABBIT_FOOT,
            amount: 16
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'FrostWalker': {
        name: 'Frost Walker',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('FROST_WALKER'),
        maxLevel: 2,
        reagent: {
            item: org.bukkit.Material.PACKED_ICE,
            amount: 8
        },
        targetItem: org.bukkit.Material.LEATHER_BOOTS
    },
    'InfinityBow': {
        name: 'Infinity Bow',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('ARROW_INFINITE'),
        maxLevel: 1,
        reagent: {
            item: org.bukkit.Material.GLOWSTONE_DUST,
            amount: 64
        },
        targetItem: org.bukkit.Material.BOW
    },
    'MendingPickaxe': {
        name: 'Mending Pickaxe',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('MENDING'),
        maxLevel: 1,
        reagent: {
            item: org.bukkit.Material.BLAZE_ROD,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'MendingSword': {
        name: 'Mending Sword',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('MENDING'),
        maxLevel: 1,
        reagent: {
            item: org.bukkit.Material.BLAZE_ROD,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_SWORD
    },
    'Power': {
        name: 'Power',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('ARROW_DAMAGE'),
        maxLevel: 5,
        reagent: {
            item: org.bukkit.Material.ENDER_PEARL,
            amount: 4
        },
        targetItem: org.bukkit.Material.BOW
    },
    'Protection': {
        name: 'Protection',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('PROTECTION_ENVIRONMENTAL'),
        maxLevel: 4,
        reagent: {
            item: org.bukkit.Material.GHAST_TEAR,
            amount: 2
        },
        targetItem: org.bukkit.Material.IRON_CHESTPLATE
    },
    'Respiration': {
        name: 'Respiration',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('OXYGEN'),
        maxLevel: 3,
        reagent: {
            item: org.bukkit.Material.FISH,
            amount: 8
        },
        targetItem: org.bukkit.Material.IRON_HELM
    },
    'Sharpness': {
        name: 'Sharpness',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DAMAGE_ALL'),
        maxLevel: 5,
        reagent: {
            item: org.bukkit.Material.PRISMARINE_SHARD,
            amount: 12
        },
        targetItem: org.bukkit.Material.DIAMOND_SWORD
    },
    'SilkTouch': {
        name: 'Silk Touch',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('SILK_TOUCH'),
        maxLevel: 1,
        reagent: {
            item: org.bukkit.Material.STRING,
            amount: 32
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'UnbreakingPickaxe': {
        name: 'Unbreaking Pickaxe',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DURABILITY'),
        maxLevel: 3,
        reagent: {
            item: org.bukkit.Material.OBSIDIAN,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'UnbreakingSword': {
        name: 'Unbreaking Sword',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DURABILITY'),
        maxLevel: 3,
        reagent: {
            item: org.bukkit.Material.OBSIDIAN,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_SWORD
    },
};

command('enchantitem', function(parameters, player) {
    //echo(player, 'hello there, ' + player.name);

    var targetPos = utils.getMousePos(player.name);
    //echo(player, 'target X is : ' + targetPos.x);
    //echo(player, 'target Y is : ' + targetPos.y);
    //echo(player, 'target Z is : ' + targetPos.z);

    var targetBlock = utils.blockAt(targetPos);
    var blockState = targetBlock.getState();

    //echo(player, 'target block is : ' + targetBlock.typeId);
    //echo(player, 'target block is : ' + targetBlock.getType());
    if (targetBlock.getType() !== org.bukkit.Material.ENCHANTMENT_TABLE) {
        echo(player, 'you must be looking at your enchantment table');
        return;
    }

    //echo(player, 'enchantment effect to perform is : ' + parameters[0]);
    //echo(player, 'enchantment level  to perform is : ' + (Number(parameters[1]) + 0));
    if (parameters[0] === undefined) {
        echo(player, 'you must state what enchantment you are performing');
        return;
    }
    
    if (parameters[1] === undefined) {
        echo(player, 'you must state the level of enchantment you desire');
        return;
    }
    if ((parameters[1] < 1) || (parameters[1] > 5)) {
        echo(player, 'the level of enchantment must be between 1 and 5');
        return;
    }
    
    if (parameters[1] > dru_enchantments[parameters[0]].maxLevel) {
        echo(player, 'the enchantment ' + dru_enchantments[parameters[0]].name + ' has a maximum level of ' + dru_enchantments[parameters[0]].maxLevel);
        return;
    }

    var playerinventory = player.getInventory().getContents();
    //for (var prop in playerinventory) {
    //    console.log('playerinventory.' + prop + ' = ' + playerinventory[prop]);
    //}
    //echo(player, 'item to be enchanted is : ' + playerinventory[0]);
    //echo(player, 'enchantment reagent is  : ' + playerinventory[1]);
    //echo(player, 'available redstone is   : ' + playerinventory[2]);
    
    //echo(player, 'playerinventory[0].getType()             : ' + playerinventory[0].getType());
    //echo(player, 'dru_enchantments[parameters[0]].targetItem : ' + dru_enchantments[parameters[0]].targetItem);
    if (playerinventory[0].getType() != dru_enchantments[parameters[0]].targetItem) {
        echo(player, 'the enchantment ' + dru_enchantments[parameters[0]].name + ' must be performed on ' + dru_enchantments[parameters[0]].targetItem);
        return;
    }

    if (playerinventory[1].getType() != dru_enchantments[parameters[0]].reagent.item) {
        echo(player, 'the enchantment ' + dru_enchantments[parameters[0]].name + ' must be performed with ' + dru_enchantments[parameters[0]].reagent.item);
        return;
    }
    
    var reagentCost = dru_enchantments[parameters[0]].reagent.amount * parameters[1];
    if (playerinventory[1].getAmount() < reagentCost) {
        echo(player, 'the enchantment ' + dru_enchantments[parameters[0]].name + ' must be performed with at least ' + reagentCost + ' ' + dru_enchantments[parameters[0]].reagent.item);
        return;
    }
    
    //var allenchantments = org.bukkit.enchantments.Enchantment.values();
    //for (var prop in allenchantments) {
    //    console.log('allenchantments.' + prop + ' = ' + allenchantments[prop]);
    //}

    playerinventory[0].addEnchantment(dru_enchantments[parameters[0]].enchantment, parameters[1]);
    playerinventory[1].setAmount(playerinventory[1].getAmount() - reagentCost);

    var displayname = dru_enchantments[parameters[0]].name;
    if (parameters[1] == 1) { displayname += ' I'; }
    if (parameters[1] == 2) { displayname += ' II'; }
    if (parameters[1] == 3) { displayname += ' III'; }
    if (parameters[1] == 4) { displayname += ' IV'; }
    if (parameters[1] == 5) { displayname += ' V'; }
    echo(player, 'the enchantment ' + displayname + ' has been added!');

    //var blockChunk = blockState.getChunk();
    //var blockWorld = blockChunk.getWorld();
    //var blockDiff = blockWorld.getDifficulty();
    //echo(player, 'difficulty of world of target block is : ' + blockDiff);

    //echo(player, 'player exhaustion is : ' + player.getExhaustion());
    //echo(player, 'player exp is        : ' + player.getExp());
    //echo(player, 'player fly speed is  : ' + player.getFlySpeed());
    //echo(player, 'player food level is : ' + player.getFoodLevel());
    //echo(player, 'player level is      : ' + player.getLevel());
});

