import React from 'react';

function Docs() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="bg-violet-900 px-8 py-10 w-1/4 h-full text-white fixed shadow-lg">
        <div className="mb-10 text-4xl font-bold">
          <a href="/" className="logo text-yellow-400">
            NoQ
          </a>
        </div>
        <nav className="space-y-6 text-lg">
          <div className="hover:bg-violet-700 transition-all duration-200 rounded-lg p-3">
            <a href="#about">About</a>
          </div>
          <div className="hover:bg-violet-700 transition-all duration-200 rounded-lg p-3">
            <a href="#services">Services</a>
          </div>
          <div className="hover:bg-violet-700 transition-all duration-200 rounded-lg p-3">
            <a href="#pricing">Pricing</a>
          </div>
          <div className="hover:bg-violet-700 transition-all duration-200 rounded-lg p-3">
            <a href="#testimonials">Testimonials</a>
          </div>
          <div className="hover:bg-violet-700 transition-all duration-200 rounded-lg p-3">
            <a href="#faq">FAQ</a>
          </div>
          <div className="hover:bg-violet-700 transition-all duration-200 rounded-lg p-3">
            <a href="#support">Support</a>
          </div>
          <div className="hover:bg-violet-700 transition-all duration-200 rounded-lg p-3">
            <a href="#contacts">Contacts</a>
          </div>
          <div className="hover:bg-violet-700 transition-all duration-200 rounded-lg p-3">
            <a href="#feedback">Feedback</a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-[25%] p-10 flex-grow bg-gray-100 text-gray-800">
        <div className="flex justify-between items-start">
          <div>
            {/* About Section */}
            <div id="about" className="py-16 pt-24"> {/* Add pt-24 for top padding */}
              <h2 className="text-4xl font-bold mb-5 text-violet-900">About NoQ</h2>
              <p className="text-lg leading-relaxed">
                NoQ is a comprehensive platform...
              </p>
            </div>

            {/* Services Section */}
            <div id="services" className="py-16 pt-24">
              <h2 className="text-4xl font-bold mb-5 text-violet-900">Our Services</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Appointment scheduling...</li>
              </ul>
            </div>
          </div>

          <div className="w-1/3 mt-10">
            <img
              src="https://img.freepik.com/premium-vector/child-character-engaged-learning-seated-desk-focused-typing-laptop-little-boy-exploring-technology_1016-17114.jpg?w=826"
              alt="Contact Illustration"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        </div>



        {/* Testimonials Section */}
        <div id="testimonials" className="py-16">
          <h2 className="text-4xl font-bold mb-5 text-violet-900">What Our Clients Say</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg leading-relaxed">
                "NoQ has completely transformed the way we handle bookings. Our clients love the ease of scheduling,
                and it has reduced our wait times significantly!" – John D., Salon Owner
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg leading-relaxed">
                "Thanks to NoQ, managing our appointments has never been easier. The interface is intuitive, and the
                customer support is excellent." – Sarah K., Automotive Services
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="py-16">
          <h2 className="text-4xl font-bold mb-5 text-violet-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">How do I sign up?</h3>
              <p className="text-lg leading-relaxed">
                You can sign up by visiting our website and clicking on the "Sign Up" button in the top-right corner.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">What payment methods do you accept?</h3>
              <p className="text-lg leading-relaxed">
                We accept all major credit cards, as well as PayPal and Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div id="support" className="py-16">
          <h2 className="text-4xl font-bold mb-5 text-violet-900">Support</h2>
          <p className="text-lg leading-relaxed">
            Need help? Our support team is available 24/7 to assist you with any questions or issues you may have.
            You can reach us at <a href="mailto:support@NoQ.com" className="text-blue-600 hover:underline">support@NoQ.com</a>.
          </p>
        </div>

        {/* Contacts Section */}
        <div id="contacts" className="py-16">

          <div className="w-2/3">
            <h2 className="text-4xl font-bold mb-5 text-violet-900">Contacts</h2>
            <p className="text-lg">
              Company Name: NoQ.pvt.LTD<br />
              Website: <a href="http://www.NoQ.com" className="text-blue-600 hover:underline">www.NoQ.com</a><br />
              Email: <a href="mailto:demo@NoQ.com" className="text-blue-600 hover:underline">demo@NoQ.com</a><br />
              Phone: +91 88489 87165<br />
              Address: YIASCM, Yenepoya University, Mangalore.
            </p>
          </div>


        </div>

        {/* Feedback Section */}
        <div id="feedback" className="py-16">
          <h2 className="text-4xl font-bold mb-5 text-violet-900">Feedback</h2>
          <p className="text-lg leading-relaxed">
            We value your feedback. Please fill out our feedback form to share your experience with NoQ.
          </p>
          <button
            className="bg-violet-900 text-white px-6 py-3 rounded-lg mt-4"
            onClick={() => {
              window.open(
                "https://mail.google.com/mail/?view=cm&fs=1&to=bz.shabz@gmail.com&su=Feedback&body=//give%20your%20feedback%20below:",
                "MailWindow",
                "width=800,height=600"
              );
            }}
          >
            Write us a Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

export default Docs;
