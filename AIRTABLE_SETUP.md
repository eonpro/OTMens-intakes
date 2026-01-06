# Airtable Integration Setup

## Step 1: Create an Airtable Base

1. Go to [Airtable](https://airtable.com) and sign in
2. Create a new base called "EONMeds Intake"
3. Create a table called "Intake Submissions" with these fields:

### Required Fields (Core)

| Field Name | Field Type |
|------------|------------|
| Session ID | Single line text |
| First Name | Single line text |
| Last Name | Single line text |
| Email | Email |
| Phone | Phone number |
| Qualified | Checkbox |
| Submitted At | Date/Time |
| Language | Single line text |

### Personal Information Fields

| Field Name | Field Type |
|------------|------------|
| Date of Birth | Single line text |
| Sex | Single line text |
| Blood Pressure | Single line text |
| Pregnancy/Breastfeeding | Single line text |
| State | Single line text |
| Address | Long text |

### Weight & BMI Fields

| Field Name | Field Type |
|------------|------------|
| Current Weight (lbs) | Number |
| Ideal Weight (lbs) | Number |
| Height | Single line text |
| BMI | Number (decimal) |

### Goals & Activity Fields

| Field Name | Field Type |
|------------|------------|
| Goals | Long text |
| Activity Level | Single line text |

### Medical History Fields

| Field Name | Field Type |
|------------|------------|
| Chronic Conditions | Long text |
| Digestive Conditions | Long text |
| Medications | Long text |
| Allergies | Long text |
| Mental Health Conditions | Long text |
| Surgery History | Single line text |
| Surgery Details | Long text |
| Family Conditions | Long text |
| Kidney Conditions | Long text |
| Medical Conditions | Long text |
| Personal Diabetes T2 | Single line text |
| Personal Gastroparesis | Single line text |
| Personal Pancreatitis | Single line text |
| Personal Thyroid Cancer | Single line text |
| Personal MEN | Single line text |
| Has Mental Health | Single line text |
| Has Chronic Conditions | Single line text |

### GLP-1 Profile Fields

| Field Name | Field Type |
|------------|------------|
| GLP-1 History | Single line text |
| GLP-1 Type | Single line text |
| Side Effects | Long text |
| Medication Preference | Single line text |
| Semaglutide Dosage | Single line text |
| Semaglutide Side Effects | Long text |
| Semaglutide Success | Single line text |
| Tirzepatide Dosage | Single line text |
| Tirzepatide Side Effects | Long text |
| Tirzepatide Success | Single line text |
| Dosage Satisfaction | Single line text |
| Dosage Interest | Single line text |

### Lifestyle Fields

| Field Name | Field Type |
|------------|------------|
| Alcohol Consumption | Single line text |
| Recreational Drugs | Long text |
| Weight Loss History | Long text |
| Weight Loss Support | Long text |
| Health Improvements | Long text |

### Referral Fields

| Field Name | Field Type |
|------------|------------|
| Referral Sources | Long text |
| Referrer Name | Single line text |
| Referrer Type | Single line text |

### Qualification Fields

| Field Name | Field Type |
|------------|------------|
| Taking Medications | Single line text |
| Personalized Treatment Interest | Single line text |

### Consent Tracking Fields

| Field Name | Field Type |
|------------|------------|
| Privacy Policy Accepted | Checkbox |
| Privacy Policy Accepted At | Date/Time |
| Terms of Use Accepted | Checkbox |
| Terms of Use Accepted At | Date/Time |
| Telehealth Consent Accepted | Checkbox |
| Telehealth Consent Accepted At | Date/Time |
| Cancellation Policy Accepted | Checkbox |
| Cancellation Policy Accepted At | Date/Time |
| Florida Bill of Rights Accepted | Checkbox |
| Florida Bill of Rights Accepted At | Date/Time |
| Florida Consent Accepted | Checkbox |
| Florida Consent Accepted At | Date/Time |

## Step 2: Get Your Credentials

### Personal Access Token (PAT)
1. Go to https://airtable.com/create/tokens
2. Click "Create new token"
3. Give it a name (e.g., "EONMeds Intake")
4. Add scopes:
   - `data.records:read`
   - `data.records:write`
5. Under "Access", select your EONMeds Intake base
6. Click "Create token"
7. **Copy the token immediately** (starts with `pat...`) - you won't see it again!

### Base ID
1. Open your Airtable base
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXX/...`
3. The Base ID is the part starting with `app` (e.g., `appXXXXXXXXXXXXX`)

**Or:**
1. Go to https://airtable.com/developers/web/api/introduction
2. Select your base from the dropdown
3. The Base ID is shown in the documentation

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Airtable Configuration (Personal Access Token)
AIRTABLE_PAT=pat_xxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AIRTABLE_BASE_ID=appXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Intake Submissions
```

## Step 4: For Vercel Deployment

Add these environment variables in your Vercel project settings:
1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development:
   - `AIRTABLE_PAT` = your personal access token (starts with `pat...`)
   - `AIRTABLE_BASE_ID` = your base ID (starts with `app...`)
   - `AIRTABLE_TABLE_NAME` = `Intake Submissions`

## Testing

### Test API Connection
Visit: `https://your-domain.vercel.app/api/airtable/test`

This endpoint will check:
- ✓ Environment variables are set
- ✓ Connection to Airtable works
- ✓ Can read/write records
- Shows existing field names in your table

### Check API Status
Visit: `GET /api/airtable` (without any parameters)

### Troubleshooting

**Error: "Airtable not configured"**
- Verify AIRTABLE_PAT and AIRTABLE_BASE_ID are set in Vercel
- Redeploy after adding environment variables

**Error: 422 "Unknown field name"**
- The field name in the code doesn't match Airtable column name exactly
- Check for typos, spacing, and capitalization
- Add missing columns to your Airtable table

**Error: 401 "Unauthorized"**
- Personal Access Token is invalid or expired
- Token doesn't have correct scopes (needs read + write)
- Token doesn't have access to the base

**Error: 404 "Table not found"**
- AIRTABLE_TABLE_NAME doesn't match exactly
- Default is "Intake Submissions"
