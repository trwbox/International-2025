# PseudoSudo Code

An initial note that this readme was written after the competition was complete, and as I am getting ready to publish the code. This is the code changes/additions that we made to the code base from the international CDC code base. The largest of the things that we implemented was that each of the services was running in it's own container. We placed everything in it's own folder to make it easier to deploy during the setup, allowing us to simply zip the folder, send it to the server, and then unzip it. All without the fear of leaking things like github information.

Note that many of the comments in the code could be outdated and just not have been updated after we fixed the problem that it was talking about.

## Initial Setup

There is some amount of initial setup that needs done before this all works correctly. Assume that everything mentioned is relative to the `www` directory. The first thing that you need to do it go into the `php` folder and install the stl parsing library using composer.

```bash
sudo apt-get install composer
composer install
```

The next thing that needs to be done is run the `run.sh` script in the main folder to set the right user to have permissions on `uploads`. This is the folder that will be bind mounted to both the php and nextjs containers. After that the next thing that needs to be done is initializing the database for use, so you need to start the mariadb container.

```bash
docker compose up mariadb
```

After it is running, you can exec into the container, and run the mariadb command line tool. Once you are in the tool, paste the contents of the `init.sql` file into the tool to create the databases and users.

```bash
docker exec -it www-mariadb-1 /bin/bash
mysql -u root -p
# Enter the password "root"
# Then paste the contents of the init.sql file
```

You can now do Ctrl-C in the terminal running the docker compose command to stop the mariadb container. The next thing that needs to be done is start the keycloak container, which also requires the mariadb container to be running.

```bash
docker compose up keycloak mariadb
```

This will take a while to start as it is creating the database it needs and generating new keys. Once it is up, you can now navigate to the domain that is running the keycloak server. If you get an error that the domain requires HTTPS, there are a number of things, but I made the choice to manually update the database from this [stackoverflow comment](https://stackoverflow.com/questions/30622599/https-required-while-logging-in-to-keycloak-as-admin#comment134017078_42002397). This is done in the same manner as the database setup that was done with the init.sql file.

```sql
USE keycloak;
UPDATE realm SET ssl_required='NONE' where name = 'master';
```

Then stop and restart the containers. Once you can login, you will need to create a new realm, name it `CyberPrint`. After creating the realm, you can then create a new client. When creating the client, enable `Client Authentication`, and we set all the URL settings that were allowed refers, and allowed callbacks to `http://www.team7.isucdc.com/*`. After creating the client go to the tab labeled keys, or similar and find the "Client Secret", this will need to be put in the nextjs `.env.local` file to allow it to authenticate to keycloak. The last thing that needs to be done is to create a new user. This user will be the admin user for the realm `admin@cyberprint.com`.

After putting the client secret in the `.env.local` file, you will need to go into the `nodejs` folder and run the following commands to install and build the dependencies required for the app. I am not 100% sure why this needs to be done? But the docker container would not complete the build process if this was not done.

```bash
yarn install
yarn build
```

At this point all the service setup should be complete, and you can start all the services at the same time using the following command.

```bash
docker compose up
```

## Notes on each services

### Keycloak

We moved opted to completely restart a brand new keycloak instance because each team had been deployed the same exact copy allowing for the possibility for red team to arbitrarily sign tokens since they could steal the shared private key from a team. We also limited the allowed URLs because the original `*` felt concerning when it clearly could be limited to our team only.

### PHP

This code had some serious problems. Such as trusting the user input as the filename, having the user upload folder be an executable directory, and misc other things. I think this allowed for arbitrary file overwrite as the user running the apache server? Some of the things that we did to fix this was to move the uploads folder out of the webroot, added an `.htaccess` file to not let the webserver send back the composer file, increased the file size limit, added the [https://github.com/ChubV/php-stl](https://github.com/ChubV/php-stl) library to parse the files that were coming in to validate they were valid stl files, and we also changed a request to `/api/order-info` to happen on the server side instead of the client side. This allowed us to never use the user provided filenames, and instead used the guid that was generated for the order as the file for the stl file.

### NextJS

This had a lot of fixes in the code because a lot of it was really bad. The biggest thing that we did was add a middleware, that checked for a valid session before accessing any of the pages, and as an additional safety check verified your access token was properly signed by our instance of keycloak before allowing you access to the pages with flags, along with the admin page checking the email for being correct. This meant that any access to those pages (such as the payment-info) would always have a known valid session, and known safely signed access token letting us trust the contents within them, and if not would send you to the sign in page that was added. Some of the other fixes included parameterizing the SQL queries to prevent injection, changing the code to handle files by the guid only, and by not trusting certain insecure user input like the amount, and instead relying on the guid relative to the order to get it from the database. This also had a shared secret of `cdc` that allowed red team to decrypt the nextauth cookie and get the contents of that cookie, and re-encrypt it to keep it valid.

NOTE: The code for the SFTP was a little flaky and failing sometimes, and I don't know why? I am not very good with javascript and that is probably the reason. So I made a really basic shell script that ran every minute that ran `use CyberPrint; select guid from orders where orders.paid = '1';` on the database to get all the orders that had been paid for, and then since file names were guids, copied all those files over using SFTP to the server. Not a prefect solution, but it worked since I only realized it being flaky about the same time we ran out of storage.

### Ruby

There was not a whole lot done with this service, I think that it was still vulnerable to the XSS attack that we did not get to fixing before the competition started.

## MariaDB

Not a lot to say here beyond the `init.sql` file being the most minimal possible setup that we could, so that we knew there wasn't anything weird sitting in the database.

### Nginx

While the nginx on the system itself was probably fine to use. Since we were already putting things in docker, placing this in docker saved just 1 less required install for my local testing environment, so I put it here. This is using the [ModSecurity](https://github.com/owasp-modsecurity/ModSecurity) WAF to help protect the system from malicious attacks and would log them for our knowledge. This was also setup to have the uploads folder bind mounted, and serving all the file contents as static files. This allowed the website to still have the functionality of downloading the stl files that were uploaded, but prevented the chance of it ever being able to be executed as code.

## Other Notes

Some of the other notes is that we uninstalled a lot of the things on the system that were no longer needed because of this, such as mariadb, postgres (which was never used, but installed), the multiple systemd services, and a few other. We also had all of the logs being generated being forwarded to our Wazuh server so that we could more easily analyze them, and see what happened if red team tried something.

This takes up **_a lot_** of space on the system. At some point a couple hours into the competition we saw some really weird logging errors. I realized that the system had eaten up all of the 25GB disk space that originally was available. I shut down the system hoping I could expand the disk, restart, expand the ubuntu LVM and move on. It was not that simple... I could not expand the disk. I instead had to add a new disk to the system and move files over to that disk while it was actively running. The docker overlay filesystems were taking up a ton of space, and those live in `/var/lib/docker/overlay2`. So what I did was format the new disk to ext4, mount the disk to a new folder, moved the overlay2 folder to the new disk, and then attempted to overlay mount to the overlay2 folder. For whatever reason that did not work nicely, and all the disk writes were going to the main drive, and resulted in tons of the files moving back, and filling up tons of the drive again. So I did the next best thing, I made a full copy of `/var/lib` to the new disk, bind mounted the old `/var/lib` to a new temporary folder, overlay mounted the copy of `/var/lib` to `/var/lib`, and then deleted the contents of the temporary folder (which in turn deleted all the files from the original `/var/lib`). I then made a bind mount in `/etc/fstab` to bind mount the new disk to the `/var/lib` folder on each boot so the system did not break if the system was restarted. This was a monster headache, and had our WWW system down for a solid hour or so during the competition which hurt our service uptime score. 10/10 don't recommend having to live migrate a major directory under pressure like that. I am more than a little shocked that I didn't majorly break the system somehow in the process.

### POC Code

To test POC code where I took out the keycloak private key (from the mariadb) that was being used to sign new access token to test if I got allowed access to the admin and server info pages. This code takes in the nextauth cookie from your browser, decrypts it using the default shared secret, decode the three JWT tokens from keycloak, and then re-sign those tokens using the keycloak private key, and re-encrypt the cookie using the shared secret. It then printed out the cookie in the sections that were needed for the cookie manager that I am using allowing me to paste those into my browser and see that this did grant me access. There are likely some number of node modules that you need to install get it working, and I think the `package.json` file is correct, but it might not be. While this code is explicitly re-signing the tokens for `CyberPrint` realm, I think it could be possible to sign tokens for the `master` realm as well, since they also all shared the same keys. I did not get around to this, but the theory around ti makes sense in my mind.
