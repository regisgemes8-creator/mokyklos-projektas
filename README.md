# Mandagiai — AI website

Pilnas, responsyvus lietuviškas puslapis, padedantis mandagiai atsisakyti. Projektas turi frontend, Node.js API serverį ir AI integraciją per oficialų OpenAI JavaScript SDK.

## Kas jau paruošta

- Svetainės dizainas kompiuteriui ir telefonui.
- Interaktyvus atsakymų generatorius su trimis atsakymo variantais.
- Pavyzdžiai, kuriuos paspaudus užpildoma forma.
- Kopijavimo mygtukai.
- Pavyzdinis režimas, veikiantis ir be API rakto (atsakymai yra šablonai, ne tikras AI).
- Serverio API, pagrindinė įvesties validacija, saugumo antraštės ir užklausų ribojimas.
- API raktas laikomas serverio `.env` faile — jis nepateikiamas naršyklei.

## Ko reikia

- Node.js 20 arba naujesnės versijos.
- OpenAI API raktas, jei nori tikro AI generatoriaus. API naudojimas apmokestinamas atskirai nuo ChatGPT plano; patikrink savo API paskyros atsiskaitymo ir limitų nustatymus.

## Kaip paleisti savo kompiuteryje

1. Išarchyvuok `mandagiai-ai-website.zip`.
2. Atidaryk išarchyvuotą aplanką terminale (Windows: PowerShell, macOS/Linux: Terminal).
3. Įdiek priklausomybes:

   ```bash
   npm install
   ```

4. Nukopijuok `.env.example` į naują failą, pavadintą `.env`.

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   macOS/Linux:

   ```bash
   cp .env.example .env
   ```

5. Atidaryk `.env` ir pakeisk `your_api_key_here` savo API raktu. Jei nori pradžioje išbandyti tik dizainą, palik šią reikšmę nepakeistą — svetainė veiks pavyzdiniu režimu.

   ```env
   OPENAI_API_KEY=įrašyk_savo_API_raktą
   OPENAI_MODEL=gpt-6-luna
   PORT=3000
   ```

   Jei tavo API paskyroje pasirinktas modelis neprieinamas, `.env` faile pakeisk `OPENAI_MODEL` į modelį, prieinamą tavo paskyrai.

6. Paleisk svetainę:

   ```bash
   npm start
   ```

7. Naršyklėje atidaryk `http://localhost:3000`.

Svarbu: nedaryk dvigubo paspaudimo ant `index.html`. Atidaryk svetainę per veikiančią Node.js programą, kad veiktų `/api/generate` API adresas.

## Kaip publikuoti internete

Pasirink hostingo paslaugą, palaikančią Node.js serverius (ne vien statinių HTML failų talpinimą). Įkelk projekto failus, paleisk `npm install`, nustatyk starto komandą `npm start` ir hostingo aplinkos kintamuosiuose pridėk `OPENAI_API_KEY`, `OPENAI_MODEL` ir, jei reikia, `PORT`. Dauguma hostingo platformų portą pateikia automatiškai.

**Niekada nekelk `.env` failo į viešą GitHub saugyklą ir neįrašyk API rakto į `public/app.js`.** `.gitignore` jau išskiria `.env` ir `node_modules`.

## API

- `GET /api/status` — patikrina, ar įjungtas demo, ar gyvo AI režimas.
- `POST /api/generate` — priima JSON laukus `request`, `relationship`, `channel`, `tone`, `reason` ir grąžina `gentle`, `balanced`, `firm`, `tip`.

## Prieš viešą paleidimą

Tai yra veikiantis pradinis projektas, bet ne pilna gamybinė platforma. Viešam paleidimui rekomenduojama pridėti stebėseną, atskirus API išlaidų limitus, testus, privatumo politiką, naudojimo sąlygas ir pritaikytą klaidų registravimą. Neprašyk lankytojų įrašyti jautrios asmeninės informacijos.
