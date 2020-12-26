# Django Template in Docker

 
## Git

Clone this repository
```sh
$ git clone giturl --depth=1
```
## Docker
Install [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/) in your system.
Create a local copy of `docker-compose.local.yml` on your machine. 

```sh
$ cp docker-compose.local.yml docker-compose.yml
```
Similarly create `entrypoint.sh` by copying the sample entrypoint script.

```sh
$ cp docker-entrypoint.local.sh entrypoint.sh
```
Also make a copy of `.env_sample` to `.env` and use it for setting environment variables for your project. 

    $ cp .env_sample.txt .env
    $ nano .env                         # Edit .env and set environment variables

 If you need postgresql database and other services running on docker container, start those first.
```sh
$ docker-compose -f external_services.yml up -d
```
To run the project in docker

    $ docker-compose up -d                      #  Will create all necessary services
    Starting db ... done
    Starting web   ... done
    Starting worker  ... done

To stop all running containers

    $ docker-compose stop                       # Will stop all running services
    Stopping db ... done
    Stopping web   ... done
    Stopping worker  ... done

## Django
Once you have created all necessary services. You may want to perform some tasks on Django server like `migrations`, `collectstatic` & `createsuperuser`.
Use these commands respectively.

    $ docker exec -it -u 0 web bash             # Get a shell on container

    # python3 manage.py collectstatic   # Collecting static files 
    # python3 manage.py migrate         # Database migrate
    # python3 manage.py createsuperuser # Creating a superuser for login.

Now you should be able to access your django server on http://localhost:8020 .

## Postgresql
In case if you want to use a local postgresql server instead on running a docker container.
First verify if `postgresql` is installed.

     $ psql -V
     psql (PostgreSQL) 10.0
Edit `postgresql.conf` file to allow listening to other IP address.

    $ sudo nano /etc/postgresql/10/main/postgresql.conf
    listen_addresses = '*'          # what IP address(es) to listen on;
Now you will need to allow authentication to `postgresql` server by editing `pg_hba.conf`.

    $ sudo nano /etc/postgresql/10/main/pg_hba.conf
    
Find `host    all             all             127.0.0.1/32            md5`  and change it to `host    all    all    0.0.0.0/0    md5`

Restart your postgresql server.

    $ sudo systemctl restart postgresql.service
You will now need to set environment `POSTGRES_HOST`  your private IP address like following.

    POSTGRES_HOST=192.168.1.22                          # my local postgresql server ip address

For creating a postgresql `role` , `database` & enabling `extensions`.

    $ sudo su - postgres
    $ psql
    psql> CREATE DATABASE myproject;
    psql> CREATE USER myprojectuser WITH PASSWORD 'password';
    psql> GRANT ALL PRIVILEGES ON DATABASE myproject TO myprojectuser;
    psql> CREATE EXTENSION postgis;
 ## Status and Logs
 For viewing status of your docker container.

    $docker-compose ps
     Name               Command               State           Ports         
    ------------------------------------------------------------------------
    nginx    /docker-entrypoint.sh ngin ...   Up      0.0.0.0:80->80/tcp    
    web      sh entrypoint.sh                 Up      0.0.0.0:8001->8001/tcp
    worker   celery -A varicon worker - ...   Up 

For viewing logs of your docker services.

    $ docker-compose logs -f  --tail 1000 web
     Apply all migrations: account, admin, auth, authtoken, contenttypes, core, sessions, sites, socialaccount, user
    Running migrations:
      Applying contenttypes.0001_initial... OK
      Applying contenttypes.0002_remove_content_type_name... OK
      Applying auth.0001_initial... OK

