export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Evertory ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our service at evertory.com 
                (the "Service"). Please read this privacy policy carefully. If you do not agree with the 
                terms of this privacy policy, please do not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                including your name, email address, and any other information you choose to provide.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Content and Media</h3>
              <p className="text-gray-700 mb-4">
                <strong className="text-red-600">IMPORTANT:</strong> All photos, videos, and content you upload 
                to Evertory are stored and may be publicly accessible. By uploading content to our Service, 
                you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Your content will be stored on our servers and third-party cloud storage services</li>
                <li>Your content may be accessible to anyone with the URL to your public website</li>
                <li>We cannot guarantee the privacy of your uploaded content</li>
                <li>You are solely responsible for the content you upload and its public availability</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Usage Information</h3>
              <p className="text-gray-700 mb-4">
                We automatically collect certain information about your use of the Service, including 
                your IP address, browser type, device information, and usage patterns.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide, operate, and maintain our Service</li>
                <li>Process your transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Improve our Service and develop new features</li>
                <li>Monitor and analyze usage and trends</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Public Content and Privacy</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Important Privacy Notice</h3>
                <p className="text-yellow-700 mb-4">
                  <strong>Evertory is designed to create public websites.</strong> When you create stories 
                  and upload content, you are creating a public website that can be accessed by anyone 
                  with the URL. This is the core functionality of our Service.
                </p>
                <p className="text-yellow-700 mb-4">
                  <strong>Do not upload private, sensitive, or confidential content.</strong> We recommend 
                  only uploading content that you are comfortable sharing publicly.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Public Content:</strong> Content you upload is designed to be publicly accessible</li>
                <li><strong>Service Providers:</strong> We may share information with third-party service providers who assist us in operating our Service</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> We may share information in connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your information. 
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                We cannot guarantee absolute security of your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Access, update, or delete your account information</li>
                <li>Delete your uploaded content (though it may remain in backups)</li>
                <li>Opt out of certain communications from us</li>
                <li>Request a copy of your personal information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our Service is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If you are a parent or guardian 
                and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Users</h2>
              <p className="text-gray-700 mb-4">
                If you are accessing our Service from outside the United States, please be aware that 
                your information may be transferred to, stored, and processed in the United States.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">Email: privacy@evertory.com</p>
                <p className="text-gray-700">Website: evertory.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
