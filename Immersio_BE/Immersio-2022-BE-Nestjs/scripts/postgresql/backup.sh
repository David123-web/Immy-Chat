#!/bin/bash

# Setting up the environment through options cli
# Example: ./backup.sh -h aws.host -p 5432 -d dbname -u user
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
    mkdir $folder
fi

# Change to the folder
cd $folder

# Check if the file already exists
if [ -f $filename ]; then
    echo "File $filename already exists. Exiting."

    # Ask to override
    read -p "Do you want to override it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi

    # Remove the file
    rm $filename
fi

# Ask password
read -s -p "Password: " password

# Set password
export PGPASSWORD=$password

# Run the pg_dump
echo "Running pg_dump..."
pg_dump -h $host -p $port -U $user -d $dbname --verbose -Fc -f $filename --no-owner --no-privileges

# Check process status if pg_dumpall failed
if [ $? -ne 0 ]; then
    echo -e "\033[0;31mERR! pg_dumpall failed. Exiting.\033[0m"
    exit 1
fi

# color
echo -e "\e[32mBackup created: $filename\e[0m"
echo "You can run restore.sh to restore the backup"