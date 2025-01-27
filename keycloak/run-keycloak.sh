#!/bin/bash

# TODO: This is a really janky way to start the docker things since there is a docker compose file? Not sure what this is all about.

# Set environment variables
MYSQL_CONTAINER_NAME="mysql-container"
MYSQL_ROOT_PASSWORD="root"
MYSQL_DATABASE="keycloak"
MYSQL_USER="cdc"
MYSQL_PASSWORD="cdc"
MYSQL_PORT_HOST="3307"
MYSQL_PORT_CONTAINER="3306"  # MySQL container will still use 3306 internally
KEYCLOAK_PORT="8080"
KEYCLOAK_REALM_EXPORT_PATH="$(pwd)/realm-export.json"

# Run MySQL container on port 3307
echo "Starting MySQL container..."
docker run -d --name $MYSQL_CONTAINER_NAME \
  -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
  -e MYSQL_DATABASE=$MYSQL_DATABASE \
  -e MYSQL_USER=$MYSQL_USER \
  -e MYSQL_PASSWORD=$MYSQL_PASSWORD \
  -p $MYSQL_PORT_HOST:$MYSQL_PORT_CONTAINER \
  mysql:8

# Wait for MySQL to initialize (check if MySQL is accepting connections)
echo "Waiting for MySQL to initialize..."
until docker exec $MYSQL_CONTAINER_NAME mysqladmin -u root -p$MYSQL_ROOT_PASSWORD ping --silent; do
  echo "Waiting for MySQL to be ready..."
  sleep 5
done

# Run Keycloak container with the MySQL database connection
echo "Starting Keycloak container..."
docker run -d -p $KEYCLOAK_PORT:$KEYCLOAK_PORT \
  -e KC_DB=mysql \
  -e KC_DB_URL=jdbc:mysql://$MYSQL_CONTAINER_NAME:$MYSQL_PORT_CONTAINER/$MYSQL_DATABASE \
  -e KC_DB_USERNAME=$MYSQL_USER \
  -e KC_DB_PASSWORD=$MYSQL_PASSWORD \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  -v $KEYCLOAK_REALM_EXPORT_PATH:/opt/keycloak/data/import/CyberPrint.json \
  quay.io/keycloak/keycloak:26.1.0 \
  start-dev --import-realm

echo "Keycloak is now running on port $KEYCLOAK_PORT and connected to MySQL on port $MYSQL_PORT_HOST."
