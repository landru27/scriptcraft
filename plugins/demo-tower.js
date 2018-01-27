var towerOne = function(material) {
    var drone1 = new Drone(self);
    
    // clean slate
    drone1.down(16).cylinder(blocks.air, 7, 40);
    
    // foundation
    drone1.cylinder(material, 7, 18);
    
    // outer wall
    drone1.up(14).fwd(2).right(2).cylinder(material, 5, 16);
    
    // first floor interior
    drone1.fwd(2).right(2).cylinder(blocks.air, 3, 3);
    // remaining floors interior
    drone1.up(4).cylinder(blocks.air, 3, 3);
    drone1.up(4).cylinder(blocks.air, 3, 3);
    drone1.up(4).cylinder(blocks.air, 3, 3);
    
    // lighting
    drone1.up(2).fwd(1).right(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    
    drone1.down(4);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    
    drone1.down(4);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    
    drone1.down(4);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    drone1.box(blocks.sealantern).fwd(4).turn(1);
    
    // ladder
    drone1.down(2).back(1).right(1).turn(3);
    drone1.box(blocks.ladder, 1, 15, 1).turn(1);
    
    // battlement, of a sort
    drone1.up(16).back(2).left(4).cylinder(blocks.fence.spruce, 5, 1);
    drone1.fwd(2).right(2).cylinder(blocks.air, 3, 1);
    drone1.fwd(2).right(2);
    drone1.box(blocks.torch).fwd(2).turn(1);
    drone1.box(blocks.torch).fwd(2).turn(1);
    drone1.box(blocks.torch).fwd(2).turn(1);
    drone1.box(blocks.torch).fwd(2).turn(1);
}
exports.towerOne = towerOne;
