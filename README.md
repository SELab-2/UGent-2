# UGent-2
De mockup van ons project kan [hier](https://www.figma.com/file/py6Qk9lgFtzbCy9by2qsYU/SELab2?type=design&node-id=617%3A4348&mode=design&t=N4FQR50wAYEyG8qx-1)
gevonden worden. 

## Project setup

1. Clone de repository naar je lokale machine met het volgende commando:
     ```bash
    git clone https://github.com/SELab-2/UGent-2
    ```
## Backend

Volg deze stappen om de backend van het project op te zetten:


1. Navigeer naar de backend map:
    ```bash
    cd UGent-2/backend
    ```
    
2. Start de Python virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3. Installeer de benodigde Python packages met behulp van het `requirements.txt` bestand:
    ```bash
    pip install -r requirements.txt
    ```
4. Installeer PostgreSQL:

    **Ubuntu**
    ```bash
    sudo apt-get install postgresql postgresql-contrib
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
5. Maak een nieuwe database genaamd `delphi`:
    ```bash
    sudo -u postgres psql -c "CREATE DATABASE delphi;"
    ```
6. Voer het `fill_database_mock.py` script uit om de database te vullen met mock data:
    ```bash
    python fill_database_mock.py
    ```
7. Start de API door het `app.py` script uit te voeren:
    ```bash
    python app.py
    ```
8. Om meer Info te krijgen over de mogelijke requests die je kan maken naar de API, kan je de swagger documentatie raadplegen op de `/docs` route.
9. De testen kunnen uitgevoerd worden met het volgende commando:
    ```bash
    python -m unittest discover tests
    ```

## Frontend

Volg deze stappen om de backend van het project op te zetten:


1. Navigeer naar de backend map:
    ```bash
    cd UGent-2/frontend
    ```
2. Instaleer Node:

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
3. Installeer alle npm dependecies
    ```bash
    npm install
    ```
4. Build de frontend:
   ```bash
   npm run build
   ```
   De gecompileerde html/css/js bevindt zich nu in de `dist` folder
   
5. Deploy:
   
   Zet de de inhoud van de `dist` folder op de juiste plaats, zodat het geserveerd kan worden.
   
6. De testen kunnen uitgevoerd worden met: (nog niet geimplementeerd)
   ```bash
   npm run tests
   ```
   
