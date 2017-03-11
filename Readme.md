# Laboradmin - backend

### Fejlesztői környezet kialakítása
#### Szoftverek
* Adatbázis: PostgreSQL https://www.postgresql.org/ (BigSQL)
* NodeJS: 6.10 (LTS) https://nodejs.org/en/
* Szövegszerkesztő: https://Atom.io (ajánlott), lehet más is, csak legyen hozzá eslint plugin

#### Adatbázis konfig
* Létre kell hozni az adatbázist, a default dev-es kapcsolódási adatok megtalálhatóak a config/config.js-ben

#### Atom.io konfig (vagy egyéb szerkesztő)
Szükséges packagek
* linter-eslint

Ajánlott packagek
* file-icons
* tree-view-copy-relative-path

#### Lépések
* Repository letöltés
```
git clone https://github.com/bme-db-lab/szglab5-backend.git
```
* NPM packagek letöltése
```
npm install
npm install nodemon -g
```
* Adatbázis feltöltése a seed adatokkal
```
npm run cli:dev seed
```
* Dev API szerver elinditása
```
npm run start:dev
```

### Parancsok (ENV = 'dev' | 'prod' | 'test')
#### CLI (npm run start cli:"ENV" "command")
##### seed [filepath]
* filepath: the json file path that contains the seed data, relative to /db/seedData (__default__: 'dev.seed.json')
* example:
```
npm run cli:dev seed test1.seed.json
```

#### START (npm run start:"ENV")
Elindítja az API szervert
```
npm run start:dev
```
