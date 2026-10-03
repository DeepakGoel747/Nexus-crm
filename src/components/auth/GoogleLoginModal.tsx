import { useState } from 'react';
import { X, Check, ArrowRight, ShieldCheck, User, Plus, RefreshCw } from 'lucide-react';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (workspaceName: string) => void;
  defaultEmail?: string;
}

export function GoogleLoginModal({
  isOpen,
  onClose,
  onSuccess,
  defaultEmail = 'goeldeepak747@gmail.com',
}: GoogleLoginModalProps) {
  const [selectedEmail, setSelectedEmail] = useState<string>(defaultEmail);
  const [selectedName, setSelectedName] = useState<string>('Deepak Goel');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [workspaceName, setWorkspaceName] = useState("Deepak's Workspace");
  const [isUsingCustom, setIsUsingCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectAccount = (email: string, name: string) => {
    setSelectedEmail(email);
    setSelectedName(name);
    setIsUsingCustom(false);
    setWorkspaceName(`${name.split(' ')[0]}'s Workspace`);
  };

  const handleSignIn = async () => {
    const finalEmail = isUsingCustom ? customEmail.trim() : selectedEmail;
    const finalName = isUsingCustom ? (customName.trim() || 'Google User') : selectedName;

    if (!finalEmail || !finalEmail.includes('@')) {
      setErrorMsg('Please enter a valid Google email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: finalEmail,
          name: finalName,
          workspaceName: workspaceName.trim() || `${finalName}'s Workspace`,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalName)}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Google authentication failed');
      }

      if (data.token) {
        localStorage.setItem('nexus_token', data.token);
        localStorage.setItem('nexus_user', JSON.stringify(data.user));
        localStorage.setItem('nexus_workspace', JSON.stringify(data.workspace));
      }

      onSuccess(data.workspace?.name || 'Google Workspace');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-[420px] rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121318] shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100 font-sans">
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div>
              <h3 className="font-bold text-base leading-tight">Sign in with Google</h3>
              <p className="text-xs text-neutral-500">to continue to Nexus CRM</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
              Choose an Account
            </span>

            {/* Account Option 1: Primary Detected Google Account */}
            <div
              onClick={() => handleSelectAccount(defaultEmail, 'Deepak Goel')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                !isUsingCustom && selectedEmail === defaultEmail
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  D
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-neutral-900 dark:text-white">Deepak Goel</span>
                    <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono px-1 py-0.2 rounded border border-blue-500/20">
                      Primary
                    </span>
                  </div>
                  <span className="text-neutral-500 font-mono text-[11px]">{defaultEmail}</span>
                </div>
              </div>

              {!isUsingCustom && selectedEmail === defaultEmail && (
                <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Account Option 2: Alternate Demo Account */}
            <div
              onClick={() => handleSelectAccount('alex.vance@gmail.com', 'Alex Vance')}
              className={`mt-2 p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                !isUsingCustom && selectedEmail === 'alex.vance@gmail.com'
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  A
                </div>
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block">Alex Vance</span>
                  <span className="text-neutral-500 font-mono text-[11px]">alex.vance@gmail.com</span>
                </div>
              </div>

              {!isUsingCustom && selectedEmail === 'alex.vance@gmail.com' && (
                <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Account Option 3: Use Another Account */}
            <div
              onClick={() => setIsUsingCustom(true)}
              className={`mt-2 p-3 rounded-xl border cursor-pointer transition-all ${
                isUsingCustom
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10'
                  : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-500">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block">Use another Google account</span>
                  <span className="text-neutral-500 text-[11px]">Enter any @gmail.com or Workspace address</span>
                </div>
              </div>

              {isUsingCustom && (
                <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700/60 space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Deepak)"
                    value={customName}
                    onChange={(e) => {
                      setCustomName(e.target.value);
                      if (e.target.value) setWorkspaceName(`${e.target.value}'s Workspace`);
                    }}
                    className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2 text-xs"
                  />
                  <input
                    type="email"
                    placeholder="google.account@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2 text-xs font-mono"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Custom Workspace Name field */}
          <div className="pt-1">
            <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              Workspace Destination
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="My Custom Workspace"
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-white/[0.04] p-2 text-xs font-medium"
            />
          </div>

          {/* Privacy text */}
          <p className="text-[11px] text-neutral-500 leading-relaxed pt-1">
            To continue, Google will share your name, email address, and profile picture with Nexus CRM. See Nexus CRM's{' '}
            <span className="text-blue-500">Privacy Policy</span> and{' '}
            <span className="text-blue-500">Terms of Service</span>.
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer font-medium"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSignIn}
              disabled={isLoading}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 flex items-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>{isLoading ? 'Authorizing...' : 'Continue'}</span>
              {!isLoading && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
