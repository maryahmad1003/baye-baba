# Katmiya — Affiche interactive "J'y serai"

Single Page Application Next.js 16 permettant aux visiteurs d'ajouter leur photo
dans l'affiche officielle de la 17ème édition de la Laylatoul Katmiya, de la
recadrer, de générer un PNG HD fidèle à la maquette, puis de le télécharger ou
le partager sur WhatsApp.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000). Aucune page d'accueil,
aucun menu : l'affiche occupe tout l'écran dès le chargement.

```bash
npm run build   # build de production (vérifié : compile sans erreur)
npm run lint    # ESLint
```

## Comment ça marche

1. **`public/assets/template.jpeg`** est l'affiche officielle complète
   (logo, portraits, textes, vagues, cercle blanc, bandeau) — **jamais modifiée**.
2. Le cercle blanc de l'affiche est la seule zone interactive
   (`src/components/Poster/PosterCanvas.tsx`). Un clic ouvre le sélecteur de
   fichier natif (`<input type="file" accept="image/*">`).
3. La photo choisie est recadrée dans une modale circulaire avec
   **React Easy Crop** (`src/components/Cropper/CropModal.tsx`).
4. À la validation, **Canvas API** compose l'image finale
   (`src/services/posterGenerator.ts`) :
   - dessine la photo de l'utilisateur avec un masque circulaire,
   - dessine par-dessus le template officiel avec un trou circulaire
     (règle `evenodd`), ce qui laisse le contour bleu/rouge/jaune du cercle
     intact et inchangé,
   - exporte un PNG HD (résolution ×2).
5. L'utilisateur peut **télécharger** le PNG ou le **partager sur WhatsApp**
   (`navigator.share` avec repli automatique sur téléchargement + `wa.me`).

## Configuration

Toutes les coordonnées (position et rayon du cercle, dimensions de l'affiche,
infos de l'événement) sont centralisées dans **`src/config/template.ts`** —
aucune coordonnée n'est codée en dur dans les composants. Pour adapter le
projet à une nouvelle affiche, il suffit de remplacer les fichiers dans
`public/assets/` et de mettre à jour ce fichier de configuration (le centre
et le rayon du cercle peuvent être retrouvés avec un simple script de
détection de zone blanche, ou mesurés dans un éditeur d'image).

## Architecture

```
src/
  app/            → layout & page (SPA)
  components/
    Poster/       → PosterCanvas (affiche + cercle), ResultOverlay (résultat)
    Cropper/      → CropModal (recadrage React Easy Crop)
  config/         → template.ts (coordonnées & constantes, seule source de vérité)
  hooks/          → useFileInput, usePosterGeneration
  services/       → posterGenerator.ts (Canvas), shareService.ts (WhatsApp)
  store/          → usePosterStore.ts (Zustand)
  types/          → types partagés
  utils/          → geometry.ts (positionnement responsive du cercle)
public/
  assets/         → template.jpeg, portrait-principal.jpeg, portrait-secondaire.jpeg,
                    logo-nouroul-bassare.png
```

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Canvas API ·
React Easy Crop · Framer Motion · Zustand · Lucide React · Sonner
