/**
 * ABM FM - Component Loader (Header & Footer)
 * Dynamically loads header.html and footer.html into all pages
 */

(function () {
  async function loadComponent(placeholderId, componentPath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return false;

    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Failed to load ${componentPath}: ${response.status} ${response.statusText}`);
      }
      const htmlText = await response.text();
      placeholder.outerHTML = htmlText;
      return true;
    } catch (error) {
      console.error(`[ABM FM Components] Error loading ${componentPath}:`, error);
      return false;
    }
  }

  function setupStickyHeader() {
    const header = document.querySelector('.site-header-abm-floating') || document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const cleanPath = currentPath.split('?')[0].split('#')[0];

    // Remove any existing active classes from header navigation
    document.querySelectorAll('.site-header-abm-floating .active').forEach((el) => {
      el.classList.remove('active');
    });

    // Check direct top-level links
    const topNavLinks = document.querySelectorAll('.site-header-abm-floating .navbar-nav > .nav-item > .nav-link, .btn-abm-exact-contact');
    let matchedTop = false;

    topNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.split('?')[0].split('#')[0] === cleanPath) {
        link.classList.add('active');
        matchedTop = true;
      }
    });

    if (!matchedTop) {
      // Key Verticals sub-pages
      const keyVerticalsPages = [
        'aviation-transportation.html',
        'hightech-missioncritical.html',
        'commercial-hospitality.html',
        'healthcare-lifesciences.html',
        'industrial-manufacturing.html',
        'education-publicsector.html',
        'industries.html'
      ];
      if (keyVerticalsPages.includes(cleanPath)) {
        document.getElementById('keyVerticalsDropdown')?.classList.add('active');
        return;
      }

      // Solutions sub-pages
      const solutionPages = [
        'solutions.html',
        'strategic-fm-consultancy.html',
        'operational-planning-excellence.html',
        'fm-contracts-operations.html',
        'stakeholder-customer-experience.html',
        'training-capability-development.html',
        'fm-technology-digital-solutions.html',
        'soft-services-workplace.html',
        'service-quality-improvement.html',
        'fm-governance-compliance.html',
        'fm-mobilization-transition.html',
        'asset-infrastructure-advisory.html',
        'engineering-systems-assessment.html',
        'reliability-maintenance-engineering.html',
        'root-cause-analysis.html',
        'energy-management-efficiency.html',
        'sustainability-green-energy.html',
        'engineering-projects-capex.html',
        'infrastructure-risk-resilience.html',
        'smart-infrastructure-technology.html',
        'asset-lifecycle-planning.html'
      ];
      if (solutionPages.includes(cleanPath)) {
        document.getElementById('solutionsDropdown')?.classList.add('active');
        return;
      }
    }
  }

  async function initComponents() {
    const headerPromise = loadComponent('site-header-placeholder', 'header.html');
    const footerPromise = loadComponent('site-footer-placeholder', 'footer.html');

    const [headerLoaded] = await Promise.all([headerPromise, footerPromise]);

    if (headerLoaded) {
      setupStickyHeader();
      setActiveNavLink();

      // Dispatch custom event for any scripts depending on header/footer
      document.dispatchEvent(new CustomEvent('abmComponentsLoaded'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }
})();
