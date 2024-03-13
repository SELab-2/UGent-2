# UGent-2
De mockup van ons project kan [hier](https://www.figma.com/file/py6Qk9lgFtzbCy9by2qsYU/SELab2?type=design&node-id=617%3A4348&mode=design&t=N4FQR50wAYEyG8qx-1)
gevonden worden. 

## Project setup

## Backend

Volg deze stappen om de backend van het project op te zetten:

1. Clone de repository naar je lokale machine met het volgende commando:
    ```bash
    git clone https://github.com/SELab-2/UGent-2
    ```
2. Navigeer naar de backend map:
    ```bash
    cd UGent-2/backend
    ```
3. Start de Python virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
4. Installeer de benodigde Python packages met behulp van het `requirements.txt` bestand:
    ```bash
    pip install -r requirements.txt
    ```
5. Installeer PostgreSQL:

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
6. Maak een nieuwe database genaamd `delphi`:
    ```bash
    sudo -u postgres psql -c "CREATE DATABASE delphi;"
    ```
7. Voer het `fill_database_mock.py` script uit om de database te vullen met mock data:
    ```bash
    python fill_database_mock.py
    ```
8. Start de API door het `app.py` script uit te voeren:
    ```bash
    python app.py
    ```
9. Om meer Info te krijgen over de mogelijke requests die je kan maken naar de API, kan je de swagger documentatie raadplegen op de `/docs` route.
10. De testen kunnen uitgevoerd worden met het volgende commando:
    ```bash
    python -m unittest discover tests
    ```