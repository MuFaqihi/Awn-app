import ContactSection from '@/components/contact';

export default function ContactPage({ params }: { params: { locale: 'ar'|'en' }}) {
  return <ContactSection locale={params.locale} />;
}