# 🚀 How to Publish InvestAI to Google Play Store

Since this is an AI Trading App, Google requires it to be secure. We have set up the project as a **Hybrid App** (React + Capacitor).

## Step 1: Install Mobile Dependencies
Open your terminal in this project folder and run:

```bash
# Install Capacitor (The bridge between Web and Mobile)
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize Capacitor
npx cap init InvestAI com.investai.tradingbot
```

## Step 2: Build the Web App
We need to turn your React code into static files.

```bash
# Build the project (creates a 'dist' or 'build' folder)
npm run build
```

## Step 3: Add Android Platform
This creates the actual Android Studio project folder.

```bash
npx cap add android
npx cap sync
```

## Step 4: Generate the Signed APK / Bundle
1. Download **Android Studio** (Official Google Tool).
2. Open Android Studio and select the `android/` folder inside this project.
3. Wait for Gradle to sync (it downloads required SDKs).
4. Go to **Build > Generate Signed Bundle / APK**.
5. Select **Android App Bundle (.aab)** (This is required for Play Store now, not APK).
6. Create a new **Keystore** (This is your developer signature key. Keep it safe! If you lose it, you can't update the app).
   - Password: [Create Strong Password]
   - Alias: upload
7. Click **Finish**.

## Step 5: Upload to Google Play Console
1. Go to [Google Play Console](https://play.google.com/console).
2. Create an account ($25 one-time fee).
3. Click **Create App**.
   - App Name: **InvestAI: Auto-Invest & Trading**
   - Default Language: English
   - App Type: App
   - Free/Paid: Free (or Paid if you want to sell it)
4. Go to **Production** > **Create New Release**.
5. Upload the `.aab` file you generated in Step 4.
6. Complete the **Store Listing**:
   - Upload screenshots of the Dashboard and Algo Studio.
   - Short Description: "Automated AI Trading & Secure Vault Wallet."
   - Full Description: Explain the AI Analysis, Risk Management, and Safe Mode features.
7. **Privacy Policy**: Since we use Camera (QR Code) and Finance, you MUST host a privacy policy. You can use a free generator online and paste the link.

## Step 6: Review & Publish
Click **Submit for Review**. Google usually takes 2-4 days to review financial apps.

---

### 💡 Tips for Approval
- **Disclaimer**: Ensure you have a "Disclaimer" in the app settings stating that "Trading involves risk".
- **Test Account**: If Google asks for login details, provide a demo username/password.
