import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Pencil, SlidersHorizontal, Sparkles, Mail, Phone } from 'lucide-react'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import './LandingPage.css'
import TiltedCard from '../../components/tilted-cards'

// Animation hook for fade-in on scroll
function useFadeInOnScroll(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { 
        threshold: options.threshold || 0.1, 
        rootMargin: options.rootMargin || '-50px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return [ref, isVisible]
}

// Hook for animating multiple children with stagger
function useStaggerAnimation(parentRef, isVisible, count = 1, delay = 0.1) {
  useEffect(() => {
    if (!parentRef.current) return
    
    const children = parentRef.current.children
    
    if (isVisible) {
      Array.from(children).forEach((child, index) => {
        if (child) {
          child.style.transitionDelay = `${delay + index * 0.15}s`
          // Force reflow to restart transition
          child.classList.remove('visible')
          void child.offsetWidth // eslint-disable-line no-unused-expressions
          setTimeout(() => {
            child.classList.add('visible')
          }, 50 + (delay + index * 0.15) * 100)
        }
      })
    } else {
      Array.from(children).forEach((child) => {
        if (child) {
          child.classList.remove('visible')
          child.style.transitionDelay = '0s'
        }
      })
    }
  }, [isVisible, count, delay, parentRef])
}


function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="logo">TaskMaster</div>

      <ul className="nav-center" role="menubar">
        <li role="none"><a className="nav-link" href='#Home' role="menuitem">Home</a></li>
        <li role="none"><a className="nav-link" href='#Features' role="menuitem">Features</a></li>
        <li role="none"><a className="nav-link" href='#Pricing' role="menuitem">Pricing</a></li>
        <li role="none"><a className="nav-link" href='#contact' role="menuitem">Contact</a></li>
      </ul>

      <div className="nav-right">
        <Link className="nav-link" to='/login' aria-label="Login to your account">Login</Link>
        <Link className="nav-link nav-sign-up" to='/signup' aria-label="Sign up for free">Get Started for Free</Link>
      </div>
    </nav>
  )
}

function Home() {
  const [sectionRef, isVisible] = useFadeInOnScroll({ threshold: 0.2, rootMargin: '-80px' })

  return (
    <section id='Home' className="hero-section" aria-label="Hero section">
      <div className={`home ${isVisible ? 'fade-in-visible' : ''}`} ref={sectionRef}>
        <div className="home-content">
          <h1 className={`animate-element ${isVisible ? 'visible' : ''}`}>TaskMaster</h1>
          <h2 className={`animate-element ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.1s' }}>Stay Organized. Get Things Done.</h2>
          <h3 className={`animate-element ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.2s' }}>Manage your tasks, track your progress, and boost your productivity — all in one place</h3>
          <Link to="/signup" className={`cta-button animate-element ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.3s' }} aria-label="Get started with TaskMaster">
            Get Started
            <ArrowRight className="arrow-icon" aria-hidden="true" />
          </Link>
          <p className={`cta-content animate-element ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.4s' }}>No credit card. No clutter. Just clarity.</p>
        </div>
        <div className={`home-image animate-element ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.3s' }}>
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFza3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
            alt="Task Management Dashboard - Organize and track your tasks efficiently"
            loading="lazy"
            width="400"
            height="300"
          />
        </div>
      </div>
    </section>
  )
}

function Features() {
  const [sectionRef, isVisible] = useFadeInOnScroll({ threshold: 0.15, rootMargin: '-60px' })
  const featuresContainerRef = useRef(null)
  useStaggerAnimation(featuresContainerRef, isVisible, 4, 0.1)

  return (
    <section id='Features' className="features-section" aria-label="Features section">
      <div className={`features ${isVisible ? 'fade-in-visible' : ''}`} ref={sectionRef}>
        <header className="animate-header">
          <h1 className={`animate-element ${isVisible ? 'visible' : ''}`}>Features</h1>
          <p className={`animate-element ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.1s' }}>Discover the powerful features of our task manager!</p>
        </header>

        <div className="features-container" ref={featuresContainerRef} role="list">
          <TiltedCard
            title="Smart Task Organization"
            text="Turn chaos into clarity. Group tasks, set priorities, and always know what to do next"
            role="listitem"
          />

          <TiltedCard
            title="Focus Mode"
            text="Eliminate distractions and work on one task at a time — like a pro."
            role="listitem"
          />

          <TiltedCard
            title="Progress Tracking"
            text="See how far you've come. Stay motivated with visual progress and completion stats."
            role="listitem"
          />

          <TiltedCard
            title="Deadlines That Work"
            text="Never miss important tasks again with smart reminders and due dates."
            role="listitem"
          />
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const [sectionRef, isVisible] = useFadeInOnScroll({ threshold: 0.15, rootMargin: '-60px' })
  const stepsRef = useRef(null)
  useStaggerAnimation(stepsRef, isVisible, 3, 0.15)

  return (
    <section className="how-it-works-section" aria-label="How It Works section">
      <div className={`how-it-works ${isVisible ? 'fade-in-visible' : ''}`} ref={sectionRef}>
        <header className="animate-header">
          <h1 className={`animate-element ${isVisible ? 'visible' : ''}`}>How It Works</h1>
          <div className="steps">
            <p className={`animate-element ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.1s' }}>Three Simple Steps to Transform Your Day With Ease</p>
            <div className="step" ref={stepsRef} role="list">
              <div className="step-card step-card-1" role="listitem">
                <h2>Step 1</h2>
                <p>Write down your tasks.</p>
                <Pencil className="step-icon" aria-hidden="true" />
              </div>
              <div className="step-card step-card-2" role="listitem">
                <h2>Step 2</h2>
                <p>Prioritize and organize what matters.</p>
                <SlidersHorizontal className="step-icon" aria-hidden="true" />
              </div>
              <div className="step-card step-card-3" role="listitem">
                <h2>Step 3</h2>
                <p>Track progress and celebrate wins.</p>
                <Sparkles className="step-icon" aria-hidden="true" />
              </div>
            </div>
          </div>
        </header>
      </div>
    </section>
  )
}


function Pricing() {
  const [sectionRef, isVisible] = useFadeInOnScroll({ threshold: 0.1, rootMargin: '-50px' })
  const pricingGridRef = useRef(null)
  useStaggerAnimation(pricingGridRef, isVisible, 3, 0.15)

  return (
    <section id='Pricing' className="pricing-section" aria-label="Pricing section">
      <div className={`pricing ${isVisible ? 'fade-in-visible' : ''}`} ref={sectionRef}>
        <header className="animate-header">
          <h1 className={`h1-price animate-element ${isVisible ? 'visible' : ''}`}>Simple Plans That Scale With You</h1>
        </header>
        <div className='pricing-grid' ref={pricingGridRef} role="list">
          <div className="pricing-card pricing-card-1" role="listitem">
            <h3>Free Plan</h3>
            <p>Best For Individuals. Getting Started</p>
            <hr aria-hidden="true" />
            <h2>Free</h2>
            <button className='pricing-button' aria-label="Start with Free Plan">Start Free Now</button>
            <hr aria-hidden="true" />
            <ul>
              <li><Check className='check-icon' aria-hidden="true" /> Task automation</li>
              <li><Check className='check-icon' aria-hidden="true" /> Email and Slack notifications</li>
              <li><Check className='check-icon' aria-hidden="true" /> 24/7 activity tracking</li>
            </ul>
          </div>

          <div className='pricing-card pricing-card-2' role="listitem">
            <h3>Focus Plan</h3>
            <p>For individuals who want to stay consistent</p>
            <hr aria-hidden="true" />
            <h2>$4.99<span className='price-period'>/mo</span></h2>
            <button className='pricing-button' aria-label="Start 7-Day Trial for Focus Plan">Start 7-Day Trial</button>
            <hr aria-hidden="true" />
            <ul>
              <li><Check className='check-icon' aria-hidden="true" /> Everything in Starter</li>
              <li><Check className='check-icon' aria-hidden="true" /> Focus mode (distraction-free)</li>
              <li><Check className='check-icon' aria-hidden="true" /> Priority task planning</li>
              <li><Check className='check-icon' aria-hidden="true" /> Progress tracking</li>
            </ul>
          </div>

          <div className='pricing-card pricing-popular pricing-card-3' role="listitem" aria-label="Master Plan - Most Popular">
            <div className="badge">Get 20% OFF this month</div>
            <h3>Master Plan</h3>
            <p>For individuals serious about productivity</p>
            <hr aria-hidden="true" />
            <h2>$9.99<span className='price-period'>/mo</span></h2>
            <button className='pricing-button' aria-label="Start 14-Day Trial for Master Plan">Start 14-Day Trial</button>
            <hr aria-hidden="true" />
            <ul>
              <li><Check className='check-icon' aria-hidden="true" /> Everything in Focus</li>
              <li><Check className='check-icon' aria-hidden="true" /> Advanced task insights</li>
              <li><Check className='check-icon' aria-hidden="true" /> Smart scheduling</li>
              <li><Check className='check-icon' aria-hidden="true" /> Habit & productivity analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [sectionRef, isVisible] = useFadeInOnScroll({ threshold: 0.1, rootMargin: '-50px' })
  const footerColsRef = useRef(null)
  useStaggerAnimation(footerColsRef, isVisible, 4, 0.1)

  return (
    <section id='contact' className="contact-section" aria-label="Contact section">
      <footer className={`footer ${isVisible ? 'fade-in-visible' : ''}`} id="contact" ref={sectionRef}>
        <div className="footer-container" ref={footerColsRef}>

          <div className="footer-col footer-col-1">
            <h3 className="logo">TaskMaster</h3>
            <p>
              TaskMaster helps you stay organized, focused, and productive —
              all in one simple workspace.
            </p>

            <address className="address">
              Gaborone, Botswana <br />
              Building Your Productivity Future
            </address>
          </div>

          <div className="footer-col footer-col-2">
            <h4>Pages</h4>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-col footer-col-3">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">FAQs</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>

          <div className="footer-col footer-col-4">
            <h4>Contact</h4>

            <div className="socials" role="list" aria-label="Social media links">
              <a href="https://facebook.com" aria-label="Follow us on Facebook" role="listitem"><FaFacebook /></a>
              <a href="https://instagram.com" aria-label="Follow us on Instagram" role="listitem"><FaInstagram /></a>
              <a href="https://twitter.com" aria-label="Follow us on Twitter" role="listitem"><FaTwitter /></a>
            </div>

            <p className="contact-item">
              <Phone size={16} aria-hidden="true" /> +267 123 4567
            </p>

            <p className="contact-item">
              <Mail size={16} aria-hidden="true" /> support@taskmaster.com
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
    <main>
      <Home />
      <Features />
      <HowItWorks />
      <Pricing />
      <Contact />
    </main>
   </div>
  )
}
