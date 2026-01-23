import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Download,
  Trash2,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/lib/utils';

/**
 * Settings sections
 */
type SettingsSection = 'account' | 'appearance' | 'privacy' | 'notifications' | 'billing' | 'data';

/**
 * SettingsPage Component
 *
 * User settings and preferences:
 * - Account settings
 * - Appearance (theme)
 * - Privacy controls
 * - Notifications
 * - Billing/subscription
 * - Data management
 */
function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');
  const { theme, setTheme, resolvedTheme } = useThemeStore();

  // Mock user data - will be replaced with real auth
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'Free',
    joinedDate: 'January 2024',
  };

  const sections: { id: SettingsSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'data', label: 'Data Management', icon: Download },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h2 font-bold text-vsg-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-body-lg text-vsg-gray-600 dark:text-vsg-gray-400">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar navigation */}
        <nav className="space-y-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                'flex items-center gap-3 w-full px-4 py-2.5 rounded-md text-body-sm font-medium transition-colors',
                activeSection === id
                  ? 'bg-vsg-orange-50 dark:bg-vsg-orange-500/10 text-vsg-orange-500'
                  : 'text-vsg-gray-600 dark:text-vsg-gray-400 hover:bg-vsg-gray-100 dark:hover:bg-vsg-gray-800'
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Account */}
          {activeSection === 'account' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-vsg-gray-200 dark:bg-vsg-gray-800 flex items-center justify-center">
                      <User className="w-8 h-8 text-vsg-gray-400" />
                    </div>
                    <div>
                      <p className="text-body font-semibold text-vsg-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-body-sm text-vsg-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-vsg-gray-200 dark:border-vsg-gray-800">
                    <div>
                      <p className="text-caption text-vsg-gray-500 uppercase tracking-wider">
                        Plan
                      </p>
                      <p className="text-body font-medium text-vsg-gray-900 dark:text-white">
                        {user.plan}
                      </p>
                    </div>
                    <div>
                      <p className="text-caption text-vsg-gray-500 uppercase tracking-wider">
                        Member since
                      </p>
                      <p className="text-body font-medium text-vsg-gray-900 dark:text-white">
                        {user.joinedDate}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>Manage your sign-in methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-md bg-vsg-gray-50 dark:bg-vsg-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-white dark:bg-vsg-gray-700 flex items-center justify-center">
                          <span className="text-body font-bold">G</span>
                        </div>
                        <div>
                          <p className="text-body-sm font-medium text-vsg-gray-900 dark:text-white">
                            Google
                          </p>
                          <p className="text-caption text-vsg-gray-500">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-vsg-error-200 dark:border-vsg-error-500/30">
                <CardHeader>
                  <CardTitle className="text-vsg-error-500">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body font-medium text-vsg-gray-900 dark:text-white">
                        Delete Account
                      </p>
                      <p className="text-body-sm text-vsg-gray-500">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Customize your visual experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light' as const, label: 'Light', icon: Sun },
                    { value: 'dark' as const, label: 'Dark', icon: Moon },
                    { value: 'system' as const, label: 'System', icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={cn(
                        'flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-colors',
                        theme === value
                          ? 'border-vsg-orange-500 bg-vsg-orange-50 dark:bg-vsg-orange-500/10'
                          : 'border-vsg-gray-200 dark:border-vsg-gray-800 hover:border-vsg-gray-300 dark:hover:border-vsg-gray-700'
                      )}
                    >
                      <div
                        className={cn(
                          'w-12 h-12 rounded-lg flex items-center justify-center',
                          theme === value
                            ? 'bg-vsg-orange-500 text-white'
                            : 'bg-vsg-gray-100 dark:bg-vsg-gray-800 text-vsg-gray-500'
                        )}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={cn(
                          'text-body-sm font-medium',
                          theme === value
                            ? 'text-vsg-orange-500'
                            : 'text-vsg-gray-700 dark:text-vsg-gray-300'
                        )}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-body-sm text-vsg-gray-500">
                  Current theme: <strong className="capitalize">{resolvedTheme}</strong>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Privacy */}
          {activeSection === 'privacy' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Data Privacy</CardTitle>
                  <CardDescription>Control how your data is processed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingToggle
                    label="Client-side processing only"
                    description="Process data entirely in your browser"
                    checked={true}
                    disabled
                  />
                  <SettingToggle
                    label="Store graph data on server"
                    description="Enable cloud sync and backup"
                    checked={false}
                  />
                  <SettingToggle
                    label="Anonymous analytics"
                    description="Help improve VSG with anonymous usage data"
                    checked={true}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Protect your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingToggle
                    label="Two-factor authentication"
                    description="Add an extra layer of security"
                    checked={false}
                  />
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-body font-medium text-vsg-gray-900 dark:text-white">
                        Active sessions
                      </p>
                      <p className="text-body-sm text-vsg-gray-500">
                        Manage devices where you're signed in
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what emails you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SettingToggle
                  label="Weekly insights digest"
                  description="Summary of your network changes"
                  checked={true}
                />
                <SettingToggle
                  label="New feature announcements"
                  description="Learn about new VSG features"
                  checked={true}
                />
                <SettingToggle
                  label="Tips & tutorials"
                  description="Get the most out of VSG"
                  checked={false}
                />
                <SettingToggle
                  label="Account alerts"
                  description="Important security and billing notifications"
                  checked={true}
                  disabled
                />
              </CardContent>
            </Card>
          )}

          {/* Billing */}
          {activeSection === 'billing' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>You're currently on the Free plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-vsg-gray-50 dark:bg-vsg-gray-800">
                    <div>
                      <p className="text-h4 font-bold text-vsg-gray-900 dark:text-white">
                        Free
                      </p>
                      <p className="text-body-sm text-vsg-gray-500">
                        1 platform, basic insights
                      </p>
                    </div>
                    <Button>Upgrade to Pro</Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-body-sm">
                      <span className="text-vsg-gray-500">Platforms</span>
                      <span className="font-medium text-vsg-gray-900 dark:text-white">
                        1 / 1
                      </span>
                    </div>
                    <div className="flex justify-between text-body-sm">
                      <span className="text-vsg-gray-500">Max nodes</span>
                      <span className="font-medium text-vsg-gray-900 dark:text-white">
                        100 / 100
                      </span>
                    </div>
                    <div className="flex justify-between text-body-sm">
                      <span className="text-vsg-gray-500">Exports</span>
                      <span className="font-medium text-vsg-gray-900 dark:text-white">
                        Not available
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Your past invoices and receipts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-body text-vsg-gray-500">
                    No billing history yet. Upgrade to Pro to see your invoices here.
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Data Management */}
          {activeSection === 'data' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Export Your Data</CardTitle>
                  <CardDescription>Download a copy of your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-md bg-vsg-gray-50 dark:bg-vsg-gray-800">
                      <div>
                        <p className="text-body font-medium text-vsg-gray-900 dark:text-white">
                          Graph Data (JSON)
                        </p>
                        <p className="text-body-sm text-vsg-gray-500">
                          Your processed network graph
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-md bg-vsg-gray-50 dark:bg-vsg-gray-800">
                      <div>
                        <p className="text-body font-medium text-vsg-gray-900 dark:text-white">
                          Insights Report (PDF)
                        </p>
                        <p className="text-body-sm text-vsg-gray-500">
                          All your generated insights
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Clear Local Data</CardTitle>
                  <CardDescription>Remove data stored in your browser</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body font-medium text-vsg-gray-900 dark:text-white">
                        Browser Storage
                      </p>
                      <p className="text-body-sm text-vsg-gray-500">
                        Cached graphs and local preferences
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Clear Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Toggle switch for settings
 */
function SettingToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between py-3',
        disabled && 'opacity-60'
      )}
    >
      <div>
        <p className="text-body font-medium text-vsg-gray-900 dark:text-white">
          {label}
        </p>
        <p className="text-body-sm text-vsg-gray-500">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={isChecked}
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors',
          isChecked ? 'bg-vsg-orange-500' : 'bg-vsg-gray-300 dark:bg-vsg-gray-600',
          disabled && 'cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
            isChecked && 'translate-x-5'
          )}
        />
      </button>
    </div>
  );
}

export default SettingsPage;
