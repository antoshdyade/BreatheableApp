import React, { useState } from 'react';
import { AppStorage } from '../utils/appStorage';
import { Download, FileText, CheckCircle, Shield, Copy, FolderDown, Smartphone, Image, Package, Sparkles } from 'lucide-react';

export const AndroidExportHub: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = AppStorage.exportJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BreatheLife-DataBackup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const gradleBuildCommands = `# 1. Clean and build the native Android Studio project
./gradlew clean

# 2. Build Debug APK (For local test installation)
./gradlew assembleDebug
# Generated output: app/build/outputs/apk/debug/BreatheLife-debug.apk

# 3. Build Signed Release APK (For direct APK distribution)
./gradlew assembleRelease
# Generated output: app/build/outputs/apk/release/BreatheLife-release.apk

# 4. Build Signed Android App Bundle (AAB for Google Play Store Publishing)
./gradlew bundleRelease
# Generated output: app/build/outputs/bundle/release/BreatheLife-release.aab`;

  const keystoreCommands = `# Generate a secure 4096-bit RSA release signing key
keytool -genkeypair -v \\
  -keystore breathelife-release.jks \\
  -keyalg RSA \\
  -keysize 4096 \\
  -validity 10000 \\
  -alias breathelife`;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-800 dark:text-slate-100">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-6 md:p-8 rounded-3xl border border-teal-800/40 shadow-xl">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
          <CheckCircle size={16} /> Official Deliverables & Download Center
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">
          Download APK & Google Play Publishing Package
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          The installable Android packages, official store graphic assets (512x512 app icon, 1024x500 feature graphic, 6 high-res phone screenshots), complete Jetpack Compose source project, and submission documents are ready for immediate download.
        </p>
      </div>

      {/* DIRECT DOWNLOAD CARDS (Requested by User) */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Package size={16} className="text-teal-600" /> One-Click Download Packages (Direct in Code Explorer)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Debug APK */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-teal-500 transition-all">
            <div>
              <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <Smartphone size={22} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Debug APK</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Install directly on any Android smartphone or tablet for immediate testing.
              </p>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                release/BreatheLife-debug.apk
              </div>
            </div>
            <a
              href="/release/BreatheLife-debug.apk"
              download="BreatheLife-debug.apk"
              className="mt-4 w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs text-center shadow-md shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Download size={14} /> Download APK (Debug)
            </a>
          </div>

          {/* Release APK */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-teal-500 transition-all">
            <div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Shield size={22} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Release APK</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Signed production APK configured with release manifest & optimization rules.
              </p>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                release/BreatheLife-release.apk
              </div>
            </div>
            <a
              href="/release/BreatheLife-release.apk"
              download="BreatheLife-release.apk"
              className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs text-center shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Download size={14} /> Download APK (Release)
            </a>
          </div>

          {/* Play Store Assets Pack */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-teal-500 transition-all">
            <div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Image size={22} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Store Graphics (.ZIP)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                512x512 app icon, 1024x500 feature graphic, and 6 high-res phone screenshots.
              </p>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                play-store-assets/ (1.06 MB)
              </div>
            </div>
            <a
              href="/release/BreatheLife-play-store-assets.zip"
              download="BreatheLife-play-store-assets.zip"
              className="mt-4 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs text-center shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Download size={14} /> Download Graphics ZIP
            </a>
          </div>

          {/* Android Studio Source Project ZIP */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-teal-500 transition-all">
            <div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <FolderDown size={22} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Android Studio Project</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Full Kotlin source, Room DB DAOs, Compose UI views, and Gradle build scripts.
              </p>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                android-project/
              </div>
            </div>
            <a
              href="/release/BreatheLife-android-project-source.zip"
              download="BreatheLife-android-project-source.zip"
              className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Download size={14} /> Download Source ZIP
            </a>
          </div>
        </div>
      </div>

      {/* Grid of Key Technical Configurations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Android Build Commands */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderDown size={18} className="text-teal-600 dark:text-teal-400" />
                Gradle Release Commands
              </h3>
              <button
                onClick={() => handleCopy(gradleBuildCommands, 'gradle')}
                className="text-xs font-semibold flex items-center gap-1 text-slate-500 hover:text-teal-600"
              >
                {copied === 'gradle' ? 'Copied!' : <><Copy size={14} /> Copy</>}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Open the project in Android Studio or run directly via command line in any Linux/macOS/Windows environment:
            </p>
            <pre className="text-[11px] font-mono bg-slate-950 text-emerald-400 p-4 rounded-xl overflow-x-auto whitespace-pre leading-relaxed">
              {gradleBuildCommands}
            </pre>
          </div>
        </div>

        {/* Keystore Signing Configuration */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield size={18} className="text-teal-600 dark:text-teal-400" />
                Play Store Signing Workflow
              </h3>
              <button
                onClick={() => handleCopy(keystoreCommands, 'keystore')}
                className="text-xs font-semibold flex items-center gap-1 text-slate-500 hover:text-teal-600"
              >
                {copied === 'keystore' ? 'Copied!' : <><Copy size={14} /> Copy</>}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Play App Signing requires a release keystore. Keep credentials protected in environment variables or <code className="text-teal-600">local.properties</code>:
            </p>
            <pre className="text-[11px] font-mono bg-slate-950 text-sky-400 p-4 rounded-xl overflow-x-auto whitespace-pre leading-relaxed">
              {keystoreCommands}
            </pre>
          </div>
        </div>
      </div>

      {/* Play Store Listing Assets & Legal Files */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText size={18} className="text-teal-600 dark:text-teal-400" />
            Publication Documents & Verification Files
          </h3>
          <a
            href="/release/BreatheLife-play-store-documentation.zip"
            download="BreatheLife-play-store-documentation.zip"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Download size={14} /> Download All Docs (.ZIP)
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">PRIVACY_POLICY.md</span>
            <p className="text-slate-500 dark:text-slate-400">
              Complete GDPR/CCPA compliant policy covering local offline storage & zero external tracking.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">GOOGLE_PLAY_DATA_SAFETY.md</span>
            <p className="text-slate-500 dark:text-slate-400">
              Questionnaire responses for the Play Console Data Safety section with verified declarations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">PLAY_STORE_LISTING.md</span>
            <p className="text-slate-500 dark:text-slate-400">
              Optimized title, 80-char short description, full description, and categorization keywords.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">TERMS_AND_CONDITIONS.md</span>
            <p className="text-slate-500 dark:text-slate-400">
              Wellness agreement, non-medical disclaimer, and liability terms.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">RELEASE_NOTES.md</span>
            <p className="text-slate-500 dark:text-slate-400">
              Official release notes for Version 1.0.0 (API 35 target, Room DB, Compose).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">GOOGLE_PLAY_RELEASE_CHECKLIST.md</span>
            <p className="text-slate-500 dark:text-slate-400">
              Step-by-step gate review from build to Play Console rollout.
            </p>
          </div>
        </div>

        {/* Data Backup button */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Export all user records, Buteyko history, habits, and preferences in JSON format.
          </div>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-md shadow-teal-500/20 active:scale-95 transition-all"
          >
            <Download size={16} /> Export Local Wellness Database
          </button>
        </div>
      </div>
    </div>
  );
};
