import { useState } from 'react';
import { ChevronDown, Search, HelpCircle, MessageCircle, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Page.css';

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(t('faq.all'));

  const faqs = [
    {
      category: t('faq.general'),
      questions: [
        { question: t('faq.q1'), answer: t('faq.a1') },
        { question: t('faq.q2'), answer: t('faq.a2') },
        { question: t('faq.q3'), answer: t('faq.a3') }
      ]
    },
    {
      category: t('faq.pricing'),
      questions: [
        { question: t('faq.q4'), answer: t('faq.a4') },
        { question: t('faq.q5'), answer: t('faq.a5') }
      ]
    },
    {
      category: t('faq.technical'),
      questions: [
        { question: t('faq.q6'), answer: t('faq.a6') },
        { question: t('faq.q7'), answer: t('faq.a7') },
        { question: t('faq.q8'), answer: t('faq.a8') }
      ]
    },
    {
      category: t('faq.dataPrivacy'),
      questions: [
        { question: t('faq.q9'), answer: t('faq.a9') },
        { question: t('faq.q10'), answer: t('faq.a10') }
      ]
    }
  ];

  const categories = [t('faq.all'), ...new Set(faqs.map(f => f.category))];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq => 
    activeCategory === t('faq.all') || faq.category === activeCategory
  ).map(faq => ({
    ...faq,
    questions: faq.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(faq => faq.questions.length > 0);

  return (
    <div className="page">
      <Navbar />
      
      {/* Hero Section */}
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">{t('faq.title')}</h1>
          <p className="page-hero-subtitle">
            {t('faq.subtitle')}
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Search Bar */}
        <div className="faq-search-container">
          <div className="faq-search">
            <Search size={20} className="faq-search-icon" />
            <input
              type="text"
              placeholder={t('faq.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="faq-search-input"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="faq-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`faq-category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="faq-list">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category-section">
              <h2 className="faq-category-title">{category.category}</h2>
              <div className="faq-items">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = `${categoryIndex}-${questionIndex}`;
                  return (
                    <div key={questionIndex} className="faq-item card">
                      <button 
                        className="faq-question"
                        onClick={() => toggleFAQ(globalIndex)}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown 
                          className={`faq-icon ${openIndex === globalIndex ? 'open' : ''}`}
                          size={20}
                        />
                      </button>
                      {openIndex === globalIndex && (
                        <div className="faq-answer">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="faq-no-results">
              <HelpCircle size={48} />
              <h3>{t('faq.noResults')}</h3>
              <p>{t('faq.tryDifferent')}</p>
            </div>
          )}
        </div>

        {/* Still Have Questions */}
        <div className="faq-contact-section">
          <div className="faq-contact-card">
            <MessageCircle size={32} className="faq-contact-icon" />
            <h2 className="faq-contact-title">{t('faq.stillQuestions')}</h2>
            <p className="faq-contact-text">
              {t('faq.stillQuestionsDesc')}
            </p>
            <div className="faq-contact-buttons">
              <a href="/contact" className="btn btn-primary">
                <MessageCircle size={18} />
                {t('faq.contactSupport')}
              </a>
              <a href="mailto:support@agrinova.com" className="btn btn-outline">
                <Mail size={18} />
                {t('faq.emailUs')}
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;