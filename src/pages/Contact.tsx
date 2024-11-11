// Contact.tsx

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const contactDetails = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@effibuildpro.com',
    link: 'mailto:support@effibuildpro.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (800) 123-4567',
    link: 'tel:+18001234567',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: '123 Construction Way, Building City, USA',
    link: '',
  },
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission (replace with backend logic)
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white">
      {/* Header Section */}
      <Container className="py-24">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Have questions or need assistance? Our team is here to support you.
            </p>
          </div>
        </FadeIn>
      </Container>

      {/* Contact Information */}
      <FadeIn delay={0.1}>
        <Container className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {contactDetails.map((detail, index) => (
              <div key={index} className="text-center">
                <detail.icon className="mx-auto h-8 w-8 text-blue-600" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{detail.label}</h3>
                {detail.link ? (
                  <a
                    href={detail.link}
                    className="mt-2 text-base text-blue-600 hover:underline"
                  >
                    {detail.value}
                  </a>
                ) : (
                  <p className="mt-2 text-base text-gray-600">{detail.value}</p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </FadeIn>

      {/* Contact Form */}
      <FadeIn delay={0.2}>
        <Container className="py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Send Us a Message
            </h2>
            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-900">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Submit <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">Thank You!</h3>
                <p className="mt-4 text-lg text-gray-600">
                  Your message has been sent. We’ll get back to you as soon as possible.
                </p>
              </div>
            )}
          </div>
        </Container>
      </FadeIn>
    </div>
  );
}
