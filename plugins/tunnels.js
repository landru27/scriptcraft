var clearthepath = function() {
    var droneT = new Drone(self);
    droneT.down(3).left(3).box(blocks.air, 7, 7, 7);
}
exports.clearthepath = clearthepath;


var tunnelForwardBuild = function(drn) {
    var droneB = drn;
    var dioritepolished = '1:4';
    var indx = 0;

    droneB.fwd(1).left(1).up(1).box(blocks.air, 3, 3, 6).down(1).right(1);

    for (indx = 0; indx < 6; indx++) {
        droneB.box(dioritepolished);
        droneB.left(1).box(dioritepolished);
        droneB.left(1).box(dioritepolished);
        droneB.up(1).box(dioritepolished);
        droneB.up(1).box(dioritepolished);
        droneB.up(1).box(dioritepolished);
        droneB.up(1).box(dioritepolished);
        droneB.right(1).box(dioritepolished);
        droneB.right(1).box(dioritepolished);
        droneB.right(1).box(dioritepolished);
        droneB.right(1).box(dioritepolished);
        droneB.down(1).box(dioritepolished);
        droneB.down(1).box(dioritepolished);
        droneB.down(1).box(dioritepolished);
        droneB.down(1).box(dioritepolished);
        droneB.left(1).box(dioritepolished);
        droneB.left(1);

        droneB.down(1).box(dioritepolished);
        droneB.left(1).box(dioritepolished);
        droneB.left(1);
        droneB.left(1);
        droneB.up(1);
        droneB.up(1).box(dioritepolished);
        droneB.up(1).box(dioritepolished);
        droneB.up(1).box(dioritepolished);
        droneB.up(1);
        droneB.up(1);
        droneB.right(1);
        droneB.right(1).box(dioritepolished);
        droneB.right(1).box(dioritepolished);
        droneB.right(1).box(dioritepolished);
        droneB.right(1);
        droneB.right(1);
        droneB.down(1);
        droneB.down(1).box(dioritepolished);
        droneB.down(1).box(dioritepolished);
        droneB.down(1).box(dioritepolished);
        droneB.down(1);
        droneB.down(1);
        droneB.left(1);
        droneB.left(1).box(dioritepolished);
        droneB.left(1).fwd(1).up(1);
    }

    droneB.back(1).box(blocks.glowstone);

    // return to where we started
    droneB.back(6);
}

var tunnelForward = function() {
    var droneT = new Drone(self);
    
    var blk = droneT.getBlock();
    var mtr = blk.getType();

    if (mtr != org.bukkit.Material.GLOWSTONE) {
        echo(self, 'you must target a glowstone block');
        return;
    }

    tunnelForwardBuild(droneT);
}
exports.tunnelForward = tunnelForward;

var tunnelJunction = function() {
    var droneJ = new Drone(self);
    var dioritepolished = '1:4';
    
    var blk = droneJ.getBlock();
    var mtr = blk.getType();

    if (mtr != org.bukkit.Material.GLOWSTONE) {
        echo(self, 'you must target a glowstone block');
        return;
    }

    droneJ.back(1).down(4).left(7).sphere(dioritepolished, 7);
    droneJ.fwd(1).up(4).right(7);

    droneJ.fwd(6).box(blocks.glowstone);

    droneJ.turn(1);
    tunnelForwardBuild(droneJ);

    droneJ.turn(1);
    tunnelForwardBuild(droneJ);

    droneJ.turn(1);
    tunnelForwardBuild(droneJ);

    droneJ.turn(1);
    tunnelForwardBuild(droneJ);

    droneJ.back(7).left(1).up(1).box(blocks.air, 3, 3, 1);
    droneJ.fwd(4).left(2).box(blocks.air, 7, 3, 7);
}
exports.tunnelJunction = tunnelJunction;
