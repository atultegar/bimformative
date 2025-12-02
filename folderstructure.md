app/
 ├── (scripts)/
 │    ├── [scriptId]/
 │    │    ├── page.tsx                      # Script details / latest version
 │    │    ├── versions/
 │    │    │    ├── page.tsx                # Version list + popup
 │    │    │    ├── compare/
 │    │    │    │    ├── page.tsx           # Compare UI (final combined page)
 │    │    │    │    ├── ComparePage.tsx    # React component for compare
 │    │    │    │    └── CompareToolbar.tsx # e.g. dropdowns, actions
 │    │    │    ├── [versionNumber]/
 │    │    │    │    └── page.tsx           # Single version view
 │    │    ├── editor/
 │    │    │    ├── AnalyzeForm.tsx         # Upload + analyze UI
 │    │    │    ├── PublishForm.tsx         # Publish UI
 │    │    │    └── page.tsx                # Upload / analyze / publish workflow
 │    └── page.tsx                          # Script listing page
 │
 ├── api/
 │    ├── scripts/
 │    │    ├── analyze/route.ts             # Analyze Dynamo file
 │    │    ├── publish/route.ts             # Create script + version
 │    │    ├── set-active/route.ts          # Set active version
 │    │    └── compare/route.ts             # Used for fetching two versions
 │
 └── components/
      ├── canvases/
      │    ├── SVGCanvas.tsx                # Main D3 canvas (interactive)
      │    ├── SVGCanvasCompare.tsx         # Two-panel compare canvas
      │    └── ScriptViewCanvas.tsx         # Lightweight static renderer
      │
      ├── scripts/
      │    ├── VersionHistoryPopup.tsx      # Popup for version list + compare button
      │    └── VersionListItem.tsx
      │
      ├── compare/
      │    ├── DiffLegend.tsx               # Shows “Green = Added, Red = Removed”
      │    ├── CompareHeader.tsx
      │    └── NodeDiffSummary.tsx          # Stats: added / removed nodes
      │
      └── ui/                               # shadcn/ui wrappers
           ├── button.tsx
           ├── dialog.tsx
           ├── dropdown.tsx
           └── card.tsx

lib/
 ├── diff/
 │    ├── diffScripts.ts                    # Node diff logic
 │    ├── diffConnectors.ts                 # Future
 │    └── diffPythonNodes.ts                # Future
 ├── types/
 │    └── dynamo.ts                         # Node, Connector, PythonNode etc.
 ├── utils/
 │    ├── parseDynamoJson.ts                # Parsing logic (if needed)
 │    └── formatSlug.ts
 └── supabase/
      ├── client.ts
      └── queries.ts                         # DB queries

public/
 └── assets/                                 # Icons, placeholders

