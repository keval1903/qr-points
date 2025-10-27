// ============================================
// QR POINTS REDEMPTION - FRONTEND
// ============================================

class RedemptionApp {
  constructor() {
    this.form = document.getElementById('redemptionForm');
    this.codeInput = document.getElementById('codeInput');
    this.nameInput = document.getElementById('nameInput');
    this.phoneInput = document.getElementById('phoneInput');
    this.submitBtn = document.getElementById('submitBtn');
    this.loading = document.getElementById('loading');
    this.alert = document.getElementById('alert');
    this.codeBadge = document.getElementById('codeBadge');
    
    this.init();
  }

  init() {
    // Get code/token from URL
    this.parseURLParams();
    
    // Phone input validation
    this.phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Load saved name from localStorage
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      this.nameInput.value = savedName;
    }
  }

  parseURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const code = urlParams.get('code');

    if (token) {
      this.codeInput.value = token;
      this.codeBadge.textContent = 'Token detected';
      this.codeBadge.classList.add('active');
    } else if (code) {
      this.codeInput.value = code;
      this.codeBadge.textContent = 'Code detected';
      this.codeBadge.classList.add('active');
    }
  }

  async handleSubmit() {
    const code = this.codeInput.value.trim();
    const name = this.nameInput.value.trim();
    const phone = this.phoneInput.value.trim();

    // Validation
    if (!code) {
      this.showAlert('Please scan a valid QR code', 'error');
      return;
    }

    if (!name) {
      this.showAlert('Please enter your name', 'error');
      this.nameInput.focus();
      return;
    }

    if (phone.length !== 10) {
      this.showAlert('Please enter a valid 10-digit phone number', 'error');
      this.phoneInput.focus();
      return;
    }

    // Save name for future use
    localStorage.setItem('userName', name);

    // Disable form
    this.setLoading(true);

    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          name,
          phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        this.showAlert(
          `✅ ${data.message}<br><br>
          <strong>Product:</strong> ${data.data.product}<br>
          <strong>Points Earned:</strong> ${data.data.points}<br>
          <strong>Total Points:</strong> ${data.data.totalPoints}<br><br>
          <a href="dashboard.html?phone=${phone}" style="color: #667eea; font-weight: 600; text-decoration: none;">View Dashboard →</a>`,
          'success'
        );

        // Clear form
        this.nameInput.value = '';
        this.phoneInput.value = '';
        
        // Clear URL params
        window.history.replaceState({}, document.title, window.location.pathname);
        this.codeInput.value = '';
        this.codeBadge.textContent = 'Waiting for QR scan';
        this.codeBadge.classList.remove('active');
      } else {
        this.showAlert(`❌ ${data.message}`, 'error');
      }
    } catch (error) {
      console.error('Redemption error:', error);
      this.showAlert('❌ Network error. Please check your connection and try again.', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(isLoading) {
    if (isLoading) {
      this.submitBtn.disabled = true;
      this.loading.classList.add('show');
      this.alert.classList.remove('show');
    } else {
      this.submitBtn.disabled = false;
      this.loading.classList.remove('show');
    }
  }

  showAlert(message, type) {
    this.alert.innerHTML = message;
    this.alert.className = `alert ${type} show`;
    
    // Auto-hide success messages after 10 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.alert.classList.remove('show');
      }, 10000);
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new RedemptionApp());
} else {
  new RedemptionApp();
}
