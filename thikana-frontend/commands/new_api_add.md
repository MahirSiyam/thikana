You are working inside the existing `thikana-frontend` project.

The project is named **Thikana**. It is a rental-house and local-service platform.

The current development phase is:

* Static frontend UI
* Working Next.js routes
* Responsive implementation
* Local typed mock data where necessary
* No backend or real API integration

The Cursor editor already has access to a configured **Figma MCP server**.

Use the available Figma MCP tools to inspect the supplied Figma design directly before writing or modifying code.

# Page information

Page name: `[browse home]`

Route: `[/browse-home]`

Feature directory: `[browse home]`

Examples:

```text
Page name: Browse Houses
Route: /houses
Feature directory: src/features/houses
```

# Figma information

Figma URL:

```text
[https://www.figma.com/design/EW07GuYDSK3Gj5xYxZedIY/Untitled?node-id=27-347&t=VgiGC82LBrtf8dWj-1]
```

Figma page name, frame name or node ID, when known:

```text
[browse home]
```

The supplied Figma frame is the primary visual source of truth for this page.

# Primary objective

Implement the supplied Figma page as accurately as practical inside the existing Thikana frontend architecture.

The implementation must:

* Match the supplied Figma frame
* Use the existing Next.js App Router architecture
* Use TypeScript
* Use Tailwind CSS
* Be responsive
* Preserve existing global layout and design conventions
* Keep the route working
* Remain ready for future backend integration

Do not invent a different design.

Do not create backend functionality.

# Mandatory Figma MCP workflow

Before editing any file, use the configured Figma MCP server to inspect the supplied Figma URL.

Complete the following investigation first:

1. Open the exact Figma file, page, frame or node from the supplied URL.

2. Confirm that the inspected frame matches:

```text
Page name: [PAGE NAME]
Route: [ROUTE]
```

3. Inspect the complete frame hierarchy and identify:

* Main page sections
* Component groups
* Auto-layout direction
* Frame width and height
* Desktop layout
* Mobile layout, when available
* Container width
* Grid structure
* Column count
* Gaps
* Padding
* Section spacing
* Alignment
* Component dimensions
* Image dimensions
* Image aspect ratios
* Border radius
* Border thickness
* Shadow values
* Background colors
* Text colors
* Font families
* Font sizes
* Font weights
* Line heights
* Letter spacing
* Button states
* Form-control states
* Icons
* Repeated card variants
* Hidden or conditional elements

4. Inspect reusable Figma components and variants used by the frame.

5. Inspect desktop and mobile frames separately when both are available.

6. Retrieve a visual preview or screenshot of the exact target frame through the available MCP capability when possible.

7. Inspect all design assets used in the target frame, including:

* Logos
* House images
* Service images
* Illustrations
* Background images
* SVG icons
* Decorative graphics

8. Do not rely only on a Figma-generated code snippet.

Use Figma as the visual and measurement source, but implement the page according to the existing project architecture and coding conventions.

9. Do not begin implementation until the target frame and its main sections have been clearly identified.

If the Figma URL points to an entire file instead of a specific frame, locate the frame matching `[PAGE NAME]` before implementing.

# Before editing the project

Inspect the existing codebase and identify:

* Existing `src/app` structure
* Existing website route group
* Existing root layout
* Existing website layout
* Existing header
* Existing footer
* Existing mobile navigation
* Existing shared components
* Existing UI components
* Existing feature folders
* Existing design tokens
* Existing CSS variables
* Existing typography configuration
* Existing route configuration
* Existing navigation configuration
* Existing image organization
* Existing installed packages

Reuse suitable existing code.

Do not create a duplicate component when an existing component can be extended through a clear prop or variant.

Do not modify unrelated completed pages.

Do not replace the existing project architecture.

# Existing technology requirements

Use the project's existing:

* Next.js App Router
* TypeScript
* Tailwind CSS
* `src` directory
* `@/*` import alias

Do not migrate the project to:

* Vite
* Pages Router
* JavaScript
* Bootstrap
* Material UI
* styled-components
* Another CSS framework
* Another routing system

Do not install a new package unless it is genuinely required to reproduce an important Figma interaction and there is no clean solution using the existing stack.

# Required route architecture

Create or update the page route inside:

```text
src/app/(website)/[route]/page.tsx
```

Examples:

```text
src/app/(website)/houses/page.tsx
src/app/(website)/services/page.tsx
src/app/(website)/about/page.tsx
```

For a dynamic house-details route, use:

```text
src/app/(website)/houses/[slug]/page.tsx
```

For a dynamic service-details route, use:

```text
src/app/(website)/services/[slug]/page.tsx
```

Keep `page.tsx` concise.

The route file should mainly:

* Define page metadata when necessary
* Import the main feature-level page component
* Pass route parameters when necessary
* Compose the page

Do not place the entire page implementation inside `page.tsx`.

# Feature architecture

Place page-specific components inside:

```text
[FEATURE DIRECTORY]/components/
```

Examples:

```text
src/features/home/components/
src/features/houses/components/
src/features/services/components/
```

Place typed static sample data inside:

```text
[FEATURE DIRECTORY]/data/
```

Place feature-specific TypeScript types inside:

```text
[FEATURE DIRECTORY]/types/
```

Only create `data`, `types`, `utils` or another subdirectory when the current page genuinely requires it.

Do not create empty directories.

# Component-placement rules

Generic reusable controls belong inside:

```text
src/components/ui/
```

Examples:

```text
Button.tsx
Input.tsx
Select.tsx
Badge.tsx
Modal.tsx
```

Cross-page Thikana components belong inside:

```text
src/components/shared/
```

Examples:

```text
Container.tsx
SectionHeading.tsx
PageHeader.tsx
Breadcrumb.tsx
Pagination.tsx
EmptyState.tsx
```

Website-level layout components belong inside:

```text
src/components/layout/
```

Examples:

```text
SiteHeader.tsx
SiteFooter.tsx
MobileNavigation.tsx
```

Page-domain components belong inside:

```text
src/features/<feature-name>/components/
```

Do not split every wrapper into a separate component.

Create a component when it represents:

* A meaningful page section
* A reusable visual pattern
* A repeated card
* A self-contained interaction
* A clearly separated business concept

Avoid one oversized component containing the entire page when the Figma frame has multiple meaningful sections.

# Figma implementation rules

Follow the supplied Figma design precisely.

Match:

* Section ordering
* Page hierarchy
* Content hierarchy
* Text wording
* Typography
* Font sizes
* Font weights
* Line heights
* Letter spacing
* Colors
* Backgrounds
* Gradients
* Spacing
* Padding
* Gaps
* Container widths
* Card widths
* Card heights
* Image ratios
* Border radius
* Borders
* Dividers
* Shadows
* Icons
* Alignment
* Grid layout
* Button dimensions
* Form-control dimensions
* Desktop composition
* Mobile composition

Preserve the exact text shown in Figma.

Do not add content that does not appear in the supplied design.

Do not add:

* New sections
* Extra cards
* Extra statistics
* Extra buttons
* Extra badges
* Extra labels
* Extra icons
* Extra navigation items
* Decorative objects not present in Figma
* Marketing copy not present in Figma

Do not remove an element from the Figma design without a clear technical reason.

Do not redesign the Thikana logo.

Do not recolor or recreate the logo when the original asset exists.

# Figma asset handling

Use the Figma MCP server to identify and retrieve the exact assets used in the target frame when possible.

Store local page assets inside:

```text
public/images/<feature-name>/
```

Examples:

```text
public/images/home/
public/images/houses/
public/images/services/
```

Use descriptive filenames, such as:

```text
hero-apartment-building.webp
featured-house-dhanmondi.webp
electrician-service-card.webp
thikana-logo.svg
```

Do not use vague filenames such as:

```text
image1.png
img2.png
asset-final.png
new-image.png
```

Do not hotlink temporary Figma asset URLs inside production components.

Do not use unrelated placeholder or stock images when the correct Figma asset is available.

Do not export the same asset multiple times under different filenames.

Preserve:

* Original aspect ratio
* Crop position
* Object-fit behavior
* Transparency
* Visual quality

Use Next.js `Image` when appropriate.

Always provide:

* Width and height, or
* A correctly constrained `fill` container
* Meaningful `alt` text

For decorative images, use an empty alt attribute when appropriate:

```tsx
alt=""
```

For SVG icons:

* Reuse an existing project icon when it matches the Figma icon accurately
* Use an already-installed icon library only when it is already part of the project
* Otherwise use the exact Figma SVG asset
* Do not install a large icon library for one icon
* Do not manually redraw complex Figma icons with inaccurate CSS

# Typography rules

Inspect the font used in the Figma frame.

Before adding or changing fonts:

1. Check whether the project already uses that font.
2. Check the existing Next.js font configuration.
3. Reuse the existing font when it matches.
4. Avoid adding duplicate font configuration.
5. Do not create random local font files.
6. Do not install an unnecessary font package.

If the exact Figma font is unavailable in the project, use the closest existing project font and mention the mismatch in the final chat summary.

Do not silently replace a distinctive display font with an unrelated default font.

# Design-token rules

Reuse existing CSS variables and Tailwind theme values.

For repeated values found in Figma, prefer consistent design tokens for:

* Brand colors
* Text colors
* Muted colors
* Background colors
* Surface colors
* Border colors
* Radius values
* Shadow values
* Container width
* Section spacing

Do not spread the same arbitrary hex value across many files.

Do not add a new global design token for a value used only once.

Do not rewrite the entire global design system for one page.

# Responsive requirements

The implementation must work at approximately:

```text
375px mobile
768px tablet
1024px laptop
1440px desktop
```

When the Figma file contains separate desktop and mobile frames, treat both as sources of truth.

Do not make the mobile version by simply shrinking the desktop layout.

Implement appropriate:

* Column changes
* Grid changes
* Stacking
* Wrapping
* Content reordering
* Mobile-specific spacing
* Responsive typography
* Touch-friendly controls
* Mobile navigation behavior
* Filter-panel behavior
* Image cropping
* Horizontal scrolling only when shown in Figma
* Overflow prevention

No page element should unintentionally overflow the viewport.

Avoid fixed widths that break smaller screens.

Use appropriate Tailwind breakpoints based on the design rather than automatically adding every breakpoint.

# Static-data rules

Use typed local mock data when the design contains repeated content such as:

* Houses
* Services
* Categories
* Testimonials
* Amenities
* Gallery images
* Filter options
* Related listings

Do not manually duplicate large JSX blocks.

Example:

```tsx
{houses.map((house) => (
  <HouseCard key={house.id} house={house} />
))}
```

Keep feature-specific mock data inside:

```text
[FEATURE DIRECTORY]/data/
```

Keep feature-specific interfaces inside:

```text
[FEATURE DIRECTORY]/types/
```

Avoid `any`.

Mock data should be realistic but clearly local and static.

Do not create fake API request functions.

# Link and route rules

Use Next.js `Link` for internal navigation.

Use stable readable slugs.

Examples:

```text
/houses/modern-family-apartment-dhanmondi
/houses/furnished-flat-uttara
/services/ac-repair
/services/home-cleaning
```

Every internal link rendered by the requested page must point to:

* An existing valid route, or
* A route explicitly created as part of the requested implementation

Do not create unrelated placeholder pages simply to satisfy navigation.

When a destination has not been implemented and is outside the current scope:

* Do not add the link, or
* Keep the element visually present as a non-navigation button when that accurately reflects the current phase

Do not use `href="#"`.

# Interaction rules

Implement frontend-only interactions shown or clearly implied by Figma, such as:

* Mobile navigation opening
* Filter drawer opening
* Dropdown opening
* Tab switching
* Accordion opening
* Gallery image selection
* Modal opening
* Search-field input
* Sort selection
* Carousel controls
* Favorite visual state
* Show-more expansion

Do not add:

* Real API requests
* Fake API requests
* Fake authentication
* Fake database operations
* Fake payment behavior
* Fake success messages
* Fake submission confirmation
* Fake server-side mutations

Use `"use client"` only in the smallest component requiring:

* State
* Effects
* Browser APIs
* Event handlers
* Interactive UI behavior

Keep the rest as Server Components.

# Code-quality rules

Use:

* TypeScript
* Descriptive component names
* Descriptive prop names
* `@/*` imports
* Semantic HTML
* Accessible form labels
* Accessible button labels
* Visible keyboard focus
* Correct heading hierarchy
* Buttons for actions
* Links for navigation

Avoid:

* `any`
* Duplicated constants
* Duplicated card markup
* Deeply nested JSX
* Vague component names
* Unnecessary wrappers
* Inline styles without a strong reason
* Unnecessary `"use client"`
* Suppressed TypeScript errors
* Suppressed ESLint errors
* Unnecessary barrel `index.ts` files

Do not add `eslint-disable` unless it is absolutely necessary and technically justified.

Do not perform unrelated dependency upgrades.

# Naming conventions

Use PascalCase for component filenames:

```text
HouseCard.tsx
HouseGrid.tsx
HousesPageHeader.tsx
ServiceCategoryCard.tsx
```

Use camelCase for:

* Functions
* Variables
* Props
* Data constants

Use kebab-case for route folders.

Avoid filenames such as:

```text
Component.tsx
Section.tsx
Data.ts
Helper.ts
NewPage.tsx
FinalPage.tsx
Design.tsx
FigmaPage.tsx
```

# Strict file-generation restrictions

Do not create:

* README.md
* AGENTS.md
* CLAUDE.md
* CHANGELOG.md
* Documentation files
* Architecture documentation
* Setup documentation
* Progress reports
* Implementation reports
* Task reports
* Markdown files
* Text reports
* Test files
* Storybook files
* Backend files
* API files
* Database files
* Authentication files
* Docker files
* CI/CD files
* Environment files
* Empty directories
* Unused components
* Duplicate components
* Duplicate assets
* Unrequested pages
* Temporary Figma inspection files
* Screenshot comparison files
* Generated design-spec files

Do not save Figma inspection results as documentation.

Use the Figma information only to implement the requested page.

# Scope protection

Only implement:

* The requested route
* Components required by the requested route
* Static data required by the requested route
* Types required by the requested route
* Assets required by the requested route
* Shared-component changes directly required by the Figma design
* Route configuration updates directly required by the page
* Navigation updates directly required by the page

Do not:

* Redesign unrelated pages
* Rewrite the existing homepage unless it is the requested page
* Replace the existing architecture
* Modify backend directories
* Add future dashboard pages
* Add authentication flows
* Add backend preparation files
* Refactor unrelated working code
* Rename unrelated files
* Delete existing working assets

# Implementation process

Follow this sequence:

1. Inspect the target Figma frame through MCP.
2. Inspect the existing project architecture.
3. Identify reusable components and design tokens.
4. Break the Figma frame into meaningful sections.
5. Determine required assets.
6. Implement the route.
7. Implement feature-level components.
8. Add typed mock data only when needed.
9. Add responsive behavior.
10. Compare the implementation against the Figma frame.
11. Correct visible spacing, typography, sizing and alignment differences.
12. Run validation commands.
13. Fix issues introduced by the implementation.

Do not stop after creating only an approximate skeleton.

Complete the requested page as closely as practical.

# Visual comparison requirement

After the first implementation pass:

1. Re-open or re-inspect the target Figma frame through MCP.
2. Compare the implemented page against it.
3. Review at minimum:

* Header spacing
* Main container width
* Section order
* Section padding
* Typography
* Card dimensions
* Image crops
* Button dimensions
* Border radius
* Colors
* Footer spacing
* Mobile stacking
* Overflow

4. Fix significant differences before completing the task.

Do not change the design merely because another layout appears subjectively better.

# Validation

After implementation:

1. Run the existing lint command.
2. Run the production build command.
3. Fix errors introduced by the implementation.
4. Verify that `[ROUTE]` loads successfully.
5. Verify all internal links rendered by the page.
6. Verify desktop layout.
7. Verify tablet layout.
8. Verify mobile layout.
9. Check for horizontal overflow.
10. Check for missing image dimensions.
11. Check for broken image paths.
12. Check for TypeScript errors.
13. Check for ESLint errors.
14. Check that no unnecessary package was installed.
15. Check that no documentation or report file was generated.
16. Check that no unrelated existing page was modified.

# Final Cursor response

At the end, respond only with a concise chat summary containing:

* Figma frame inspected
* Route implemented
* Main components created
* Existing components reused
* Assets added
* Files created
* Files modified
* Responsive states completed
* Lint result
* Production build result
* Any Figma asset, font or interaction that could not be reproduced exactly

Do not create a summary file.

Do not create any Markdown, text, documentation or report file for the summary.
