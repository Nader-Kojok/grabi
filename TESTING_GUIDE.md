# Category Navigation Testing Guide

## How to Test the Implementation

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test Category Navigation from Header

**Steps:**
1. Hover over any category in the horizontal navigation bar (below the main header)
2. Wait 500ms for the mega menu to appear
3. Click on a subcategory link
4. Verify you're taken to the subcategory page with proper breadcrumbs

**Example Test:**
- Hover over "Véhicules"
- Click "Voitures" in the mega menu
- Should navigate to `/category/vehicules/voitures`
- Breadcrumb should show: Home → Véhicules → Voitures

### 3. Test Category Navigation from Categories Section

**On Homepage:**
1. Scroll down to the "Categories Section"
2. **Desktop**: Click on a category title (e.g., "VÉHICULES")
   - Should navigate to `/category/vehicules`
3. **Desktop**: Click on a subcategory link (e.g., "Voitures")
   - Should navigate to `/category/vehicules/voitures`
4. **Mobile**: Tap a category to expand it
5. **Mobile**: Tap a subcategory
   - Should navigate to the subcategory page

### 4. Test Category Page Features

**Navigate to:** `/category/vehicules`

**Verify:**
- ✅ Breadcrumb shows: Home → Véhicules
- ✅ Category icon and name displayed
- ✅ Listing count shown
- ✅ All subcategories displayed as clickable cards
- ✅ Clicking a subcategory card navigates to subcategory page
- ✅ Filter button is visible
- ✅ Sort dropdown works (Recent, Price ascending, Price descending)
- ✅ Grid/List view toggle works
- ✅ Listings are displayed (mock data)
- ✅ Each listing shows: image, title, price, location, date

### 5. Test Subcategory Page Features

**Navigate to:** `/category/vehicules/voitures`

**Verify:**
- ✅ Breadcrumb shows: Home → Véhicules → Voitures
- ✅ Parent category link in breadcrumb works
- ✅ Category icon displayed with subcategory name
- ✅ Related subcategories shown (other subcategories from Véhicules)
- ✅ Clicking related subcategory navigates correctly
- ✅ "Voir toutes les sous-catégories" link goes back to category page
- ✅ Filter and sort options work
- ✅ Grid/List view toggle works
- ✅ Listings displayed with proper formatting

### 6. Test All Categories

**Test each category URL:**
```
/category/vehicules
/category/immobilier
/category/electronique
/category/mode
/category/maison-jardin
/category/services
/category/emploi
/category/locations-vacances
/category/famille
/category/loisirs
/category/materiel-professionnel
/category/autre
```

### 7. Test Sample Subcategories

**Test various subcategory URLs:**
```
/category/vehicules/voitures
/category/immobilier/appartements
/category/electronique/ordinateurs
/category/mode/vetements
/category/maison-jardin/ameublement
/category/services/services-aux-entreprises
/category/emploi/offres-demploi
/category/locations-vacances/locations-saisonnieres
/category/famille/equipement-bebe
/category/loisirs/livres
/category/materiel-professionnel/tracteurs
/category/autre/divers
```

### 8. Test 404 Handling

**Test invalid URLs:**
- `/category/invalid-category` → Should show "Catégorie introuvable"
- `/category/vehicules/invalid-subcategory` → Should show "Sous-catégorie introuvable"
- Both should have a "Retour à l'accueil" button

### 9. Test Responsive Design

**Desktop (> 1024px):**
- Categories section shows 4-column grid
- Listings show 4 columns in grid view
- Mega menu displays properly

**Tablet (768px - 1024px):**
- Categories section shows 3-column grid
- Listings show 2-3 columns

**Mobile (< 768px):**
- Categories section shows accordion style
- Listings show single column
- All navigation works with touch

### 10. Test Navigation Flow

**Complete User Journey:**
1. Start at homepage (`/`)
2. Click "Toutes les catégories" button → Goes to `/categories`
3. From categories page, click a category → Goes to category page
4. From category page, click a subcategory → Goes to subcategory page
5. Use breadcrumbs to navigate back
6. Test header mega menu from any page
7. Verify all links work consistently

### 11. Test Interactive Elements

**Hover Effects:**
- Category cards in CategoriesSection scale on hover
- Subcategory links show underline on hover
- Listing cards show shadow increase on hover

**Transitions:**
- Mobile accordion expands/collapses smoothly
- Mega menu appears/disappears with delay
- View mode changes smoothly

### 12. Test Edge Cases

**Empty States:**
- Categories with no listings show "Aucune annonce disponible"
- "Publier une annonce" button appears in empty state

**Long Category Names:**
- Verify text doesn't overflow
- Check mobile display

**Multiple Rapid Clicks:**
- Navigation should be stable
- No duplicate pages or errors

## Expected Behavior Summary

### ✅ Working Features
- All category links in header mega menu
- All category links in CategoriesSection (desktop & mobile)
- All subcategory links throughout the app
- Breadcrumb navigation
- Category and subcategory pages display correctly
- Filter and sort UI (functionality ready for backend)
- Grid/List view toggle
- Responsive design on all screen sizes
- 404 error handling

### 🔄 Mock Data Notice
Currently using mock data from `mockCurrentListings`. The filtering is basic (matches first word of category name). Once connected to Supabase, listings will be properly filtered by actual category/subcategory fields.

## Common Issues to Check

1. **Links not working?**
   - Check that React Router is properly set up
   - Verify routes in App.tsx

2. **404 on valid category?**
   - Check slug generation in `utils/categories.ts`
   - Verify category slug matches URL

3. **Styling issues?**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting styles

4. **Icons not showing?**
   - Verify lucide-react is installed
   - Check icon imports in categories.ts

## Next Testing Phase

After backend integration:
1. Test with real database listings
2. Verify category filtering works with actual data
3. Test sorting functionality with real data
4. Test pagination (when implemented)
5. Test search within categories
