# Setup

1. Create .env in root of project (if you change the user/db_name change it in the following commands too)

    ```env
    containername_db=""
    containername_backend=""
    containername_frontend=""
    DB_name="picsdb_db"
    DB_user="picsdb_admin"
    DB_password=""
    og_pics_path=""
    prew_pics_path=""
    app_key=""
    jwt_secret_key=""
    ```
2. run `docker compose up db`

3. run

    ```bash
    createdb -h localhost -p 5433 -U picsdb_admin picsdb_db
    psql -h localhost -p 5433 -U picsdb_admin -d picsdb_db -f ./setup/schema.sql
    ```

