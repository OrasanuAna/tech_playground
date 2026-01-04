# HTML5 Tech Playground (Proiect semestrial)

Acest mini-proiect adună într-un singur loc **câte un exemplu funcțional** pentru:
- Canvas 2D
- Canvas 3D (WebGL)
- Drag & Drop
- ContentEditable
- Audio + Video (cu VTT subtitles)
- SVG (inline + interacțiune)
- Web Workers
- Geolocation + History (pushState)
- SSE (Server-Sent Events) – necesită server PHP

## Cum rulezi
1. Deschide folderul în VS Code
2. Rulează cu **Live Server** (sau `npx http-server`)  
   ⚠️ Workers și unele API-uri nu merg din `file://`.

## Structură
- `index.html` – meniu către demo-uri
- `css/styles.css` – stiluri simple
- `modules/*.html` – pagini demo
- `js/*.js` – logica pentru fiecare demo
- `assets/` – imagini + media
- `sse/sse_script.php` – server SSE (PHP)

## Mapare către laboratoare (orientativ)
- Lab 1: Canvas 2D + exemple de desen
- Lab 2: Drag&Drop + contenteditable + history
- Lab 3: Multimedia + localStorage + SVG
- Lab 4: Geolocation + WebWorkers + SSE