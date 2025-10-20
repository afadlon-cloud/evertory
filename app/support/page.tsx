export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Support Center</h1>
          <p className="text-gray-600 mb-8">Get help with Evertory and find answers to common questions.</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What is Evertory?</h3>
                  <p className="text-gray-700">
                    Evertory is a platform that helps you create beautiful, personal websites to share your 
                    life stories, family memories, and special moments. You get your own custom domain 
                    like "yourname.evertory.com" where you can upload photos, write stories, and create 
                    chapters of your life.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my content private?</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 font-medium">
                      <strong>No, your content is public.</strong> Evertory creates public websites that 
                      anyone can access with your URL. This is the core feature - creating shareable 
                      family websites.
                    </p>
                  </div>
                  <p className="text-gray-700">
                    Only upload content you're comfortable sharing publicly. Do not upload private, 
                    sensitive, or confidential information.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I create my first story?</h3>
                  <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                    <li>Sign up for an account and choose your domain name</li>
                    <li>Go to your dashboard and click "New Story"</li>
                    <li>Choose a template (Timeline, Blog, or Gallery)</li>
                    <li>Add your story title and start creating chapters</li>
                    <li>Upload photos and write your content</li>
                    <li>Publish your story to make it live</li>
                  </ol>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What's the difference between templates?</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Timeline:</strong> Perfect for chronological stories with chapters</li>
                    <li><strong>Blog:</strong> Great for written stories with descriptions and chapters</li>
                    <li><strong>Gallery:</strong> Focus on photos and videos without chapters</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I add photos to my story?</h3>
                  <p className="text-gray-700 mb-4">
                    You can add photos in several ways:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Upload directly to chapters (Timeline/Blog stories)</li>
                    <li>Upload to the gallery (Gallery stories)</li>
                    <li>Use the media selector to choose from existing photos</li>
                    <li>Set a cover photo for your story</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I change my domain name?</h3>
                  <p className="text-gray-700">
                    Domain names are set when you create your account and cannot be changed. 
                    If you need a different domain, you'll need to create a new account.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I share my website?</h3>
                  <p className="text-gray-700">
                    Once published, your website is accessible at your custom URL (e.g., 
                    "yourname.evertory.com"). You can share this URL with family and friends. 
                    You can also share individual stories by adding "/story-slug" to your URL.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I delete my content?</h3>
                  <p className="text-gray-700">
                    Yes, you can delete stories, chapters, and photos from your dashboard. 
                    However, once content is publicly accessible, it may have been viewed or 
                    shared by others before deletion.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What file types are supported?</h3>
                  <p className="text-gray-700">
                    We support common image formats (JPEG, PNG, GIF) and video formats (MP4, MOV). 
                    There are file size limits to ensure good performance.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Is Evertory free?</h3>
                  <p className="text-gray-700">
                    Evertory offers a free tier with basic features. Premium features and 
                    additional storage may be available in the future.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started Guide</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">New to Evertory? Follow these steps:</h3>
                <ol className="list-decimal pl-6 text-blue-800 space-y-2">
                  <li>Create your account and choose your domain</li>
                  <li>Read our Terms of Service and Privacy Policy</li>
                  <li>Create your first story with a template</li>
                  <li>Add photos and write your content</li>
                  <li>Set a cover photo for your story</li>
                  <li>Publish and share your website</li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Troubleshooting</h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Photos not uploading?</h3>
                  <ul className="list-disc pl-6 text-red-800 space-y-1">
                    <li>Check your internet connection</li>
                    <li>Ensure file size is within limits</li>
                    <li>Try a different file format</li>
                    <li>Refresh the page and try again</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Story not appearing?</h3>
                  <ul className="list-disc pl-6 text-orange-800 space-y-1">
                    <li>Make sure your story is published</li>
                    <li>Check if the story is set to public</li>
                    <li>Verify your domain is correct</li>
                    <li>Clear your browser cache</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Can't access your account?</h3>
                  <ul className="list-disc pl-6 text-purple-800 space-y-1">
                    <li>Check your email and password</li>
                    <li>Try resetting your password</li>
                    <li>Clear browser cookies</li>
                    <li>Try a different browser</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Support</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Can't find what you're looking for? We're here to help!
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Support</h3>
                    <p className="text-gray-700 mb-2">For technical issues and questions:</p>
                    <a href="mailto:support@evertory.com" className="text-gray-900 font-medium hover:text-gray-700">
                      support@evertory.com
                    </a>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Time</h3>
                    <p className="text-gray-700">
                      We typically respond within 24-48 hours during business days.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Important Reminders</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">⚠️ Remember:</h3>
                <ul className="list-disc pl-6 text-yellow-800 space-y-2">
                  <li>All content you upload is publicly accessible</li>
                  <li>Only upload content you're comfortable sharing</li>
                  <li>Your website URL can be shared with anyone</li>
                  <li>Content may be indexed by search engines</li>
                  <li>Always review your content before publishing</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Legal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms of Service</h3>
                  <p className="text-gray-700 mb-4">
                    Read our complete terms and conditions for using Evertory.
                  </p>
                  <a href="/terms" className="text-gray-900 font-medium hover:text-gray-700 underline">
                    View Terms of Service →
                  </a>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy Policy</h3>
                  <p className="text-gray-700 mb-4">
                    Learn how we handle your data and content.
                  </p>
                  <a href="/privacy" className="text-gray-900 font-medium hover:text-gray-700 underline">
                    View Privacy Policy →
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
