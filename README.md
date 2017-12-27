# scriptcraft
setup and development for a ScriptCraft server


###  overview

Minecraft is a whole lot of fun, and provides a rich virtual environment.  And, while not completely open, it is open enough for there to be a popular variant, Spigot, for setting up your own Minecraft server.  ScriptCraft takes this one step further, and provides a way to interact with the Minecraft world through JavaScript programming.  These things together make an engaging way for people to learn programming skills, using a real-world and current language.

I have added a file uploader to this mix, to provide a user-friendly way in which users can add or update the scripts that they write.  This allows people to focus on mastering JavaScript, not needing to get lost in the mechanics of juggling files and such.

The `INSTALL` file in this repo consolidates the installation directions for Spigot, ScriptCraft, and my script uploader.  For reference, here are some links to the source projects.  I recommend skipping over these links for now, and coming back to them if you want to look into the material I drew from, or if you run into issues that might be clarified in the installation notes I worked from.  I also recommend returning after installation to _The Young Person's Guide to Programming in Minecraft_ that is part of the ScriptCraft material, as an excellent way to explore what is possible.

related websites:  
https://www.spigotmc.org/  
https://www.spigotmc.org/wiki/spigot-installation/  
https://www.spigotmc.org/wiki/buildtools/  

https://scriptcraftjs.org/  
https://github.com/walterhiggins/ScriptCraft/blob/master/README.md  
https://github.com/walterhiggins/ScriptCraft/blob/master/docs/YoungPersonsGuideToProgrammingMinecraft.md  


###  installation

My installations have all been on CentOS 7 target machines, which is reflected in things like the `yum` commands.  I imagine that there are e.g. corresponding `apt-get` commands for Linux distros that use `apt` instead of `yum`.  Feedback from folks who perform this installation on non-CentOS targets is welcome.

To install Spigot, ScriptCraft, and my script uploader, procure a target machine, such as a PC on your home network, a VM at a provider such as DigitalOcean, or similar.  Then, do the following:

First, clone this repo with:
```
git clone git@github.com:landru27/scriptcraft.git
```

Second, open two command-line windows, one for displaying the `INSTALL` file, and one for issuing its commands.

Third, note that at the top of the `INSTALL` file is this command:
```
cat INSTALL                                \
  | sed 's/USER/==USER==/g'                \
  | sed 's/TARGET_HOST/==TARGET_HOST==/g'  \
  | more
```

Issue this command, replacing `==USER==` with a user account on the target machine, and `==TARGET_HOST==` with the IP address or DNS hostname of the target machine.  This will display the `INSTALL` commands, with the target user and machine substituted to allow for straight-forward copy-n-paste.


###  usage

At the end of the installation steps you will find some notes on connecting to the newly installed Minecraft / Spigot / ScriptCraft server, and using your web browser to access the script uploader.

Each time you upload a script (whether it is new or an update to an existing one), in Minecraft issue `/js refresh()` to have your changes recognized, and `/js yourfunctionname()` to execute your code.

Also see the ScriptCraft site for complete information about using it to write JavaScript mods for Minecraft.  It comes with a rich API, and hooks into the Bukkit API, so there are already lots of wheels that do not need to be reinvented.  But, there is also a wide open world of programming possibilities.
