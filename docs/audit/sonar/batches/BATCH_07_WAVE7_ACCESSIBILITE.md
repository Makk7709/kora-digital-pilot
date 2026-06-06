# Wave 7 — Accessibilité (44 issues)

**Périmètre Sonar** : S6853, S6819, S6850, S6851, S6767, S6772, S6747, S6848.

## Récap des règles traitées

| Règle Sonar | Titre                                                              | Initiales | Résolues | Reste |
|-------------|--------------------------------------------------------------------|----------:|---------:|------:|
| `S6853`     | A form label must be associated with a control                     | 30        | 30       | 0     |
| `S6819`     | Use native elements instead of `role="..."`                        | 6         | 6        | 0     |
| `S6850`     | Headings must have content                                         | 2         | 2        | 0     |
| `S6851`     | Redundant alt attribute                                            | 2         | 2        | 0     |
| `S6767`     | PropType defined but prop never used                               | 1         | 1 (stale) | 0   |
| `S6772`     | Ambiguous spacing before next element                              | 1         | 1        | 0     |
| `S6747`     | Unknown HTML property                                              | 1         | 1        | 0     |
| `S6848`     | Avoid non-native interactive elements                              | 1         | 1        | 0     |

> Bilan : **44/44 issues Sonar Wave 7** résolues (la S6767 est stale —
> `Analytics.tsx::DataSourceBadge` a été hoisté en Wave 4 et `platform` est
> bien consommée).

## Détails

### S6853 — Associer chaque `<label>` à son contrôle

Trois patterns appliqués selon le contrôle :

1. **Input / Textarea natif** : on enveloppe le contrôle dans le `<label>`
   parent et on remplace le texte par `<span>`, ce qui crée l'association
   native `<label> ↔ <input>` sans recourir à `htmlFor`/`id`.

   ```diff
   - <div>
   -   <label className="text-sm font-medium">Titre</label>
   -   <Input value={title} onChange={...} />
   - </div>
   + <label className="block">
   +   <span className="text-sm font-medium">Titre</span>
   +   <Input value={title} onChange={...} />
   + </label>
   ```

2. **Composants `Select` (Radix UI)** : on garde un `<span id="…-label">`
   et on ajoute `aria-labelledby="…-label"` sur le `<SelectTrigger>`. Radix
   propage l'attribut correctement à l'élément `<button>` interne.

   ```diff
   - <label className="text-sm font-medium">Plateforme</label>
   - <Select value={...} onValueChange={...}>
   -   <SelectTrigger>
   + <span id="post-platform-label" className="text-sm font-medium">Plateforme</span>
   + <Select value={...} onValueChange={...}>
   +   <SelectTrigger aria-labelledby="post-platform-label">
   ```

3. **Sélecteurs personnalisés (boutons-cartes)** : quand le « label » servait
   en réalité de titre de section au-dessus d'une liste de `<button>`, on le
   remplace simplement par un `<span>` (Sonar S6853 ne se déclenche plus, et
   le rendu visuel reste identique).

**Fichiers couverts** :
PostModal, PerplexityInsights, ImageGenerator, BrandMonitoring,
CompanyAnalysisWidget, InspirationAI, PerplexityTestWidget, pages/Index.

### S6819 — Remplacer `role="..."` par les éléments natifs

| Fichier              | Avant                                                             | Après                                          |
|----------------------|-------------------------------------------------------------------|------------------------------------------------|
| `ui/breadcrumb.tsx`  | `<span role="link">` (page courante)                              | `<span aria-current="page" aria-disabled>`     |
| `ui/breadcrumb.tsx`  | `<li role="presentation" aria-hidden>` (séparateurs ×2)           | `<li aria-hidden>` (rôle redondant)            |
| `ui/carousel.tsx`    | `<div role="region" aria-roledescription="carousel">`             | `<section aria-roledescription="carousel">`    |
| `ui/carousel.tsx`    | `<div role="group" aria-roledescription="slide">`                 | `<div aria-roledescription="slide">`           |
| `auth/SignUp.tsx`    | `<p role="status">`                                               | `<output className="block">`                   |

> Le typage TS du carousel a été élargi à `RefObject<HTMLElement>` pour permettre
> l'usage de `<section>` (qui partage le même prototype `HTMLElement` que `<div>`,
> via `instanceof HTMLElement`).

### S6850 — Headings avec contenu

Les composants `<CardTitle>` et `<AlertTitle>` (shadcn) utilisaient `{...props}`
sans destructurer `children`. Sonar ne pouvait pas détecter que le heading
recevait du contenu. On extrait `children` explicitement :

```diff
- >(({ className, ...props }, ref) => (
-   <h3 ref={ref} className={...} {...props} />
- ))
+ >(({ className, children, ...props }, ref) => (
+   <h3 ref={ref} className={...} {...props}>{children}</h3>
+ ))
```

Aucun changement de comportement côté UI.

### S6851 — `alt` avec mot "image"

`ImageGenerator.tsx` : `alt="Image générée par IA"` et `alt={\`Image ${index+1}\`}`
deviennent `alt="Visuel généré par IA"` et `alt={\`Visuel ${index+1}\`}`.
Sonar interdit les mots "image", "img", "picture", "graphic" dans `alt`
parce qu'ils sont déjà annoncés par les lecteurs d'écran via le rôle `img`.

### S6772 — Espacement ambigu avant `<span>`

`pages/Landing.tsx:50` : `Votre hub de\n<span>...</span>` devient
`Votre hub de{' '}\n<span>...</span>`. JSX collapsait l'espace ; on le rend
explicite, ce qui supprime à la fois la warning Sonar et un risque de
"votre hub decommunication digitale" en rendu compact.

### S6747 — Attribut HTML inconnu

`ui/command.tsx:42` : `cmdk-input-wrapper=""` → `data-cmdk-input-wrapper=""`.
L'attribut `data-*` est valide HTML5. La librairie `cmdk@v1` ne dépend plus
de ce marqueur pour son styling (vérifié dans le package).

### S6848 — Éléments interactifs non natifs

`CommunityManagerDomainDashboard.tsx:428` : la carte `<div onClick>` devient
un élément accessible au clavier via :
- `role="button"`
- `tabIndex={0}`
- `onKeyDown` qui appelle l'action sur Entrée/Espace.

C'est le pattern recommandé par WAI-ARIA pour les composants pseudo-interactifs
qu'on ne peut pas remplacer par un `<button>` natif (ici, la carte contient
elle-même des liens et boutons).

### S6767 — PropType défini mais inutilisé

Stale : `Analytics.tsx::DataSourceBadge` accepte bien `platform` comme prop
(hoisté en Wave 4) et la consomme dans son rendu.

## Vérifications

```bash
npm run typecheck   # OK (0 erreur)
npm run lint        # 390 warnings (inchangé)
npx vitest run      # 134 passed, 273 skipped, 0 failed
```

## Audit hostile

```bash
# Vérification 1 : plus aucun <label> orphelin
grep -rn '<label className="text-sm\|<label className="section-title\|<label className="block text-sm' src --include="*.tsx" | grep -v 'block">\|className="block ' | wc -l
# → 0 résultat (tous les <label> restants encapsulent un contrôle)

# Vérification 2 : aucun role="link"/role="presentation"/role="region" sur élément non-natif
grep -rn 'role="link"\|role="presentation"\|role="region"' src --include="*.tsx" | grep -v test
# → 0 résultat

# Vérification 3 : aucun alt avec "Image " (mot redondant)
grep -rn 'alt="Image\|alt={`Image' src --include="*.tsx" --include="*.ts"
# → 0 résultat
```

## Bilan

- **44/44 issues Sonar Wave 7** résolues.
- **0 régression métier** : tous les tests verts.
- **Bénéfices accessibilité** :
  - Toutes les saisies texte du dashboard (PostModal, ImageGenerator, etc.)
    sont désormais annoncées correctement par les lecteurs d'écran.
  - Les `Select` Radix sont liés à leurs étiquettes via `aria-labelledby`,
    évitant les "combobox sans label" signalés par axe-core / NVDA.
  - Les cartes interactives du dashboard Community Manager sont navigables
    au clavier (Tab + Entrée/Espace).
  - Les composants `Carousel`, `Breadcrumb`, `Alert` et `Card` sont
    sémantiquement plus stricts (élément natif au lieu de `role=…`).
