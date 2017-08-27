# „Adatbázisok Labor" adminisztrációs rendszer funkcionális specifikáció

## Szerepkörök

- *Hallgató* — a rendszerben szereplő, éves szinten körülbelül 300-600
  felhasználó közül a legtöbb hallgatói szerepkörrel rendelkezik. A rendszer
  folyamatainak csak egy kis részéhez kapcsolódik, illetve jogosultságai csak a
  felhasználóhoz közvetlenül hozzátartozó adatok megtekintésére hatalmazzák
  fel.

- *Mérésvezető* (laborvezető, demonstrátor) — éves szinten körülbelül 30-50
  felhasználót érint, akiknek feladata a gyakorlatok levezetése, illetve a
  mérésen megjelent hallgatók osztályzása, értékelése.

- *Javító* (értékelő) — az ugyancsak 30-50 felhasználót érintő szerepkörhöz a
  jegyzőkönyvek javítással kapcsolatos feladatok tartoznak (letöltés,
  értékelés, stb.).

- *Adminisztrátor* — a rendszer működésével, jogosultságok és felhasználók
  menedzsmentjével, stb. kapcsolatos funkciók tartoznak az adminisztrátor
  szerepkörű felhasználókhoz. A hozzáférések minőségének és mértékének
  megfelelően adminisztrátorból csak viszonylag kevés, várhatóan 1-2-re van
  szükség egy félév során.

- *Labor felelős* – az oktatási folyamat zavartalanságáért felelős személy,
  akinek elsősorban a folyamatok monitorozásának lehetőségét kell biztosítani
  olvasási jellegű általános hozzáférésekkel, meghatározott riportok
  futtatásával.

- *"Anonymous"* — mivel a teljes rendszer használata bejelentkezéshez kötött,
  az azonosítatlan felhasználóknak alapvetően csak a bejelentkező oldal
  elérését kell biztosítani.

## Általános elvárások

A rendszerben tárolt adatokkal kapcsolatban vannak általános elvárásaink, ezek
az alábbiak:

- *jelszó*
    * generált jelszó esetén kerüljük a 0 (nulla), O (nagy-omega), 1 (egy), l
      (kis lima) és I (nagy-india) betűk használatát
    * engedjü, de ne követeljünk meg bizonyos karakterosztályok használatát --
      lehessen pl. akár emojit is megadni, de ne követeljük meg azt, hogy
      legyen benne legalább egy szám, nagybetű, stb.
    * minimálisan 12 karakter legyen a jelszó és tegyünk javaslatot a jelkód,
      -mondat használatára a jelszó változtató oldalon.
    * a jelszó tárolásánál PBKDF2, időhöz kötött, lenyomatképző algoritmust
      szabad csak használni!
    * a laboradmin rendszer eléréséhez szükséges jelszót nyíltan _tilos_ tárolni!

- *azonosítók* -- hosszú távú, kontextus független azonosításra egyszerű
  számokat nem érdemes használni, ilyen esetekben mindig UUID-t generáljunk

- *lenyomatok* -- ha egy dokumentum, fájl, stb. lenyomatát kell tároljuk,
  válasszunk jól működő, biztonságos algoritmust, pl. SHA-256.  Mindenképp
  kerülendők: RC4, MD5, SHA1!

- *napló* -- általános elvárás a rendszer működésével kapcsolatban az, hogy
  minden adatváltozás (még ha feleslegesen is redundáns), de naplózásra
  kerüljön.  Tehát ha az API felületen vagy konzolon keresztül bármilyen adat
  megváltozik a rendszerben, arról készüljön naplóbejegyzés. *Opcionális*: ha
  ez a napló újra beolvasható és előállítható belőle az aktuális
  adatbázis-állapot az plusz pont.

## Fogalmak

**TODO** Ide kéne átvezetni az ER-ben már definiált fogalmakat, egyedeket,
attribútumokat és azok jelentését.

- mérés / labor

## Folyamatok

### Általános funkciók "anonymous" felhasználóként

1.  Hírek olvasása (azonosítatlan felhasználóknak szánt hírek!) **PIPA**

2.  Bejelentkezés  **PIPA**

    ![Bejelentkezés](image_0.png)

    Az alkalmazásba Sibboleth-tel, illetve felhasználónév és jelszó páros
    megadásával lehet belépni. Sikeres azonosítás után a felhasználó számára
    betöltődik a szerepköréhez tartozó felület. Új jelszót lehet kérni, ha a
    felhasználó elfelejetette volna azt.

3.  Ha egy oldalt bejelentkezés nélkül próbálunk meg elérni, akkor
    automatikusan a bejelentkezésre irányít a felület minket.  Sikeres
    bejelentkezést követően az eredetileg megnyitott oldalra kerülünk.

4.  Ha be vagyunk jelentkezve, de nincs jogosultságunk elérni egy oldalt, akkor
    "jogosultság ellenőrzés" hibát kapunk.

5.  Ha olyan oldalt próbálunk elérni, ami nem létezik, akkor "nem létezik"
    hibát kapunk.

### Általános funkciók (bejelentkezett felhasználóként)

1.  Hírek olvasása (azonosítottaknak szánt hírek!) **PIPA**

    A hírek megjelenítésére mindenképp legyen egy dedikált külön oldal,
    menüpont.

    *(Opcionális)* Új (fontos?) hírek esetén a belépést követően jelenjen meg
    egy X-elhető popupban a legutolsó belépést követő hír vagy hírek száma egy
    figyelmeztető üzenettel, ha több ilyen volt.

2.  Kijelentkezés ![Kijelentkezés](image_20.png) **PIPA**

    - A kijelentkezéssel a felhasználónak megszűnik a session-je, azaz a
      (vissza) gomb nyomkodásával se' lehessen újra belépett állapotba kerülni.
      Az elvárás az, hogy kijelentkezés után 1 visszalépést _követően_ ne
      lehessen új, sikeresen lefutó, azonosított oldallekérést végrehajtani.

    - A kijelentkezés után a felhasználó a bejelentkezés oldalra lesz
      átirányítva.

3.  Felhasználói beállítások és adatok ![Beállítások](image_18.png)

    ![Beállítások](image_19.png)

    - Felhasználó megtekintheti saját adatait

        ...de nem módosíthatja saját nevét és neptun kódját.

    - Felhasználó módosíthatja e-mail címét

    - Amennyiben a felhasználó nem rendelkezik megadott e-mail címmel,
      bejelentkezés után erre az oldalra irányítandó.

        Ha megadta az e-mail címét, az eredetileg lekérdezett oldalra
        irányítsuk át -- ahogyan a belépésnél is.

    - Amennyiben változott a felhasználó e-mail címe, ellenőrző levél fog
      kiküldésre kerülni.

        - Az ellenőrző e-mail időkorlátos, amennyiben a felhasználó nem erősíti
          meg, az előző e-mail cím automatikusan visszaírásra kerül

        - Ellenőrző e-mail kiküldését lehet újrakérni, amennyiben az nem
          érkezett meg a felhasználónak.

        - Hibás vagy felhasznált ellenőrző token esetén dobjon a rendszer
          hibaüzenetet.

    - Felhasználó módosíthatja jelszavát az aktuális, az új illetve az új
      jelszó ellenőrzésére szolgáló ismétlés megadásával

        Erről a változtatásról mindenképp küldjünk e-mail értesítést a
        felhasználónak.

    - Felhasználó feliratkozhat levelezőlistá(k)ra

    - Felhasználó feliratkozhat e-mail alapú értesítésekre (új jegy, hír)

    - Felhasználó megadhatja a saját SSH publikus kulcsát

        Erről a változtatásról mindenképp küldjünk e-mail értesítést a
        felhasználónak.


### Admin szerepkör funkciói

![Admin szerepkör](image_1.png)

1. Felhasználóval kapcsolatos folyamatok

    1.  adott jelszó beállítása

        A jelszóval kapcsolatos ellenőrzések itt ne akadályozzanak, csak
        figyelmeztessenek.  Tehát engedje a felület beállítani az "12345678"
        jelszót is, ha azt pötyögi be az adminisztrátor.

    2.  véletlenszerű jelszó generálása

        A _jelszóval_ kapcsolatos elvárásoknak megfelelően.

        A generált jelszót írja ki a generálás során a felület.

    3.  e-mail cím manuális jóváhagyása

    4.  új felhasználó felvétele

    5.  felhasználó módosítása (naplózás!)

    6.  jogosultságok megtekintése

    7.  jogosultságok hozzáadása

    8.  jogosultságok módosítása

    9.  jogosultságok törlése

    10. keresés név alapján

    11. keresés user név alapján

    12. keresés azonosítószám alapján

    13. javító esetén a javítandó feladatok típusának beállítása

    14. felhasználó megszemélyesítése

        Ez a unixos `sudo` program webes megfelelője, azaz az
        adminisztrátoroknak megengedi azt, hogy bárki bőrébe bújva a felületen
        navigáljon és feladatokat végrehajtson.

        Az adatváltozásokat ilyenkor is naplózni kell, az eredeti és a
        megszemélyesített felhasználóval _is_ megcímkézve a módosítást.

        *(Opcionális)* A megszemélyesítési folyamat végeztével ismételt
        bejelentkezés nélkül jussunk vissza az eredeti felhasználói folyamatba.

2. Hallgatói adatok feltöltése CSV állomány segítségével

3. Mérésekkel és mérésvezetőkkel kapcsolatos folyamatok

    15. méréshelyek (csoportok) adatainak kezelése (listázás, hozzáadás,
        módosítás, törlés)

        - Törölni csak üres, jövőbeli dátumú méréshelyet lehessen!

        - Mérés téma (sql, oracle, …) megváltoztatása

        - Lehessen típust állítani, pl. "pótmérés"

        - Lehessen szabad szövegesen helyszínt állítani

        - Lehessen szabad szövegesen általános leírást állítani

    16. méréshelyek és hallgatók összerendelése

        Legyen lehetőség akár utólagos átrendezésre is, tehát előfordulhat,
        hogy utólag kell az admin rendszerben egy hallgató megbetegedését, stb.
        kezelni.

    17. méréshelyek és mérésvezetők összerendelése

        Támogassa a több--több összerendelést, ui. előfordulhat
        az, hogy egy mérést több mérésvezető tart (pl. idén a németeseknél),
        illetve az is, hogy egy mérésvezető több méréshelyért felel egyazon
        időben.

    18. méréshelyek és mérésidőpontok összerendelése

        Ez jelentheti a mérésidőpontok beállítását is (tehát nem szükséges az
        időpontokat külön relációban kezelni)

4. Feladattípusokkal kapcsolatos funkciók:

    19. feladattípus és értékelők összerendelése (több--több)

    20. feladattípus és hallgatók összerendelése

        Minden hallgatónak 1 méréshez 1 feladattípusa van, de előfordulhat,
        hogy a hallgató az év elején egy A feladattípust csinál és a pótmérés
        alkalmával egy B feladattípust kap!

5. Eredményekhez, statisztikákhoz tartozó funkciók:

    22. Részletes eredmények listázása csoportonként

    23. Részletes eredmények listázása hallgatóként

    24. Összesített eredmények listázása csoportonként

    25. Összesített eredmények listázása hallgatóként

    26. Házi feladatok esetén a feladattípusonként a nem véglegesített
        jegyzőkönyvek számának listázása javítók szerint

    27. Lezáratlan mérésjegyek számának (van jegyzőkönyvjegy, de nincs
        laborjegy) listázása mérésvezetők szerint

    28. Javítók terheltségének listázása

    29. Eredmények exportálása CSV állományba

        *(Opcionális)* Neptun export

6. Határidők:

    A szünnapok kezelését nem várjuk el a projekttől!

    30. Hallgatói jegyzőkönyvek leadásának határidejének módosítása

        - 1 konkrét hallgató, 1 konkrét határidejét is lehessen állítani,

        - 1 egész méréshely (és idő) összes hallgatójának határidejét lehessen
          módosítani,

        - lehessen globálisan állítani a jövőbeni határidőket

    31. Jegyzőkönyv értékelésének határidejének változtatása mérésenként,
        illetve globálisan

7. Jegyzőkönyvek kezelése:

    32. Jegyzőkönyv archiválása (plágiumkereséshez)

        GIT esetén is szükségünk lesz egy megoldásra, ami a plágiumkereső
        szolgáltatás által feldolgozható adatot képes exportálni az admin
        rendszerben tárolt adatokból.

8. Hírek, hirdetmények kezelése:

    33. Hírek listázása

    34. Hírek létrehozása

    35. Hírek szerkesztése

        Be lehessen állítani, hogy egy adott hír melyik szerepkörnél
        látszódjon.

    36. Hírek törlése

    37. *(Opcionális)* Hírek kezeljék a MD formátumot

9. Véglegesítés visszavonása

    38. Beugró esetén (naplózás!)

    39. Jegyzőkönyv esetén (naplózás!)

    40. Végleges jegy esetén (naplózás!)

11. SQL szkriptek futtatása (*Opcionális*, ha mindent lehet frontendről, akkor ne)

12. Beugrókkal kapcsolatos funkciók:

    41. Új kérdés hozzáadása

    42. Kérdés módosítása

    43. 4-7 darab kérdés kiválasztása és nyomtatható fájl létrehozása

#### Képernyőképek

![Statisztikák](image_2.png)

![Felhasználók keresése, áttekintése](image_3.png)

![Hír létrehozása](image_4.png)

![Hírek listázása (szerkesztése, törlése)](image_5.png)

![Mérés létrehozása](image_6.png)

![Mérések listázása](image_7.png)

![Beugró létrehozása adott laborhoz](image_8.png)

![Beugrók listája](image_9.png)


### Hallgató szerepkör funkciói

1. Saját eredmények megtekintése *PIPA*

   - *(Opcionális)* Megosztás :) -- ehhez egy stabil, szerver oldali URL,
     szerveren renderelt tartalom és pár <meta> címke kell.

2. Mérésekhez tartozó funkciók:

    1. Mérések adatainak megjelenítése

        - helyszín

        - időpont

        - laborvezetői megjegyzés -- ha van általános méréshelyet és -időpontot
          érintő megjegyzés, akkor azt is jelenítsük meg

        - mérésvezető személye

        - mérésvezető elérhetőségei (?)

    2. Jegyzőkönyv leadási határidejének megtekintése

    3. Végleges értékelésének megjelenítése

        - Beugró jegy

        - Jegyzőkönyv jegy

        - Jegyzőkönyv riport

        - Javító neve

        - Labor jegy

        - Labor riport

    4. Megjegyzések megjelenítése

    5. Git remote URL elérése

    6. Minden címke (tag) listázása az adott labor repository-jából

    7. Végleges címke (tag) beállítása végleges verziónak

        - Amennyiben lejár a határidő, a backend minden branch utolsó commitját
          tageli. Amennyiben nem jelölt meg a hallgató egyetlen egy taget se
          végleges verziónak, akkor csak a master branch commitját veszi
          figyelembe a backend, és a javító az alapján fog pontozni.

3. Kezdeti jelszavak megtekintése (rapid, Oracle DB, etc.)

    Ezeket a jelszavakat lehet cleartext tárolni.

#### Képernyőképek

![Hallgató szerepkör funkciói](image_10.png)

![Általános információk](image_11.png) / ![Megtartott, de még nem értékelt labor](image_12.png)

![Értékelt labor](image_13.png)


### Javító szerepkör funkciói

1. Mérések listázása téma (Oracle, SQL, …) szerint

2. Mérésekhez tartozó funkciók

    A listázással kapcsolatos megoldások szűrőfeltételekkel is megoldhatók, nem
    kell minden funkcióra külön oldalt, listát, stb. tervezni, megvalósítani!

    1. Jegyzőkönyvekkel kapcsolatos statisztikák, általános számok
       megjelenítése

        - jelöljük, hogy hány jegyzőkönyv vár javításra egy adott témában,

        - derüljön ki a felületen, hogy az adott javítási feladatra hány javító
          jut

    2. Javításra váró / javítás alatt lévő / kijavított / véglegesített
       jegyzőkönyvek megjelenítése

        - egyértelműen kerüljön jelölésre, ha egy jegyzőkönyv leadási
          határideje még nem járt le!

        - látszódjon, hogy határidő előtt vagy után került leadásra a listázott
          jegyzőkönyv

        - látszódjon, hogy egy jegyzőkönyvre milyen jegyet adott a javító

        - lefoglalt jegyzőkönyv esetén lehessen a listázó oldalról is
          véglegesítést kezdeményezni

    3. Jegyzőkönyv lefoglalása -- ne javítsa egyszerre két javító ugyanazt

        Addig nem szabad engedni javítani a javítót, amíg a jegyzőkönyv leadási
        határideje nem járt le!

    4. Jegyzőkönyv feloldása

        - itt kell megjeleníteni az egyes részletes adatokat: GIT repository,
          leadási határidő, megvalósult leadási idő

3. Javítandó/véglegesített jegyzőkönyvhöz tartozó funkciók

    5. Jegyzőkönyvvel kapcsolatos adatok lekérdezése

        - hallgató neve

        - hallgató neptun kódja

        - hallgató elérhetősége

        - feladattípus

        - téma

        - határidő

        - git repository, véglegesnek jelölt címkékkel

        - leadási határidő

        - leadás határideje (külön jelezve, ha határidőn túli a leadás)

        - érdemjegyek

        - Imsc pont

        - megjegyzések

    6. Érdemjegy módosítása

        Véglegesítés előtt!

    7. Megjegyzés módosítása

        Véglegesítés előtt!

    8. Megjegyzés eltávolítása

        Véglegesítés előtt!

    9. Véglegesítés

4. Más javítók által javítandó/véglegesített jegyzőkönyvhöz tartozó funckiók

    10. Jegyzőkönyvvel kapcsolatos adatok lekérdezése

        Mint fent


#### Képernyőképek

![Javító szerepkör](image_14.png)

![Javító szerepkör funkciói](image_15.png)


### Mérésvezető (demonstrátor) szerepkör funkciói

1. Laborok listázása

    1. Méréshely és idő alapján listázhatóak legyenek a mérések (laborok)

2. Laborokhoz tartozó funkciók

    2. Hallgatók listázása

        - megjelenítendő az összes elérhető jegy és pontszám

        - megjelenítendő a leadási határidő, illetve feltöltött jegyzőkönyv
          esetén annak ideje és késés esetén a késés mértéke

    3. A listában lehessen beugrójegyet módosítani

    4. A listában lehessen laborjegyet módosítani

    5. A listában lehessen egyszerre vagy egyesével véglegesíteni az egyes
       pontszámokat, jegyeket

    6. Adott méréshez helyettesítő mérésvezető rendelése önmaga helyett

        *(Opcionális)* E-mail értesítés az érintettnek

3. Méréshez (hallgatóhoz) tartozó funkciók

    7. Mérés részletes adatainak megjeleneítése

        - hallgató neve

        - hallgató neptun kódja

        - feladattípus

        - téma

        - mérés helye és ideje

        - jegyek és pontszámok

        - megjegyzések

        - git URL lekérdezése, címkékkel együtt

    8. Pontszámok, jegyek és megjegyzések véglegesítése külön-külön és együtt

    9. Labor érdemjegy módosítása

    10. Labor megjegyzésének módosítása

    11. Labor megjegyzésének törlése

    12. IMSc pontok módosítása

    13. Hallgató áthelyezése másik laborba

        - akár utólag is!

4. Beugrókkal kapcsolatos funkciók

    14. Beugrók listázása, lekérdezése

    15. Új beugró hozzáadása

    16. Beugrók szerkesztése

    17. Beugrók törlése

    18. Beugrók kiválasztása és nyomtatása

        - *(Opcionális)* ideális esetben egy PDF dokumentum lenne a jó megoldás


### Oktató szerepkör (Admin, Mérésvezető, Javító uniója ennek részhalmaza) közös funkciói

1. A https://db.bme.hu/szglab5-generator/ címen elérhető feladatlap-generátor teljes funkcionalitásának elérése

#### Képernyőképek

![Demonstrátor szerepkör funkciói](image_16.png)

![Hallgatók listája](image_17.png)
