# UGent-2
De mockup van ons project kan [hier](https://www.figma.com/file/py6Qk9lgFtzbCy9by2qsYU/SELab2?type=design&node-id=617%3A4348&mode=design&t=N4FQR50wAYEyG8qx-1)
gevonden worden.

## Project setup

1. Clone de repository naar je lokale machine met het volgende commando:
     ```bash
    git clone https://github.com/SELab-2/UGent-2
    ```
## Backend

De backend gebruikt Python 3.12 en Poetry.
Volg deze stappen om de backend van het project op te zetten:


1. Navigeer naar de backend map:
    ```bash
    cd UGent-2/backend
    ```
2. Installeer Poetry

3. Installeer de benodigde Python packages met behulp van Poetry en voer de rest van de stappen uit in die virtual environment:
    ```bash
    poetry install
    poetry shell
    ```
4. Installeer PostgreSQL:

    **Ubuntu**
    ```bash
    sudo apt-get install postgresql postgresql-contrib
    sudo service postgresql start
    ```
    **Fedora**
    ```bash
    sudo dnf install postgresql postgresql-server
    sudo postgresql-setup --initdb --unit postgresql
    sudo systemctl enable --now postgresql
    ```
    **Arch**
    ```bash
    sudo pacman -S postgresql
    sudo su - postgres -c "initdb --locale $LANG -E UTF8 -D '/var/lib/postgres/data'"
    sudo systemctl start postgresql.service
    sudo systemctl enable postgresql.service
    ```
5. Maak een nieuwe database genaamd `delphi` en stel het standaardwachtwoord in:
    ```bash
    sudo -u postgres psql -c "CREATE DATABASE delphi;"
    sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
    ```
6. Voer het `fill_database_mock.py` script uit als een module om de database te vullen met mock data:
    ```bash
    python -m db.fill_database_mock
    ```
    Je kan ook een lege databank initialiseren met het `create_database_tables.py` script als volgt:
    ```bash
    python -m db.create_database_tables
    ```
    *Opgelet: beide scripts zullen de huidige databankinhoud verwijderen indien die bestaat en daarna de tabellen opnieuw aanmaken.*
7. Start de API door het `app.py` script uit te voeren:
    ```bash
    python app.py
    ```
8. Om meer Info te krijgen over de mogelijke requests die je kan maken naar de API, kan je de swagger documentatie raadplegen op de `/api/docs` route.
9. De testen kunnen uitgevoerd worden met het volgende commando:
    ```bash
    python -m unittest discover tests
    ```

## Frontend

Volg deze stappen om de frontend van het project op te zetten:


1. Navigeer naar de frontend map:
    ```bash
    cd UGent-2/frontend
    ```
2. Installeer Node:

    **Ubuntu**
    ```bash
    sudo apt update
    sudo apt install ca-certificates curl gnupg

    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

    NODE_MAJOR=20
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

    sudo apt update
    sudo apt install nodejs
    ```
    **Fedora**
    ```bash
    sudo dnf install nodejs
    ```
    **Arch**
    ```bash
    sudo pacman -S nodejs-lts-iron
    ```
3. Installeer alle npm dependencies
    ```bash
    npm install
   ```
4. Build de frontend:
   ```bash
   npm run build
   ```
   De gecompileerde html/css/js bevindt zich nu in de `dist` folder.
5. Deploy:
   Zet de inhoud van de `dist` folder op de juiste plaats, zodat het geserveerd kan worden.
6. De testen kunnen uitgevoerd worden met:
   ```bash
   npm run tests
   ```
   Dit draait zowel de unit als de e2e testen. De e2e testen kun je ook debuggen met een UI in je browser via:
   ```bash
   npm run test:e2e:ui
   ```
