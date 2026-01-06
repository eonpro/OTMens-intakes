# Weight Loss Intake Platform - Enterprise Upgrade

## Background and Motivation

This is a **medical intake questionnaire web application** for **EONMeds/EONPro**, a telehealth platform specializing in GLP-1 weight loss medications. The application is being upgraded to enterprise-grade architecture.

### Purpose
- Collect patient demographics and contact information
- Screen for medical eligibility (BMI, medical conditions, contraindications)
- Gather medical history for licensed physician review
- Qualify patients before redirecting to checkout/payment platform
- Support bilingual experience (English/Spanish)

---

## Codebase Analysis (January 4, 2026)

### Architecture Overview

| System | Status | Description |
|--------|--------|-------------|
| **V1 (Legacy)** | ✅ ACTIVE | 60+ individual page files in `/intake/` using sessionStorage |
| **V2 (Enterprise)** | ⚠️ BUILT, NOT DEPLOYED | Configuration-driven system in `/v2/` |

### Component Usage Analysis

| Component | Import Count | Status | Notes |
|-----------|-------------|--------|-------|
| `EonmedsLogo` | 63 | ✅ Heavily used | Core branding |
| `CopyrightText` | ~20 | ✅ Used | Footer component |
| `BMIWidget` | 1 | ✅ Used | BMI result page |
| `ClientProviders` | 1 | ✅ Used | Root layout |
| `LanguageToggle` | 1 | ✅ Used | In ClientProviders |
| `IntroLottie` | 1 | ✅ Used | Landing page (dynamic) |
| `IntakePageLayout` | 1 | ⚠️ Underutilized | Only contact-info |
| `ViewportAwareLayout` | 1 | ⚠️ Underutilized | Only main page |
| `form-engine/*` | 2 | ⚠️ V2 Only | Not in production |

### Store & State Management

| System | Usage | Notes |
|--------|-------|-------|
| **sessionStorage (V1)** | All 60+ pages | Direct storage access |
| **Zustand Store (V2)** | 2 files | Only v2/page.tsx and FormStep.tsx |
| **localStorage** | Language preference | Via LanguageContext |

### V2 Enterprise System Status

| Module | File | Status |
|--------|------|--------|
| Types | `@/types/form.ts` | ✅ Complete, used by V2 |
| Validation | `@/validation/schemas.ts` | ❌ **NOT USED ANYWHERE** |
| Store | `@/store/intakeStore.ts` | ⚠️ Only V2 |
| Config | `@/config/forms/weightloss-intake.ts` | ⚠️ Partial (~15 of 60+ steps) |
| Form Engine | `@/components/form-engine/` | ⚠️ Only V2 |

---

## What's Working ✅

1. **Full V1 Intake Flow** - All 60+ pages functional
2. **Airtable Integration** - Submissions working (BMI bug fixed)
3. **Bilingual Support** - English/Spanish translations
4. **BMI Calculation** - Fixed string concatenation bug
5. **Session Persistence** - Data saved across steps
6. **Responsive Design** - Mobile/desktop layouts
7. **Progress Tracking** - Progress bar on pages
8. **Consent Management** - Checkbox tracking with timestamps
9. **Conditional Navigation** - GLP-1 history branching

---

## Cleanup Completed (January 4, 2026) ✅

| Action | Status | Details |
|--------|--------|---------|
| Remove `page-backup.tsx` | ✅ Done | Deleted duplicate file |
| Clean console.log | ✅ Done | Reduced from 28 → 3 statements |
| Remove Lottie packages | ✅ Done | Removed unused npm deps |
| Protect debug endpoints | ✅ Done | Dev-only + key protection |

---

## Issues Found (Remaining)

### 1. Unused Dependencies (package.json)
```
- @lottiefiles/dotlottie-react  ← ✅ REMOVED
- lottie-react                   ← ✅ REMOVED
- react-hook-form               ← Only in V2 (not live)
- @hookform/resolvers           ← Only in V2 (not live)
- zod                           ← Schemas defined but NEVER imported
- zustand                       ← Only in V2 (not live)
```

### 2. Backup/Dead Files
```
- src/app/intake/contact-info/page-backup.tsx  ← Duplicate backup
```

### 3. Debug/Dev Files (Consider for Production)
```
- src/app/api/airtable/test/route.ts  ← Test endpoint
- src/app/intake/debug/page.tsx       ← Debug page
```

### 4. Console.log Statements
```
Total: 28 console.log statements across 6 files
- src/lib/api.ts: 1
- src/app/intake/contact-info/page.tsx: 10
- src/app/api/airtable/route.ts: 9
- src/app/intake/review/page.tsx: 5
- src/app/intake/debug/page.tsx: 2
- src/components/IntroLottie.tsx: 1
```

### 5. Type Safety Issues
- Multiple `any` types in api.ts, debug page, store
- Loose typing in sessionStorage operations

---

## High-level Task Breakdown

### Phase 1: Foundation ✅ COMPLETED
| ID | Task | Status |
|----|------|--------|
| 1 | Install dependencies (Zod, Zustand, React Hook Form) | ✅ Complete |
| 2 | Create TypeScript types for form system | ✅ Complete |
| 3 | Create Zustand store with persistence | ✅ Complete |
| 4 | Create Zod validation schemas | ✅ Complete |
| 5 | Create form configuration system | ✅ Complete |
| 6 | Create reusable form field components | ✅ Complete |
| 7 | Create dynamic FormStep renderer | ✅ Complete |
| 8 | Create V2 test routes | ✅ Complete |

### Phase 2: Code Cleanup 🔄 IN PROGRESS
| ID | Task | Status |
|----|------|--------|
| C1 | Remove backup file (page-backup.tsx) | Pending |
| C2 | Remove/reduce console.log statements | Pending |
| C3 | Remove unused Lottie packages | Pending |
| C4 | Review debug/test endpoints for production | Pending |

### Phase 3: V2 Migration (Future)
| ID | Task | Status |
|----|------|--------|
| 9 | Complete full step configuration (60+ steps) | Pending |
| 10 | Add all conditional navigation | Pending |
| 11 | Migrate landing page to v2 | Pending |
| 12 | Add custom step components (consent, address, BMI) | Pending |
| 13 | Test full flow end-to-end | Pending |
| 14 | Connect Zod validation to form engine | Pending |

### Phase 4: Quality & Testing (Future)
| ID | Task | Status |
|----|------|--------|
| 15 | Add Vitest test framework | Pending |
| 16 | Write unit tests for store | Pending |
| 17 | Write unit tests for validation | Pending |
| 18 | Add E2E tests with Playwright | Pending |

---

## Safe Cleanup Actions

### ✅ SAFE TO REMOVE (No Impact on V1)
1. `page-backup.tsx` - Duplicate backup file
2. Unused npm packages (can reinstall if needed for V2)
3. Console.log statements (use conditional logging)

### ⚠️ KEEP FOR NOW (V2 Future Use)
1. `@/types/form.ts` - Will use when V2 goes live
2. `@/validation/schemas.ts` - Will use when V2 goes live
3. `@/store/intakeStore.ts` - Will use when V2 goes live
4. `@/config/forms/` - Will use when V2 goes live
5. `@/components/form-engine/` - Will use when V2 goes live

### ⚠️ REVIEW FOR PRODUCTION
1. `debug/page.tsx` - Remove or add auth gate
2. `api/airtable/test/route.ts` - Remove or add auth gate

---

## Project Status Board

### Production (V1)
- ✅ All intake pages working
- ✅ Airtable integration functional
- ✅ BMI calculation fixed
- ✅ Bilingual support active
- ✅ Mobile responsive

### Development (V2)
- ✅ Types defined
- ✅ Store created
- ✅ Validation schemas ready
- ⚠️ Only ~15 of 60+ steps configured
- ⚠️ Not connected to Airtable
- ⚠️ Not deployed

---

## Lessons

1. **Zustand persist middleware** - Use `partialize` to exclude actions from storage
2. **Configuration pattern** - Separate data from presentation completely
3. **Conditional navigation** - Array of rules with operator-based matching
4. **BMI Bug** - Always parseInt() height values from sessionStorage (strings!)
5. **Lottie Libraries** - iframe embeds work better than React libraries for simple use
6. **Unused dependencies** - Installed for V2 but V1 still in production

---

## SOAP Note PDF Generation Plan (January 4, 2026)

### Background & Motivation

Need to generate a **second PDF document** (SOAP Note) alongside the existing Intake Form PDF. This SOAP note is a medical document that:
- Uses the same patient data collected during intake
- Follows a standardized SOAP (Subjective, Objective, Assessment, Plan) format
- Includes provider attestation with electronic signature
- Gets uploaded to IntakeQ patient profile

### Key Requirements

1. **Same Data Source** - Uses all data from intake form (name, DOB, sex, height, weight, BMI, medical history, etc.)
2. **SOAP Format** - Structured medical document with S/O/A/P sections
3. **Provider Signature** - Include image: `https://static.wixstatic.com/media/c49a9b_4dc4d9fce65f4c2a94047782401ffe9a~mv2.png`
4. **Same UI Style** - Match the existing intake form PDF styling (Poppins font, green accents, section boxes)
5. **PDF.co Generation** - Use same API as intake form
6. **IntakeQ Upload** - Upload to "SOAP NOTES" folder on patient profile

### Implementation Plan

#### Phase 1: SOAP HTML Template
| Task | Description |
|------|-------------|
| Create `generateSoapNoteHtml()` | Function that builds HTML from patient data |
| Map intake fields to SOAP sections | Correctly place data in S/O/A/P format |
| Style matching intake form | Same CSS, fonts, colors |
| Add provider signature image | Embed in Provider Attestation section |

#### Phase 2: Airtable Script Integration
| Task | Description |
|------|-------------|
| Add SOAP PDF generation | After intake PDF, generate SOAP PDF |
| Upload to IntakeQ | Second upload call to "SOAP NOTES" folder |
| Update Airtable status | Track both PDFs |

### SOAP Note Data Mapping

| SOAP Section | Source Data Fields |
|--------------|-------------------|
| **Patient Info** | firstName, lastName, DOB, sex, state |
| **S - Subjective** | GLP-1 history, goals, activity level, symptoms |
| **O - Objective** | Height, weight, BMI, blood pressure, medical history, medications, allergies |
| **A - Assessment** | BMI classification, contraindications check, medical necessity |
| **P - Plan** | Medication recommendation based on GLP-1 type preference |
| **Provider** | Static provider info + signature image |

### BMI Classification Logic
```
BMI < 18.5 → Underweight
18.5 - 24.9 → Normal
25.0 - 29.9 → Overweight (Class 0)
30.0 - 34.9 → Obesity Class I
35.0 - 39.9 → Obesity Class II
≥ 40.0 → Obesity Class III (Morbid)
```

### Provider Information (Static)
- **Provider**: Dr. Gavin Sigle
- **NPI**: 1497917561
- **License**: FL ME145797
- **Signature**: https://static.wixstatic.com/media/c49a9b_4dc4d9fce65f4c2a94047782401ffe9a~mv2.png

### Files to Modify

1. **Airtable Automation Script** - Add SOAP PDF generation after intake PDF
2. **IntakeQ Upload** - Second upload to different folder

### Success Criteria

- [ ] SOAP PDF generates with all patient data correctly placed
- [ ] Provider signature image renders in PDF
- [ ] PDF uploads to IntakeQ "SOAP NOTES" folder
- [ ] Styling matches intake form PDF
- [ ] Both PDFs attached to same patient profile

---

## Architecture Comparison

### V1 (Current Production)
```
src/app/intake/goals/page.tsx
src/app/intake/medication-preference/page.tsx
src/app/intake/research-done/page.tsx
... 60+ more files with some repeated patterns
```

### V2 (Future - Configuration-Driven)
```
src/config/forms/weightloss-intake.ts  # All steps defined here
src/app/v2/intake/[stepId]/page.tsx    # Single dynamic route
src/components/form-engine/FormStep.tsx # Single renderer
```

**V2 Benefits:**
- Add new steps by updating config only
- Consistent behavior across all steps
- Easy A/B testing
- Reduced code duplication
- Full type safety

---

## Multi-Brand Strategy (January 5, 2026)

### Business Requirements
- **10+ treatments** planned long-term
- Some with minor tweaks, some with completely different flows
- **Same Airtable account**, different bases per brand
- **Different IntakeQ accounts** per brand
- Single maintainer (Italo)

### Chosen Approach: Clone & Customize
For now, we're using **Option 1: Clone & Customize** because:
1. Fastest time to market
2. Different IntakeQ accounts require separate API keys anyway
3. Easy to maintain when flows are identical
4. No refactoring risk to production site

### Current Project: New Brand Weight Loss Intake

**Same as EONMeds:**
- All questions and steps (identical flow)
- Airtable field structure
- IntakeQ integration logic
- PDF generation (Intake + SOAP)

**Different:**
- Brand logo
- Brand colors
- Domain/URL
- IntakeQ API key (different account)
- Airtable base (new base, same account)
- Favicon & OG image

---

## New Brand Setup Checklist

### Phase 1: Repository Setup
| Task | Details | Status |
|------|---------|--------|
| Clone repo | `git clone weightlossintake [newbrand]intake` | Pending |
| Create new GitHub repo | Under eonpro org or new org | Pending |
| Push to new remote | Set new origin | Pending |

### Phase 2: Brand Assets (Need from client)
| Asset | Specs | Status |
|-------|-------|--------|
| Logo | PNG with transparency, ~300px wide | Pending |
| Favicon | PNG, 32x32 or 64x64 | Pending |
| OG Image | JPG, 1200x630 for social sharing | Pending |
| Primary Color | Hex code (replaces #9fe870 green) | Pending |
| Secondary Color | Hex code if needed | Pending |
| Brand Name | For copy/metadata | Pending |

### Phase 3: Code Updates
| File | Changes | Status |
|------|---------|--------|
| `src/app/layout.tsx` | metadataBase, title, favicon, OG image | Pending |
| `src/components/EonmedsLogo.tsx` | New logo image URL | Pending |
| `src/app/globals.css` | Brand colors (search/replace hex) | Pending |
| `src/app/page.tsx` | Landing page images if needed | Pending |
| `src/components/CopyrightText.tsx` | Company name if different | Pending |

### Phase 4: Backend Setup
| Task | Details | Status |
|------|---------|--------|
| Create Airtable base | Clone "Intake Submissions" structure | Pending |
| Get IntakeQ API key | From new IntakeQ account | Pending |
| Create Vercel project | Deploy with new domain | Pending |
| Set environment variables | AIRTABLE_*, INTAKEQ_API_KEY, PDFCO_API_KEY | Pending |
| Create Airtable automation | Clone existing script, update table/keys | Pending |

### Phase 5: Testing
| Test | Status |
|------|--------|
| Full intake flow | Pending |
| Airtable submission | Pending |
| IntakeQ client creation | Pending |
| Intake PDF generation & upload | Pending |
| SOAP PDF generation & upload | Pending |
| Mobile responsiveness | Pending |
| Both languages (EN/ES) | Pending |

---

## Color Replacement Guide

When updating brand colors, search and replace these EONMeds values:

| Element | Current EONMeds Color | Replace With |
|---------|----------------------|--------------|
| Primary Green | `#9fe870` | New primary |
| Primary Green Alt | `#f0feab` | New primary light |
| Button Hover | `#8fd960` | New primary dark |
| Progress Bar | `#f0feab` | New primary light |
| Checkmarks | `#9fe870` | New primary |
| BMI Approved | `#1dd1a1` | New accent (or keep) |

Files with brand colors:
- `src/app/globals.css` - Global styles
- `src/components/BMIWidget.tsx` - BMI indicator
- `src/app/intake/bmi-result/page.tsx` - BMI result page
- Various `/intake/` pages - Progress bars, buttons

---

## Executor Notes

When creating new brand:
1. Ask for brand assets FIRST before coding
2. Use search/replace for color changes (safer than manual)
3. Test IntakeQ connection before full flow test
4. Verify Airtable field names match exactly
5. Keep SOAP PDF provider info same (Dr. Sigle) unless specified
