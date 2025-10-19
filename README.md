<img width="978" height="618" alt="Jotihunt Tracker (1)" src="https://github.com/user-attachments/assets/bea945e9-306e-4c62-a486-073289eec721" />

# 🦊 Jotihunt Tracker - Client
Volg met gemak de locaties van vossenteams, hunts, hints en hunters tijdens de Jotihunt!
Met deze client-app heb je een overzichtelijke en gebruiksvriendelijke interface om de voortgang live te volgen en direct op de hoogte te blijven van alle ontwikkelingen.

## 🚀 Gebruik
Je bent volledig vrij om deze tracker te gebruiken (het is ten slotte open-source). We zouden het echter enorm waarderen als je ons als bron vermeldt wanneer je dat doet. 
Laat het ons vooral weten als je de tracker inzet tijdens jullie Jotihunt, we vinden het superleuk om te horen hoe hij in het veld wordt gebruikt! 😄

## 🛠️ Installatie
Deze webapp werkt het beste in combinatie met de [Jotihunt Tracker Server](https://github.com/ScoutingScherpenzeel/jotihunt-tracker-server). De server niet gebruiken kan, maar wordt niet aanbevolen en is geen rekening mee gehouden in de code.
Om de complete app te gebruiken, kun je het beste gebruik maken van [Docker](https://www.docker.com/). Onderstaande installatie zorgt ook voor een [Traccar](https://www.traccar.org/) server, welke je later zelf nog dient te configureren.
Traccar is de GPS tracker die gebruikt wordt op de telefoons van de hunters.

### Docker compose
1. Maak een bestand `docker-compose.yml` aan met de volgende inhoud:
```yaml
version: "3.9"
services:
  server:
    image: ghcr.io/scoutingscherpenzeel/jotihunt-tracker-server:latest # of ":main" voor de laatste ontwikkelversie.
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "3000:3000"
  client:
    image: ghcr.io/scoutingscherpenzeel/jotihunt-tracker-client:latest
    restart: unless-stopped
    ports:
      - "80:80"
    env_file:
      - .env
  mongodb:
    image: mongo:latest
    restart: unless-stopped
    environment:
      - MONGO_INITDB_DATABASE=jotihunt
    volumes:
      - mongodb:/data/db
  traccar:
    image: traccar/traccar:ubuntu
    restart: unless-stopped
    ports:
      - 5055:5055 # UDP poort voor GPS trackers
      - 8082:8082 # Webinterface en API
    volumes:
      - traccar_logs:/opt/traccar/logs
      - traccar_data:/opt/traccar/data
      - ./traccar.xml:/opt/traccar/conf/traccar.xml
      
volumes:
  mongodb:
  traccar_logs:
  traccar_data:
```
2. Maak in dezelfde folder een `.env` bestand aan met de volgende inhoud (zie ook: configuratie):
```env
DEBUG=false
TZ=Europe/Amsterdam

# Database
MONGO_URI=mongodb://mongodb:27017/jotihunt
MONGO_INITDB_DATABASE=jotihunt

# Traccar
TRACCARR_API_URL=http://traccar:8082
TRACCARR_API_TOKEN=token-van-traccar
JOTIHUNT_API_URL=https://jotihunt.nl/api/2.0

# Jotihunt
JOTIHUNT_WEB_URL=https://jotihunt.nl
JOTIHUNT_WEB_USERNAME=naam@jouwscoutinggroep.nl
JOTIHUNT_WEB_PASSWORD=password123
HUNT_START_TIME=2025-10-18T10:00+02:00 # Pas dit aan naar de starttijd van de hunt van dat jaar.
HUNT_END_TIME=2025-10-19T12:00+02:00 # Pas dit aan naar de eindtijd van de hunt van dat jaar.

# Client
JWT_SECRET=verander-dit-naar-een-veilige-random-string-van-minimaal-32-tekens
API_BASE_URL=https://api.jotihunt.jouwscoutinggroep.nl
MAPBOX_TOKEN=jouw-mapbox-token-hier
HOME_TEAM_API_ID=17
GROUP_WALKING_ID=3
GROUP_CAR_ID=2
GROUP_MOTORCYCLE_ID=4
GROUP_BIKE_ID=5
DISCORD_URL=https://discord.gg/jouw-discord-server # Optioneel
TEAMS_AREA_EDITING=false # Sta toe dat gebruikers de teams-gebieden kunnen aanpassen in de client
```
3. Start de applicatie met:
```bash
   docker-compose up -d
   ```

Er zijn nu vier services gestart:
- `server`: De Jotihunt Tracker Server - http://localhost:3000
- `client`: De Jotihunt Tracker Client - http://localhost:80
- `traccar`: De Traccar GPS tracking server - http://localhost:8082
- `mongodb`: De MongoDB database voor de server

## ⚙️ Configuratie
Volg de configuratiestappen om de volledige applicatie werkend te krijgen.

### Omgevingsvariabelen
De applicatie kan worden geconfigureerd via omgevingsvariabelen. Hieronder volgt een overzicht van waar je de verschillende variabelen vandaan kunt halen.
### `TRACCARR_API_TOKEN`
1. Ga naar jouw Traccar server (standaard te bereiken via `http://localhost:8082`) en log in als administrator.
2. Navigeer onderin naar `Instellingen` > `Voorkeuren` > `Token`.
3. Stel een verloopdatum in en druk op de ververs knop.
4. Kopieer de gegenereerde token en plak deze in de `.env` file bij `TRACCARR_API_TOKEN`.

### `JOTIHUNT_WEB_USERNAME` en `JOTIHUNT_WEB_PASSWORD`
Dit zijn de inloggegevens die je normaal gebruikt om in te loggen op [jotihunt.nl](https://jotihunt.nl). De server zal deze gebruiken om automatisch de hunts op te halen (scrapen).

### `HUNT_START_TIME` en `HUNT_END_TIME`
Stel hier de start- en eindtijd van de hunt in. Let goed op de juiste tijdzone (bijv. `+02:00` voor Nederland tijdens zomertijd).

### `JWT_SECRET`
Genereer een willekeurige, veilige string van minimaal 32 tekens. Deze wordt gebruikt om JWT tokens te ondertekenen voor de authenticatie.

### `MAPBOX_TOKEN`
1. Maak een account aan op [Mapbox](https://www.mapbox.com/).
2. Volg de instructies [hier](https://docs.mapbox.com/help/dive-deeper/access-tokens/) om een token te genereren.
3. Standaard heeft je account 50.000 gratis kaartweergaven per maand. Tenzij je van plan bent 600 terminator AI-agents in te schakelen, zou dit voldoende moeten zijn.
4. Kopieer de token en plak deze in de `.env` file bij `MAPBOX_TOKEN`.

### `API_BASE_URL`
Stel dit in op de URL waar jouw Jotihunt Tracker Server bereikbaar is. Bijvoorbeeld `https://api.jotihunt.jouwscoutinggroep.nl` of `http://localhost:3000` als je lokaal werkt.
Belangrijk: deze URL moet **publiek toegankelijk** zijn.

### `HOME_TEAM_API_ID`
Dit is de API ID van jouw eigen team op de Jotihunt website. Deze kun je pas invullen nadat je bent aangemeld.
1. Ga naar `https://jotihunt.nl/api/2.0/subscriptions` en zoek jouw team op in de lijst.
2. Noteer de `id` waarde van jouw team en vul deze in bij `HOME_TEAM_API_ID` in de `.env` file.

### `GROUP_WALKING_ID`, `GROUP_CAR_ID`, `GROUP_MOTORCYCLE_ID`, `GROUP_BIKE_ID`
Deze waarden komen overeen met de groeps-ID's die door Traccar worden gebruikt om verschillende soorten voertuigen te onderscheiden.
1. Ga naar jouw Traccar server (standaard te bereiken via `http://localhost:8082`) en log in als administrator.
2. Navigeer onderin naar `Instellingen` > `Groepen`.
3. Maak hier de verschillende groepen aan: `Auto`, `Fiets`, `Motor`, `Lopend`.
4. Voor elke groep zie je in het bewerkscherm in de URL het juiste ID staan. (bijv. bij https://traccar.jotihunt.jouwscoutinggroep.nl/settings/group/2 is het id `2`).
5. Vul deze ID's in bij de respectievelijke omgevingsvariabelen in de `.env` file.

### `DISCORD_URL`
Optioneel: vul hier de URL in van jouw Discord-server. Er zal dan een knop verschijnen in de client waarmee gebruikers direct kunnen joinen.

### `TEAMS_AREA_EDITING`
In 2024 waren de deelgebieden niet voorafgaand aan de hunt bekend. 
Door deze instelling op `true` te zetten, kunnen gebruikers in de client de gebieden van teams zelf aanpassen en opslaan. 

## 🛰️ GPS Tracking
