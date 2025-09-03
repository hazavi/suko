import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

export interface SupportSection {
  id: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  currentSection = 'contact';
  
  sections: { [key: string]: SupportSection } = {
    contact: {
      id: 'contact',
      title: 'Contact Us',
      content: `
        <div class="contact-grid">
          <div class="contact-card">
            <h4>Email</h4>
            <p><a href="mailto:hello@suko.com">hello@suko.com</a></p>
            <p><a href="mailto:orders@suko.com">orders@suko.com</a></p>
          </div>
          <div class="contact-card">
            <h4>Phone</h4>
            <p>DK: +45 12 34 56 78</p>
            <p>SE: +46 123 456 789</p>
            <small>Mon-Fri 9AM-5PM CET</small>
          </div>
          <div class="contact-card">
            <h4>Live Chat</h4>
            <p>Available Mon-Fri 9AM-5PM</p>
            <button class="chat-btn">Start Chat</button>
          </div>
        </div>
      `
    },
    faq: {
      id: 'faq',
      title: 'FAQ',
      content: `
        <div class="faq-container">
          <div class="faq-item">
            <details>
              <summary>How long does shipping take?</summary>
              <p>Standard: 3-5 days in Europe, 7-10 days internationally.</p>
            </details>
          </div>
          <div class="faq-item">
            <details>
              <summary>What is your return policy?</summary>
              <p>Free returns within 30 days. Items must be unworn with tags.</p>
            </details>
          </div>
          <div class="faq-item">
            <details>
              <summary>How do I track my order?</summary>
              <p>You'll receive a tracking number via email once shipped.</p>
            </details>
          </div>
          <div class="faq-item">
            <details>
              <summary>What sizes do you offer?</summary>
              <p>XS-XXL. Check our size guide for measurements.</p>
            </details>
          </div>
          <div class="faq-item">
            <details>
              <summary>Do you ship internationally?</summary>
              <p>Yes! Shipping costs vary by destination.</p>
            </details>
          </div>
        </div>
      `
    },
    'size-guide': {
      id: 'size-guide',
      title: 'Size Guide',
      content: `
        <div class="size-guide-compact">
          <table class="size-table">
            <thead>
              <tr><th>Size</th><th>Chest (cm)</th><th>Length (cm)</th></tr>
            </thead>
            <tbody>
              <tr><td>XS</td><td>86-91</td><td>66</td></tr>
              <tr><td>S</td><td>91-96</td><td>68</td></tr>
              <tr><td>M</td><td>96-101</td><td>70</td></tr>
              <tr><td>L</td><td>101-106</td><td>72</td></tr>
              <tr><td>XL</td><td>106-111</td><td>74</td></tr>
              <tr><td>XXL</td><td>111-116</td><td>76</td></tr>
            </tbody>
          </table>
          <div class="size-tips">
            <p><strong>Chest:</strong> Measure around fullest part</p>
            <p><strong>Length:</strong> Shoulder to hem</p>
          </div>
        </div>
      `
    },
    shipping: {
      id: 'shipping',
      title: 'Shipping',
      content: `
        <div class="shipping-grid">
          <div class="shipping-card">
            <h4>Standard</h4>
            <p>3-5 days</p>
            <small>Free on €50+</small>
          </div>
          <div class="shipping-card">
            <h4>Express</h4>
            <p>1-2 days</p>
            <small>€9.95</small>
          </div>
          <div class="shipping-card">
            <h4>International</h4>
            <p>7-10 days</p>
            <small>Varies</small>
          </div>
        </div>
      `
    },
    returns: {
      id: 'returns',
      title: 'Returns',
      content: `
        <div class="returns-info">
          <div class="policy-card">
            <h4>Return Policy</h4>
            <ul>
              <li>30-day window</li>
              <li>Unworn with tags</li>
              <li>Free in EU</li>
            </ul>
          </div>
          <div class="process-card">
            <h4>Return Process</h4>
            <ol>
              <li>Login to account</li>
              <li>Select return items</li>
              <li>Print label</li>
              <li>Drop at post office</li>
            </ol>
          </div>
        </div>
      `
    },
    about: {
      id: 'about',
      title: 'About SUKO',
      content: `
        <div class="about-content">
          <p>Contemporary fashion brand focused on timeless, sustainable pieces.</p>
          <div class="about-sections">
            <div class="about-card">
              <h4>Mission</h4>
              <p>High-quality, ethically-made clothing combining style with sustainability.</p>
            </div>
            <div class="about-card">
              <h4>Sustainability</h4>
              <p>Organic materials, recycled fabrics, certified ethical manufacturers.</p>
            </div>
          </div>
        </div>
      `
    },
    careers: {
      id: 'careers',
      title: 'Careers',
      content: `
        <div class="careers-content">
          <p>Join our team and help shape sustainable fashion's future.</p>
          <div class="careers-info">
            <h4>Current Openings</h4>
            <p>Check back regularly for new opportunities.</p>
            <h4>Apply</h4>
            <p>Send resume to <a href="mailto:careers@suko.com">careers@suko.com</a></p>
          </div>
        </div>
      `
    },
    'privacy-policy': {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      content: `
        <div class="policy-content">
          <p><em>Last updated: September 2025</em></p>
          <div class="policy-sections">
            <div class="policy-item">
              <details>
                <summary>Information We Collect</summary>
                <p>Information you provide when creating accounts or making purchases.</p>
              </details>
            </div>
            <div class="policy-item">
              <details>
                <summary>How We Use Information</summary>
                <p>To process orders, provide customer service, and improve our services.</p>
              </details>
            </div>
            <div class="policy-item">
              <details>
                <summary>Information Sharing</summary>
                <p>We do not sell or rent your personal information to third parties.</p>
              </details>
            </div>
          </div>
        </div>
      `
    },
    'terms-of-service': {
      id: 'terms-of-service',
      title: 'Terms of Service',
      content: `
        <div class="terms-content">
          <p><em>Last updated: September 2025</em></p>
          <div class="terms-sections">
            <div class="terms-item">
              <details>
                <summary>Acceptance of Terms</summary>
                <p>By using our website, you agree to these Terms of Service.</p>
              </details>
            </div>
            <div class="terms-item">
              <details>
                <summary>Products and Services</summary>
                <p>We reserve the right to modify or discontinue products without notice.</p>
              </details>
            </div>
            <div class="terms-item">
              <details>
                <summary>Orders and Payment</summary>
                <p>All orders subject to availability. Payment due at purchase.</p>
              </details>
            </div>
          </div>
        </div>
      `
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const section = params['section'] || 'contact';
      this.switchSection(section);
    });
  }

  switchSection(sectionId: string) {
    if (this.sections[sectionId]) {
      this.currentSection = sectionId;
      this.titleService.setTitle(`${this.sections[sectionId].title} - SUKO`);
      this.router.navigate(['/support', sectionId]);
      
      // Smooth scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  getCurrentSection(): SupportSection {
    return this.sections[this.currentSection] || this.sections['contact'];
  }
}
