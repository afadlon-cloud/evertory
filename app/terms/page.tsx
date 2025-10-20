export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Evertory ("the Service"), you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to abide by the above, please 
                do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Evertory is a platform that allows users to create personal websites to share their 
                stories through photos, videos, and text. The Service enables users to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Create personal websites with custom domains</li>
                <li>Upload and organize photos and videos</li>
                <li>Write and share personal stories</li>
                <li>Create public websites accessible to anyone with the URL</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Public Nature of Content</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">🚨 CRITICAL NOTICE</h3>
                <p className="text-red-700 mb-4">
                  <strong>ALL CONTENT UPLOADED TO EVERSTORY IS PUBLICLY ACCESSIBLE.</strong> By using 
                  our Service, you acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 text-red-700 mb-4">
                  <li>Your stories, photos, and videos will be publicly accessible to anyone with the URL</li>
                  <li>We cannot guarantee the privacy of your uploaded content</li>
                  <li>Your content may be indexed by search engines</li>
                  <li>You are solely responsible for the content you upload</li>
                  <li>Do not upload private, sensitive, or confidential information</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">As a user of Evertory, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide accurate and complete information when creating your account</li>
                <li>Maintain the security of your account credentials</li>
                <li>Only upload content that you own or have permission to use</li>
                <li>Not upload illegal, harmful, or inappropriate content</li>
                <li>Respect the rights of others and not infringe on intellectual property</li>
                <li>Not use the Service for any unlawful purpose</li>
                <li>Be responsible for all content you upload and its public availability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Prohibited Content</h2>
              <p className="text-gray-700 mb-4">You may not upload content that:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Is illegal, harmful, threatening, or abusive</li>
                <li>Violates any intellectual property rights</li>
                <li>Contains malware, viruses, or other harmful code</li>
                <li>Is defamatory, obscene, or pornographic</li>
                <li>Violates privacy rights of others</li>
                <li>Contains personal information of others without consent</li>
                <li>Is designed to harass, intimidate, or harm others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property Rights</h2>
              <p className="text-gray-700 mb-4">
                You retain ownership of the content you upload to Evertory. However, by uploading 
                content, you grant us a license to store, display, and distribute your content as 
                necessary to provide the Service.
              </p>
              <p className="text-gray-700 mb-4">
                You represent and warrant that you own or have the necessary rights to all content 
                you upload and that such content does not infringe on any third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of the Service, to understand our practices.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Important:</strong> Due to the public nature of our Service, we cannot guarantee 
                the privacy of your uploaded content. Please do not upload sensitive or private information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Availability</h2>
              <p className="text-gray-700 mb-4">
                We strive to provide continuous service availability, but we do not guarantee that 
                the Service will be uninterrupted or error-free. We may modify, suspend, or discontinue 
                the Service at any time without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, EVERSTORY SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, 
                LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR 
                USE OF THE SERVICE.
              </p>
              <p className="text-gray-700 mb-4">
                You acknowledge and agree that you use the Service at your own risk and that the public 
                nature of the Service may expose your content to unauthorized access or use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to defend, indemnify, and hold harmless Evertory and its officers, directors, 
                employees, and agents from and against any claims, damages, obligations, losses, 
                liabilities, costs, or debt, and expenses (including attorney's fees) arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you upload to the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to the Service immediately, without 
                prior notice or liability, for any reason whatsoever, including without limitation if 
                you breach the Terms.
              </p>
              <p className="text-gray-700 mb-4">
                Upon termination, your right to use the Service will cease immediately. However, 
                your content may remain publicly accessible until manually removed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be interpreted and governed by the laws of the United States, without 
                regard to its conflict of law provisions. Any disputes arising from these Terms or your 
                use of the Service shall be resolved in the courts of the United States.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any 
                material changes by posting the new Terms on this page and updating the "Last updated" date.
              </p>
              <p className="text-gray-700 mb-4">
                Your continued use of the Service after any such changes constitutes your acceptance 
                of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Severability</h2>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms is held to be invalid or unenforceable, the remaining 
                provisions will remain in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">Email: legal@evertory.com</p>
                <p className="text-gray-700">Website: evertory.com</p>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Summary</h3>
              <p className="text-blue-700 mb-4">
                By using Evertory, you acknowledge that you understand the public nature of the Service 
                and agree to these terms. You are responsible for all content you upload and its 
                public availability.
              </p>
              <p className="text-blue-700">
                <strong>Remember:</strong> Only upload content you are comfortable sharing publicly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
