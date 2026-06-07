## spawn skill

### install
Creates the user directory, copies docker-compose template, prepares config.

### run
Runs `docker compose up -d` for that user’s stack.

### stop / kill
Runs `docker compose down` or `docker compose down --rmi all`.

### status
Shows `docker compose ps` for that user.
