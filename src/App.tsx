import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Download,
  ArrowRight,
  Mail,
  Terminal,
  FileCode,
  FileJson,
  GraduationCap,
  Code,
  Rocket,
  Puzzle,
  Braces,
  Layout,
  Wrench,
  Info,
  ShoppingBag,
  ExternalLink,
  Github,
  CheckSquare,
  MapPin,
  BookOpen,
  Award,
  Zap,
  Brain,
  Cpu,
  GitPullRequest,
  Users,
  Sparkles,
  Phone,
  Share2,
  Linkedin,
  User,
  MessageSquare,
  Send,
  CheckCircle,
  ArrowUp,
  X,
  Loader,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Pause
} from 'lucide-react';

interface Skill {
  name: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  icon: React.ReactNode;
  bgClass: string;
}

interface GalleryPhoto {
  url: string;
  title: string;
  category: string;
  desc: string;
}

function App() {
  /* ==========================================================================
     REACT STATES
     ========================================================================== */
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  // Active Tab for Mock IDE Code Editor
  const [activeTab, setActiveTab] = useState<'js' | 'json'>('js');

  // Slider & Gallery states
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxImg, setLightboxImg] = useState<GalleryPhoto | null>(null);

  /* ==========================================================================
     DATA SECTIONS (Easy to edit/customize)
     ========================================================================== */
  const programmingSkills: Skill[] = [
    { name: 'JavaScript (ES6+)' },
    { name: 'Python' },
    { name: 'C++' },
    { name: 'SQL' }
  ];

  const webSkills: Skill[] = [
    { name: 'HTML5' },
    { name: 'CSS3 / Grid / Flexbox' },
    { name: 'JavaScript' },
    { name: 'React' }
  ];

  const toolSkills: Skill[] = [
    { name: 'Git' },
    { name: 'GitHub' },
    { name: 'VS Code' },
    { name: 'Command Line' }
  ];

  const projectsData: Project[] = [
    {
      name: 'Project One (E-Commerce Web UI)',
      description: 'A responsive e-commerce storefront landing interface showcasing product filters, visual grid layouts, state management cart simulations, and interactive details tabs.',
      technologies: ['React', 'CSS Grid', 'LocalStorage'],
      githubUrl: 'https://github.com/jivanwarankar',
      demoUrl: '#projects',
      icon: <ShoppingBag className="w-12 h-12 text-indigo-500 opacity-80" />,
      bgClass: 'bg-gradient-to-br from-indigo-500/25 to-purple-500/15'
    },
    {
      name: 'Project Two (Weather App & Tracker)',
      description: 'A dynamic weather searching tool utilizing weather open APIs to render five-day forecasts, location-based auto search, interactive weather condition icons, and detailed humidity charts.',
      technologies: ['JavaScript', 'API Fetch', 'CSS Flexbox'],
      githubUrl: 'https://github.com/jivanwarankar',
      demoUrl: '#projects',
      icon: <CheckSquare className="w-12 h-12 text-emerald-500 opacity-80" />,
      bgClass: 'bg-gradient-to-br from-emerald-500/25 to-indigo-500/15'
    },
    {
      name: 'Project Three (CLI File Organizer)',
      description: 'A command-line script utilities package that automates categorizing clutter files by extensions, compressing archive folders, logging transaction directories, and validating folder sizes.',
      technologies: ['Python', 'Data Analysis', 'Pandas'],
      githubUrl: 'https://github.com/jivanwarankar',
      demoUrl: '#projects',
      icon: <Terminal className="w-12 h-12 text-rose-500 opacity-80" />,
      bgClass: 'bg-gradient-to-br from-rose-500/25 to-amber-500/15'
    }
  ];

  // 10 Online Free Technology & Development Photos (Unsplash source)
  const galleryPhotos: GalleryPhoto[] = [
    {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      title: 'Modern Coding Workflow',
      category: 'Development',
      desc: 'Writing clean, optimized frontend architecture using modular design patterns.'
    },
    {
      url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
      title: 'Syntax Highlighting & IDEs',
      category: 'Tools',
      desc: 'Configuring custom developer environments for maximum terminal efficiency.'
    },
    {
      url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      title: 'Responsive Web Design',
      category: 'Design',
      desc: 'Crafting fluid layouts that align perfectly across desktop and mobile browsers.'
    },
    {
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      title: 'Developer Workspace',
      category: 'Workspace',
      desc: 'A minimal, focused productivity environment tailored for full-stack engineering.'
    },
    {
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      title: 'Secure Cloud Infrastructures',
      category: 'Security',
      desc: 'Analyzing data pathways and deploying secure token authentications.'
    },
    {
      url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      title: 'UI Wireframing & Prototyping',
      category: 'Design',
      desc: 'Iterating through user journeys to construct intuitive navigation patterns.'
    },
    {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      title: 'Hardware & System Architectures',
      category: 'Systems',
      desc: 'Exploring logical gates, assembly connections, and memory allocations.'
    },
    {
      url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
      title: 'Web Application Dashboards',
      category: 'Data',
      desc: 'Visualizing key system metrics and API database request logs in real time.'
    },
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      title: 'Algorithm Debugging',
      category: 'Development',
      desc: 'Tracing binary branches and recursive functions to solve logic puzzles.'
    },
    {
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      title: 'Sprint Planning & Git Pipelines',
      category: 'Workflows',
      desc: 'Collaborating on version histories and managing continuous deployment builds.'
    }
  ];

  /* ==========================================================================
     EFFECTS & OBSERVERS
     ========================================================================== */
  // Theme logic
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      setTheme(systemPrefersLight ? 'light' : 'dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Window scroll observers
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Scrolled Header styling
      if (scrollPosition > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Back to top button visibility
      if (scrollPosition > 500) {
        setBackToTopVisible(true);
      } else {
        setBackToTopVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scrollspy & Scroll-reveal triggers
  useEffect(() => {
    const sectionsList = document.querySelectorAll('section[id]');
    const scrollRevealList = document.querySelectorAll('.scroll-reveal');

    // Scrollspy Observer
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    sectionsList.forEach((section) => sectionObserver.observe(section));

    // Scroll Reveal Observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    scrollRevealList.forEach((el) => revealObserver.observe(el));

    return () => {
      sectionsList.forEach((section) => sectionObserver.unobserve(section));
      scrollRevealList.forEach((el) => revealObserver.unobserve(el));
    };
  }, []);

  // Autoplay functionality for Slider
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % galleryPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  /* ==========================================================================
     HANDLERS & NAVIGATION HELPERS
     ========================================================================== */
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Please enter your name';
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errors.subject = 'Please enter a subject';
    if (!formData.message.trim()) errors.message = 'Please enter your message details';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessVisible(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setIsSuccessVisible(false);
      }, 8000);
    }, 1500);
  };

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const targetElement = document.getElementById(id);
    if (targetElement) {
      window.location.hash = id;
      setIsMenuOpen(false);
    }
  };

  // Slider navigation
  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % galleryPhotos.length);
  };

  return (
    <>
      {/* Navigation Header */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`} id="header">
        <div className="nav-container container">
          <a href="#hero" className="logo" onClick={(e) => scrollToSection('hero', e)}>
            <span className="logo-accent">&lt;</span>Jivan<span className="logo-highlight">Warankar</span><span className="logo-accent"> /&gt;</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="nav-menu" role="navigation" aria-label="Main Navigation">
            <ul className="nav-list">
              <li>
                <a
                  href="#about"
                  className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('about', e)}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('skills', e)}
                >
                  Skills
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('projects', e)}
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className={`nav-link ${activeSection === 'gallery' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('gallery', e)}
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#education"
                  className={`nav-link ${activeSection === 'education' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('education', e)}
                >
                  Education
                </a>
              </li>
              <li>
                <a
                  href="#highlights"
                  className={`nav-link ${activeSection === 'highlights' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('highlights', e)}
                >
                  Why Me
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('contact', e)}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Action buttons */}
          <div className="nav-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <a href="./resume/Jivan-Warankar-Resume.pdf" className="btn btn-outline btn-sm resume-btn" download>
              <Download className="w-4 h-4" />
              <span>Resume</span>
            </a>

            <button
              className="hamburger-menu"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`} id="mobile-drawer" aria-hidden={!isMenuOpen}>
        <div className="drawer-header">
          <a href="#hero" className="logo-mobile" onClick={(e) => scrollToSection('hero', e)}>
            <span className="logo-accent">&lt;</span>Jivan<span className="logo-accent">/&gt;</span>
          </a>
          <button className="drawer-close" onClick={() => setIsMenuOpen(false)} aria-label="Close navigation menu">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="drawer-nav">
          <ul className="drawer-list">
            <li>
              <a
                href="#about"
                className={`drawer-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={(e) => scrollToSection('about', e)}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#skills"
                className={`drawer-link ${activeSection === 'skills' ? 'active' : ''}`}
                onClick={(e) => scrollToSection('skills', e)}
              >
                Skills
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className={`drawer-link ${activeSection === 'projects' ? 'active' : ''}`}
                onClick={(e) => scrollToSection('projects', e)}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#gallery"
                className={`drawer-link ${activeSection === 'gallery' ? 'active' : ''}`}
                onClick={(e) => scrollToSection('gallery', e)}
              >
                Gallery
              </a>
            </li>
            <li>
              <a
                href="#education"
                className={`drawer-link ${activeSection === 'education' ? 'active' : ''}`}
                onClick={(e) => scrollToSection('education', e)}
              >
                Education
              </a>
            </li>
            <li>
              <a
                href="#highlights"
                className={`drawer-link ${activeSection === 'highlights' ? 'active' : ''}`}
                onClick={(e) => scrollToSection('highlights', e)}
              >
                Why Me
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={`drawer-link ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={(e) => scrollToSection('contact', e)}
              >
                Contact
              </a>
            </li>
          </ul>
          <div className="drawer-footer">
            <a href="./resume/Jivan-Warankar-Resume.pdf" className="btn btn-primary w-full" download>
              <Download className="w-4 h-4" />
              <span>Download Resume</span>
            </a>
          </div>
        </nav>
      </div>
      <div
        className={`drawer-overlay ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <main id="main-content">
        {/* Hero Section */}
        <section className="hero-section section" id="hero">
          <div className="hero-container container">
            <div className="hero-content scroll-reveal reveal-left">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                <span className="badge-text">Open to Opportunities</span>
              </div>
              <h1 className="hero-title">
                Hi, I'm <span className="text-gradient">Jivan Warankar</span>
              </h1>
              <h2 className="hero-subtitle">IT Graduate | Aspiring Software Developer</h2>
              <p className="hero-desc">
                I am an Information Technology graduate passionate about technology, software development, problem solving, and building useful digital experiences. Let's construct clean, modern applications together.
              </p>
              <div className="hero-buttons">
                <a
                  href="#projects"
                  className="btn btn-primary"
                  onClick={(e) => scrollToSection('projects', e)}
                >
                  <span>View My Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#contact"
                  className="btn btn-outline"
                  onClick={(e) => scrollToSection('contact', e)}
                >
                  <span>Contact Me</span>
                  <Mail className="w-4 h-4" />
                </a>
                <a href="./resume/Jivan-Warankar-Resume.pdf" className="btn btn-ghost" download>
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
              </div>
            </div>

            {/* Right Side - Interactive Code IDE Graphic */}
            <div className="hero-graphic scroll-reveal reveal-right">
              <div className="ide-window">
                <div className="ide-header">
                  <div className="ide-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                  </div>
                  <div className="ide-title">{activeTab === 'js' ? 'developer.js' : 'skills.json'}</div>
                  <div className="ide-actions">
                    <Terminal className="w-4 h-4" />
                  </div>
                </div>
                <div className="ide-tabs">
                  <button
                    className={`ide-tab ${activeTab === 'js' ? 'active' : ''}`}
                    onClick={() => setActiveTab('js')}
                  >
                    <FileCode className="w-3.5 h-3.5 tab-icon" />
                    <span>developer.js</span>
                  </button>
                  <button
                    className={`ide-tab ${activeTab === 'json' ? 'active' : ''}`}
                    onClick={() => setActiveTab('json')}
                  >
                    <FileJson className="w-3.5 h-3.5 tab-icon" />
                    <span>skills.json</span>
                  </button>
                </div>
                <div className="ide-editor">
                  {activeTab === 'js' ? (
                    <div className="code-lines">
                      <div className="code-line">
                        <span className="line-num">1</span>
                        <span className="code-content"><span className="code-keyword">const</span> <span className="code-variable">developer</span> = &#123;</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">2</span>
                        <span className="code-content"><span className="code-indent"></span>name: <span className="code-string">'Jivan Warankar'</span>,</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">3</span>
                        <span className="code-content"><span className="code-indent"></span>education: <span className="code-string">'B.Sc. Information Technology'</span>,</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">4</span>
                        <span className="code-content"><span className="code-indent"></span>role: <span className="code-string">'Aspiring Software Developer'</span>,</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">5</span>
                        <span className="code-content"><span className="code-indent"></span>skills: [</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">6</span>
                        <span className="code-content"><span className="code-indent"></span><span className="code-indent"></span><span className="code-string">'React'</span>, <span className="code-string">'JavaScript'</span>, <span className="code-string">'HTML/CSS'</span>,</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">7</span>
                        <span className="code-content"><span className="code-indent"></span><span className="code-indent"></span><span className="code-string">'Git'</span>, <span className="code-string">'VS Code'</span>, <span className="code-string">'Software Design'</span></span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">8</span>
                        <span className="code-content"><span className="code-indent"></span>],</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">9</span>
                        <span className="code-content"><span className="code-indent"></span>passions: [</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">10</span>
                        <span className="code-content"><span className="code-indent"></span><span className="code-indent"></span><span className="code-string">'Building digital experiences'</span>,</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">11</span>
                        <span className="code-content"><span className="code-indent"></span><span className="code-indent"></span><span className="code-string">'Solving complex puzzles'</span></span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">12</span>
                        <span className="code-content"><span className="code-indent"></span>],</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">13</span>
                        <span className="code-content"><span className="code-indent"></span>readyToCode: <span className="code-bool">true</span></span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">14</span>
                        <span className="code-content">&#125;;</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">15</span>
                        <span className="code-content"></span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">16</span>
                        <span className="code-content"><span className="code-keyword">function</span> <span className="code-entity">hireJivan</span>() &#123;</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">17</span>
                        <span className="code-content"><span className="code-indent"></span><span className="code-keyword">if</span> (<span className="code-variable">developer</span>.readyToCode) &#123;</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">18</span>
                        <span className="code-content"><span className="code-indent"></span><span className="code-indent"></span><span className="code-keyword">return</span> <span className="code-string">'Let\'s build something great together!'</span>;</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">19</span>
                        <span className="code-content"><span className="code-indent"></span>&#125;</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">20</span>
                        <span className="code-content">&#125;</span>
                      </div>
                    </div>
                  ) : (
                    <div className="code-lines">
                      <div className="code-line">
                        <span className="line-num">1</span>
                        <span className="code-content">&#123;</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">2</span>
                        <span className="code-content"><span className="code-indent"></span><span className="code-keyword">"programming"</span>: [</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">3</span>
                        <span className="code-content"><span className="code-indent"></span><span className="code-indent"></span><span className="code-string">"JavaScript"</span>, <span className="code-string">"Python"</span>, <span className="code-string">"C++"</span></span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">4</span>
                        <span className="code-content"><span className="code-indent"></span>],</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">5</span>
                        <span className="code-content"><span className="code-indent"></span><span className="code-keyword">"webDevelopment"</span>: [</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">6</span>
                        <span className="code-content"><span className="code-indent"></span><span className="code-indent"></span><span className="code-string">"HTML5"</span>, <span className="code-string">"CSS3"</span>, <span className="code-string">"React"</span></span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">7</span>
                        <span className="code-content"><span className="code-indent"></span>],</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">8</span>
                        <span className="code-content"><span className="code-indent"></span><span className="code-keyword">"tools"</span>: [</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">9</span>
                        <span className="code-content"><span className="code-indent"></span><span className="code-indent"></span><span className="code-string">"Git"</span>, <span className="code-string">"GitHub"</span>, <span className="code-string">"VS Code"</span></span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">10</span>
                        <span className="code-content"><span className="code-indent"></span>]</span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">11</span>
                        <span className="code-content">&#125;</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section className="about-section section" id="about">
          <div className="container">
            <div className="section-title-wrapper scroll-reveal">
              <h2 className="section-title text-gradient">About Me</h2>
              <p className="section-subtitle">Get to know my educational background and coding aspirations</p>
            </div>

            <div className="about-content grid-2">
              <div className="about-text scroll-reveal reveal-left">
                <h3>Hi, I'm Jivan.</h3>
                <p className="p-highlight">
                  "Hello! I'm Jivan Warankar, an Information Technology graduate with a strong interest in software development and modern technology. I enjoy learning new technologies, solving problems, and turning ideas into practical digital solutions."
                </p>
                <p>
                  Throughout my academic journey in Information Technology, I have developed a solid understanding of software engineering concepts, web technologies, and database design. I enjoy working through coding challenges and am dedicated to writing clean, maintainable code that delivers great user experiences.
                </p>
                <div className="about-meta">
                  <div className="meta-item">
                    <span className="meta-label">Location:</span>
                    <span className="meta-value">India (Open to remote)</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Education Status:</span>
                    <span className="meta-value">IT Graduate (B.Sc. IT / BE IT)</span>
                  </div>
                </div>
              </div>

              <div className="about-cards-grid scroll-reveal reveal-right">
                <div className="about-card card glass-panel">
                  <div className="about-card-icon card-icon-grad">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h4>IT Graduate</h4>
                  <p>Strong foundations in computer networks, operating systems, algorithms, and software development lifecycles.</p>
                </div>

                <div className="about-card card glass-panel">
                  <div className="about-card-icon card-icon-dev">
                    <Code className="w-6 h-6" />
                  </div>
                  <h4>Software Development</h4>
                  <p>Enthusiastic about web architectures, writing structured code, and implementing modern framework solutions.</p>
                </div>

                <div className="about-card card glass-panel">
                  <div className="about-card-icon card-icon-learn">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h4>Continuous Learner</h4>
                  <p>Constantly picking up new libraries, expanding languages, reading dev blogs, and working on side projects.</p>
                </div>

                <div className="about-card card glass-panel">
                  <div className="about-card-icon card-icon-solve">
                    <Puzzle className="w-6 h-6" />
                  </div>
                  <h4>Problem Solver</h4>
                  <p>Approaching bugs and specifications systematically to design efficient, elegant, and modern logical solutions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="skills-section section" id="skills">
          <div className="container">
            <div className="section-title-wrapper scroll-reveal">
              <h2 className="section-title text-gradient">Skills & Expertise</h2>
              <p className="section-subtitle">A collection of frameworks, tools, and libraries I am learning and working with</p>
            </div>

            <div className="skills-grid grid-3 scroll-reveal">
              {/* Programming Category */}
              <div className="skills-category card glass-panel">
                <div className="category-header">
                  <div className="category-icon icon-programming">
                    <Braces className="w-5 h-5" />
                  </div>
                  <h3>Programming</h3>
                </div>
                <p className="category-desc">Core languages used to solve problems and write background logic. <span className="placeholder-note">(Editable placeholder skills)</span></p>
                <div className="skills-list">
                  {programmingSkills.map((skill, idx) => (
                    <div className="skill-tag" key={idx}>
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-dot programming"></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Web Development Category */}
              <div className="skills-category card glass-panel">
                <div className="category-header">
                  <div className="category-icon icon-web">
                    <Layout className="w-5 h-5" />
                  </div>
                  <h3>Web Development</h3>
                </div>
                <p className="category-desc">Frontend frameworks and styling sheets used to build modern, responsive interfaces.</p>
                <div className="skills-list">
                  {webSkills.map((skill, idx) => (
                    <div className="skill-tag" key={idx}>
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-dot web"></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Tech Category */}
              <div className="skills-category card glass-panel">
                <div className="category-header">
                  <div className="category-icon icon-tools">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3>Tools & Tech</h3>
                </div>
                <p className="category-desc">Development software, versioning tools, and platforms to maintain codebases.</p>
                <div className="skills-list">
                  {toolSkills.map((skill, idx) => (
                    <div className="skill-tag" key={idx}>
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-dot tools"></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="skills-info-footer scroll-reveal">
              <p className="text-muted text-center flex items-center justify-center gap-1.5 mt-10">
                <Info className="w-4 h-4 text-indigo-500" />
                <span>Recruiter Tip: These skills can be updated quickly in the project codebase.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="projects-section section" id="projects">
          <div className="container">
            <div className="section-title-wrapper scroll-reveal">
              <h2 className="section-title text-gradient">Featured Projects</h2>
              <p className="section-subtitle">A showcase of projects illustrating developer skills and technical implementation</p>
            </div>

            <div className="projects-grid grid-3 scroll-reveal">
              {projectsData.map((project, idx) => (
                <article className="project-card card glass-panel" key={idx}>
                  <div className="project-visual">
                    <div className={`project-placeholder-image ${project.bgClass}`}>
                      {project.icon}
                      <span className="placeholder-tag">Placeholder Demo</span>
                    </div>
                  </div>
                  <div className="project-info">
                    <div className="project-tags">
                      {project.technologies.map((tech, tIdx) => (
                        <span className="tech-badge" key={tIdx}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-desc">{project.description}</p>
                    <span className="project-disclaimer">Note: Realistic placeholder project for demo purposes.</span>
                    <div className="project-links">
                      <a
                        href={project.githubUrl}
                        className="btn btn-outline btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4" />
                        <span>Code</span>
                      </a>
                      <a
                        href={project.demoUrl}
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          if (project.demoUrl.startsWith('#')) {
                            scrollToSection('projects', e);
                          }
                          alert('This is a mock project live demo link.');
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery & Slider Section (NEW) */}
        <section className="gallery-section section" id="gallery">
          <div className="container">
            <div className="section-title-wrapper scroll-reveal">
              <h2 className="section-title text-gradient">Visual Gallery</h2>
              <p className="section-subtitle">A collection of developer concept images and workspace setups. Click on any card to view in high definition.</p>
            </div>

            {/* Premium 3D Card Slider */}
            <div className="gallery-slider-wrapper scroll-reveal mb-20 relative">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold tracking-widest text-indigo-500 uppercase">Interactive Showreel</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="theme-toggle w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 hover:border-indigo-500 text-indigo-400"
                    title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-xs text-muted font-medium">Slide {activeSlide + 1} of {galleryPhotos.length}</span>
                </div>
              </div>

              {/* Slider Deck container */}
              <div className="slider-deck-container relative overflow-hidden h-[420px] md:h-[480px] w-full flex items-center justify-center">
                {galleryPhotos.map((photo, index) => {
                  let position = 'hidden-slide';
                  
                  // Calculate positions relative to active slide index
                  const total = galleryPhotos.length;
                  if (index === activeSlide) {
                    position = 'active-slide';
                  } else if (index === (activeSlide - 1 + total) % total) {
                    position = 'prev-slide';
                  } else if (index === (activeSlide + 1) % total) {
                    position = 'next-slide';
                  }

                  return (
                    <div 
                      key={index}
                      className={`slide-card ${position}`}
                      onClick={() => {
                        if (position === 'active-slide') {
                          setLightboxImg(photo);
                        } else if (position === 'prev-slide') {
                          prevSlide();
                        } else if (position === 'next-slide') {
                          nextSlide();
                        }
                      }}
                    >
                      <div className="slide-image-wrapper relative w-full h-full">
                        <img 
                          src={photo.url} 
                          alt={photo.title}
                          className="w-full h-full object-cover select-none pointer-events-none"
                        />
                        <div className="slide-overlay">
                          <span className="slide-category">{photo.category}</span>
                          <h3 className="slide-title">{photo.title}</h3>
                          <p className="slide-desc">{photo.desc}</p>
                          <button 
                            className="slide-zoom-btn btn btn-primary btn-sm mt-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxImg(photo);
                            }}
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Zoom Photo</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Left Control Arrow */}
                <button 
                  onClick={prevSlide}
                  className="absolute left-4 z-40 w-12 h-12 rounded-full flex items-center justify-center bg-slate-900/80 border border-slate-700/80 text-white hover:border-indigo-500 hover:bg-indigo-600/90 transition shadow-lg cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Control Arrow */}
                <button 
                  onClick={nextSlide}
                  className="absolute right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center bg-slate-900/80 border border-slate-700/80 text-white hover:border-indigo-500 hover:bg-indigo-600/90 transition shadow-lg cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Slider dot paginations */}
              <div className="flex justify-center gap-2 mt-6">
                {galleryPhotos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === activeSlide ? 'bg-indigo-500 w-8' : 'bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>

            {/* Grid Thumbnail Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 scroll-reveal">
              {galleryPhotos.map((photo, index) => (
                <div 
                  key={index}
                  className="gallery-thumbnail-card relative overflow-hidden rounded-lg aspect-[4/3] border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                  onClick={() => setLightboxImg(photo)}
                >
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-all duration-300">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 mb-0.5">{photo.category}</span>
                    <h4 className="text-xs font-bold text-white truncate">{photo.title}</h4>
                    <span className="text-[9px] text-slate-400 mt-1 flex items-center gap-1">
                      <Maximize2 className="w-2.5 h-2.5" /> View Photo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="education-section section" id="education">
          <div className="container">
            <div className="section-title-wrapper scroll-reveal">
              <h2 className="section-title text-gradient">Education</h2>
              <p className="section-subtitle">Academic timeline and foundational IT coursework details</p>
            </div>

            <div className="timeline-container scroll-reveal">
              <div className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  <div className="marker-glow"></div>
                </div>
                <div className="timeline-content card glass-panel">
                  <span className="timeline-date">Graduation Year: [Insert Year, e.g., 2025/2026]</span>
                  <h3 className="education-degree">Bachelor's Degree in Information Technology</h3>
                  <h4 className="education-institution">[Enter College/University Name]</h4>
                  <div className="education-meta">
                    <div className="edu-meta-item">
                      <MapPin className="w-4 h-4" />
                      <span>[Enter Location, e.g., Mumbai, India]</span>
                    </div>
                    <div className="edu-meta-item">
                      <BookOpen className="w-4 h-4" />
                      <span>Grade/CGPA: [Insert Grade/CGPA, e.g., First Class]</span>
                    </div>
                  </div>
                  <div className="education-coursework">
                    <h5>Relevant Coursework:</h5>
                    <div className="coursework-tags">
                      <span className="course-tag">Software Engineering</span>
                      <span className="course-tag">Object-Oriented Programming</span>
                      <span className="course-tag">Database Management Systems (DBMS)</span>
                      <span className="course-tag">Web Design & Technologies</span>
                      <span className="course-tag">Data Structures & Algorithms</span>
                      <span className="course-tag">Computer Networks & Security</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Work With Me Section */}
        <section className="highlights-section section" id="highlights">
          <div className="container">
            <div className="section-title-wrapper scroll-reveal">
              <h2 className="section-title text-gradient">Why Work With Me</h2>
              <p className="section-subtitle">Key strengths and professional values I bring to a development team</p>
            </div>

            <div className="highlights-grid grid-3 scroll-reveal">
              <div className="highlight-card card glass-panel">
                <div className="highlight-icon icon-1">
                  <Award className="w-5 h-5" />
                </div>
                <h3>Strong IT Foundation</h3>
                <p>Academic training in networking, hardware interfaces, database systems, and full-stack architecture principles.</p>
              </div>

              <div className="highlight-card card glass-panel">
                <div className="highlight-icon icon-2">
                  <Zap className="w-5 h-5" />
                </div>
                <h3>Quick Learner</h3>
                <p>Highly adaptable to modern development frameworks and eager to master new toolchains, guidelines, and libraries.</p>
              </div>

              <div className="highlight-card card glass-panel">
                <div className="highlight-icon icon-3">
                  <Brain className="w-5 h-5" />
                </div>
                <h3>Problem-Solving Mindset</h3>
                <p>Deconstructing design specs and bugs logically, designing solutions incrementally, and testing edge cases.</p>
              </div>

              <div className="highlight-card card glass-panel">
                <div className="highlight-icon icon-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3>Passion for Development</h3>
                <p>Genuine interest in writing clean script structures, creating layout elements, and exploring UI concepts.</p>
              </div>

              <div className="highlight-card card glass-panel">
                <div className="highlight-icon icon-5">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <h3>Focus on Clean Code</h3>
                <p>Writing well-documented, clean, semantic HTML/CSS structures and reusable Javascript logic modules.</p>
              </div>

              <div className="highlight-card card glass-panel">
                <div className="highlight-icon icon-6">
                  <Users className="w-5 h-5" />
                </div>
                <h3>Collaboration Focused</h3>
                <p>Comfortable utilizing Git workflows, communicating technical points clearly, and accepting constructive reviews.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Resume / Career CTA Section */}
        <section className="resume-cta-section section" id="resume-cta">
          <div className="container scroll-reveal">
            <div className="cta-banner">
              <div className="cta-content">
                <h2 className="cta-title">Let's Build Something Great Together</h2>
                <p className="cta-desc">
                  Are you looking for an energetic, quick-learning IT graduate to join your software development team, manage frontend projects, or collaborate on digital solutions? Let's connect!
                </p>
                <div className="cta-buttons">
                  <a href="./resume/Jivan-Warankar-Resume.pdf" className="btn btn-light" download>
                    <Download className="w-4 h-4 text-primary-color" />
                    <span className="text-primary-color">Download Resume</span>
                  </a>
                  <a
                    href="#contact"
                    className="btn btn-outline-light"
                    onClick={(e) => scrollToSection('contact', e)}
                  >
                    <span>Contact Me</span>
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="cta-graphic animate-spin-slow">
                <Sparkles className="w-36 h-36 cta-sparkle-icon" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section section" id="contact">
          <div className="container">
            <div className="section-title-wrapper scroll-reveal">
              <h2 className="section-title text-gradient">Get In Touch</h2>
              <p className="section-subtitle">Reach out for recruiter queries, project discussions, or feedback</p>
            </div>

            <div className="contact-grid grid-2">
              <div className="contact-info scroll-reveal reveal-left">
                <h3>Contact Information</h3>
                <p>Feel free to contact me via email, telephone, or connect with me on social platforms. I will do my best to get back to you as soon as possible.</p>

                <div className="contact-cards">
                  <div className="contact-item card glass-panel">
                    <div className="contact-icon icon-email">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="contact-details">
                      <span className="contact-label">Email</span>
                      <a href="mailto:jivan.warankar@example.com" className="contact-value">jivan.warankar@example.com</a>
                      <span className="placeholder-badge">Placeholder</span>
                    </div>
                  </div>

                  <div className="contact-item card glass-panel">
                    <div className="contact-icon icon-phone">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="contact-details">
                      <span className="contact-label">Phone</span>
                      <a href="tel:+919999999999" className="contact-value">+91 98765 43210</a>
                      <span className="placeholder-badge">Placeholder</span>
                    </div>
                  </div>

                  <div className="contact-item card glass-panel">
                    <div className="contact-icon icon-location">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="contact-details">
                      <span className="contact-label">Location</span>
                      <span className="contact-value">Mumbai, Maharashtra, India</span>
                      <span className="placeholder-badge">Placeholder</span>
                    </div>
                  </div>

                  <div className="contact-item card glass-panel">
                    <div className="contact-icon icon-socials">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div className="contact-details">
                      <span className="contact-label">Professional Profiles</span>
                      <div className="contact-socials-row">
                        <a href="https://linkedin.com/in/jivanwarankar" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="LinkedIn">
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a href="https://github.com/jivanwarankar" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="GitHub">
                          <Github className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form-wrapper card glass-panel scroll-reveal reveal-right">
                <h3>Send A Message</h3>
                <p className="form-instructions text-secondary text-sm mb-4">All fields are required. Submit is handled on client side.</p>

                <form onSubmit={handleFormSubmit} className="contact-form" noValidate>
                  <div className={`form-group ${formErrors.name ? 'invalid' : ''}`}>
                    <label htmlFor="form-name">Your Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon w-4 h-4" />
                      <input
                        type="text"
                        id="form-name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <span className="error-message">{formErrors.name}</span>
                  </div>

                  <div className={`form-group ${formErrors.email ? 'invalid' : ''}`}>
                    <label htmlFor="form-email">Your Email</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon w-4 h-4" />
                      <input
                        type="email"
                        id="form-email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <span className="error-message">{formErrors.email}</span>
                  </div>

                  <div className={`form-group ${formErrors.subject ? 'invalid' : ''}`}>
                    <label htmlFor="form-subject">Subject</label>
                    <div className="input-wrapper">
                      <Info className="input-icon w-4 h-4" />
                      <input
                        type="text"
                        id="form-subject"
                        name="subject"
                        placeholder="Enter subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <span className="error-message">{formErrors.subject}</span>
                  </div>

                  <div className={`form-group ${formErrors.message ? 'invalid' : ''}`}>
                    <label htmlFor="form-message">Message</label>
                    <div className="input-wrapper align-start">
                      <MessageSquare className="input-icon w-4 h-4 mt-3" />
                      <textarea
                        id="form-message"
                        name="message"
                        rows={5}
                        placeholder="Write your message details..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <span className="error-message">{formErrors.message}</span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full submit-btn mt-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span>Sending Message...</span>
                        <Loader className="w-4 h-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Success Message Banner */}
                  <div className={`success-message ${isSuccessVisible ? 'visible' : ''}`}>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h5>Message Verified!</h5>
                      <p>Thank you for testing. This form is client-side only; your message has been validated successfully.</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Overlay Modal Viewer */}
      {lightboxImg && (
        <div 
          className="lightbox-overlay" 
          onClick={() => setLightboxImg(null)}
          role="dialog"
          aria-modal="true"
        >
          <button 
            className="lightbox-close"
            onClick={() => setLightboxImg(null)}
            aria-label="Close Lightbox"
          >
            <X className="w-8 h-8 text-white hover:text-indigo-400" />
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-media-wrapper">
              <img src={lightboxImg.url} alt={lightboxImg.title} />
            </div>
            <div className="lightbox-details">
              <span className="lightbox-category">{lightboxImg.category}</span>
              <h3 className="lightbox-title">{lightboxImg.title}</h3>
              <p className="lightbox-desc">{lightboxImg.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-branding">
              <a href="#hero" className="logo-footer" onClick={(e) => scrollToSection('hero', e)}>
                <span className="logo-accent">&lt;</span>Jivan<span className="logo-highlight">Warankar</span><span className="logo-accent"> /&gt;</span>
              </a>
              <p className="footer-role">IT Graduate | Aspiring Software Developer</p>
              <p className="footer-tagline">Building modern, responsive, and functional digital experiences.</p>
            </div>
            
            <div className="footer-links-group">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#about" onClick={(e) => scrollToSection('about', e)}>About</a></li>
                <li><a href="#skills" onClick={(e) => scrollToSection('skills', e)}>Skills</a></li>
                <li><a href="#projects" onClick={(e) => scrollToSection('projects', e)}>Projects</a></li>
                <li><a href="#gallery" onClick={(e) => scrollToSection('gallery', e)}>Gallery</a></li>
                <li><a href="#education" onClick={(e) => scrollToSection('education', e)}>Education</a></li>
                <li><a href="#highlights" onClick={(e) => scrollToSection('highlights', e)}>Why Me</a></li>
                <li><a href="#contact" onClick={(e) => scrollToSection('contact', e)}>Contact</a></li>
              </ul>
            </div>

            <div className="footer-socials-group">
              <h4>Social Profiles</h4>
              <p>Connect with me on social platforms.</p>
              <div className="footer-social-row">
                <a href="https://linkedin.com/in/jivanwarankar" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://github.com/jivanwarankar" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="GitHub">
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          <hr className="footer-divider" />
          <div className="footer-bottom">
            <p>&copy; 2026 Jivan Warankar. All rights reserved.</p>
            <p className="footer-notes">Created as a professional React + Tailwind portfolio.</p>
          </div>
        </div>
      </footer>

      {/* Back To Top Button */}
      <button
        className={`back-to-top ${backToTopVisible ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top of page"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
}

export default App;
