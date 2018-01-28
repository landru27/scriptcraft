var cleartheair = function() {
    var drone1 = new Drone(self);
    drone1.left(5).box(blocks.air, 11, 5, 11);
}
exports.cleartheair = cleartheair;

var midairblock = function() {
    var drone1 = new Drone(self);
    drone1.box(blocks.quartz);
}
exports.midairblock = midairblock;


var towerBoundary = function() {
    var drone1 = new Drone(self);

    drone1.box(blocks.quartz);
    drone1.fwd(54).box(blocks.quartz);
    drone1.right(54).box(blocks.quartz);
    drone1.back(54).box(blocks.quartz);
    drone1.left(54);

    drone1.back(1).left(1).box(blocks.quartz);
    drone1.fwd(56).box(blocks.quartz);
    drone1.right(56).box(blocks.quartz);
    drone1.back(56).box(blocks.quartz);
}
exports.towerBoundary = towerBoundary;

var prepareYeTheGround = function(drn) {
    // clean slate
    drn.down(16).box(blocks.air, 11, 40, 11);
    
    // foundation
    drn.box(blocks.stone, 11, 12, 11);
    drn.up(12).box(blocks.dirt, 11, 3, 11);
    drn.up(3).box(blocks.grass, 11, 1, 11);

    // return to where we started
    drn.up(1);

    // return the drone object passed in, for coordination among separate functions
    return drn;
}

var prepareYeForPlantingLayer = function(drn, mtr) {
    drn.box(mtr, 2, 1, 2);
    drn.fwd(3).box(mtr, 2, 1, 5);
    drn.fwd(6).box(mtr, 2, 1, 2);

    drn.back(9).right(3);
    drn.box(mtr, 5, 1, 2);
    drn.fwd(3).box(mtr, 5, 1, 5);
    drn.fwd(6).box(mtr, 5, 1, 2);

    drn.back(9).right(6);
    drn.box(mtr, 2, 1, 2);
    drn.fwd(3).box(mtr, 2, 1, 5);
    drn.fwd(6).box(mtr, 2, 1, 2);

    // return to where we started
    drn.back(9).left(9);

    // return the drone object passed in, for coordination among separate functions
    return drn;
}

var prepareYeForPlanting = function(drn) {
    // start with a normal subsurface
    prepareYeTheGround(drn);

    drn.down(5);
    prepareYeForPlantingLayer(drn, blocks.clay);
    drn.up(1);
    prepareYeForPlantingLayer(drn, blocks.gravel);
    drn.up(1);
    prepareYeForPlantingLayer(drn, blocks.sand);
    drn.up(1);
    prepareYeForPlantingLayer(drn, blocks.dirt);
    drn.up(1);
    prepareYeForPlantingLayer(drn, blocks.farmland);

    // supply water supply
    drn.down(1).fwd(3).right(3);
    drn.box(blocks.water, 5, 2, 5);

    // return to where we started
    drn.up(2).back(3).left(3);

    // return the drone object passed in, for coordination among separate functions
    return drn;
}

var towerFarmPatch = function(drn) {
    if (drn === undefined) {
        drn = new Drone(self);
    }

    prepareYeForPlanting(drn);
}
exports.towerFarmPatch = towerFarmPatch;

var towerFarmQuarter = function() {
    var drone1 = new Drone(self);

    // use this if you need to see the corners of each patch
    // var marker = blocks.fence.spruce;
    var marker = blocks.air;

    towerFarmPatch(drone1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);

    drone1.fwd(11);
    prepareYeTheGround(drone1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);

    drone1.fwd(11);
    towerFarmPatch(drone1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);

    drone1.right(11);
    prepareYeTheGround(drone1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);

    drone1.back(11);
    prepareYeTheGround(drone1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);

    drone1.back(11);
    prepareYeTheGround(drone1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);

    drone1.right(11);
    towerFarmPatch(drone1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);

    drone1.fwd(11);
    prepareYeTheGround(drone1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);
    drone1.box(marker).fwd(10).turn(1);

    drone1.fwd(11).down(11);
    drone1.box(blocks.air, 11, 11, 11);
}
exports.towerFarmQuarter = towerFarmQuarter;

var towerLevel = function(drn, mtr) {
    // a block of brick to carve
    drn.box(blocks.brick.stone, 11, 5, 11);

    // carve out the south-west corner
    drn.box(mtr, 3, 5, 1);
    drn.box(mtr, 1, 5, 3);

    // carve out the north-west corner
    drn.fwd(8);
    drn.box(mtr, 1, 5, 3);
    drn.fwd(2);
    drn.box(mtr, 3, 5, 1);

    // carve out the north-east corner
    drn.right(8);
    drn.box(mtr, 3, 5, 1);
    drn.right(2).back(2);
    drn.box(mtr, 1, 5, 3);

    // carve out the south-east corner
    drn.back(8);
    drn.box(mtr, 1, 5, 3);
    drn.left(2);
    drn.box(mtr, 3, 5, 1);

    // return to where we started
    drn.left(8);

    // carve out the living space
    drn.up(1).fwd(2).right(2);
    drn.box(blocks.air, 7, 3, 7);

    // corner lighting
    drn.box(blocks.brick.stone).fwd(6).turn(1);
    drn.box(blocks.brick.stone).fwd(6).turn(1);
    drn.box(blocks.brick.stone).fwd(6).turn(1);
    drn.box(blocks.brick.stone).fwd(6).turn(1);

    drn.up(1);
    drn.box(blocks.brick.stone).fwd(6).turn(1);
    drn.box(blocks.brick.stone).fwd(6).turn(1);
    drn.box(blocks.brick.stone).fwd(6).turn(1);
    drn.box(blocks.brick.stone).fwd(6).turn(1);

    drn.up(1);
    drn.box(blocks.sealantern).fwd(6).turn(1);
    drn.box(blocks.sealantern).fwd(6).turn(1);
    drn.box(blocks.sealantern).fwd(6).turn(1);
    drn.box(blocks.sealantern).fwd(6).turn(1);

    // ladder for travel between floors
    drn.down(3).fwd(6).right(3);
    drn.box(blocks.ladder, 1, 5, 1);

    // return to where we started
    drn.back(8).left(5);

    // return the drone object passed in, for coordination among separate functions
    return drn;
}

var towerEleven = function() {
    var drone1 = new Drone(self);
    
    // foundation
    prepareYeTheGround(drone1);

    // portal floor
    drone1.down(10);
    towerLevel(drone1, blocks.brick.stone);

    // storage floor
    drone1.up(5);
    towerLevel(drone1, blocks.dirt);

    // main floor
    drone1.up(5);
    towerLevel(drone1, blocks.air);

    // wizard's den floor
    drone1.up(5);
    towerLevel(drone1, blocks.air);

    // towering floor
    drone1.up(5);
    towerLevel(drone1, blocks.air);



    // battlement, of a sort
    drone1.up(5).cylinder(blocks.fence.spruce, 5, 1);
    drone1.fwd(2).right(2).cylinder(blocks.air, 3, 1);
    drone1.fwd(2).right(2);
    drone1.box(blocks.torch).fwd(2).turn(1);
    drone1.box(blocks.torch).fwd(2).turn(1);
    drone1.box(blocks.torch).fwd(2).turn(1);
    drone1.box(blocks.torch).fwd(2).turn(1);
}
exports.towerEleven = towerEleven;
