import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Page.css';

const OurTeam = () => {
  const { t } = useTranslation();
  
  const teamMembers = [
    {
      key: "shubham",
      image: "https://res.cloudinary.com/dpn6jplxx/image/upload/v1772454673/shubham_ac80ab.png",
      social: {
        email: "shubhampatel2728@gmail.com",
        linkedin: "https://www.linkedin.com/in/shubham-badresiya/",
      }
    },
    {
      key: "hiten",
      image: "https://res.cloudinary.com/dpn6jplxx/image/upload/v1772454613/hiten_yltcwx.png",
      social: {
        email: "hp040912@gmail.com",
        linkedin: "https://www.linkedin.com/in/hitenpatel2004/",
      }
    },
    {
      key: "meet",
      image: "https://res.cloudinary.com/dpn6jplxx/image/upload/v1772454680/meet_pvwly4.png",
      social: {
        email: "meetprajapati5243@gmail.com",
        linkedin: "https://www.linkedin.com/in/meetprajapati03/",
      }
    },
    {
      key: "kirtan",
      image: "https://res.cloudinary.com/dpn6jplxx/image/upload/v1772454646/kirtan_zkcz1s.png",
      social: {
        email: "kdp862005@gmail.com",
        linkedin: "https://www.linkedin.com/in/kirtan-patel8/",
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
              <div className="team-member-avatar">
                <img src={member.image} alt={t(`team.members.${member.key}.name`)} />
              </div>
              <div className="team-member-info">
                <h3 className="team-member-name">{t(`team.members.${member.key}.name`)}</h3>
                <p className="team-member-role">{t(`team.members.${member.key}.role`)}</p>
                <p className="team-member-bio">{t(`team.members.${member.key}.bio`)}</p>
                
                {/* Expertise Tags */}
                <div className="team-member-expertise">
                  {t(`team.members.${member.key}.expertise`, { returnObjects: true }).map((skill, i) => (
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OurTeam;