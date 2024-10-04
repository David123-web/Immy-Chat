**To Copy a Remote PostgreSQL Database to a Local PostgreSQL Database**

Prerequisites: Ensure the PostgreSQL container is running before using this script.

Steps:
1. Start the PostgreSQL container.
2. Modify database connection details in `backup.sh` and `restore.sh`.
3. Run `backup.sh` to create a backup of the remote database and check for errors.
4. Execute `restore.sh` to restore the local database from the created backup.

Options:
- `-h` for host
- `-p` for port
- `-d` for database name
- `-u` for username

Example:
```
# Example: ./backup.sh -h aws.host -p 5432 -d dbname -u user
# Example: ./restore.sh -h localhost -p 5432 -d dbname -u user
```
