# Setup

1. Create .env in root of project

    ```env
    containername_db="picsdb_db"
    containername_backend="picsdb_backend"
    containername_frontend="picsdb_frontend"
    DB_name="picsdb_db"
    DB_user="picsdb_admin"
    DB_password=""
    og_pics_path=""
    prew_pics_path=""
    app_key=""
    jwt_secret_key=""
    DOMAIN"test.de, www.test.de"
    ```
2. run 

    `docker compose up db --build`

3. run

    ```
    docker exec -it picsdb_db createdb -h localhost -p 5432 -U picsdb_admin picsdb_db
    docker exec -i picsdb_db psql -h localhost -p 5432 -U picsdb_admin -d picsdb_db < ./setup/schema.sql
    ```
4. run
    ```
    mkdir backend/content
    mkdir backend/content/original
    mkdir backend/content/preview
    ```

5. Login with admin:admin

