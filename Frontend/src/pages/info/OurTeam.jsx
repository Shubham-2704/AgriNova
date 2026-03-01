import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Linkedin, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Page.css';

const OurTeam = () => {
  const { t } = useTranslation();
  
  const teamMembers = [
    {
      name: t('team.member1Name'),
      role: t('team.member1Role'),
      image: "👨‍🔬",
      bio: t('team.member1Bio'),
      expertise: [t('team.cropScience'), t('team.research'), t('team.sustainability')],
      social: {
        email: "rajesh.kumar@agrinova.com",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: t('team.member2Name'),
      role: t('team.member2Role'),
      image: "👩‍💻",
      bio: t('team.member2Bio'),
      expertise: [t('team.machineLearning'), t('team.ai'), t('team.dataAnalytics')],
      social: {
        email: "priya.sharma@agrinova.com",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: t('team.member3Name'),
      role: t('team.member3Role'),
      image: "👨‍💼",
      bio: t('team.member3Bio'),
      expertise: [t('team.productStrategy'), t('team.uxDesign'), t('team.agtech')],
      social: {
        email: "amit.patel@agrinova.com",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: t('team.member4Name'),
      role: t('team.member4Role'),
      image: "👩‍🎨",
      bio: t('team.member4Bio'),
      expertise: [t('team.uiuxDesign'), t('team.userResearch'), t('team.accessibility')],
      social: {
        email: "sneha.desai@agrinova.com",
        linkedin: "#",
        twitter: "#"
      }
    }
  ];
  return (
    <div className="page">
      <Navbar />
      
      {/* Hero Section */}
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">{t('team.title')}</h1>
          <p className="page-hero-subtitle">
            {t('team.subtitle')}
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Team Intro */}
        <div className="team-intro">
          <div className="team-intro-content">
            <span className="section-tag">{t('team.whoWeAre')}</span>
            <h2 className="team-intro-title">{t('team.expertsTitle')}</h2>
            <p className="team-intro-text">
              {t('team.expertsDesc')}
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
            <h2 className="team-join-title">{t('team.joinTeam')}</h2>
            <p className="team-join-text">
              {t('team.joinTeamDesc')}
            </p>
            <a href="/careers" className="btn btn-primary">{t('team.viewPositions')}</a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OurTeam;