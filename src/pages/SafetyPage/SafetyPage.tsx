import React from 'react';
import { Shield, AlertTriangle, Phone, MapPin, Users, Heart } from 'lucide-react';
import { AppLayout } from '../../components/templates/AppLayout';
import { useTheme } from '../../hooks/useTheme';

export const SafetyPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pt-8 px-4 pb-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className={`text-4xl font-bold ${theme.colors.text} mb-4`}>
            Safety Guidelines
          </h1>
          <p className={`text-lg ${theme.colors.textSecondary} max-w-2xl mx-auto`}>
            Your safety is our top priority. Follow these guidelines to have positive, secure experiences on GF'd.
          </p>
        </div>

        <div className="space-y-12">
          {/* Online Safety */}
          <section>
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Online Safety
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-4`}>Protect Your Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={theme.colors.textSecondary}>
                        Never share personal information like your full name, address, or financial details
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={theme.colors.textSecondary}>
                        Use GF'd's messaging system instead of sharing phone numbers immediately
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={theme.colors.textSecondary}>
                        Be cautious of users who ask for money or financial assistance
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={theme.colors.textSecondary}>
                        Report suspicious behavior or profiles immediately
                      </p>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-4`}>Red Flags to Watch For</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={theme.colors.textSecondary}>
                        Profiles with limited photos or information
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={theme.colors.textSecondary}>
                        Users who immediately want to move off the platform
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={theme.colors.textSecondary}>
                        Requests for money, gifts, or financial information
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={theme.colors.textSecondary}>
                        Inconsistent stories or evasive answers about basic questions
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Meeting in Person */}
          <section>
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Meeting in Person
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <div className="space-y-8">
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-4`}>Before You Meet</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-medium ${theme.colors.text} mb-2`}>Video Chat First</h4>
                      <p className={theme.colors.textSecondary}>
                        Have a video call before meeting in person to verify identity and build comfort.
                      </p>
                    </div>
                    <div>
                      <h4 className={`font-medium ${theme.colors.text} mb-2`}>Tell Someone</h4>
                      <p className={theme.colors.textSecondary}>
                        Inform a trusted friend or family member about your plans, including when and where you're meeting.
                      </p>
                    </div>
                    <div>
                      <h4 className={`font-medium ${theme.colors.text} mb-2`}>Research the Venue</h4>
                      <p className={theme.colors.textSecondary}>
                        Choose a public place you're familiar with, preferably a gluten-free friendly restaurant.
                      </p>
                    </div>
                    <div>
                      <h4 className={`font-medium ${theme.colors.text} mb-2`}>Plan Your Transportation</h4>
                      <p className={theme.colors.textSecondary}>
                        Arrange your own transportation to and from the date. Don't rely on your date for rides.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-4`}>During Your Date</h3>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Stay in Public</h4>
                          <p className="text-blue-800 text-sm">Keep first dates in busy, public locations</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Stay Connected</h4>
                          <p className="text-blue-800 text-sm">Keep your phone charged and accessible</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Trust Your Instincts</h4>
                          <p className="text-blue-800 text-sm">Leave if you feel uncomfortable at any time</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Heart className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Take It Slow</h4>
                          <p className="text-blue-800 text-sm">Don't feel pressured to do anything you're not comfortable with</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gluten-Free Dating Safety */}
          <section>
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Gluten-Free Dating Safety
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-4`}>Dining Safety</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-medium ${theme.colors.text} mb-2`}>Research Restaurants</h4>
                      <p className={theme.colors.textSecondary}>
                        Use GF'd's restaurant recommendations and always verify gluten-free options before dining.
                      </p>
                    </div>
                    <div>
                      <h4 className={`font-medium ${theme.colors.text} mb-2`}>Communicate Your Needs</h4>
                      <p className={theme.colors.textSecondary}>
                        Be clear about your dietary restrictions and the severity of your condition with both your date and restaurant staff.
                      </p>
                    </div>
                    <div>
                      <h4 className={`font-medium ${theme.colors.text} mb-2`}>Bring Emergency Medication</h4>
                      <p className={theme.colors.textSecondary}>
                        If you have severe reactions, always carry necessary medications and inform your date about emergency procedures.
                      </p>
                    </div>
                    <div>
                      <h4 className={`font-medium ${theme.colors.text} mb-2`}>Have Backup Plans</h4>
                      <p className={theme.colors.textSecondary}>
                        Know alternative dining options nearby in case the chosen restaurant can't accommodate your needs safely.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-2">Important Medical Disclaimer</h4>
                      <p className="text-yellow-800 text-sm">
                        GF'd users self-report their dietary restrictions. Always verify information independently and consult 
                        with healthcare providers about your specific needs. Never rely solely on user-provided information for 
                        medical decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Reporting & Support */}
          <section>
            <div className="flex items-center mb-6">
              <Phone className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>
                Reporting & Support
              </h2>
            </div>
            <div className={`${theme.colors.surface} rounded-xl p-8 shadow-sm border ${theme.colors.border}`}>
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-medium ${theme.colors.text} mb-4`}>How to Report Issues</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className={`font-medium ${theme.colors.text} mb-2`}>In-App Reporting</h4>
                      <p className={`text-sm ${theme.colors.textSecondary}`}>
                        Use the report button on any profile or conversation
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Phone className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className={`font-medium ${theme.colors.text} mb-2`}>24/7 Support</h4>
                      <p className={`text-sm ${theme.colors.textSecondary}`}>
                        Contact our safety team at safety@gfd.com
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <h4 className={`font-medium ${theme.colors.text} mb-2`}>Emergency</h4>
                      <p className={`text-sm ${theme.colors.textSecondary}`}>
                        Call local emergency services (911) for immediate danger
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className={`font-medium ${theme.colors.text} mb-3`}>We Take Action</h4>
                  <p className={`${theme.colors.textSecondary} mb-3`}>
                    All reports are reviewed by our safety team within 24 hours. We may:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={theme.colors.textSecondary}>Issue warnings to users who violate community guidelines</p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={theme.colors.textSecondary}>Temporarily or permanently suspend accounts</p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={theme.colors.textSecondary}>Cooperate with law enforcement when necessary</p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={theme.colors.textSecondary}>Provide resources and support to affected users</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={`mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200`}>
          <div className="text-center">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className={`text-lg font-medium ${theme.colors.text} mb-2`}>
              Your Safety is Our Priority
            </h3>
            <p className={`${theme.colors.textSecondary} mb-4`}>
              These guidelines help create a safe, welcoming community for everyone. 
              When in doubt, trust your instincts and prioritize your safety.
            </p>
            <p className="text-blue-600 font-medium">
              Questions? Contact our safety team at safety@gfd.com
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};