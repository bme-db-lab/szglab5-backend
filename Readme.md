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
```
* Adatbázis feltöltése a seed adatokkal
```
npm run cli:dev seed
```
* Dev API szerver elinditása
```
npm run start:dev
```
