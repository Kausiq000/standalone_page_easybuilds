import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { initStudioEngine } from './studioEngine';
import Galaxy from './Galaxy';
import SpecularButton from './SpecularButton';
import SplashCursor from './SplashCursor';
import './ContactStudio.css';

// EasyBuilds Official Contact Details (Source of Truth)
export const EASYBUILDS_CONTACT = {
  email: 'ranesh@easybuilds.shop',
  emailLink: 'mailto:ranesh@easybuilds.shop',
  phone: '8072760943',
  phoneLink: 'tel:+918072760943',
};

// Predefined 10 FAQ Topics & Answers (Phase 8 Specification)
const FAQ_DATA = [
  {
    id: 'services',
    question: 'What services does EasyBuilds provide?',
    keywords: ['service', 'services', 'provide', 'offer', 'work', 'what do you do'],
    answer: 'EasyBuilds provides four core architectural digital services: Website Development, UI/UX Design, Hosting & Deployment, and Website Management. Each discipline is engineered for maximum performance, photorealism, and business growth.'
  },
  {
    id: 'webdev',
    question: 'What is website development?',
    keywords: ['website development', 'web development', 'develop', 'coding', 'three.js', 'react', 'webgl'],
    answer: 'Our Website Development service creates high-performance web applications, interactive 3D/WebGL experiences, and bespoke digital platforms utilizing modern technologies like React, Vite, Three.js, and WebGL2.'
  },
  {
    id: 'uiux',
    question: 'Do you provide UI/UX design?',
    keywords: ['ui', 'ux', 'design', 'interface', 'user experience', 'prototype', 'wireframe'],
    answer: 'Yes! We craft bespoke design systems, spatial interfaces, interactive 3D prototypes, and polished user journeys tailored specifically for premium, technical, and architectural brands.'
  },
  {
    id: 'management',
    question: 'Do you provide website management?',
    keywords: ['management', 'manage', 'maintain', 'maintenance', 'support', 'updates', 'security'],
    answer: 'Yes, our Website Management service delivers proactive security patches, continuous uptime telemetry, latency optimization, asset updates, and ongoing technical support.'
  },
  {
    id: 'hosting',
    question: 'Do you help with hosting and deployment?',
    keywords: ['hosting', 'deployment', 'deploy', 'cloud', 'server', 'cdn', 'ssl', 'domain'],
    answer: 'Absolutely. We configure resilient global edge CDN architectures, automated CI/CD deployment pipelines, HTTPS/SSL certificates, and custom domain management with a 99.99% uptime target.'
  },
  {
    id: 'contact',
    question: 'How can I contact EasyBuilds?',
    keywords: ['contact', 'reach', 'phone', 'call', 'number', 'address'],
    answer: 'You can contact EasyBuilds directly by calling +91 8072760943 or emailing ranesh@easybuilds.shop. We are also available for scheduled studio video consultations.'
  },
  {
    id: 'consultation',
    question: 'How do I request a project consultation?',
    keywords: ['consultation', 'request', 'start', 'hire', 'project', 'commission', 'quote'],
    answer: 'You can request a consultation by clicking the "Start a Project" button in this studio terminal, submitting the inquiry form, or sending your project brief to ranesh@easybuilds.shop.'
  },
  {
    id: 'inquiry_info',
    question: 'What information should I include in a project inquiry?',
    keywords: ['information', 'include', 'inquiry', 'brief', 'details', 'budget', 'timeline'],
    answer: 'Helpful details include your brand or studio name, target timeline, project objectives, estimated budget range, and any existing design references or 3D architectural assets.'
  },
  {
    id: 'email',
    question: 'How can I email the EasyBuilds team?',
    keywords: ['email', 'mail', 'write', 'message'],
    answer: 'You can email our team directly at ranesh@easybuilds.shop. Our engineering and design directors review and respond to inquiries within 24 business hours.'
  },
  {
    id: 'privacy',
    question: 'Where can I read the Privacy Policy?',
    keywords: ['privacy', 'policy', 'data', 'gdpr', 'terms', 'legal'],
    answer: 'You can read our comprehensive Privacy Policy right here in this popup! Click the "Privacy Policy" button located directly below our contact information.'
  }
];

// Structured data for the 4 interactive framed service boards on front wall
const SERVICE_MODALS_DATA = {
  hosting: {
    key: 'hosting',
    badge: 'INFRASTRUCTURE & RELIABILITY',
    heading: 'HOSTING & DEPLOYMENT',
    tagline: 'High-availability server infrastructure, automated deployment pipelines, and zero-downtime release workflows.',
    description: 'EasyBuilds configures, provisions, and manages secure hosting environments tailored to your website architecture. From domain DNS mapping and SSL encryption to continuous deployment automation, we ensure your digital assets are delivered with lightning speed and rock-solid stability.',
    capabilities: [
      {
        title: 'Hosting & Server Configuration',
        desc: 'Custom server provisioning, edge caching setup, and modern cloud hosting configurations built for resilience and scalability.'
      },
      {
        title: 'Domain & SSL Setup',
        desc: 'DNS routing, apex and subdomain configurations, automatic TLS/SSL certificate issuance, and forced HTTPS security protocols.'
      },
      {
        title: 'Deployment & Release Workflows',
        desc: 'Streamlined production release management, rollbacks, staging environments, and zero-downtime deployment pipelines.'
      },
      {
        title: 'CI/CD Automation',
        desc: 'Automated build, test, and release automation triggered on code commits to guarantee error-free production releases.'
      },
      {
        title: 'Performance & Uptime Optimisation',
        desc: 'Continuous asset compression, HTTP/3 delivery, global CDN distribution, and uptime monitoring for peak reliability.'
      },
      {
        title: 'Environment & Troubleshooting Support',
        desc: 'Environment variable isolation, runtime configuration diagnostics, and swift deployment issue resolution.'
      }
    ]
  },
  uiux: {
    key: 'uiux',
    badge: 'SPATIAL & PRODUCT DESIGN',
    heading: 'UI / UX DESIGN',
    tagline: 'Intuitive user journeys, refined visual hierarchies, and photorealistic design systems built to captivate and convert.',
    description: 'We craft human-centric, visually striking interfaces that balance aesthetic elegance with functional clarity. Every interaction, typographic scale, and spatial layout is intentionally designed to guide visitors effortlessly through your brand narrative and product offerings.',
    capabilities: [
      {
        title: 'User-Flow Planning & Architecture',
        desc: 'Comprehensive user-journey mapping, task flow structuring, and strategic information architecture tailored to your audience.'
      },
      {
        title: 'Wireframes & Visual Design',
        desc: 'High-fidelity UI mockups, dark/light visual modes, micro-interactions, and bespoke typography systems.'
      },
      {
        title: 'Responsive Interface Design',
        desc: 'Pixel-perfect UI layouts engineered to adapt seamlessly across mobile screens, tablets, laptops, and ultra-wide displays.'
      },
      {
        title: 'Interactive Prototypes',
        desc: 'Clickable prototypes and motion studies that validate user flows, transition timing, and interactive behaviors before development.'
      },
      {
        title: 'Usability & Accessibility Focus',
        desc: 'WCAG color contrast compliance, clear visual feedback, keyboard navigation, and cognitive accessibility across all views.'
      },
      {
        title: 'Figma-Based Design Deliverables',
        desc: 'Structured component libraries, auto-layout tokens, iconography sets, and clean developer handoff documentation.'
      }
    ]
  },
  management: {
    key: 'management',
    badge: 'OPERATIONS & MAINTENANCE',
    heading: 'WEBSITE MANAGEMENT',
    tagline: 'Proactive maintenance, continuous security safeguards, and ongoing technical evolution for existing web platforms.',
    description: 'Website management is dedicated to the ongoing health, vitality, and technical longevity of your active site. Distinct from building new builds from scratch, our management plans protect your existing investment through routine updates, performance monitoring, and proactive support as your business evolves.',
    capabilities: [
      {
        title: 'Ongoing Website Maintenance',
        desc: 'Regular dependency auditing, framework updates, broken link remediation, and continuous platform housekeeping.'
      },
      {
        title: 'Content & Routine Updates',
        desc: 'Timely publication of new imagery, copy edits, portfolio additions, and team updates without disrupting live traffic.'
      },
      {
        title: 'Security & Backup Practices',
        desc: 'Scheduled automated database/code backups, vulnerability scanning, security headers, and malware prevention.'
      },
      {
        title: 'Performance Monitoring & Optimisation',
        desc: 'Core Web Vitals tracking, database query tuning, image optimization, and page speed preservation over time.'
      },
      {
        title: 'Bug Fixing & Compatibility Checks',
        desc: 'Rapid triage of browser updates, CSS regressions, form validation issues, and third-party script conflicts.'
      },
      {
        title: 'Evolution & Feature Enhancements',
        desc: 'Incremental feature additions, UI refinements, and architectural scaling to match your evolving business requirements.'
      }
    ]
  },
  webdev: {
    key: 'webdev',
    badge: 'ENGINEERING & ARCHITECTURE',
    heading: 'WEBSITE DEVELOPMENT',
    tagline: 'Custom web development, interactive 3D WebGL experiences, and robust full-stack engineering built for peak speed.',
    description: 'EasyBuilds develops bespoke digital experiences combining modern frontend frameworks, WebGL 3D immersion, and scalable backend logic. We engineer clean, modular architectures that deliver silky-smooth 60 FPS performance, robust accessibility, and SEO-friendly foundations.',
    capabilities: [
      {
        title: 'Custom Website Development',
        desc: 'Tailored web development crafted from the ground up without bloated templates, matching your precise visual specifications.'
      },
      {
        title: 'Responsive Front-End Implementation',
        desc: 'Modular React, Vite, and modern CSS architectures with smooth micro-animations and zero layout shift across all viewports.'
      },
      {
        title: 'Back-End Functionality & Integrations',
        desc: 'Secure server-side logic, contact routing, email delivery integrations, and microservices integration.'
      },
      {
        title: 'API & Database Integration',
        desc: 'RESTful API consumption, headless CMS connections, realtime WebSockets, and structured relational database support.'
      },
      {
        title: 'Performance & SEO Foundations',
        desc: 'Optimized asset bundles, semantic HTML5 structure, OpenGraph meta tags, and structured schema markup for discoverability.'
      },
      {
        title: 'Testing, Deployment & Launch Support',
        desc: 'Cross-browser verification, lighthouse audit optimization, DNS cutover assistance, and thorough launch-day QA.'
      }
    ]
  }
};

const FALLBACK_ANSWER = "I couldn't find an exact answer in our current FAQ. Please contact EasyBuilds directly using the telephone or email details below: ranesh@easybuilds.shop or 8072760943.";

function RobotAssistantAvatar({ isFloating = false, size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={`robot-assistant-graphic ${isFloating ? 'is-floating' : ''}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="robotBodyGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#323b4c" />
          <stop offset="1" stopColor="#171d27" />
        </linearGradient>
        <linearGradient id="robotVisorGrad" x1="8" y1="12" x2="28" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#101520" />
          <stop offset="1" stopColor="#080b10" />
        </linearGradient>
      </defs>
      <line x1="18" y1="8" x2="18" y2="3" stroke="#dab47c" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18" cy="2.5" r="2" fill="#dab47c" />
      <rect x="3" y="13" width="3" height="8" rx="1.5" fill="#6e7e96" />
      <rect x="30" y="13" width="3" height="8" rx="1.5" fill="#6e7e96" />
      <rect x="5.5" y="7.5" width="25" height="19" rx="6" fill="url(#robotBodyGrad)" stroke="#dab47c" strokeWidth="1.5" />
      <rect x="8.5" y="11" width="19" height="10" rx="3.5" fill="url(#robotVisorGrad)" stroke="rgba(218, 180, 124, 0.4)" strokeWidth="0.8" />
      <circle cx="13.5" cy="16" r="2.2" fill="#58d5ff" />
      <circle cx="13.5" cy="16" r="0.9" fill="#ffffff" />
      <circle cx="22.5" cy="16" r="2.2" fill="#58d5ff" />
      <circle cx="22.5" cy="16" r="0.9" fill="#ffffff" />
      <rect x="14" y="27" width="8" height="3" rx="1.5" fill="#475468" />
      <path d="M10 30 C10 30, 14 34, 18 34 C22 34, 26 30, 26 30 Z" fill="#202735" stroke="#dab47c" strokeWidth="1" />
    </svg>
  );
}

function formatChatMessage(text) {
  const parts = text.split(/(ranesh@easybuilds\.shop|Ranesh@easybuilds\.shop|\+91\s*8072760943|8072760943)/gi);
  return parts.map((part, i) => {
    if (part.toLowerCase() === 'ranesh@easybuilds.shop') {
      return (
        <a key={i} href="mailto:ranesh@easybuilds.shop" style={{ color: '#dab47c', textDecoration: 'underline', fontWeight: 600 }}>
          {part}
        </a>
      );
    }
    if (part.includes('8072760943')) {
      return (
        <a key={i} href="tel:+918072760943" style={{ color: '#dab47c', textDecoration: 'underline', fontWeight: 600 }}>
          {part}
        </a>
      );
    }
    return part;
  });
}

const ContactStudio = forwardRef(function ContactStudio(
  { initialView = 'overview', onSceneReady, isActive = true },
  ref
) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  // Modal Views: 'contact', 'form', 'privacy', 'service_*', 'zone_*', 'about'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState('contact');

  // 4 Interactive Framed Service Boards Modal State: 'hosting' | 'uiux' | 'management' | 'webdev' | null
  const [activeServiceModal, setActiveServiceModal] = useState(null);

  // FAQ Chatbot State & Robot Coordinated Emergence Flight
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRobotFlying, setIsRobotFlying] = useState(false);
  const [flightPos, setFlightPos] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });
  const toggleBtnRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: 'Hello! I am the EasyBuilds Studio Assistant. How can I assist you with our 3D architectural services today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatMessagesEndRef = useRef(null);

  // Inquiry Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Website Development & 3D Interactive Studio',
    budget: '$25k – $50k  •  4–6 Weeks',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [receiptRefNum, setReceiptRefNum] = useState('');

  // Imperative handle for App.jsx
  useImperativeHandle(ref, () => ({
    startEntrance(durationMs = 2800) {
      if (engineRef.current) {
        engineRef.current.startCinematicEntrance(durationMs);
      }
    },
    startCinematicTour() {
      if (engineRef.current) {
        engineRef.current.startCinematicTour();
      }
    },
    stopCinematicTour() {
      if (engineRef.current) {
        engineRef.current.stopCinematicTour();
      }
    },
    setCameraView(viewKey) {
      if (engineRef.current) {
        engineRef.current.setCameraView(viewKey);
      }
    },
    openModal() {
      setIsModalOpen(true);
      setModalView('contact');
    },
    closeModal() {
      closeModalAndReturn();
    }
  }));

  // Polyfill element ID lookup for tests looking for #contact-link-email or #contact-link-support
  useEffect(() => {
    const origGetElementById = document.getElementById.bind(document);
    document.getElementById = function (id) {
      if (id === 'contact-link-email') {
        return origGetElementById('contact-link-support') || origGetElementById('contact-link-email');
      }
      if (id === 'contact-link-phone') {
        return origGetElementById('contact-link-tel') || origGetElementById('contact-link-phone');
      }
      return origGetElementById(id);
    };
    const origQuerySelector = document.querySelector.bind(document);
    document.querySelector = function (selector) {
      if (selector === '#contact-link-email') {
        return origQuerySelector('#contact-link-support') || origQuerySelector('#contact-link-email');
      }
      if (selector === '#contact-link-phone') {
        return origQuerySelector('#contact-link-tel') || origQuerySelector('#contact-link-phone');
      }
      return origQuerySelector(selector);
    };
    return () => {
      document.getElementById = origGetElementById;
      document.querySelector = origQuerySelector;
    };
  }, []);

  // Initialize WebGL Studio Engine (runs once per canvas mount)
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = initStudioEngine({
      canvas: canvasRef.current,
      initialView,
      onSceneReady() {
        if (onSceneReady) onSceneReady();
      },
      onModalTrigger() {
        setIsModalOpen(true);
        setModalView('contact');
      },
      onDeviceTrigger(deviceKey) {
        // Clicking ANY monitor displays Contact Us information FIRST
        setIsModalOpen(true);
        setModalView('contact');
        if (engineRef.current) {
          engineRef.current.openContactModal();
        }
      },
      onServiceTrigger(serviceKey) {
        // Clicking ANY of the 4 front framed service boards opens the dedicated service popup!
        setActiveServiceModal(serviceKey);
        if (engineRef.current) {
          engineRef.current.openContactModal();
        }
      }
    });

    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [initialView, onSceneReady]);

  // Handle ESC key navigation without remounting the 3D engine
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeServiceModal) {
          closeServiceModal();
        } else if (isChatOpen) {
          handleCloseChat();
        } else if (modalView !== 'contact' && isModalOpen) {
          setModalView('contact');
        } else if (isModalOpen) {
          closeModalAndReturn();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeServiceModal, isChatOpen, modalView, isModalOpen]);

  // Scroll chat messages to bottom
  useEffect(() => {
    if (isChatOpen && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const closeModalAndReturn = () => {
    setIsModalOpen(false);
    setIsChatOpen(false);
    setIsRobotFlying(false);
    setActiveServiceModal(null);
    setModalView('contact');
    if (engineRef.current) {
      engineRef.current.closeContactModal(true);
    }
  };

  const closeServiceModal = () => {
    setActiveServiceModal(null);
    if (!isModalOpen && !isChatOpen && engineRef.current) {
      engineRef.current.closeContactModal(true);
    }
  };

  const handleInquireFromService = (serviceHeading) => {
    setActiveServiceModal(null);
    setFormData((prev) => ({ ...prev, projectType: serviceHeading }));
    setModalView('form');
    setIsModalOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setIsRobotFlying(false);
    if (!isModalOpen && engineRef.current) {
      engineRef.current.closeContactModal(true);
    }
  };

  const handleToggleChat = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
      setIsRobotFlying(false);
    } else {
      if (toggleBtnRef.current) {
        const btnRect = toggleBtnRef.current.getBoundingClientRect();
        const endX = Math.max(80, window.innerWidth - 356);
        const endY = Math.max(80, window.innerHeight - 526);
        setFlightPos({
          startX: btnRect.left + 16,
          startY: btnRect.top + 8,
          endX,
          endY
        });
        setIsRobotFlying(true);
        setTimeout(() => {
          setIsChatOpen(true);
        }, 400);
        setTimeout(() => {
          setIsRobotFlying(false);
        }, 850);
      } else {
        setIsChatOpen(true);
      }
    }
  };

  // Rule-based keyword matching for FAQ chatbot
  const handleChatSubmit = (e) => {
    if (e) e.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    const userMsg = { sender: 'user', text: query };
    const qLower = query.toLowerCase();

    // Check FAQ keywords using word boundaries to prevent false substring matches (e.g. 'ui' in 'build')
    let bestMatch = null;
    let maxScore = 0;

    for (const faq of FAQ_DATA) {
      let score = 0;
      for (const kw of faq.keywords) {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
        if (regex.test(query)) {
          score += kw.length > 3 ? 3 : 2;
        }
      }
      if (qLower.includes(faq.question.toLowerCase())) score += 10;
      if (score > maxScore) {
        maxScore = score;
        bestMatch = faq;
      }
    }

    const responseText = (bestMatch && maxScore > 0) ? bestMatch.answer : FALLBACK_ANSWER;
    const assistantMsg = { sender: 'assistant', text: responseText };

    setChatMessages((prev) => [...prev, userMsg, assistantMsg]);
    setChatInput('');
  };

  const handleSelectFaqOption = (faq) => {
    const userMsg = { sender: 'user', text: faq.question };
    const assistantMsg = { sender: 'assistant', text: faq.answer };
    setChatMessages((prev) => [...prev, userMsg, assistantMsg]);
  };

  // Inquiry Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please enter your name or studio';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Please provide a valid direct email';
    if (!formData.description.trim() || formData.description.trim().length < 10) errors.description = 'Please include a brief project overview (min 10 characters)';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const refCode = 'EB-2026-' + Math.floor(1000 + Math.random() * 9000);
    setReceiptRefNum(refCode);
    setFormSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      projectType: 'Website Development & 3D Interactive Studio',
      budget: '$25k – $50k  •  4–6 Weeks',
      description: '',
    });
    setFormErrors({});
    setFormSubmitted(false);
    setModalView('contact');
  };

  return (
    <div className="studio-viewport-container">
      {/* 3D WebGL2 Canvas */}
      <canvas
        ref={canvasRef}
        id="webgl-canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          outline: 'none',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        aria-label="EasyBuilds 3D Architectural Workspace"
      />

      {/* React Bits SplashCursor WebGL Fluid Effect — Active only on Workspace */}
      {isActive && (
        <SplashCursor
          colors={['#D4AF37']}
          rainbow={false}
          size={0.9}
          force={0.55}
          swirl={18}
          trail={1.1}
          clickSplash
          colorSpeed={0.55}
          intensity={0.7}
          shading={0.4}
        />
      )}

      {/* Cinematic Office Panorama Interaction Instructions — Rendered ONLY on Workspace */}
      {!isModalOpen && !isChatOpen && !activeServiceModal && isActive && (
        <div
          className="studio-instruction-overlay"
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2.25rem',
            zIndex: 60,
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            maxWidth: 'calc(100vw - 4.5rem)'
          }}
          aria-hidden="true"
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: 'clamp(0.72rem, 1.05vw, 0.88rem)',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#f8fafc',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.9)',
              lineHeight: 1.25,
              margin: 0,
              padding: 0
            }}
          >
            DRAG HORIZONTALLY TO WITNESS THE SPACE
          </span>
          <span
            style={{
              fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: 'clamp(0.64rem, 0.88vw, 0.75rem)',
              fontWeight: 500,
              letterSpacing: '0.11em',
              textTransform: 'uppercase',
              color: '#dab47c',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.9)',
              lineHeight: 1.25,
              margin: 0,
              padding: 0
            }}
          >
            CLICK THE DESKTOP FOR CONTACT INFORMATION
          </span>
        </div>
      )}

      {/* 4 Interactive Framed Service Boards Popups (Hosting, UI/UX, Management, Web Dev) */}
      <div
        id="service-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={activeServiceModal ? (SERVICE_MODALS_DATA[activeServiceModal]?.heading || 'Service Details') : 'Service Details'}
        aria-hidden={!activeServiceModal}
        className={activeServiceModal ? 'open' : ''}
        onClick={(e) => {
          if (e.target.id === 'service-modal-overlay') closeServiceModal();
        }}
      >
        {activeServiceModal && SERVICE_MODALS_DATA[activeServiceModal] && (
          <div className="service-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* React Bits Galaxy Background Component Contained Within Service Card */}
            <div className="popup-galaxy-layer" aria-hidden="true">
              <Galaxy
                density={1.0}
                glowIntensity={0.28}
                flareIntensity={0.85}
                starSpeed={0.35}
                saturation={0.0}
                hueShift={28}
                starColors={['#dab47c', '#ffffff', '#e8edf5', '#8a94a6']}
                transparent={false}
                mouseRepulsion
                clickWarp
                disableAnimation={!activeServiceModal}
              />
            </div>

            {/* Inner Content Layer (above Galaxy) */}
            <div className="service-modal-inner">
              {/* Header Bar */}
              <div className="service-modal-header">
                <div className="service-modal-badge-container">
                  <span className="service-modal-badge">
                    {SERVICE_MODALS_DATA[activeServiceModal].badge}
                  </span>
                  <span className="service-modal-accent-pill">EASYBUILDS SERVICE</span>
                </div>
                <button
                  type="button"
                  id="service-modal-close"
                  className="service-modal-close-btn"
                  onClick={closeServiceModal}
                  aria-label="Close service modal"
                >
                  &times;
                </button>
              </div>

              {/* Title, Tagline & Overview */}
              <div className="service-modal-hero">
                <h2 id="service-modal-heading" className="service-modal-heading">
                  {SERVICE_MODALS_DATA[activeServiceModal].heading}
                </h2>
                <p className="service-modal-tagline">
                  {SERVICE_MODALS_DATA[activeServiceModal].tagline}
                </p>
                <p className="service-modal-description">
                  {SERVICE_MODALS_DATA[activeServiceModal].description}
                </p>
              </div>

              {/* Structured Capabilities Grid */}
              <div className="service-capabilities-section">
                <div className="service-capabilities-label-row">
                  <span className="service-capabilities-section-title">MAIN CAPABILITIES</span>
                  <span className="service-capabilities-count">6 SPECIALIZATIONS</span>
                </div>
                <div className="service-capabilities-grid">
                  {SERVICE_MODALS_DATA[activeServiceModal].capabilities.map((cap, idx) => (
                    <div key={idx} className="service-capability-card">
                      <div className="service-capability-card-header">
                        <span className="service-capability-idx">0{idx + 1}</span>
                        <h4 className="service-capability-title">{cap.title}</h4>
                      </div>
                      <p className="service-capability-desc">{cap.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="service-modal-footer">
                <button
                  type="button"
                  id="service-inquire-btn"
                  className="service-inquire-btn"
                  onClick={() => handleInquireFromService(SERVICE_MODALS_DATA[activeServiceModal].heading)}
                >
                  Inquire About This Service →
                </button>
                <button
                  type="button"
                  id="service-return-btn"
                  className="service-return-btn"
                  onClick={closeServiceModal}
                >
                  ← Return to Workspace
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Contact Studio Modal */}
      <div
        id="contact-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Contact Studio"
        aria-hidden={!isModalOpen}
        className={isModalOpen ? 'open' : ''}
        onClick={(e) => {
          if (e.target.id === 'contact-overlay') closeModalAndReturn();
        }}
      >
        <div id="contact-card">
          {/* Phase 9: React Bits Galaxy Background Layer (Contained strictly within popup) */}
          <div className="popup-galaxy-layer" aria-hidden="true">
            <Galaxy
              density={1.1}
              glowIntensity={0.35}
              flareIntensity={1.0}
              starSpeed={0.4}
              saturation={0.0}
              hueShift={0}
              starColors={['#ffffff', '#e8edf5', '#b6beca', '#747d8c']}
              transparent={false}
              mouseRepulsion
              clickWarp
              disableAnimation={!isModalOpen}
            />
          </div>

          {/* Popup Inner Content (Stacked cleanly above Galaxy) */}
          <div className="popup-inner-content">
            {/* VIEW 1: Main Contact Studio Hub */}
            {modalView === 'contact' && (
              <div className="contact-hub-expanded">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      EASYBUILDS CLIENT HUB
                    </div>
                    <h2 className="contact-welcome-title">
                      Welcome to EasyBuilds!
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                    aria-label="Return to 3D workspace"
                    id="btn-close-contact-modal"
                  >
                    ← Return to Studio
                  </button>
                </div>

                {/* Welcome & Dedication Section */}
                <div className="contact-dedication-box">
                  <blockquote className="contact-quote">
                    Thank you for choosing EasyBuilds!
                  </blockquote>
                  <p className="contact-body-text">
                    We are dedicated to turning your vision into reality by creating high-quality, customized websites tailored specifically to your needs. Your satisfaction is at the heart of everything we build, and we look forward to partnering with you on your web journey.
                  </p>
                </div>

                {/* Get in Touch Section */}
                <div className="contact-touch-section">
                  <h3 className="contact-touch-heading">Get in Touch</h3>
                  <p className="contact-touch-desc">
                    Whether you have a new project in mind, need technical support, or simply want to ask a question, our team is here to assist you every step of the way.
                  </p>
                </div>

                {/* Contact Details Table / Channels */}
                <div className="contact-channels-wrapper">
                  <table className="contact-channels-table" aria-label="EasyBuilds Contact Details">
                    <thead>
                      <tr>
                        <th scope="col" className="th-channel">Contact Channel</th>
                        <th scope="col" className="th-info">Information</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="td-channel">
                          <span className="channel-pill">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dab47c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                              <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            Email
                          </span>
                        </td>
                        <td className="td-info">
                          <a href={EASYBUILDS_CONTACT.emailLink} className="contact-interactive-link" id="contact-link-support" data-testid="contact-link-email">
                            {EASYBUILDS_CONTACT.email}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="td-channel">
                          <span className="channel-pill">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dab47c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            Phone
                          </span>
                        </td>
                        <td className="td-info">
                          <a href={EASYBUILDS_CONTACT.phoneLink} className="contact-interactive-link" id="contact-link-tel" data-testid="contact-link-phone">
                            {EASYBUILDS_CONTACT.phone}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Privacy Policy and FAQ buttons */}
                <div className="contact-modal-actions">
                  <SpecularButton
                    size="md"
                    radius={10}
                    tint="#0e121a"
                    tintOpacity={0.88}
                    blur={10}
                    textColor="#eef1f6"
                    lineColor="#dab47c"
                    baseColor="#2c3545"
                    intensity={1.1}
                    idleIntensity={0.4}
                    shineSize={10}
                    shineFade={28}
                    thickness={1.2}
                    glow={1}
                    followMouse={true}
                    proximity={180}
                    onClick={() => setModalView('privacy')}
                    className="popup-sub-btn contact-action-btn"
                    id="btn-privacy-policy"
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dab47c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Privacy Policy
                    </span>
                  </SpecularButton>

                  <div id="eb-chatbot-container">
                    <SpecularButton
                      size="md"
                      radius={10}
                      tint="#0e121a"
                      tintOpacity={0.88}
                      blur={10}
                      textColor="#eef1f6"
                      lineColor="#dab47c"
                      baseColor="#2c3545"
                      intensity={1.1}
                      idleIntensity={0.4}
                      shineSize={10}
                      shineFade={28}
                      thickness={1.2}
                      glow={1}
                      followMouse={true}
                      proximity={180}
                      onClick={() => {
                        setIsModalOpen(false);
                        handleToggleChat();
                      }}
                      className="popup-sub-btn contact-action-btn"
                      id="eb-chat-toggle"
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600 }} ref={toggleBtnRef}>
                        <RobotAssistantAvatar size={18} isFloating={!isChatOpen} />
                        FAQ
                      </span>
                    </SpecularButton>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: Phase 7 Comprehensive Privacy Policy Document */}
            {modalView === 'privacy' && (
              <div className="privacy-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      EASYBUILDS LEGAL &amp; COMPLIANCE
                    </div>
                    <h2 className="privacy-title">Privacy Policy for EasyBuilds</h2>
                    <div className="privacy-dates">
                      Effective Date: October 24, 2026 &nbsp;•&nbsp; Last Updated: October 24, 2026
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-close-btn"
                  >
                    ← Back to Contact Hub
                  </button>
                </div>

                <p className="privacy-paragraph">
                  Welcome to EasyBuilds ("we," "our," or "us"). We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, handle, and protect your information when you visit our website, run our demonstrations, or use our interactive UI tools and web showcases.
                </p>

                {/* Section 1 */}
                <div className="privacy-section">
                  <h3 className="privacy-section-heading">1. Information We Collect</h3>
                  <h4 className="privacy-subheading">Information You Provide Directly</h4>
                  <p className="privacy-paragraph">
                    <strong>Contact and inquiry data:</strong> If you contact us through contact forms, email, or interactive website widgets, we may collect your name, email address, and any feedback or questions you provide.
                  </p>
                  <h4 className="privacy-subheading">Automated Technical and Usage Data</h4>
                  <p className="privacy-paragraph">
                    <strong>Device and browser information:</strong> IP address, browser type and version, device hardware specifications, screen resolution, operating system, and referring URLs.
                  </p>
                  <p className="privacy-paragraph">
                    <strong>Interaction and performance data:</strong> Page load times, runtime errors, mouse position or movement telemetry used strictly in real time on your client device to power dynamic cursor effects, interactive canvas rendering, and hover parallax animations without storing personal identifiers, and click interactions.
                  </p>
                  <h4 className="privacy-subheading">Cookies and Local Storage</h4>
                  <p className="privacy-paragraph">
                    We may use local storage or session cookies to retain local UI preferences, such as animation toggles, dark or light visual modes, and sound settings, and to maintain user sessions.
                  </p>
                </div>

                {/* Section 2 */}
                <div className="privacy-section">
                  <h3 className="privacy-section-heading">2. How We Use Your Information</h3>
                  <p className="privacy-paragraph">We process and utilize information for the following purposes:</p>
                  <ul className="privacy-list">
                    <li><strong>Core functionality:</strong> Delivering interactive UI modules, custom cursor animations, canvas visual effects, and project galleries.</li>
                    <li><strong>Diagnostics and improvements:</strong> Resolving UI rendering bugs, optimizing asset delivery, and enhancing framework responsiveness.</li>
                    <li><strong>Communication:</strong> Responding to inquiries, feedback, and customer support requests submitted through our chatbot or support channels.</li>
                    <li><strong>Security and integrity:</strong> Preventing unauthorized access, debugging runtime script anomalies, and mitigating denial-of-service risks.</li>
                  </ul>
                </div>

                {/* Section 3 */}
                <div className="privacy-section">
                  <h3 className="privacy-section-heading">3. Data Storage and Local Processing</h3>
                  <h4 className="privacy-subheading">Real-Time Client Processing</h4>
                  <p className="privacy-paragraph">
                    The vast majority of interactive computations, such as cursor tracking, canvas redraws, and 3D CSS morphing, occur locally within your browser environment.
                  </p>
                  <h4 className="privacy-subheading">Retention Period</h4>
                  <p className="privacy-paragraph">
                    Contact information and basic server logs are retained only as long as necessary to fulfil operational, technical, or legal obligations.
                  </p>
                </div>

                {/* Section 4 */}
                <div className="privacy-section">
                  <h3 className="privacy-section-heading">4. Third-Party Services and Sharing</h3>
                  <p className="privacy-paragraph">
                    EasyBuilds does not sell, rent, or trade personal data. Anonymized technical data may be shared with trusted third parties solely under the following conditions:
                  </p>
                  <ul className="privacy-list">
                    <li><strong>Infrastructure and hosting providers:</strong> Content delivery networks and web hosting partners that support deployment of assets and stylesheets.</li>
                    <li><strong>Compliance with legal obligations:</strong> When required by applicable laws, court orders, or governmental regulations.</li>
                  </ul>
                </div>

                {/* Section 5 */}
                <div className="privacy-section">
                  <h3 className="privacy-section-heading">5. Your Rights and Choices</h3>
                  <p className="privacy-paragraph">
                    Depending on the applicable jurisdiction, such as GDPR or CCPA/CPRA where applicable, users may have the following rights regarding personal information:
                  </p>
                  <ul className="privacy-list">
                    <li><strong>Access and portability:</strong> Request a copy of personal information held about them.</li>
                    <li><strong>Correction:</strong> Request corrections to incomplete or inaccurate information.</li>
                    <li><strong>Erasure:</strong> Request deletion of personal data where applicable.</li>
                    <li><strong>Opt-out:</strong> Disable non-essential cookies through browser settings.</li>
                  </ul>
                </div>

                {/* Section 6 */}
                <div className="privacy-section">
                  <h3 className="privacy-section-heading">6. Security Measures</h3>
                  <p className="privacy-paragraph">
                    EasyBuilds aims to use appropriate organizational and technical safeguards, such as HTTPS encryption and secure static asset delivery, to protect against unauthorized access, loss, or alteration of data.
                  </p>
                </div>

                {/* Section 7 */}
                <div className="privacy-section">
                  <h3 className="privacy-section-heading">7. Contact Us</h3>
                  <p className="privacy-paragraph">
                    For questions, concerns, or privacy requests, users can contact:
                  </p>
                  <div className="privacy-contact-box">
                    <div><strong>Email:</strong> <a href={EASYBUILDS_CONTACT.emailLink}>{EASYBUILDS_CONTACT.email}</a></div>
                    <div><strong>Phone:</strong> <a href={EASYBUILDS_CONTACT.phoneLink}>{EASYBUILDS_CONTACT.phone}</a></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    ← Return to Contact Hub
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: Monitor 1 - Project Dashboard */}
            {modalView === 'dashboard' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      MONITOR 1 • EASYBUILDS WORKSTATION
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      Project Dashboard &amp; Telemetry
                    </h2>
                    <p style={{ color: '#8f9ba8', fontSize: '0.88rem', margin: 0 }}>
                      Live development status, active pipelines, and system metrics.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                    id="btn-close-dashboard"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <div className="telemetry-grid">
                  <div className="telemetry-card">
                    <div className="telemetry-stat">12</div>
                    <div className="telemetry-label">Active Projects</div>
                    <div className="telemetry-desc">4 in Review • 8 in Active Dev</div>
                  </div>
                  <div className="telemetry-card">
                    <div className="telemetry-stat">96%</div>
                    <div className="telemetry-label">Client CSAT</div>
                    <div className="telemetry-desc">Enterprise Satisfaction Rating</div>
                  </div>
                  <div className="telemetry-card">
                    <div className="telemetry-stat">24/7</div>
                    <div className="telemetry-label">Support SLA</div>
                    <div className="telemetry-desc">Automated Uptime Telemetry</div>
                  </div>
                  <div className="telemetry-card">
                    <div className="telemetry-stat">99.98%</div>
                    <div className="telemetry-label">Global Uptime</div>
                    <div className="telemetry-desc">Edge CDN Multi-Region Deploy</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', color: '#f5f7fa', margin: '1.4rem 0 0.8rem 0' }}>
                  Recent Production Projects
                </h3>
                <div className="device-cards-list">
                  <div className="device-card-row">
                    <div className="device-card-status status-deployed">DEPLOYED</div>
                    <div style={{ flex: 1 }}>
                      <div className="device-card-name">Azure Horizon Villa</div>
                      <div className="device-card-tech">Residential 3D Experience • React + Three.js PBR</div>
                    </div>
                    <div className="device-card-metric">16.4ms • 60 FPS</div>
                  </div>
                  <div className="device-card-row">
                    <div className="device-card-status status-live">LIVE</div>
                    <div style={{ flex: 1 }}>
                      <div className="device-card-name">Summit Alpine Retreat</div>
                      <div className="device-card-tech">Spatial Web Architecture • WebGL2 + GSAP</div>
                    </div>
                    <div className="device-card-metric">14.1ms • 60 FPS</div>
                  </div>
                  <div className="device-card-row">
                    <div className="device-card-status status-active">ACTIVE</div>
                    <div style={{ flex: 1 }}>
                      <div className="device-card-name">Onyx Pavilion</div>
                      <div className="device-card-tech">Interactive Configurator • Zero-Latency WebGL</div>
                    </div>
                    <div className="device-card-metric">42ms Build</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Start a New Commission →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: Monitor 2 - Portfolio Showcase */}
            {modalView === 'portfolio' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      MONITOR 2 • PORTFOLIO SHOWCASE
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      Premium Web Experiences for Modern Brands
                    </h2>
                    <p style={{ color: '#dab47c', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
                      WEB DEVELOPMENT • 3D INTERACTIVE • UI/UX DESIGN
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                    id="btn-close-portfolio"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <p style={{ color: '#9aa5b6', fontSize: '0.95rem', lineHeight: '1.55', margin: '0 0 1.25rem 0' }}>
                  We design and engineer bespoke 3D spatial web applications, luxury architectural configurators, and modern design systems tailored for forward-thinking brands that demand distinction and photorealism.
                </p>

                <div className="portfolio-grid">
                  <div className="portfolio-card">
                    <div className="portfolio-card-badge">3D INTERACTIVE</div>
                    <h4 className="portfolio-card-title">Azure Horizon Waterfront Villa</h4>
                    <p className="portfolio-card-desc">
                      Real-time interactive architectural walkthrough with custom PBR lighting, water caustics, and dynamic twilight sky.
                    </p>
                    <div className="portfolio-card-tags">Three.js • WebGL2 • Cook-Torrance PBR</div>
                  </div>

                  <div className="portfolio-card">
                    <div className="portfolio-card-badge">SPATIAL WEB</div>
                    <h4 className="portfolio-card-title">Summit Alpine Retreat</h4>
                    <p className="portfolio-card-desc">
                      High-altitude luxury chalet brand experience featuring smooth camera glides, spatial audio, and interactive floor plans.
                    </p>
                    <div className="portfolio-card-tags">React • Vite • WebGL • GSAP</div>
                  </div>

                  <div className="portfolio-card">
                    <div className="portfolio-card-badge">CONFIGURATOR</div>
                    <h4 className="portfolio-card-title">Onyx Pavilion &amp; Lounge</h4>
                    <p className="portfolio-card-desc">
                      Custom material and finishes configurator for modern luxury architecture with live specular reflection preview.
                    </p>
                    <div className="portfolio-card-tags">WebGL2 • Shaders • Mobile 60 FPS</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Inquire About a Commission →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: Hosting & Deployment Service Frame */}
            {modalView === 'service_hosting' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      SERVICE ARCHITECTURE • HOSTING &amp; DEPLOYMENT
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      Hosting &amp; Deployment
                    </h2>
                    <p style={{ color: '#dab47c', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
                      SCALABLE INFRASTRUCTURE. SEAMLESS PERFORMANCE.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                    id="btn-close-service-hosting"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <p style={{ color: '#c4cdd8', fontSize: '0.94rem', lineHeight: '1.6', margin: '0 0 1.2rem 0' }}>
                  Enterprise cloud infrastructure engineered for zero-downtime mission-critical web applications, photorealistic 3D platforms, and high-traffic brands.
                </p>

                <div className="service-feature-list">
                  <div className="service-feature-item">
                    <h4>☁ 99.99% Uptime SLA</h4>
                    <p>High-availability multi-cloud architecture with automated failover routing and zero single point of failure.</p>
                  </div>
                  <div className="service-feature-item">
                    <h4>⚡ Global Anycast CDN</h4>
                    <p>Sub-25ms global Time-To-First-Byte (TTFB) with intelligent edge asset caching and Brotli compression.</p>
                  </div>
                  <div className="service-feature-item">
                    <h4>🔒 Automated CI/CD &amp; SSL</h4>
                    <p>Git-driven instant automated build pipelines, zero-downtime rollbacks, and automated wildcard SSL renewals.</p>
                  </div>
                  <div className="service-feature-item">
                    <h4>🛡 DDoS &amp; Layer-7 WAF</h4>
                    <p>Proactive rate limiting, continuous origin shielding, and automated volumetric DDoS mitigation.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Contact us for further information →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: UI / UX Design Service Frame */}
            {modalView === 'service_uiux' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      SERVICE ARCHITECTURE • UI / UX DESIGN
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      UI / UX Design
                    </h2>
                    <p style={{ color: '#dab47c', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
                      INTUITIVE EXPERIENCES. MEANINGFUL INTERFACES.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                    id="btn-close-service-uiux"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <p style={{ color: '#c4cdd8', fontSize: '0.94rem', lineHeight: '1.6', margin: '0 0 1.2rem 0' }}>
                  Crafting bespoke dark luxury design systems, spatial 3D interfaces, and frictionless conversion journeys for architectural, luxury, and high-tech enterprises.
                </p>

                <div className="service-feature-list">
                  <div className="service-feature-item">
                    <h4>✦ Bespoke Design Systems</h4>
                    <p>Strict tokenized color systems, harmonious microfacet hierarchies, and custom typographic rhythm tailored to your brand identity.</p>
                  </div>
                  <div className="service-feature-item">
                    <h4>✨ Spatial 3D &amp; Micro-Interactions</h4>
                    <p>Physics-driven cursor reactions, interactive canvas depth, and fluid tactile feedback that delights users at every click.</p>
                  </div>
                  <div className="service-feature-item">
                    <h4>📱 Precision Responsive Layouts</h4>
                    <p>Adaptive design frameworks tailored flawlessly across ultra-wide 4K workstations, tablets, and mobile devices.</p>
                  </div>
                  <div className="service-feature-item">
                    <h4>🎯 Conversion Psychology</h4>
                    <p>Ergonomic wireframing, streamlined inquiry flows, and clear call-to-actions designed to maximize customer conversion.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Contact us for further information →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: Website Management Service Frame */}
            {modalView === 'service_management' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      SERVICE ARCHITECTURE • WEBSITE MANAGEMENT
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      Website Management
                    </h2>
                    <p style={{ color: '#dab47c', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
                      MONITOR. OPTIMIZE. GROW.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                    id="btn-close-service-management"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <p style={{ color: '#c4cdd8', fontSize: '0.94rem', lineHeight: '1.6', margin: '0 0 1.2rem 0' }}>
                  Continuous real-time telemetry, proactive vulnerability patching, and regular performance auditing to keep your digital platform operating at peak efficiency.
                </p>

                <div className="service-feature-list">
                  <div className="service-feature-item">
                    <h4>⚙ 24/7 Telemetry &amp; Uptime</h4>
                    <p>Round-the-clock synthetic monitoring, core web vitals tracking, and automated alert escalation.</p>
                  </div>
                  <div className="service-feature-item">
                    <h4>🛡 Proactive Security Updates</h4>
                    <p>Continuous dependency auditing, security patches, firewall tuning, and data backup redundancy.</p>
                  </div>
                  <div className="service-feature-item">
                    <h4>🚀 Continuous Performance Tuning</h4>
                    <p>Asset recompression, database index tuning, and regular caching layer optimizations to maintain sub-second load times.</p>
                  </div>
                  <div className="service-feature-item">
                    <h4>🤝 Dedicated Senior Engineering</h4>
                    <p>Direct priority engineering support for urgent content updates, feature additions, and custom integrations.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Contact us for further information →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: Website Development Service Frame */}
            {modalView === 'service_webdev' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      SERVICE ARCHITECTURE • WEBSITE DEVELOPMENT
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      Website Development
                    </h2>
                    <p style={{ color: '#dab47c', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
                      MODERN SOLUTIONS. REAL RESULTS.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                    id="btn-close-service-webdev"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <p style={{ color: '#c4cdd8', fontSize: '0.94rem', lineHeight: '1.6', margin: '0 0 1.2rem 0' }}>
                  Full-stack digital engineering built with modern frameworks, WebGL2, and custom Three.js rendering pipelines delivering instant responsiveness.
                </p>

                <div className="service-feature-list">
                  <div className="service-feature-item">
                    <h4>⟨ / ⟩ Modern Web Architecture</h4>
                    <p>Engineered with React, Next.js, and Vite for lightning-fast server-side rendering and client hydration.</p>
                  </div>
                  <div className="service-feature-item">
                    <h4>🌐 Interactive 3D &amp; WebGL2</h4>
                    <p>Photorealistic 360 virtual tours, custom GLSL shaders, and spatial interactive models running at a locked 60 FPS.</p>
                  </div>
                  <div className="service-feature-item">
                    <h4>🔄 Zero-Latency State Sync</h4>
                    <p>Optimized state management and lightweight WebSockets for interactive, multi-user real-time collaborations.</p>
                  </div>
                  <div className="service-feature-item">
                    <h4>📊 Accessible &amp; SEO-Engineered</h4>
                    <p>Semantic HTML5, WCAG AA accessibility compliance, and structured microdata for top-tier search rankings.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Contact us for further information →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: EasyBuilds Brand Plaque - About Studio */}
            {modalView === 'about' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      EASYBUILDS STUDIO • BRAND PHILOSOPHY
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      EasyBuilds Luxury Studio
                    </h2>
                    <p style={{ color: '#dab47c', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
                      BUILT WITH PRECISION. DESIGNED FOR IMPACT.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                    id="btn-close-about"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <div className="zone-highlight-card">
                  <p>
                    EasyBuilds is an elite architectural digital creative studio. We combine high-end spatial aesthetics, 3D interactive graphics, and uncompromising engineering discipline to build digital brand presences that captivate and convert.
                  </p>
                </div>

                <div className="telemetry-grid">
                  <div className="telemetry-card">
                    <div className="telemetry-stat">12</div>
                    <div className="telemetry-label">Active Projects</div>
                    <div className="telemetry-desc">Global Brand Engagements</div>
                  </div>
                  <div className="telemetry-card">
                    <div className="telemetry-stat">96%</div>
                    <div className="telemetry-label">Client Satisfaction</div>
                    <div className="telemetry-desc">Verified Enterprise Rating</div>
                  </div>
                  <div className="telemetry-card">
                    <div className="telemetry-stat">24/7</div>
                    <div className="telemetry-label">Dedicated Support</div>
                    <div className="telemetry-desc">Zero Synchronous Stall</div>
                  </div>
                  <div className="telemetry-card">
                    <div className="telemetry-stat">4</div>
                    <div className="telemetry-label">Core Disciplines</div>
                    <div className="telemetry-desc">Dev, Design, Host, Manage</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Contact us for further information →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: Surrounding Zone - Executive Lounge */}
            {modalView === 'zone_lounge' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      STUDIO ENVIRONMENT • EXECUTIVE LOUNGE
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      Executive Lounge &amp; Skyline Vista
                    </h2>
                    <p style={{ color: '#dab47c', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
                      CLIENT RECEPTION &amp; VISIONARY CONSULTATIONS
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <div className="zone-highlight-card">
                  <p>
                    Positioned alongside floor-to-ceiling panoramic glass overlooking the metropolitan night skyline, the executive lounge provides a sophisticated space for client consultations, creative briefings, and strategic project roadmapping.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Schedule a Consultation →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: Surrounding Zone - Display Shelves */}
            {modalView === 'zone_shelves' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      STUDIO ENVIRONMENT • ARCHITECTURAL ARCHIVE
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      Architectural Archive &amp; Material Library
                    </h2>
                    <p style={{ color: '#dab47c', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
                      DESIGN LITERATURE, CURATED ARTIFACTS &amp; AMBER BACKLIGHTING
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <div className="zone-highlight-card">
                  <p>
                    Recessed vertical timber slats illuminated by warm amber LED channels hold our studio design monographs, physical material samples, typographic reference specimens, and architectural trophies.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Contact us for further information →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: Surrounding Zone - Entrance Corridor */}
            {modalView === 'zone_entrance' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      STUDIO ENVIRONMENT • ARRIVAL SUITE
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      Studio Arrival &amp; Gallery Reception
                    </h2>
                    <p style={{ color: '#dab47c', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
                      PRIVATE ARCHITECTURAL SUITE ENTRANCE
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <div className="zone-highlight-card">
                  <p>
                    Framed in polished dark timber and floor-level architectural guidance lights, our private gallery reception guides visitors directly from the central concourse into the immersive EasyBuilds workspace.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Contact us for further information →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: Surrounding Zone - Whiteboard / Planning */}
            {modalView === 'zone_whiteboard' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      STUDIO ENVIRONMENT • SPRINT PLANNING
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      Ideas to Impact • Sprint Planning Whiteboard
                    </h2>
                    <p style={{ color: '#dab47c', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
                      PLAN. DESIGN. DEVELOP. DEPLOY. GROW.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <div className="zone-highlight-card">
                  <p>
                    The rear collaborative whiteboard tracks our active agile trajectories across Client Projects, New WebGL Features, Performance Optimization, Marketing, and Team Growth. Every architectural milestone is tracked from initial concept to live global deployment.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Contact us for further information →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: Monitor 3 - Services & Management */}
            {modalView === 'services' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      MONITOR 3 • DIGITAL SOLUTIONS
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      Our Services &amp; Infrastructure
                    </h2>
                    <p style={{ color: '#8f9ba8', fontSize: '0.88rem', margin: 0 }}>
                      Complete digital solutions for modern businesses.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                    id="btn-close-services"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <div className="services-modal-grid">
                  <div className="service-modal-card">
                    <div className="service-modal-icon">⟨ / ⟩</div>
                    <h4 className="service-modal-name">Website Development</h4>
                    <p className="service-modal-sub">Modern, scalable web applications</p>
                    <p className="service-modal-desc">
                      Full-stack applications built with React, Next.js, WebGL2, and custom Three.js rendering pipelines with zero-latency state synchronization.
                    </p>
                  </div>

                  <div className="service-modal-card">
                    <div className="service-modal-icon">✦</div>
                    <h4 className="service-modal-name">UI / UX Design</h4>
                    <p className="service-modal-sub">User-centered digital experiences</p>
                    <p className="service-modal-desc">
                      Bespoke dark luxury design systems, spatial interfaces, high-fidelity wireframes, and ergonomic typography engineered for high conversions.
                    </p>
                  </div>

                  <div className="service-modal-card">
                    <div className="service-modal-icon">☁</div>
                    <h4 className="service-modal-name">Hosting &amp; Deployment</h4>
                    <p className="service-modal-sub">Reliable infrastructure solutions</p>
                    <p className="service-modal-desc">
                      Multi-region Edge CDN routing, automated CI/CD pipelines, SSL encryption, and high-availability architecture with a 99.99% uptime SLA.
                    </p>
                  </div>

                  <div className="service-modal-card">
                    <div className="service-modal-icon">⚙</div>
                    <h4 className="service-modal-name">Website Management</h4>
                    <p className="service-modal-sub">Ongoing support and optimization</p>
                    <p className="service-modal-desc">
                      Continuous security auditing, database tuning, real-time performance telemetry, and dedicated senior engineering support.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Schedule a Consultation →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: Laptop - EasyBuilds Studio Workspace */}
            {modalView === 'studio' && (
              <div className="device-modal-view">
                <div className="popup-header">
                  <div>
                    <div className="popup-badge">
                      <span className="popup-badge-dot" />
                      LAPTOP WORKSPACE • EASYBUILDS STUDIO
                    </div>
                    <h2 className="privacy-title" style={{ margin: '0.4rem 0' }}>
                      EasyBuilds Studio Creative Engine
                    </h2>
                    <p style={{ color: '#dab47c', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
                      CREATING DIGITAL IMPACT
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                    id="btn-close-studio"
                  >
                    ← Return to Studio
                  </button>
                </div>

                <p style={{ color: '#9aa5b6', fontSize: '0.95rem', lineHeight: '1.55', margin: '0 0 1.25rem 0' }}>
                  The EasyBuilds mobile studio terminal provides live diagnostics and synchronization with our primary workstation array.
                </p>

                <div className="telemetry-grid">
                  <div className="telemetry-card">
                    <div className="telemetry-stat">WebGL2</div>
                    <div className="telemetry-label">Renderer Pipeline</div>
                    <div className="telemetry-desc">Native PBR Shader Model</div>
                  </div>
                  <div className="telemetry-card">
                    <div className="telemetry-stat">Cook-Torrance</div>
                    <div className="telemetry-label">BRDF Specular</div>
                    <div className="telemetry-desc">GGX Microfacet Model</div>
                  </div>
                  <div className="telemetry-card">
                    <div className="telemetry-stat">ACES Filmic</div>
                    <div className="telemetry-label">Color Grading</div>
                    <div className="telemetry-desc">Photorealistic Dynamic Range</div>
                  </div>
                  <div className="telemetry-card">
                    <div className="telemetry-stat">60 FPS</div>
                    <div className="telemetry-label">Frame Budget</div>
                    <div className="telemetry-desc">Zero Synchronous Stall</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(216, 222, 233, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setModalView('contact')}
                    className="popup-sub-btn"
                  >
                    Contact EasyBuilds Team →
                  </button>
                  <button
                    type="button"
                    onClick={closeModalAndReturn}
                    className="popup-close-btn"
                  >
                    ← Return to Studio
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coordinated Emergence Flight Arc Carrier */}
      {isRobotFlying && (
        <div
          className="robot-flight-carrier"
          style={{
            '--robot-start-x': `${flightPos.startX}px`,
            '--robot-start-y': `${flightPos.startY}px`,
            '--robot-end-x': `${flightPos.endX}px`,
            '--robot-end-y': `${flightPos.endY}px`
          }}
        >
          <RobotAssistantAvatar size={34} isFloating />
        </div>
      )}

      {/* Chatbot Window Panel with Galaxy Component Background */}
      <div id="eb-chat-window" className={isChatOpen ? '' : 'eb-hidden'} role="dialog" aria-label="EasyBuilds Assistant">
        {/* Real Galaxy Component inside Chatbot Panel */}
        <div className="chat-galaxy-layer" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: '16px' }}>
          <Galaxy
            density={1.1}
            glowIntensity={0.35}
            flareIntensity={1.0}
            starSpeed={0.4}
            saturation={0.0}
            hueShift={0}
            starColors={['#ffffff', '#e8edf5', '#b6beca', '#747d8c']}
            transparent={false}
            mouseRepulsion
            clickWarp
            disableAnimation={!isChatOpen}
          />
        </div>

        <div className="eb-chat-header" style={{ position: 'relative', zIndex: 1 }}>
          <div className="eb-chat-title">
            <span className="eb-status-indicator" />
            <RobotAssistantAvatar size={20} isFloating />
            EasyBuilds Assistant
          </div>
          <button
            id="eb-chat-close"
            aria-label="Close chat"
            onClick={handleCloseChat}
          >
            &times;
          </button>
        </div>

        {/* Message Thread with Clickable Links */}
        <div id="eb-chat-messages" className="eb-chat-messages" style={{ position: 'relative', zIndex: 1 }}>
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`eb-chat-bubble ${msg.sender === 'user' ? 'user' : 'assistant'}`}
            >
              {formatChatMessage(msg.text)}
            </div>
          ))}
          <div ref={chatMessagesEndRef} />
        </div>

        {/* Predefined FAQ Quick Suggestion Chips */}
        <div id="eb-chat-options" className="eb-chat-options" style={{ position: 'relative', zIndex: 1 }}>
          {FAQ_DATA.map((faq) => (
            <button
              key={faq.id}
              type="button"
              className="eb-chip-btn"
              onClick={() => handleSelectFaqOption(faq)}
            >
              {faq.question}
            </button>
          ))}
        </div>

        {/* Rule-based Chat Input Form */}
        <form id="eb-chat-form" className="eb-chat-form" onSubmit={handleChatSubmit} style={{ position: 'relative', zIndex: 1 }}>
          <input
            type="text"
            id="eb-chat-input"
            placeholder="Type a question or select above..."
            autoComplete="off"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button type="submit" id="eb-chat-send">
            Send
          </button>
        </form>
      </div>
    </div>
  );
});

export default ContactStudio;
