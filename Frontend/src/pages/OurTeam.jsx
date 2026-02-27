import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Page.css'

const teamMembers = [
  {
    name: "Dr. Rajesh Kumar",
    role: "Chief Agricultural Scientist",
    image: "👨‍🔬",
    bio: "20+ years of experience in agricultural research and crop optimization"
  },
  {
    name: "Priya Sharma",
    role: "Lead Data Scientist",
    image: "👩‍💻",
    bio: "Expert in machine learning and AI applications in agriculture"
  },
  {
    name: "Amit Patel",
    role: "Product Manager",
    image: "👨‍💼",
    bio: "Passionate about bringing technology to farmers"
  },
  {
    name: "Sneha Desai",
    role: "UX Designer",
    image: "👩‍🎨",
    bio: "Creating intuitive experiences for agricultural technology"
  }
]

const OurTeam = () => {
  return (
    <div className="page">
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>Our Team</h1>
          <p>Meet the people behind AgriNova</p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card card">
              <div className="team-avatar">{member.image}</div>
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default OurTeam
