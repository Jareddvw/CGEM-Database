# CGEM-DB

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## Table of Contents
  * [About](#about)
  * [Requirements](#requirements)
  * [Usage](#usage)
  * [License](#license)
  * [Acknowledgements](#acknowledgements)

## About
This is a relational database for ribosomal reactions curated by the NSF Center for Genetically Encoded Materials (C-GEM). 

The site enables advanced search queries for reactions based on monomer structure, tRNA, tRNA synthetases or flexizymes, and other reaction parameters. Users can draw molecules to query for only monomers which contain the drawn structure as a substructure.

The backend is a PostgreSQL database with the RDKit Postgres cartridge, under a Django REST Framework API. The frontend is a React application made using create-react-app. 

Site url: [db.gem-net.net](https://db.gem-net.net/).

More information about using the site and the database schema: [db.gem-net.net/about](https://db.gem-net.net/about).

REST API url: [db.gem-net.net/api](https://db.gem-net.net/api).

Technologies used: PostgreSQL, Django REST Framework, React, Docker, RDKit.

## Requirements
### API
1. Clone this repository and cd into the project.
```
    git clone https://github.com/Jareddvw/CGEM-DB.git
    cd CGEM-DB
```
2. Docker version 3.8
3. Install RDKit: https://www.rdkit.org/docs/Install.html 
4. Create a file called secret_key.py. For local development (DEBUG = True), set 
``` DJANGO_CGEMDB_SECRETKEY = "a" ``` 
5. Use a virtual environment (or conda env) to install the required Python packages and start Docker containers: 
```
pip install -r requirements.txt
docker compose-up
```
6. Migrate models to the database and run Django server:
```
python manage.py migrate
python manage.py runserver
```
### Frontend
1. Node v18.4.0
2. Start the server:
```
cd frontend
npm install
npm start
```
- for production build:
```
npm run build
```

## Usage
- Access the database from the gem-net site: [db.gem-net.net](https://db.gem-net.net/).
- For API access: currently the only allowed origin is from https://db.gem-net.net. If you would like to use the API in your application, please email [sarah@gem-net.net](mailto:sarah@gem-net.net) with a description of your intended uses.



## License


## Acknowledgements

- Probst, Daniel, and Jean-Louis Reymond. “Smilesdrawer: Parsing and Drawing Smiles-Encoded Molecular Structures Using Client-Side JavaScript.” _Journal of Chemical Information and Modeling_, vol. 58, no. 1, 2018, pp. 1–7., https://doi.org/10.1021/acs.jcim.7b00425. 

- RDKit: Open-source cheminformatics; http://www.rdkit.org

- Django-rdkit: https://github.com/rdkit/django-rdkit