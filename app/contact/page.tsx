import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="block max-w-md bg-white dark:bg-neutral-700 w-full space-y-8 p-8 rounded-xl shadow-md">
        <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Contact Us</h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                We love to hear from you. Please fill out the form below and we will get back to you as soon as possible.
            </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}