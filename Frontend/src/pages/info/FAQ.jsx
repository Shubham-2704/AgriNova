import { useState } from 'react';
import { ChevronDown, Search, HelpCircle, MessageCircle, Mail } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Page.css';

const faqs = [
  {
    category: "General",
    questions: [
      {
        question: "How accurate are the crop recommendations?",
        answer: "Our AI model has been trained on extensive agricultural data and achieves over 90% accuracy in crop recommendations. The system considers multiple factors including weather, soil type, water availability, and historical data to provide reliable suggestions."
      },
      {
        question: "How does the weather integration work?",
        answer: "We integrate with OpenWeatherMap API to fetch real-time weather data for your selected location. This includes temperature, rainfall, humidity, cloud cover, and other meteorological factors that influence crop growth."
      },
      {
        question: "Can I use AgriNova for any location in India?",
        answer: "Currently, AgriNova is optimized for Gujarat state with data from 26+ cities. We're continuously expanding our coverage to include more states and regions across India."
      }
    ]
  },
  {
    category: "Pricing & Plans",
    questions: [
      {
        question: "Is AgriNova free to use?",
        answer: "Yes! We offer a free tier that includes basic crop recommendations. For advanced features like detailed analytics, historical data, and priority support, we offer affordable premium plans."
      },
      {
        question: "Are there any hidden charges?",
        answer: "No hidden charges whatsoever. All our pricing is transparent and clearly displayed. You only pay for the plan you choose."
      }
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        question: "How are profit calculations determined?",
        answer: "Profit calculations are based on historical production data, current market prices, and your specified land area. We provide both per-acre and total profit estimates to help you make informed decisions."
      },
      {
        question: "Do I need technical knowledge to use AgriNova?",
        answer: "Not at all! AgriNova is designed with farmers in mind. The interface is intuitive and easy to use. Simply input your farm details, and our system will provide recommendations in a clear, understandable format."
      },
      {
        question: "Can I get recommendations for multiple crops?",
        answer: "Yes! Our system provides the top 6 crop recommendations ranked by suitability. You can view the top 3 initially and expand to see 3 more alternatives."
      }
    ]
  },
  {
    category: "Data & Privacy",
    questions: [
      {
        question: "Is my data secure?",
        answer: "Yes, we take data security seriously. All user data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent."
      },
      {
        question: "How often is the data updated?",
        answer: "Weather data is fetched in real-time whenever you make a prediction. Our crop database and pricing information are updated regularly to ensure accuracy."
      }
    ]
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(faqs.map(f => f.category))];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq => 
    activeCategory === 'All' || faq.category === activeCategory
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
          <h1 className="page-hero-title">Frequently Asked Questions</h1>
          <p className="page-hero-subtitle">
            Find answers to common questions about AgriNova
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
              placeholder="Search your question..."
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
              <h3>No results found</h3>
              <p>Try searching with different keywords</p>
            </div>
          )}
        </div>

        {/* Still Have Questions */}
        <div className="faq-contact-section">
          <div className="faq-contact-card">
            <MessageCircle size={32} className="faq-contact-icon" />
            <h2 className="faq-contact-title">Still have questions?</h2>
            <p className="faq-contact-text">
              Can't find the answer you're looking for? Please chat with our friendly team.
            </p>
            <div className="faq-contact-buttons">
              <a href="/contact" className="btn btn-primary">
                <MessageCircle size={18} />
                Contact Support
              </a>
              <a href="mailto:support@agrinova.com" className="btn btn-outline">
                <Mail size={18} />
                Email Us
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