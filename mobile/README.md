# SunPropMart Mobile Application (React Native + Expo)

Production-grade cross-platform mobile suite for **SunPropMart Real Estate & Construction**, integrating seamlessly with the same Supabase PostgreSQL backend as the web application.

## 📱 Applications Included

1. **Customer App**:
   - **Home**: Featured properties, new launches, banners.
   - **Search & Filters**: Real-time property searching by locality, type, and budget.
   - **Property Details**: High-res gallery, specifications, EMI calculator, instant enquiry.
   - **Saved / Favorites**: Offline-persisted and Supabase-synced property bookmarking.
   - **Enquiries & Visits**: Real-time status tracking of site visits and agent contact.
   - **Profile**: Customer preferences and contact details.

2. **Agent App (RBAC Protected)**:
   - **Dashboard**: Metric counts for active listings, review requests, assigned leads, and visits.
   - **Property Upload & Media**:
     - Direct camera photo capture and gallery selection with client-side image compression.
     - Video capture and document upload (PDF/DOC agreements).
     - Save as Draft or Submit for Administrative Review.
   - **Strict Agent RBAC Enforced**:
     - Direct publishing blocked (must submit for review).
     - Direct deletion blocked (must submit delete request).
     - Direct price changes blocked (must submit price change request).
   - **CRM Leads**: Strictly scoped to leads assigned to the authenticated agent.
   - **Site Visits**: Calendar and customer contact info for scheduled property inspections.

## 🚀 Running the Mobile App Locally

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code using the **Expo Go** app on iOS or Android, or press:
   - `a` to open Android Emulator
   - `i` to open iOS Simulator
   - `w` to open web preview
