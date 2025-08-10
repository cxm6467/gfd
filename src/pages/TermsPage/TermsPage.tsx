import React from 'react';
import { FileText, Users, Shield, AlertTriangle, Scale, Globe } from 'lucide-react';
import { AppLayout } from '../../components/templates/AppLayout';
import { useTheme } from '../../hooks/useTheme';

export const TermsPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pt-8 px-4 pb-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className={`text-4xl font-bold ${theme.colors.text} mb-4`}>
            Terms of Service
          </h1>
          <p className={`text-lg ${theme.colors.textSecondary} max-w-2xl mx-auto`}>
            Please read these terms carefully before using GF'd. By using our service, you agree to these terms.
          </p>
        </div>

        <div className="space-y-12">
          {/* Acceptance of Terms */}
          <section>
            <div className="flex items-center mb-6">
              <Scale className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Acceptance of Terms
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <p className={`${theme.colors.textSecondary} mb-4`}>
                By accessing or using GF'd ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p className={theme.colors.textSecondary}>
                These Terms apply to all visitors, users, and others who access or use the Service. 
                We reserve the right to update these Terms at any time, and continued use constitutes acceptance of any changes.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                User Accounts & Eligibility
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Age Requirements</h3>
                  <p className={theme.colors.textSecondary}>
                    You must be at least 18 years old to use GF'd. By creating an account, you represent and warrant 
                    that you are at least 18 years of age and have the legal capacity to enter into these Terms.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Account Responsibility</h3>
                  <p className={theme.colors.textSecondary}>
                    You are responsible for maintaining the confidentiality of your account credentials and for all 
                    activities that occur under your account. You must immediately notify us of any unauthorized use.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Accurate Information</h3>
                  <p className={theme.colors.textSecondary}>
                    You agree to provide accurate, current, and complete information during registration and to update 
                    such information to keep it accurate, current, and complete.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Acceptable Use Policy
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <div className="mb-6">
                <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>You agree NOT to:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <p className={theme.colors.textSecondary}>
                      Use the Service for any unlawful purpose or to solicit others to perform unlawful acts
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <p className={theme.colors.textSecondary}>
                      Harass, abuse, or harm other users or engage in discriminatory behavior
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <p className={theme.colors.textSecondary}>
                      Create fake profiles or impersonate others
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <p className={theme.colors.textSecondary}>
                      Share inappropriate, offensive, or explicit content
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <p className={theme.colors.textSecondary}>
                      Attempt to gain unauthorized access to our systems or other users' accounts
                    </p>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className={`text-blue-800 text-sm`}>
                  <strong>Community Focus:</strong> GF'd is designed for individuals seeking meaningful connections 
                  within the gluten-free community. Commercial solicitation and spam are strictly prohibited.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy & Data */}
          <section>
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Privacy & Data Protection
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <p className={`${theme.colors.textSecondary} mb-4`}>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information 
                when you use our Service. By using GF'd, you also agree to our Privacy Policy.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className={`text-gray-700 text-sm`}>
                  <strong>Data Retention:</strong> We retain your data only as long as necessary to provide our services. 
                  You can delete your account and data at any time through your profile settings.
                </p>
              </div>
            </div>
          </section>

          {/* Subscription & Payments */}
          <section>
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Subscriptions & Payments
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Free & Premium Features</h3>
                  <p className={theme.colors.textSecondary}>
                    GF'd offers both free and premium features. Premium subscriptions provide enhanced functionality 
                    and are billed on a recurring basis until cancelled.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Billing & Cancellation</h3>
                  <p className={theme.colors.textSecondary}>
                    Subscriptions automatically renew unless cancelled before the renewal date. You can cancel your 
                    subscription at any time through your account settings. Refunds are provided according to our refund policy.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Price Changes</h3>
                  <p className={theme.colors.textSecondary}>
                    We reserve the right to modify subscription prices with 30 days' notice. Existing subscribers 
                    will be notified via email before any price changes take effect.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Disclaimers & Limitations
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Service Availability</h3>
                  <p className={theme.colors.textSecondary}>
                    We strive to maintain service availability but cannot guarantee uninterrupted access. 
                    We reserve the right to modify or discontinue features with reasonable notice.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>User Interactions</h3>
                  <p className={theme.colors.textSecondary}>
                    GF'd is not responsible for the conduct of users or the outcome of interactions between users. 
                    Users are responsible for their own safety when meeting others.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Medical Information</h3>
                  <p className={theme.colors.textSecondary}>
                    Information about dietary restrictions and health conditions is user-provided and not verified by medical professionals. 
                    Always consult healthcare providers for medical advice.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <div className="flex items-center mb-6">
              <Globe className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Contact Information
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <p className={`${theme.colors.textSecondary} mb-6`}>
                Questions about these Terms of Service? Contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Email</h3>
                  <p className="text-blue-600">legal@gfd.com</p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-3`}>Response Time</h3>
                  <p className={theme.colors.textSecondary}>We respond to all inquiries within 48 hours</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={`mt-12 p-6 bg-gray-50 rounded-xl border ${theme.colors.border}`}>
          <p className={`text-sm ${theme.colors.textSecondary} text-center`}>
            Last updated: January 2024 • These terms are governed by the laws of [Jurisdiction]. 
            Any disputes will be resolved through binding arbitration.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};