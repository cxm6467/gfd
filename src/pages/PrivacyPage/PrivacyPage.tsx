import React from 'react';
import { Shield, Eye, Lock, Database, UserCheck, Globe } from 'lucide-react';
import { AppLayout } from '../../components/templates/AppLayout';
import { useTheme } from '../../hooks/useTheme';

export const PrivacyPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pt-8 px-4 pb-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className={`text-4xl font-bold ${theme.colors.text} mb-4`}>
            Privacy Policy
          </h1>
          <p className={`text-lg ${theme.colors.textSecondary} max-w-2xl mx-auto`}>
            Your privacy is fundamental to everything we do. Learn how we protect and respect your personal information.
          </p>
        </div>

        <div className="space-y-12">
          {/* Information We Collect */}
          <section>
            <div className="flex items-center mb-6">
              <Database className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Information We Collect
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Profile Information</h3>
                  <p className={theme.colors.textSecondary}>
                    We collect information you provide when creating your profile, including your name, age, dietary restrictions, 
                    location, photos, and preferences. This information helps us provide better matches and personalized experiences.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Usage Data</h3>
                  <p className={theme.colors.textSecondary}>
                    We collect information about how you use our service, including your interactions, matches, messages, 
                    and app usage patterns to improve our matching algorithms and user experience.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Device Information</h3>
                  <p className={theme.colors.textSecondary}>
                    We collect device information such as IP address, browser type, operating system, and device identifiers 
                    for security purposes and to optimize our service for your device.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-center mb-6">
              <UserCheck className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                How We Use Your Information
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className={theme.colors.textSecondary}>
                    <strong className={theme.colors.text}>Matching & Recommendations:</strong> To provide compatible matches based on dietary preferences, location, and interests
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className={theme.colors.textSecondary}>
                    <strong className={theme.colors.text}>Communication:</strong> To enable messaging between matched users and provide customer support
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className={theme.colors.textSecondary}>
                    <strong className={theme.colors.text}>Safety & Security:</strong> To verify identities, prevent fraud, and maintain a safe community
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className={theme.colors.textSecondary}>
                    <strong className={theme.colors.text}>Service Improvement:</strong> To analyze usage patterns and improve our algorithms and features
                  </p>
                </li>
              </ul>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <div className="flex items-center mb-6">
              <Lock className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Data Protection & Security
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Encryption</h3>
                  <p className={theme.colors.textSecondary}>
                    All sensitive data is encrypted using AES-256 encryption both in transit and at rest. 
                    Your messages and personal information are protected with industry-standard security measures.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Access Controls</h3>
                  <p className={theme.colors.textSecondary}>
                    We implement strict access controls and regularly audit who has access to your data. 
                    Only authorized personnel can access user information for legitimate business purposes.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Data Minimization</h3>
                  <p className={theme.colors.textSecondary}>
                    We only collect and retain data that is necessary for providing our services. 
                    Inactive accounts and unnecessary data are automatically purged according to our retention policies.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Third-Party Security</h3>
                  <p className={theme.colors.textSecondary}>
                    All third-party services we use are vetted for security and privacy compliance. 
                    We never sell your data to third parties or use it for advertising purposes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center mb-6">
              <Eye className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Your Privacy Rights
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${theme.colors.text} mb-2`}>Access Your Data</h3>
                    <p className={theme.colors.textSecondary}>
                      Request a copy of all personal data we have about you in a portable format.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${theme.colors.text} mb-2`}>Correct Information</h3>
                    <p className={theme.colors.textSecondary}>
                      Update or correct any inaccurate personal information in your profile at any time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${theme.colors.text} mb-2`}>Delete Your Account</h3>
                    <p className={theme.colors.textSecondary}>
                      Permanently delete your account and all associated data from our systems.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${theme.colors.text} mb-2`}>Control Communications</h3>
                    <p className={theme.colors.textSecondary}>
                      Opt out of marketing communications while still receiving important service updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <div className="flex items-center mb-6">
              <Globe className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Contact Us
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <p className={`${theme.colors.textSecondary} mb-6`}>
                If you have questions about this Privacy Policy or want to exercise your privacy rights, contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Email</h3>
                  <p className="text-blue-600">privacy@gfd.com</p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Response Time</h3>
                  <p className={theme.colors.textSecondary}>We respond to all privacy requests within 30 days</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={`mt-12 p-6 bg-gray-50 rounded-xl border ${theme.colors.border}`}>
          <p className={`text-sm ${theme.colors.textSecondary} text-center`}>
            Last updated: January 2024 • This policy may be updated periodically. 
            We'll notify you of significant changes via email or app notification.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};