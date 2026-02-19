## Appointment Flow - Debugging Guide

### **The Problem**
Appointments submitted via the Contact form were not appearing in the admin dashboard.

### **Root Cause Found**
The Supabase Edge Function `send-appointment-email` was **only sending emails** but **NOT inserting appointments into the database**.

**Before Fix:**
```
User Form → Edge Function → Send Email ✅ → Return Success ✅
                         ✗ No database insert → Admin Dashboard empty ❌
```

**After Fix:**
```
User Form → Edge Function → Send Email ✅ → Insert to DB ✅ → Return Success ✅
                                          → Admin Dashboard loads data ✅
```

---

### **Changes Made**

#### 1. **Edge Function Database Integration**
**File**: `supabase/functions/send-appointment-email/index.ts`

**Added:**
- Supabase client initialization with service role key
- Database insert after emails are sent successfully
- Error handling for database operations

**Key Code:**
```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

// After emails sent:
const { data: appointmentData, error: dbError } = await supabase
  .from("appointments")
  .insert([
    {
      name,
      email,
      phone,
      procedure: procedure || "General Consultation",
      preferred_date: date || null,
      message: message || null,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ])
  .select();
```

#### 2. **Admin Dashboard - Manual Refresh**
**File**: `src/admin/pages/Appointments.tsx`

**Added:**
- Refresh button to manually reload appointments
- Loading state during refresh
- Proper aria-labels for accessibility

**Key Changes:**
```typescript
const { appointments, loading, error, refreshAppointments } = useAppointments();
const [isRefreshing, setIsRefreshing] = useState(false);

// Refresh handler
onClick={async () => {
  setIsRefreshing(true);
  await refreshAppointments();
  setIsRefreshing(false);
}}
```

---

### **Testing Checklist**

**Step 1: Test the Form**
- [ ] Go to website contact form
- [ ] Fill out and submit an appointment
- [ ] Should see success toast: "We've received your appointment request"
- [ ] Check email inbox for confirmation email

**Step 2: Check Admin Dashboard**
- [ ] Log into admin panel
- [ ] Go to Appointments page
- [ ] New appointment should appear in the list
- [ ] If not visible, click the "Refresh" button to reload data
- [ ] Appointment should show with status "pending"

**Step 3: Verify Data Accuracy**
- [ ] Check all fields match what was entered in the form:
  - Name ✓
  - Email ✓
  - Phone ✓
  - Procedure ✓
  - Date (if provided) ✓
  - Message (if provided) ✓

**Step 4: Test Admin Actions**
- [ ] Click appointment to open details modal
- [ ] Change status from "pending" to "confirmed"
- [ ] Add admin notes
- [ ] Should update successfully

---

### **Potential Issues & Fixes**

#### **Issue: Appointments still not appearing**

**Possible Cause 1: Edge Function environment variable missing**
- [ ] Check Supabase project settings
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] Verify `SUPABASE_URL` is set

**Possible Cause 2: Database permissions**
- [ ] Check if RLS policies allow inserts
- [ ] Verify `appointments` table exists
- [ ] Check table structure matches schema

**Debug Steps:**
1. Open browser DevTools → Network tab
2. Submit appointment form
3. Look for `send-appointment-email` request
4. Check response body for any errors
5. Check Supabase logs:
   - Project → Edge Functions → send-appointment-email → Logs
   - Look for error messages

**Fix:** Contact support with logs if Edge Function is failing

#### **Issue: Double appointments created**
- [ ] Check if form is being submitted twice (network issue)
- [ ] Verify refresh button isn't creating duplicates
- [ ] All should be working correctly with fix

---

### **Production Deployment Checklist**

Before deploying to production:

- [ ] Test full flow locally
- [ ] Test on staging environment
- [ ] Verify emails are being sent to correct address
- [ ] Verify appointments appear in admin dashboard
- [ ] Test database contains complete data
- [ ] Verify status defaults to "pending"
- [ ] Check timestamps are correct
- [ ] Verify admin can update appointment status
- [ ] Ensure error handling works (test by removing API key)

---

### **How to Verify Fix is Working**

**Real-time dashboard updates (Future Enhancement):**
Currently, admins must click "Refresh" to see new appointments. For a better experience, we can add real-time subscriptions:

```typescript
// Future enhancement for auto-updating dashboard
useEffect(() => {
  const subscription = supabase
    .from('appointments')
    .on('*', payload => {
      console.log('New appointment:', payload);
      setAppointments(prev => [payload.new, ...prev]);
    })
    .subscribe();
  
  return () => subscription.unsubscribe();
}, []);
```

**For now:** The refresh button provides manual polling solution.

---

### **Files Modified**
1. `supabase/functions/send-appointment-email/index.ts` - Added DB insert
2. `src/admin/pages/Appointments.tsx` - Added refresh button
3. `src/admin/hooks/useAppointments.ts` - Already had refresh method

### **Files Not Modified (Working Correctly)**
- Contact form is working properly
- Email sending is working
- Admin authentication is secure
- Database schema is correct
