# ICE2025-3dPrintWeb

## Original

Here are some tips for modifying the code:

After making a change, make sure you cd into /business-website (where you see all the files/directories like app and package.json)
and then run "yarn build". After you do this, run "sudo systemctl restart nextjs-app.service". This is slow however, so if you are in
the middle of making changes and testing, you can instead run "sudo systemctl stop nextjs-app.service", cd into the /business-website 
directory and then run "yarn dev". This will make it so that your changes are reflected every time you save the file you're working on.
Once you're done with this, ctrl-c to stop the development server, run "yarn build", and start the nextjs service back up again.


You are free to modify the code how you wish, however, you may not remove or substantially change any features of the application. 
Furthermore, you may not change the fundamental "look and feel" of the application so that green team is able to identify if your 
website has been defaced by red team or not. You want your work to interfere with CyberPrint's development team as little as possible.


A minimal nvim installation is present on this box, but you will probably want to set up some other way of looking through/modifying 
the software on this box such as accessing the files on this server remotely or using version control.


The pages found on /print and /thankyou of the website can be found in a php file served by the nginx server and the Ruby on Rails
app found just outside this directory.


Tip: add logging to the backend to identify suspicous activity.


## Notes

I think that this has a lot of code from these two blog posts
[https://medium.com/inspiredbrilliance/implementing-authentication-in-next-js-v13-application-with-keycloak-part-1-f4817c53c7ef](https://medium.com/inspiredbrilliance/implementing-authentication-in-next-js-v13-application-with-keycloak-part-1-f4817c53c7ef
)
[https://medium.com/inspiredbrilliance/implementing-authentication-in-next-js-v13-application-with-keycloak-part-2-6f68406bb3b5](https://medium.com/inspiredbrilliance/implementing-authentication-in-next-js-v13-application-with-keycloak-part-2-6f68406bb3b5
)
