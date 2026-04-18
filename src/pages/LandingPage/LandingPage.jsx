import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Pencil, SlidersHorizontal, Sparkles, Mail, Phone  } from 'lucide-react'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import './LandingPage.css'
import TiltedCard from '../../components/tilted-cards'


function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="logo">TaskMaster</div>

      <ul className="nav-center">
        <li><a className="nav-link" href='#Home'>Home</a></li>
        <li><a className="nav-link" href='#Features'>Features</a></li>
        <li><a className="nav-link" href='#Pricing'>Pricing</a></li>
        <li><a className="nav-link" href='#contact'>Contact</a></li>
      </ul>

      <div className="nav-right">
        <Link className="nav-link" to='/login'>Login</Link>
        <Link className="nav-link nav-sign-up" to='/signup'>Get Started for Free</Link>
      </div>
    </nav>
  )
}

function Home() {
  return (
    <section id='Home'>
      <div className="home">
        <div className="home-content">
          <h1>TaskMaster</h1>
          <h2>Stay Organized. Get Things Done.</h2>
          <h3>Manage your tasks, track your progress, and boost your productivity — all in one place</h3>
          <Link to="/signup" className="cta-button">
            Get Started
            <ArrowRight className="arrow-icon" />
          </Link>
          <p className='cta-content'>No credit card. No clutter. Just clarity.</p>
        </div>
        <div className="home-image">
          <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFza3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" alt="Task Management" />
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id='Features'>
      <div className="features">
        <h1>Features</h1>
        <p>Discover the powerful features of our task manager!</p>

        <div className="features-container">
          <TiltedCard
            title="Smart Task Organization"
            text="Turn chaos into clarity. Group tasks, set priorities, and always know what to do next"
          />

          <TiltedCard
            title="Focus Mode"
            text="Eliminate distractions and work on one task at a time — like a pro."
          />

          <TiltedCard
            title="Progress Tracking"
            text="See how far you've come. Stay motivated with visual progress and completion stats."
          />

          <TiltedCard
            title="Deadlines That Work"
            text="Never miss important tasks again with smart reminders and due dates."
          />
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="how-it-works">
        <h1>How It Works</h1>
        <div className="steps">
          <p>Three Simple Steps to Transform Your Day With Ease</p>
          <div className="step">
            <div className="step-card">
              <h2>Step 1</h2>
              <p>Write down your tasks.</p>
              <Pencil className="step-icon" />
            </div>
            <div className="step-card">
              <h2>Step 2</h2>
              <p>Prioritize and organize what matters.</p>
              <SlidersHorizontal className="step-icon" />
            </div>
            <div className="step-card">
              <h2>Step 3</h2>
              <p>Track progress and celebrate wins.</p>
              <Sparkles className="step-icon" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function Pricing() {
  return (
    <section id='Pricing'>
      <div className="pricing">
        <h1 className='h1-price'>Simple Plans That Scale With You</h1>
        <div className='pricing-grid'>
          <div className="pricing-card">
            <h3>Free Plan</h3>
            <p>Best For Individuals. Getting Started</p>
            <hr></hr>
            <h2>Free</h2>
            <button className='pricing-button'>Start Free Now</button>
            <hr></hr>
            <ul>
              <li><Check className='check-icon' /> Task automation</li>
              <li><Check className='check-icon' /> Email and Slack notifications</li>
              <li><Check className='check-icon' /> 24/7 activity tracking</li>
            </ul>
          </div>

          <div className='pricing-card'>
            <h3>Focus Plan</h3>
            <p>For individuals who want to stay consistent</p>
            <hr></hr>
            <h2>$4.99<span className='price-period'>/mo</span></h2>
            <button className='pricing-button'>Start 7-Day Trial</button>
            <hr></hr>
            <ul>
              <li><Check className='check-icon' /> Everything in Starter</li>
              <li><Check className='check-icon' /> Focus mode (distraction-free)</li>
              <li><Check className='check-icon' /> Priority task planning</li>
              <li><Check className='check-icon' /> Progress tracking</li>
            </ul>
          </div>

          <div className='pricing-card pricing-popular'>
            <div className="badge">Get 20% OFF this month</div>
            <h3>Master Plan</h3>
            <p>For individuals serious about productivity</p>
            <hr></hr>
            <h2>$9.99<span className='price-period'>/mo</span></h2>
            <button className='pricing-button'>Start 14-Day Trial</button>
            <hr></hr>
            <ul>
              <li><Check className='check-icon' /> Everything in Focus</li>
              <li><Check className='check-icon' /> Advanced task insights</li>
              <li><Check className='check-icon' /> Smart scheduling</li>
              <li><Check className='check-icon' /> Habit & productivity analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id='contact'>
      <footer className="footer" id="contact">
        <div className="footer-container">

          <div className="footer-col">
            <h3 className="logo">TaskMaster</h3>
            <p>
              TaskMaster helps you stay organized, focused, and productive —
              all in one simple workspace.
            </p>

            <p className="address">
              Gaborone, Botswana <br />
              Building Your Productivity Future
            </p>
          </div>

          <div className="footer-col">
            <h4>Pages</h4>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">FAQs</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>

            <div className="socials">
              <FaFacebook />
              <FaInstagram />
              <FaTwitter />
            </div>

            <p className="contact-item">
              <Phone size={16} /> +267 123 4567
            </p>

            <p className="contact-item">
              <Mail size={16} /> support@taskmaster.com
            </p>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} TaskMaster. All rights reserved.
        </div>
      </footer>
    </section>
  )
}


export default function LandingPage() {
  return (
   <div className="landingpage">
    <Navbar />
    <Home />
    <Features />
    <HowItWorks />
    <Pricing />
    <Contact />
   </div>
  )
}
