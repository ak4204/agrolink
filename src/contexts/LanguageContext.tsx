import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: 'AgroLink',
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    continueWithGoogle: 'Continue with Google',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    browse: 'Browse Equipment',
    myBookings: 'My Bookings',
    messages: 'Messages',
    admin: 'Admin',
    logout: 'Logout',
    rentNow: 'Rent Now',
    pricePerDay: 'per day',
    location: 'Location',
    owner: 'Owner',
    availability: 'Availability',
    bookNow: 'Book Now',
    startDate: 'Start Date',
    endDate: 'End Date',
    totalDays: 'Total Days',
    totalPrice: 'Total Price',
    confirmBooking: 'Confirm Booking',
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
  },
  hi: {
    appName: 'एग्रोलिंक',
    login: 'लॉग इन करें',
    signup: 'साइन अप करें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'नाम',
    continueWithGoogle: 'Google के साथ जारी रखें',
    forgotPassword: 'पासवर्ड भूल गए?',
    noAccount: 'खाता नहीं है?',
    hasAccount: 'पहले से खाता है?',
    browse: 'उपकरण ब्राउज़ करें',
    myBookings: 'मेरी बुकिंग',
    messages: 'संदेश',
    admin: 'व्यवस्थापक',
    logout: 'लॉगआउट',
    rentNow: 'अभी किराए पर लें',
    pricePerDay: 'प्रति दिन',
    location: 'स्थान',
    owner: 'मालिक',
    availability: 'उपलब्धता',
    bookNow: 'अभी बुक करें',
    startDate: 'शुरुआत की तारीख',
    endDate: 'समाप्ति तिथि',
    totalDays: 'कुल दिन',
    totalPrice: 'कुल कीमत',
    confirmBooking: 'बुकिंग की पुष्टि करें',
    pending: 'लंबित',
    confirmed: 'पुष्टि',
    completed: 'पूर्ण',
    cancelled: 'रद्द',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
  },
  mr: {
    appName: 'अॅग्रोलिंक',
    login: 'लॉगिन',
    signup: 'साइन अप',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'नाव',
    continueWithGoogle: 'Google सह सुरू ठेवा',
    forgotPassword: 'पासवर्ड विसरलात?',
    noAccount: 'खाते नाही?',
    hasAccount: 'आधीच खाते आहे?',
    browse: 'उपकरणे ब्राउझ करा',
    myBookings: 'माझी बुकिंग',
    messages: 'संदेश',
    admin: 'प्रशासक',
    logout: 'लॉगआउट',
    rentNow: 'आता भाड्याने घ्या',
    pricePerDay: 'प्रतिदिन',
    location: 'स्थान',
    owner: 'मालक',
    availability: 'उपलब्धता',
    bookNow: 'आता बुक करा',
    startDate: 'प्रारंभ तारीख',
    endDate: 'समाप्ती तारीख',
    totalDays: 'एकूण दिवस',
    totalPrice: 'एकूण किंमत',
    confirmBooking: 'बुकिंगची पुष्टी करा',
    pending: 'प्रलंबित',
    confirmed: 'पुष्टी',
    completed: 'पूर्ण',
    cancelled: 'रद्द',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
