# Project Aanmaken: Simpele Structuur Beperkingen

Docenten kunnen de volledige structuur van een opdracht vastleggen. Ze kunnen de studenten echter ook enige vrijheid bieden, indien gewenst.

Een lesgever kan beslissen of de opdracht een enkel bestand moet zijn of een zip-archief met meerdere bestanden.

## Een bestand als indiening

Wanneer de indiening een enkel bestand betreft, moet de lesgever de naam van dit bestand vastleggen.

![File indiening](images/file_indiening.png)

## Een zip-archief als indiening

Wanneer de indiening een zip-archief betreft, moet de lesgever ook de naam van dit archief vastleggen.

![File indiening](images/zip_indiening.png)

Naast de naam van het archief kan de volledige interne structuur worden vastgelegd. Er kan echter ook volledige vrijheid worden gegeven, of iets ertussenin.

Door met de muis over het archief te slepen, kunnen er bestanden of mappen aan worden toegevoegd:

![hover_zip](images/hover_zip.png)

![map_bestand_lokaal](images/map_bestand_lokaal.png)

Namen die vetgedrukt zijn, stellen mappen voor. Namen in normale tekst zijn bestanden.

Lesgevers die nog meer controle willen over de indiening, kunnen met hun muis over de bestanden of mappen hoveren en op de drie puntjes klikken:

![constraint_veranderen](images/constraint_veranderen.png)

Door op `maak folder` te klikken, kan een bestand worden veranderd in een map, zoals `mijn_map`.

`niet aanwezig` zorgt ervoor dat dit bestand niet aanwezig mag zijn in de map waarin de beperking is gedefinieerd (hier `archief_naam.zip`), maar mogelijk wel in andere mappen:

![verboden](images/verboden.png)

`extensie niet aanwezig` zorgt ervoor dat een bepaalde extensie niet aanwezig mag zijn in de map of het archief waarin de beperking is gedefinieerd:

![extensie_verboden](images/extensie_verboden.png)

`extensie enkel aanwezig` zal er voor zorgen dat enkel de gegeven extensie in de map aanwezig mag zijn:

![alleen_extensie](images/alleen_extensie.png)

## Globale voorwaarden

Soms is het nodig om een beperking over de volledige indiening te definiëren. Dit kan in de sectie `globale voorwaarden`.

![global](images/global.png)

Men kan vastleggen welke bestanden of extensies niet aanwezig mogen zijn met `niet-aanwezig` en `extensie niet aanwezig`. Men kan ook afdwingen dat enkel een bepaalde extensie aanwezig mag zijn over het hele project (mappen niet meegerekend).

## Voorbeeld

![voorbeeld](images/voorbeeld.png)

Dit is een zip-indiening waarbij er zeker een `verslag.pdf`, `src`, `src/frontend` en `src/backend` map aanwezig moet zijn. In de frontend map mag geen `node_modules` aanwezig zijn. De backend map mag enkel `*.py` bestanden bevatten.

Globaal gezien mogen er nergens `.class` bestanden of een `malware.exe` aanwezig zijn.
