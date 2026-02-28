import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Linkedin, Twitter } from 'lucide-react';
import './Page.css';

const teamMembers = [
  {
    name: "Dr. Rajesh Kumar",
    role: "Chief Agricultural Scientist",
    image: "👨‍🔬",
    bio: "20+ years of experience in agricultural research and crop optimization. PhD in Agricultural Science from IARI.",
    expertise: ["Crop Science", "Research", "Sustainability"],
    social: {
      email: "rajesh.kumar@agrinova.com",
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    name: "Priya Sharma",
    role: "Lead Data Scientist",
    image: "👩‍💻",
    bio: "Expert in machine learning and AI applications in agriculture. Previously led ML teams at tech startups.",
    expertise: ["Machine Learning", "AI", "Data Analytics"],
    social: {
      email: "priya.sharma@agrinova.com",
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    name: "Amit Patel",
    role: "Product Manager",
    image: "👨‍💼",
    bio: "Passionate about bringing technology to farmers. 10+ years in agtech product development.",
    expertise: ["Product Strategy", "UX Design", "AgTech"],
    social: {
      email: "amit.patel@agrinova.com",
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    name: "Sneha Desai",
    role: "UX Designer",
    image: "👩‍🎨",
    bio: "Creating intuitive experiences for agricultural technology. Focus on farmer-centric design.",
    expertise: ["UI/UX Design", "User Research", "Accessibility"],
    social: {
      email: "sneha.desai@agrinova.com",
      linkedin: "#",
      twitter: "#"
    }
  }
];

const OurTeam = () => {
  return (
    <div className="page">
      <Navbar />
      
      {/* Hero Section */}
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">Our Team</h1>
          <p className="page-hero-subtitle">
            Meet the passionate experts behind AgriNova dedicated to transforming agriculture
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Team Intro */}
        <div className="team-intro">
          <div className="team-intro-content">
            <span className="section-tag">Who We Are</span>
            <h2 className="team-intro-title">Experts in Agriculture & Technology</h2>
            <p className="team-intro-text">
              Our team combines decades of agricultural expertise with cutting-edge technology 
              to deliver the best solutions for farmers. From soil scientists to AI engineers, 
              we're united by a common goal: making farming smarter and more profitable.
            </p>
          </div>
        </div>

        {/* Team Grid - 4 in one line */}
        <div className="team-grid-four">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member-card">
              <div className="team-member-avatar">{member.image}</div>
              <div className="team-member-info">
                <h3 className="team-member-name">{member.name}</h3>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-bio">{member.bio}</p>
                
                {/* Expertise Tags */}
                <div className="team-member-expertise">
                  {member.expertise.map((skill, i) => (
                    <span key={i} className="expertise-tag">{skill}</span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="team-member-social">
                  <a href={`mailto:${member.social.email}`} className="social-icon" aria-label="Email">
                    <Mail size={16} />
                  </a>
                  <a href={member.social.linkedin} className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin size={16} />
                  </a>
                  <a href={member.social.twitter} className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <Twitter size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join Us Section */}
        <div className="team-join-section">
          <div className="team-join-content">
            <h2 className="team-join-title">Join Our Team</h2>
            <p className="team-join-text">
              We're always looking for passionate individuals to help us revolutionize agriculture.
            </p>
            <a href="/careers" className="btn btn-primary">View Open Positions</a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OurTeam;