//////////////////////////////////////////////////////////////////////////////
//
//  a ScriptCraft plugin for allowing the player to cast specific
//  enchantments at specific levels (instead of relying on the normal random
//  enchantment mechanism), to cast spells for various effects (similar
//  to using potions, but more like a wizard), and to cast various offensive
//  and defensive spells (to extend the magic system of Minecraft further)
//
//  copyright 2018  Andrew Witt  landru729@gmail.com
//  released under the MIT License
//
//////////////////////////////////////////////////////////////////////////////
//
//  when a player provides a book and quill as the item on his/her enchanting
//  table, that book is turned into one of a couple of different spellbooks,
//  and placed into his/her inventory
//
//  one spellbook is for enchantment spells, and one is for various effects,
//  protections, and attacks
//
//////////////////////////////////////////////////////////////////////////////
//
//  enchantments are cast by selecting them from the spellbook, while in front
//  of an enchanting table  (the player must in fact be looking at his/her
//  enchanting table, which requires a sneak-use (e.g., shift-right-click)
//  to open the spellbook)
//
//  other spells are cast by selecting them from the spellbook as needed
//
//  it takes lapis lazuli to cast a spell, but also an appropriate reagent;
//  for example, packed ice for Frost Walker, rabbit's foot for Fortune,
//  obsidian for Unbreaking, and so forth;  the higer the spell level, the
//  more lapis lazuli and the more reagent needed
//
//  casting a spell also costs redstone; for enchantments blocks of redstone
//  are used, but experience levels can be used instead, similar to how
//  enchantment normally costs XP;  for other spells redstone dust is used,
//  and the amount available determines the strength or duration of the spell
//
//  enchantments stack in the normal way; this means that an item can have
//  multiple enchantments, and that an existing enchantment's level can be
//  increased -- Minecraft automatically replaces the lower level enchantment
//  of the same type
//
//////////////////////////////////////////////////////////////////////////////
//
//  enchantment           translation        reagent            qty (per level)
//  ---------------       ---------------    --------           ---
//  Respiration           Respiration        fish                 8
//  Depth Strider         Depth Strider      ink sack             8
//  Frost Walker          Frost Walker       packed ice           8
//
//  Mending Pickaxe       Mending            blaze rod            8
//  Silk Touch            Silk Touch         string              32
//  Fortune               Fortune            rabbit foot         16
//  Efficiency            Efficiency         quartz               8
//
//  Feather Falling       Feather Falling    feather             16
//  Protection            Protection         ghast tear           2
//
//  Mending Sword         Mending            blaze rod            8
//  Vorbal Blade          Sharpness          prismarine shard    12
//  Flaming Sword         Fire Aspect        gunpowder            4
//
//  Power                 Power              ender pearl          4
//  Flaming Arrows        Flame              magma cream         16
//  Infinity Bow          Infinity           glowstone dust      64
//
//  Unbreaking Pickaxe    Unbreaking         obsidian             8
//  Unbreaking Sword      Unbreaking         obsidian             8
//
//  spell                 translation        reagent            qty
//  ---------------       ---------------    --------           ---
//
//////////////////////////////////////////////////////////////////////////////
//
//  enchantments cost:      lapis lazuli    :  1 per enchantment level
//                          reagent         :  1 qty per enchantment level
//                          redstone block  :  1 for level I
//                          -or- XP            3 for level II
//                                             5 for level III
//                                             7 for level IV
//                                             9 for level V
//
//  spells cost:            lapis lazuli    :  1 per degree
//                          reagent         :  1 qty per degree
//                          restone dust    :  1 per degree
//
//                          'degree' is strength, duration, etc.
//
//////////////////////////////////////////////////////////////////////////////


// import ScriptCraft modules
var utils = require('utils');
var events = require('events');
var slash = require('slash');
var items = require('items');
var inventory = require('inventory');

// define the enchantments that we support in this plugin
//
// 'name'         is our name for the enchantment being cast, which in many cases
//                matches the normal Minecraft name, but there is no actual tie
//
// 'enchantment'  is the Minecraft/Bukkit/Spigot Enchantment object
//
// 'reagent'      defines the ingredient required to cast this enchantment; the
//                'amount' is per level of the enchantment being cast
//
// 'targetItem'   is the type of item that can have this enchantment applied; we
//                are much narrower than what the normal Minecraft enchantment
//                mechanism allows, but this suits the target game play; this
//                plugin is certainly open to modification for adaptation to a
//                broader sort of gameplay
//
var enchantments = {
    'respiration': {
        name: 'Respiration',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('OXYGEN'),
        reagent: {
            item: org.bukkit.Material.RAW_FISH,
            amount: 8
        },
        targetItem: org.bukkit.Material.IRON_HELM
    },

    'depthstrider': {
        name: 'Depth Strider',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DEPTH_STRIDER'),
        reagent: {
            item: org.bukkit.Material.INK_SACK,
            amount: 8
        },
        targetItem: org.bukkit.Material.LEATHER_BOOTS
    },
    'frostwalker': {
        name: 'Frost Walker',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('FROST_WALKER'),
        reagent: {
            item: org.bukkit.Material.PACKED_ICE,
            amount: 8
        },
        targetItem: org.bukkit.Material.LEATHER_BOOTS
    },

    'mendingpickaxe': {
        name: 'Mending Pickaxe',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('MENDING'),
        reagent: {
            item: org.bukkit.Material.BLAZE_ROD,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'silktouch': {
        name: 'Silk Touch',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('SILK_TOUCH'),
        reagent: {
            item: org.bukkit.Material.STRING,
            amount: 32
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'fortune': {
        name: 'Fortune',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('LOOT_BONUS_BLOCKS'),
        reagent: {
            item: org.bukkit.Material.RABBIT_FOOT,
            amount: 16
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'efficiency': {
        name: 'Efficiency',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DIG_SPEED'),
        reagent: {
            item: org.bukkit.Material.QUARTZ,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },

    'featherfalling': {
        name: 'Feather Falling',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('PROTECTION_FALL'),
        reagent: {
            item: org.bukkit.Material.FEATHER,
            amount: 16
        },
        targetItem: org.bukkit.Material.IRON_LEGGINGS
    },

    'protection': {
        name: 'Protection',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('PROTECTION_ENVIRONMENTAL'),
        reagent: {
            item: org.bukkit.Material.GHAST_TEAR,
            amount: 2
        },
        targetItem: org.bukkit.Material.IRON_CHESTPLATE
    },

    'mendingsword': {
        name: 'Mending Sword',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('MENDING'),
        reagent: {
            item: org.bukkit.Material.BLAZE_ROD,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_SWORD
    },
    'vorpalblade': {
        name: 'Vorbal Blade',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DAMAGE_ALL'),
        reagent: {
            item: org.bukkit.Material.PRISMARINE_SHARD,
            amount: 12
        },
        targetItem: org.bukkit.Material.DIAMOND_SWORD
    },
    'flamingsword': {
        name: 'Flaming Sword',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('FIRE_ASPECT'),
        reagent: {
            item: org.bukkit.Material.GUNPOWDER,
            amount: 4
        },
        targetItem: org.bukkit.Material.DIAMOND_SWORD
    },

    'power': {
        name: 'Power',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('ARROW_DAMAGE'),
        reagent: {
            item: org.bukkit.Material.ENDER_PEARL,
            amount: 4
        },
        targetItem: org.bukkit.Material.BOW
    },
    'flamingarrows': {
        name: 'Flaming Arrows',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('ARROW_FIRE'),
        reagent: {
            item: org.bukkit.Material.MAGMA_CREAM,
            amount: 16
        },
        targetItem: org.bukkit.Material.BOW
    },
    'infinitybow': {
        name: 'Infinity Bow',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('ARROW_INFINITE'),
        reagent: {
            item: org.bukkit.Material.GLOWSTONE_DUST,
            amount: 64
        },
        targetItem: org.bukkit.Material.BOW
    },

    'unbreakingpickaxe': {
        name: 'Unbreaking Pickaxe',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DURABILITY'),
        reagent: {
            item: org.bukkit.Material.OBSIDIAN,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_PICKAXE
    },
    'unbreakingsword': {
        name: 'Unbreaking Sword',
        enchantment: org.bukkit.enchantments.Enchantment.getByName('DURABILITY'),
        reagent: {
            item: org.bukkit.Material.OBSIDIAN,
            amount: 8
        },
        targetItem: org.bukkit.Material.DIAMOND_SWORD
    }
};

// define the spell effect that we support in this plugin
//
// 'name'         is our name for the enchantment being cast, which in many cases
//                matches the normal Minecraft name, but there is no actual tie
//
// 'effect'       is the Minecraft/Bukkit/Spigot Effect object; if present, the
//                spell applies this effect to the player; if absent, the spell
//                does something more specific
//
// 'reagent'      defines the ingredient required to cast this enchantment
//
var wizardspells = {
    'jump': {
        name: 'Jump',
        effect: org.bukkit.potion.PotionEffectType.JUMP,
        maxlevel: 15,
        reagent: org.bukkit.Material.RABBIT_HIDE
    },
    'speed': {
        name: 'Speed',
        effect: org.bukkit.potion.PotionEffectType.SPEED,
        maxlevel: 15,
        reagent: org.bukkit.Material.SUGAR
    },
    'strength': {
        name: 'Strength',
        effect: org.bukkit.potion.PotionEffectType.INCREASE_DAMAGE,
        maxlevel: 15,
        reagent: org.bukkit.Material.BLAZE_POWDER
    },
    'waterbreathing': {
        name: 'Water Breathing',
        effect: org.bukkit.potion.PotionEffectType.WATER_BREATHING,
        maxlevel: 15,
        reagent: org.bukkit.Material.RAW_FISH
    },
    'nightvision': {
        name: 'Night Vision',
        effect: org.bukkit.potion.PotionEffectType.NIGHT_VISION,
        maxlevel: 1,
        reagent: org.bukkit.Material.GOLDEN_CARROT
    },
    'invisibility': {
        name: 'Invisibility',
        effect: org.bukkit.potion.PotionEffectType.INVISIBILITY,
        maxlevel: 1,
        reagent: org.bukkit.Material.FERMENTED_SPIDER_EYE
    },
    'sustenance': {
        name: 'Sustenance',
        effect: org.bukkit.potion.PotionEffectType.SATURATION,
        maxlevel: 30,
        reagent: org.bukkit.Material.MYCEL
    },
    'protection': {
        name: 'Protection',
        effect: org.bukkit.potion.PotionEffectType.ABSORPTION,
        maxlevel: 5,
        reagent: org.bukkit.Material.BLAZE_POWDER
    },
    'healing': {
        name: 'Healing',
        effect: org.bukkit.potion.PotionEffectType.HEAL,
        maxlevel: 30,
        reagent: org.bukkit.Material.MELON
    },
    'healingaura': {
        name: 'Healing Aura',
        maxlevel: 15,
        reagent: org.bukkit.Material.GOLDEN_APPLE
    },
    'regeneration': {
        name: 'Regeneration',
        effect: org.bukkit.potion.PotionEffectType.REGENERATION,
        maxlevel: 5,
        reagent: org.bukkit.Material.GHAST_TEAR
    },
    'arrowfall': {
        name: 'Arrowfall',
        maxlevel: 8,
        reagent: org.bukkit.Material.FLINT
    },
    'fireball': {
        name: 'Fireball',
        maxlevel: 8,
        reagent: org.bukkit.Material.MAGMA_CREAM
    },
    'firestorm': {
        name: 'Firestorm',
        maxlevel: 8,
        reagent: org.bukkit.Material.MAGMA
    },
    'firestrike': {
        name: 'Firestrike',
        maxlevel: 8,
        reagent: org.bukkit.Material.MAGMA
    },
    'lightningstrike': {
        name: 'Lightning Strike',
        maxlevel: 8,
        reagent: org.bukkit.Material.BLAZE_ROD
    }
};


// for tracking the granting of this spellbook
//
var store = persist('spellbooks', {players: {}});


// this is the /jsp command for casting an enchantment
//
// this is not intended to be used directly, but through the spellbook that this
// plugin grants the player when he/she crafts a book and quill at an enchantment table
//
// but, nothing apart from awareness and command permissions stops a player from
// issuing these enchantitem commands directly
//
command('enchantitem', function(parameters, player) {
    var targetPos = utils.getMousePos(player.name);
    if (targetPos === null) {
        echo(player, 'you must be looking at your enchantment table');
        return;
    }

    var targetBlock = utils.blockAt(targetPos);
    if (targetBlock === null) {
        echo(player, 'you must be looking at your enchantment table');
        return;
    }
    if (targetBlock.getType() !== org.bukkit.Material.ENCHANTMENT_TABLE) {
        echo(player, 'you must be looking at your enchantment table');
        return;
    }

    var enchantmentname = parameters[0];
    var enchantmentlevel = parameters[1];

    if (enchantmentname === undefined) {
        echo(player, 'you must state what enchantment you are performing');
        return;
    }
    
    if (enchantmentlevel === undefined) {
        echo(player, 'you must state the level of enchantment you desire');
        return;
    }
    if (enchantmentlevel == 'I')   { enchantmentlevel = 1; }
    if (enchantmentlevel == 'II')  { enchantmentlevel = 2; }
    if (enchantmentlevel == 'III') { enchantmentlevel = 3; }
    if (enchantmentlevel == 'IV')  { enchantmentlevel = 4; }
    if (enchantmentlevel == 'V')   { enchantmentlevel = 5; }
    if ((enchantmentlevel < 1) || (enchantmentlevel > 5)) {
        echo(player, 'the level of enchantment must be between 1 and 5');
        return;
    }

    // the player must have an XP level of at least 10x the spell level
    if (player.getLevel() < (10 * enchantmentlevel)) {
        echo(player, 'you must be at least ' + (10 * enchantmentlevel) + 'th level to cast a spell of that level');
        return;
    }

    var enchantmentdefinition = enchantments[enchantmentname];

    var displayname = enchantmentdefinition.name;
    if (enchantmentlevel == 1) { displayname += ' I'; }
    if (enchantmentlevel == 2) { displayname += ' II'; }
    if (enchantmentlevel == 3) { displayname += ' III'; }
    if (enchantmentlevel == 4) { displayname += ' IV'; }
    if (enchantmentlevel == 5) { displayname += ' V'; }

    // is there a method on ItemStack, Material, or related to fetch the actual friendly name for an item?
    var displaynameitem = enchantmentdefinition.targetItem.name();
    displaynameitem = displaynameitem.replace(/_/g, ' ');
    displaynameitem = displaynameitem.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

    var displaynamereagent = enchantmentdefinition.reagent.item.name();
    displaynamereagent = displaynamereagent.replace(/_/g, ' ');
    displaynamereagent = displaynamereagent.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

    if (enchantmentlevel > enchantmentdefinition.enchantment.getMaxLevel()) {
        echo(player, 'the enchantment ' + enchantmentdefinition.name + ' has a maximum level of ' + enchantmentdefinition.enchantment.getMaxLevel());
        return;
    }

    var playerinventory = player.getInventory().getContents();

    if (playerinventory[0] === null) {
        echo(player, 'place the item to be enchanted in your 1st inventory slot');
        return;
    }
    if (playerinventory[0].getType() != enchantmentdefinition.targetItem) {
        echo(player, 'the enchantment ' + enchantmentdefinition.name + ' must be performed on ' + displaynameitem);
        return;
    }

    var lapisCost = enchantmentlevel;
    if (playerinventory[1] === null) {
        echo(player, 'place some lapis lazuli in your 2nd inventory slot');
        return;
    }
    if ((playerinventory[1].getType()            != org.bukkit.Material.INK_SACK) ||
        (playerinventory[1].getData().getColor() != org.bukkit.DyeColor.BLUE)) {
        echo(player, 'place some lapis lazuli in your 2nd inventory slot');
        return;
    }
    if (playerinventory[1].getAmount() < lapisCost) {
        echo(player, 'the enchantment ' + displayname + ' requires at least ' + lapisCost + ' lapis lazuli');
        return;
    }

    var reagentCost = enchantmentdefinition.reagent.amount * enchantmentlevel;
    if (playerinventory[2] === null) {
        echo(player, 'place the spell reagents in your 3nd inventory slot');
        return;
    }
    if (playerinventory[2].getType() != enchantmentdefinition.reagent.item) {
        echo(player, 'the enchantment ' + enchantmentdefinition.name + ' must be performed with ' + displaynamereagent);
        return;
    }
    if (playerinventory[2].getAmount() < reagentCost) {
        echo(player, 'the enchantment ' + displayname + ' must be performed with at least ' + reagentCost + ' ' + displaynamereagent);
        return;
    }

    var redstone = 0;
    var rsxpCost = (enchantmentlevel * 2) - 1;
    var redstoneCost = 0;
    var xplvlCost = 0;
    if ((playerinventory[3] !== null) && (playerinventory[3].getType() == org.bukkit.Material.REDSTONE_BLOCK)){
        redstone = playerinventory[3].getAmount();
    }
    if (redstone >= rsxpCost) {
        redstoneCost = rsxpCost;
        xplvlCost = 0;
    } else {
        redstoneCost = redstone;
        xplvlCost = rsxpCost - redstoneCost;
    }

    playerinventory[0].addEnchantment(enchantmentdefinition.enchantment, enchantmentlevel);
    playerinventory[1].setAmount(playerinventory[1].getAmount() - lapisCost);
    playerinventory[2].setAmount(playerinventory[2].getAmount() - reagentCost);
    if (redstoneCost > 0) { playerinventory[3].setAmount(playerinventory[3].getAmount() - redstoneCost); }
    if (xplvlCost    > 0) { player.setLevel(player.getLevel() - xplvlCost); }

    echo(player, 'your ' + displaynameitem + ' has been enchanted with ' + displayname);
});

// this is the /jsp command for casting a wizard spell
//
// this is not intended to be used directly, but through the spellbook that this
// plugin grants the player when he/she crafts a book and quill at an enchantment table
//
// but, nothing apart from awareness and command permissions stops a player from
// issuing these wizardspell commands directly
//
command('wizardspell', function(parameters, player) {
    var wizardspellname = parameters[0];

    if (wizardspellname === undefined) {
        echo(player, 'you must state what wizard spell you are casting');
        return;
    }

    var wizardspelldefinition = wizardspells[wizardspellname];

    // the degree of the spell is limited by the player's XP level, the
    // amount of available lapis lazuli, the amount of available redstone
    // dust, and the amount of available reagent
    //
    // only the player's immediate inventory ('hotbar' inventory) is checked;
    // this allows the player to carry ingrediates for many high-powered
    // spells, but still only cast one of a specific level (by keeping the
    // excess in the general inventory ('UI' inventory)

    var xplvl = Math.floor(player.getLevel() / 10);
    var lapis = 0;
    var ragnt = 0;
    var rdust = 0;

    var playerinventory = player.getInventory().getContents();
    var indx = 0;
    var indxlapis = 0;
    var indxragnt = 0;
    var indxrdust = 0;

    for (indx = 0; indx < 9; indx++) {
        if (playerinventory[indx] === null) {
            continue;
        }

        if ((playerinventory[indx].getType()            == org.bukkit.Material.INK_SACK) &&
            (playerinventory[indx].getData().getColor() == org.bukkit.DyeColor.BLUE)) {
            lapis = playerinventory[indx].getAmount();
            indxlapis = indx;
        }

        if (playerinventory[indx].getType() == wizardspelldefinition.reagent) {
            ragnt = playerinventory[indx].getAmount();
            indxragnt = indx;
        }

        if (playerinventory[indx].getType() == org.bukkit.Material.REDSTONE) {
            rdust = playerinventory[indx].getAmount();
            indxrdust = indx;
        }
    }

    var spelllevel = Math.min(xplvl, lapis, ragnt, rdust);

    if (spelllevel == 0) {
        echo(player, 'you are not properly prepared to cast ' + wizardspelldefinition.name);
        return;
    }

    // consume the spell ingredients
    playerinventory[indxlapis].setAmount(playerinventory[indxlapis].getAmount() - spelllevel);
    playerinventory[indxragnt].setAmount(playerinventory[indxragnt].getAmount() - spelllevel);
    playerinventory[indxrdust].setAmount(playerinventory[indxrdust].getAmount() - spelllevel);

    // general logic for potion-effect-like spells
    if (wizardspelldefinition.effect !== undefined) {
        duration = 20 * 120 * spelllevel;
        amplifier = Math.min(spelllevel, wizardspelldefinition.maxlevel);

//      var potioneffect = wizardspelldefinition.effect.createEffect(duration, amplifier);
//      player.addPotionEffect(potioneffect, true);
        player.addPotionEffect(wizardspelldefinition.effect.createEffect(duration, amplifier), true);
    } else {
    }

    echo(player, 'you have cast ' + wizardspelldefinition.name + ' at level ' + spelllevel);
});


function grantSpellbook(event) {
    // the player might be using the enchanting table for a normal enchantment, in
    // which case, we bow out
    enchitem = event.getItem();
    if (enchitem.getType() != org.bukkit.Material.BOOK_AND_QUILL) {
        return;
    }

    player = event.getEnchanter();

    // grant each spellbook only once; this can be cleared, but in a more competitive
    // context it should be very difficult to regain lost spellbooks
    //
    var hasplayer = store.players[player.name];
    var hasbook;
    if (!hasplayer) {
        store.players[player.name] = {};
        store.players[player.name].enchantments = false;
        store.players[player.name].wizardry = false;
    }
    hasbook = store.players[player.name].enchantments;
    if ((!hasbook) || (hasbook == false)) {
        // is there a better way to call our own "command('enchantmentsbook', ..." method?
        slash('jsp enchantmentsbook', player);

        // consume the book and quill provided
        enchitem.setAmount(0);

        // mark the fact that the player now has this spellbook
        store.players[player.name].enchantments = true;
        return;
    }

    hasbook = store.players[player.name].wizardry;
    if ((!hasbook) || (hasbook == false)) {
        // is there a better way to call our own "command('wizardrybook', ..." method?
        slash('jsp wizardrybook', player);

        // consume the book and quill provided
        enchitem.setAmount(0);

        // mark the fact that the player now has this spellbook
        store.players[player.name].wizardry = true;
        return;
    }
}

events.prepareItemEnchant(grantSpellbook);

command('clearspellbooks', function(parameters, player) {
    var hasplayer = store.players[player.name];

    if (!hasplayer) {
        store.players[player.name] = {};
    }

    store.players[player.name].enchantments = false;
    store.players[player.name].wizardry = false;
});


command('enchantmentsbook', function(parameters, player) {

    //
    // gratefully, the ScriptCraft API has a slash() function for issuing general Minecraft
    // commands; the BookMeta.addPage() (and related) functions turn the input string into a
    // literal 'text' element of a page, eliminating the opportunity to use Minecraft's richer
    // textual spec, which includes things like formatting, click handling, etc
    //
    // BookMeta.Spigot.addPage() (and related) are initialy more promising, but seem to require
    // NMS methods to properly compose / encode the net.md_5.bungee.api.chat.BaseComponent
    // object that these functions operate on
    //
    // thus, we use the work-around of issuing a /give command to supply the player with a
    // spellbook of clickable text for casting the enchantments defined in this plugin
    //
    // (if others can figure out or have figured out a way to do this with only ScriptCraft API
    // and Bukkit/Spigot API calls, insights and feedback are welcome)
    //

    var command = '';
    command  = 'give ' + player.name + ' minecraft:written_book 1 0 {';
    command += 'author:"Crimson Mage",';
    command += 'title:"Weapon and Tool Enchantments",';
    command += 'pages:[';
    // page 1
    command +=       '"{text:\\\"Enchantments\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Use these spells to cast specific enchantments with an item, lapis lazuli, reagents, and redstone blocks in your first few inventory slots; XP levels can substitute for redstone.\\\"}]}",';
    // page 2
    command +=       '"{text:\\\"Helm and Boots\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Respiration I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem respiration 1\\\"},';
    command += 'extra:[{text:\\\"Respiration II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem respiration 2\\\"},';
    command += 'extra:[{text:\\\"Respiration III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem respiration 3\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Depth Strider I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem depthstrider 1\\\"},';
    command += 'extra:[{text:\\\"Depth Strider II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem depthstrider 2\\\"},';
    command += 'extra:[{text:\\\"Depth Strider III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem depthstrider 3\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Frostwalker I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem frostwalker 1\\\"},';
    command += 'extra:[{text:\\\"Frostwalker II\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem frostwalker 2\\\"}}]}]}]}]}]}]}]}]}]}]}",';
    // page 3
    command +=       '"{text:\\\"Pick Axe\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Mending I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem mendingpickaxe 1\\\"},';
    command += 'extra:[{text:\\\"Silk Touch I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem silktouch 1\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Fortune I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem fortune 1\\\"},';
    command += 'extra:[{text:\\\"Fortune II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem fortune 2\\\"},';
    command += 'extra:[{text:\\\"Fortune III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem fortune 3\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Efficiency I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem efficiency 1\\\"},';
    command += 'extra:[{text:\\\"Efficiency II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem efficiency 2\\\"},';
    command += 'extra:[{text:\\\"Efficiency III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem efficiency 3\\\"},';
    command += 'extra:[{text:\\\"Efficiency IV\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem efficiency 4\\\"},';
    command += 'extra:[{text:\\\"Efficiency V\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem efficiency 5\\\"}}]}]}]}]}]}]}]}]}]}]}]}]}",';
    // page 4
    command +=       '"{text:\\\"Armor\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Feather Falling I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem featherfalling 1\\\"},';
    command += 'extra:[{text:\\\"Feather Falling II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem featherfalling 2\\\"},';
    command += 'extra:[{text:\\\"Feather Falling III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem featherfalling 3\\\"},';
    command += 'extra:[{text:\\\"Feather Falling IV\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem featherfalling 4\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Protection I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem protection 1\\\"},';
    command += 'extra:[{text:\\\"Protection II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem protection 2\\\"},';
    command += 'extra:[{text:\\\"Protection III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem protection 3\\\"},';
    command += 'extra:[{text:\\\"Protection IV\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem protection 4\\\"}}]}]}]}]}]}]}]}]}]}",';
    // page 5
    command +=       '"{text:\\\"Crimson Sword\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Mending I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem mendingsword 1\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Vorbal Blade I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem vorpalblade 1\\\"},';
    command += 'extra:[{text:\\\"Vorbal Blade II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem vorpalblade 2\\\"},';
    command += 'extra:[{text:\\\"Vorbal Blade III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem vorpalblade 3\\\"},';
    command += 'extra:[{text:\\\"Vorbal Blade IV\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem vorpalblade 4\\\"},';
    command += 'extra:[{text:\\\"Vorbal Blade V\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem vorpalblade 5\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Flaming Sword I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem flamingsword 1\\\"},';
    command += 'extra:[{text:\\\"Flaming Sword II\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem flamingsword 2\\\"}}]}]}]}]}]}]}]}]}]}]}",';
    // page 6
    command +=       '"{text:\\\"Crimson Bow\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Power I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem power 1\\\"},';
    command += 'extra:[{text:\\\"Power II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem power 2\\\"},';
    command += 'extra:[{text:\\\"Power III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem power 3\\\"},';
    command += 'extra:[{text:\\\"Power IV\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem power 4\\\"},';
    command += 'extra:[{text:\\\"Power V\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem power 5\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Flaming Arrows\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem flamingarrows 1\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Infinity Bow\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem infinitybow 1\\\"}}]}]}]}]}]}]}]}]}]}",';
    // page 7
    command +=       '"{text:\\\"Unbreaking\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Unbreaking Pickaxe I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem unbreakingpickaxe 1\\\"},';
    command += 'extra:[{text:\\\"Unbreaking Pickaxe II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem unbreakingpickaxe 2\\\"},';
    command += 'extra:[{text:\\\"Unbreaking Pickaxe III\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem unbreakingpickaxe 3\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Unbreaking Sword I\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem unbreakingsword 1\\\"},';
    command += 'extra:[{text:\\\"Unbreaking Sword II\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem unbreakingsword 2\\\"},';
    command += 'extra:[{text:\\\"Unbreaking Sword III\\\",clickEvent:{action:run_command,value:\\\"/jsp enchantitem unbreakingsword 3\\\"}}]}]}]}]}]}]}]}"';
    // end of pages array
    command += ']}';

    slash(command);
});

command('wizardrybook', function(parameters, player) {
    var command = '';
    command  = 'give ' + player.name + ' minecraft:written_book 1 0 {';
    command += 'author:"Crimson Mage",';
    command += 'title:"Wizardry and Spellcasting",';
    command += 'pages:[';
    // page 1
    command +=       '"{text:\\\"Wizard Spells\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"Use this book to cast various spells with lapis lazuli, reagents, and redstone dust in your immediate inventory\\\"}]}",';
    // page 2
    command +=       '"{text:\\\"Effects\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Jump\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell jump\\\"},';
    command += 'extra:[{text:\\\"Speed\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell speed\\\"},';
    command += 'extra:[{text:\\\"Strength\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell strength\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Water Breathing\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell waterbreathing\\\"},';
    command += 'extra:[{text:\\\"Night Vision\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell nightvision\\\"},';
    command += 'extra:[{text:\\\"Invisibilty\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell invisibility\\\"}}]}]}]}]}]}]}]}]}",';
    // page 3
    command +=       '"{text:\\\"Protection\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Sustenance\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell sustenance\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Protection\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell protection\\\"},';
    command += 'extra:[{text:\\\"Healing\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell healing\\\"},';
    command += 'extra:[{text:\\\"Healing Aura\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell healingaura\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Regeneration\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell regeneration\\\"}}]}]}]}]}]}]}]}]}",';
    // page 4
    command +=       '"{text:\\\"Attacks\\\\n\\\\n\\\",';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Arrowfall\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell arrowfall\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Fireball\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell fireball\\\"},';
    command += 'extra:[{text:\\\"Firestorm\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell firestorm\\\"},';
    command += 'extra:[{text:\\\"Firestrike\\\\n\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell firestrike\\\"},';
    command += 'extra:[{text:\\\"\\\\n\\\",';
    command += 'extra:[{text:\\\"Lightning Strike\\\",clickEvent:{action:run_command,value:\\\"/jsp wizardspell lightningstrike\\\"}}]}]}]}]}]}]}]}]}"';
    // end of pages array
    command += ']}';

    slash(command);
});
