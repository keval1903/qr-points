// ============================================
// QR POINTS DASHBOARD - FRONTEND
// ============================================

class DashboardApp {
  constructor() {
    this.form = document.getElementById('lookupForm');
    this.phoneInput = document.getElementById('phoneInput');
    this.lookupBtn = document.getElementById('lookupBtn');
    this.loading = document.getElementById('loading');
    this.alert = document.getElementById('alert');
    this.dashboardContent = document.getElementById('dashboardContent');
    
    this.init();
  }

  init() {
    // Phone input validation
    this.phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLookup();
    });

    // Check if phone is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const phone = urlParams.get('phone');
    if (phone) {
      this.phoneInput.value = phone;
      this.handleLookup();
    }
  }

  async handleLookup() {
    const phone = this.phoneInput.value.trim();

    if (phone.length !== 10) {
      this.showAlert('Please enter a valid 10-digit phone number', 'error');
      this.phoneInput.focus();
      return;
    }

    this.setLoading(true);
    this.dashboardContent.style.display = 'none';

    try {
      const response = await fetch(`/api/dashboard?phone=${phone}`);
      const data = await response.json();

      if (data.success) {
        this.renderDashboard(data.data);
        this.alert.classList.remove('show');
      } else {
        this.showAlert(`❌ ${data.message}`, 'error');
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      this.showAlert('❌ Network error. Please check your connection and try again.', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  renderDashboard(data) {
    // Update stats
    document.getElementById('totalPoints').textContent = data.totalPoints || 0;
    document.getElementById('totalRedemptions').textContent = data.redemptions?.length || 0;

    // Render activity list
    const activityList = document.getElementById('recentActivity');
    
    if (!data.redemptions || data.redemptions.length === 0) {
      activityList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <div class="empty-state-text">No redemptions yet</div>
          <div class="empty-state-hint">Scan a QR code to start earning points!</div>
        </div>
      `;
    } else {
      activityList.innerHTML = data.redemptions
        .map(item => `
          <div class="activity-item">
            <div class="activity-header">
              <div class="activity-product">${this.escapeHtml(item.product)}</div>
              <div class="activity-points">+${item.points} pts</div>
            </div>
            <div class="activity-details">
              <span>📦 <span class="activity-code">${this.escapeHtml(item.code)}</span></span>
              <span>📅 ${this.formatDate(item.date)}</span>
            </div>
          </div>
        `)
        .join('');
    }

    this.dashboardContent.style.display = 'block';
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  setLoading(isLoading) {
    if (isLoading) {
      this.lookupBtn.disabled = true;
      this.loading.classList.add('show');
      this.alert.classList.remove('show');
    } else {
      this.lookupBtn.disabled = false;
      this.loading.classList.remove('show');
    }
  }

  showAlert(message, type) {
    this.alert.innerHTML = message;
    this.alert.className = `alert ${type} show`;
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new DashboardApp());
} else {
  new DashboardApp();
}
