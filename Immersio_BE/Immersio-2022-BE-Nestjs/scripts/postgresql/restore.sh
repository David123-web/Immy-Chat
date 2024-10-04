#!/bin/bash

# Setting up the environment through options cli
# Example: ./restore.sh -h localhost -p 5432 -d dbname -u user
while getopts h:p:d:u: flag
do
    case "${flag}" in
        h) host=${OPTARG};;
        p) port=${OPTARG};;
        d) dbname=${OPTARG};;
        u) user=${OPTARG};;
    esac
done

# Setting up the folder and filename
folder=backups
filename=backup-$(date +%Y-%m-%d).sql

# Check for the folder
if [ ! -d $folder ]; then
    echo -e "\033[0;31mERR! Folder $folder does not exist. Exiting.\033[0m"
fi

# Change to the folder
cd $folder

# Check if the file exists
if [ ! -f $filename ]; then
    echo "File $filename does not exist. Exiting."
    exit 1
fi

# Check if host is amazon, if so, exit
if [[ $host == *"amazonaws.com"* ]]; then
    echo -e "\033[0;31mERR! This script should not be run on Amazon RDS. Exiting.\033[0m"
    exit 1
fi

# Ask password
read -s -p "Password: " password

# Set password
export PGPASSWORD=$password

# Create the database and restore the backup
function create_database() {
    createdb -U "$user" -h "$host" -p "$port" "$dbname"

    # Set user to superuser
    psql -U "$user" -h "$host" -p "$port" -d "$dbname" -c "ALTER USER $user WITH SUPERUSER"

    echo "Database '$dbname' created."

    # Restore the backup using psql
    pg_restore -U "$user" -h "$host" -p "$port" -d "$dbname" --verbose < "$filename"

    # Restored
    echo -e "\e[32mRestored: $filename\e[0m"
}

# Check if the database exists
if psql -U "$user" -d postgres -h "$host" -p "$port" -lqt | cut -d \| -f 1 | grep -qw "$dbname"; then
    # Drop the database if it exists and continue
    read -p "Database '$dbname' exists. Do you want to remove it and recreate? (y/n): " confirm
    if [[ $confirm == "y" ]]; then
        dropdb -U "$user" -h "$host" -p "$port" "$dbname"
        create_database
    fi
else
    create_database
fi