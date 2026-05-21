# Copa Cadete Preferente – Dashboard

Dashboard interactivo de la Copa Cadete Preferente Grupo 1, Tenerife 2025-2026.

## Estructura del proyecto

```
copa-cadete/
├── api/
│   └── data.py                  ← Función serverless: lee el Excel y devuelve JSON
├── public/
│   ├── index.html               ← Dashboard (carga datos desde la API)
│   └── data/
│       └── CopaCadetePref_Dashboard.xlsx  ← ⬅️ ACTUALIZA ESTE ARCHIVO
├── requirements.txt             ← openpyxl (dependencia Python)
├── vercel.json                  ← Configuración Vercel
└── .gitignore
```

## Despliegue en Vercel (primera vez)

1. Sube esta carpeta a GitHub (repo público o privado)
2. Ve a [vercel.com](https://vercel.com) → **Add New Project** → elige tu repo
3. Vercel detecta automáticamente el `vercel.json` → pulsa **Deploy**
4. En ~60 segundos tendrás tu URL: `https://copa-cadete.vercel.app`

## 🔄 Cómo actualizar los datos con el Excel

### Opción A — GitHub Web (más fácil, sin instalar nada)
1. Ve a tu repo en github.com
2. Navega a `public/data/`
3. Haz clic en `CopaCadetePref_Dashboard.xlsx`
4. Pulsa el ícono del lápiz ✏️ → **"Upload files"** → arrastra tu Excel actualizado
5. Pulsa **Commit changes**
6. Vercel redespliega automáticamente en ~30 segundos ✅

### Opción B — GitHub Desktop (más cómodo si lo usas frecuentemente)
1. Actualiza el Excel en tu carpeta local
2. Abre GitHub Desktop → verás el archivo cambiado
3. Escribe un mensaje → **Commit to main** → **Push origin**
4. Vercel redespliega solo ✅

### Opción C — Git por terminal
```bash
git add public/data/CopaCadetePref_Dashboard.xlsx
git commit -m "Actualizar datos Copa"
git push
```

## Qué pasa cuando actualizas el Excel

El flujo completo es:
```
Tú subes Excel → GitHub → Vercel redespliega → 
Alguien abre el dashboard → fetch('/api/data') → 
api/data.py lee el Excel → devuelve JSON → 
El dashboard actualiza tablas y gráficos automáticamente
```

Si la API no está disponible (modo offline), el dashboard usa los datos
embebidos en el HTML como respaldo.

## Añadir resultados futuros

Tienes dos opciones:
- **En el Excel**: añade filas en la hoja "⚽ Resultados 16avos" o "🔜 Octavos de Final"
  y sube el Excel actualizado → el dashboard se actualiza al recargar
- **En el dashboard**: usa la pestaña "➕ Agregar Resultado" para resultados rápidos
  (se guardan en el navegador del usuario con localStorage)
