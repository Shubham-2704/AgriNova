import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Page.css'

const AboutUs = () => {
  return (
    <div className="page">
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>About AgriNova</h1>
          <p>Revolutionizing agriculture with AI-powered insights</p>
        </div>

        <div className="page-content">
          <section className="content-section">
            <h2>Our Mission</h2>
            <p>
              At AgriNova, we're on a mission to transform traditional farming into smart, data-driven agriculture. 
              We believe that every farmer deserves access to cutting-edge technology that can help them make better 
              decisions, increase yields, and maximize profits.
            </p>
          </section>

          <section className="content-section">
            <h2>What We Do</h2>
            <p>
              AgriNova provides AI-powered crop recommendations based on real-time weather data, soil conditions, 
              and historical agricultural patterns. Our platform analyzes multiple factors to suggest the most 
              suitable crops for your specific farm conditions, helping you optimize your agricultural output.
            </p>
          </section>

          <section className="content-section">
            <h2>Our Technology</h2>
            <p>
              We use advanced machine learning algorithms trained on extensive agricultural datasets to provide 
              accurate crop recommendations. Our system integrates live weather APIs, soil analysis, and market 
              price data to give you comprehensive insights for informed decision-making.
            </p>
          </section>

          <section className="content-section">
            <h2>Why Choose Us</h2>
            <ul className="feature-list">
              <li>✅ 90%+ prediction accuracy with Random Forest ML models</li>
              <li>✅ Real-time weather integration for up-to-date recommendations</li>
              <li>✅ Comprehensive profit and production calculations</li>
              <li>✅ User-friendly interface designed for farmers</li>
              <li>✅ Continuous learning and improvement of our algorithms</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutUs
