#!/bin/bash
# This script is used to change the owner of the uploads folder to www-data for the php container

sudo chown 33:33 -R uploads/
