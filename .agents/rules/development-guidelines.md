<!-- gentle-ai:trigger-rules -->
## Development Standards & Architecture Rules

For every development, feature, refactoring, or UI task in this project:

1. **English-Only Naming Standard**: ALL components, classes, folders, files, models, variables, methods, and code identifiers MUST be named in English (e.g. `AssetInventoryComponent`, `asset-inventory.ts`, `loadAssets()`, `AssetStatus`). UI text labels may remain localized as required by business specs.
2. **Atomic Design First**: Check existing components in the atomic hierarchy (atoms, molecules, organisms, templates) before creating new ones. Ensure components are cleanly modular and reusable.
3. **Follow `src/DESIGN.md` (Carbon Enterprise System)**: Adhere strictly to the design system in [DESIGN.md](file:///src/DESIGN.md):
   - IBM Blue `#0f62fe`, `#ffffff` background, grayscale `#f4f4f4` to `#161616`, semantic colors only.
   - IBM Plex Sans typography with weight-based hierarchy.
   - 8px strict grid spacing, minimal elevation, 48px touch targets, WCAG AA compliance.
4. **Repository Pattern for APIs**: Decouple data consumption. No direct `HttpClient` calls from UI components. Use repository contracts (interfaces/tokens) and implementations with models/DTOs in English.

Refer to full specifications in [GUIDELINES.md](file:///GUIDELINES.md) and [DESIGN.md](file:///src/DESIGN.md).
