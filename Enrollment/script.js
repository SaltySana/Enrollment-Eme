// General Notification Bell Handler
document.addEventListener('DOMContentLoaded', function () {
  const notificationBell = document.querySelector('.notification-bell');
  const notificationPopup = document.createElement('div');
  notificationPopup.id = 'notification-popup';
  notificationPopup.style.position = 'fixed';
  notificationPopup.style.top = '60px';
  notificationPopup.style.right = '20px';
  notificationPopup.style.zIndex = '1000';
  notificationPopup.style.display = 'none';
  notificationPopup.style.backgroundColor = '#fff';
  notificationPopup.style.color = '#333';
  notificationPopup.style.padding = '15px';
  notificationPopup.style.border = '1px solid #ddd';
  notificationPopup.style.borderRadius = '5px';
  notificationPopup.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
  notificationPopup.textContent = 'No new notifications at this time.';
  document.body.appendChild(notificationPopup);

  let popupTimeout;

  if (notificationBell) {
    notificationBell.addEventListener('click', function () {
      if (notificationPopup.style.display === 'none') {
        notificationPopup.style.display = 'block';

        // Automatically hide the popup after 3 seconds
        clearTimeout(popupTimeout);
        popupTimeout = setTimeout(() => {
          notificationPopup.style.display = 'none';
        }, 1500);
      } else {
        notificationPopup.style.display = 'none';
        clearTimeout(popupTimeout);
      }
    });
  }
});
// Dashboard Page Script
function initializeDashboardPage() {
  let currentSlide = 0;
  const indicators = document.querySelectorAll('.indicator');

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentSlide = index;
      updateCarousel();
    });
  });

  function updateCarousel() {
    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  setInterval(() => {
    currentSlide = (currentSlide + 1) % indicators.length;
    updateCarousel();
  }, 1000);
}

// Enrollment Form Script
function initializeEnrollmentForm() {
  const allPaymentCards = document.querySelectorAll('.payment-card');
  const allCheckboxes = document.querySelectorAll('input[name="payment-option"]');

  allPaymentCards.forEach(card => {
    card.addEventListener('click', function () {
      const checkbox = this.querySelector('input[type="checkbox"]');

      allCheckboxes.forEach(cb => {
        cb.checked = false;
      });

      allPaymentCards.forEach(c => {
        c.classList.remove('selected');
      });

      checkbox.checked = true;
      this.classList.add('selected');
    });
  });

  document.querySelectorAll('.payment-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', function (event) {
      event.stopPropagation();
      this.parentElement.click();
    });
  });

  document.querySelector('.proceed-btn').addEventListener('click', function () {
    const requiredFields = [
      'lastName', 'firstName', 'homeAddress', 'contactNumber',
      'fathersName', 'fatherOccupation', 'mothersName', 'motherOccupation',
      'parentAddress', 'previousSchool', 'yearGradeLevel', 'enrollmentDate', 'generalAverage'
    ];

    let isValid = true;

    requiredFields.forEach(field => {
      const input = document.getElementById(field);
      const errorElement = document.getElementById(`${field}-error`);

      if (!input.value.trim()) {
        input.classList.add('error');
        if (errorElement) {
          errorElement.style.display = 'block';
        }
        isValid = false;
      } else {
        input.classList.remove('error');
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      }
    });

    const paymentOptionSelected = Array.from(document.querySelectorAll('input[name="payment-option"]')).some(cb => cb.checked);

    if (!paymentOptionSelected) {
      showAlert('Please select a payment option to proceed.', 'error');
      isValid = false;
    }

    if (isValid) {
      showModal();
    } else {
      const firstError = document.querySelector('.form-control.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const alertBox = document.createElement('div');
    alertBox.className = `alert ${type}`;
    alertBox.innerHTML = `
      <span>${message}</span>
      <button class="close-btn" onclick="this.parentElement.remove()">×</button>
    `;

    alertContainer.appendChild(alertBox);

    setTimeout(() => {
      if (alertBox.parentElement) {
        alertBox.style.animation = 'fadeOut 0.5s ease';
        alertBox.addEventListener('animationend', () => alertBox.remove());
      }
    }, 5000);
  }

  function showModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.style.display = 'flex';
  }

  function hideModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.style.display = 'none';
  }

  document.getElementById('confirm-submit').addEventListener('click', function () {
    showLoadingSpinner();
    setTimeout(() => {
      window.location.href = 'payment.html';
    }, 750);
  });

  document.getElementById('cancel-submit').addEventListener('click', function () {
    showAlert('Form submission canceled by the user.', 'warning');
    hideModal();
  });

  function showLoadingSpinner() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'flex';
  }
}

// Curriculum Page Script
function initializeCurriculumPage() {
  const tabButtons = document.querySelectorAll('.curriculum-tab');
  const tabSections = document.querySelectorAll('.curriculum-section');

    const jhsSection = document.getElementById('jhs');
  const shsSection = document.getElementById('shs');
  
  if (shsSection && jhsSection.contains(shsSection)) {

    const curriculumContent = document.querySelector('.curriculum-content');
    curriculumContent.appendChild(shsSection);
    console.log('Fixed SHS section structure');
  }
  

  if (shsSection) {
    if (!document.querySelector('.curriculum-tab[data-tab="shs"]').classList.contains('active')) {
      shsSection.classList.remove('active');
    }
  } else {
    console.error('SHS section not found in the document');
  }
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      tabSections.forEach(section => section.classList.remove('active'));
      const tabId = this.getAttribute('data-tab');
      const targetSection = document.getElementById(tabId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });

  const levelHeaders = document.querySelectorAll('.level-header');
  levelHeaders.forEach(header => {
    header.addEventListener('click', function () {
      const toggleIcon = this.querySelector('.level-toggle');
      const detailsSection = this.nextElementSibling;

      toggleIcon.classList.toggle('open');
      detailsSection.classList.toggle('open');
    });
  });

  const downloadBtn = document.querySelector('.primary-button');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function (e) {
      e.preventDefault();
      alert('Curriculum guide download started.');
    });
  }

  const printBtn = document.querySelector('.secondary-button');
  if (printBtn) {
    printBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.print();
    });
  }
}

// Payment Page Script
function initializePaymentPage() {
  function showLoadingSpinner() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'flex';
  }

  document.querySelectorAll('.payment-btn').forEach(button => {
    button.addEventListener('click', function () {
      showLoadingSpinner();
      setTimeout(() => {
        window.location.href = 'payment.html';
      }, 750);
    });
  });
}

// Schedule Page Script
function initializeSchedulePage() {
  document.querySelectorAll('.nav-item').forEach(function (item) {
    item.addEventListener('click', function () {
      if (!this.classList.contains('active')) {
        document.querySelectorAll('.nav-item').forEach(function (navItem) {
          navItem.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });
}

// Settings Page Script
function initializeSettingsPage() {
  const tabs = document.querySelectorAll('.settings-tab');
  const contents = document.querySelectorAll('.settings-content');
  const colorOptions = document.querySelectorAll('.color-option');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`${target}-settings`).classList.add('active');
    });
  });

  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      colorOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
    });
  });
}

// Settings Page Color Management
function initializeColorManagement() {
  const colorOptions = document.querySelectorAll('.color-option');
  const saveButton = document.querySelector('#appearance-settings .btn');
  const darkModeToggle = document.querySelector('input[name="theme"][value="dark"]');
  const lightModeToggle = document.querySelector('input[name="theme"][value="light"]');
  let selectedColor = null;

  // Dark mode handling
  if (darkModeToggle && lightModeToggle) {
    // Set initial state from localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.checked = isDarkMode;
    lightModeToggle.checked = !isDarkMode;
    document.documentElement.classList.toggle('dark-mode', isDarkMode);

    // Dark mode toggle event listener
    [darkModeToggle, lightModeToggle].forEach(toggle => {
      toggle.addEventListener('change', function() {
        const isDark = darkModeToggle.checked;
        document.documentElement.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark);
      });
    });
  }

  // Color selection handling
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      selectedColor = this.classList[1];
    });
  });

  // Save button handling
  if (saveButton) {
    saveButton.addEventListener('click', function() {
      if (selectedColor) {
        applyThemeColors(selectedColor);
        localStorage.setItem('selectedColorTheme', selectedColor);
        showAlert('Theme settings saved successfully!', 'success');
      }
    });
  }
}

function applyThemeColors(colorClass) {
  const root = document.documentElement;
  const colorMap = {
    'color-maroon': { main: '#8b1a37', darker: '#5a0f23' },
    'color-blue': { main: '#1a3d8b', darker: '#112959' },
    'color-green': { main: '#1a8b4f', darker: '#115933' },
    'color-purple': { main: '#4f1a8b', darker: '#331159' }
  };

  const colors = colorMap[colorClass] || colorMap['color-maroon'];
  
  // Update CSS variables
  root.style.setProperty('--primary-color', colors.main);
  root.style.setProperty('--primary-darker', colors.darker);
  root.style.setProperty('--gradient-background', `linear-gradient(to bottom, var(--primary-color), var(--primary-darker))`);

  // Update sidebar and all gradient elements
  document.querySelectorAll('.sidebar, .card, .announcement-slide, .level-card, .schedule-container').forEach(element => {
    element.style.background = 'var(--gradient-background)';
  });

  // Save colors to localStorage
  localStorage.setItem('primaryColor', colors.main);
  localStorage.setItem('primaryDarker', colors.darker);
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedColor = localStorage.getItem('primaryColor');
  const savedDarker = localStorage.getItem('primaryDarker');

  if (savedColor && savedDarker) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', savedColor);
    root.style.setProperty('--primary-darker', savedDarker);
    root.style.setProperty('--gradient-background', `linear-gradient(to bottom, var(--primary-color), var(--primary-darker))`);

    // Update gradient elements
    document.querySelectorAll('.sidebar, .card, .announcement-slide, .level-card, .schedule-container').forEach(element => {
      element.style.background = 'var(--gradient-background)';
    });
  }

  const savedColorTheme = localStorage.getItem('selectedColorTheme');
  if (savedColorTheme) {
    applyThemeColors(savedColorTheme);
    
    // Update active state of color option if on settings page
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
      if (option.classList.contains(savedColorTheme)) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }

  // Apply dark mode on page load
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  document.documentElement.classList.toggle('dark-mode', isDarkMode);

  // Initialize color management if on settings page
  if (document.querySelector('.color-option')) {
    initializeColorManagement();
  }
});

function applyPrimaryColor(colorClass) {
  const root = document.documentElement;
  const colorMap = {
    'color-maroon': ['#8b1a37', '#5a0f23'],
    'color-blue': ['#1a3d8b', '#122d66'],
    'color-green': ['#1a8b4f', '#115a33'],
    'color-purple': ['#4f1a8b', '#331159']
  };

  const colors = colorMap[colorClass] || colorMap['color-maroon'];
  root.style.setProperty('--primary-color', colors[0]);
  root.style.setProperty('--primary-gradient-start', colors[0]);
  root.style.setProperty('--primary-gradient-end', colors[1]);

  // Update sidebar and other gradient elements
  document.querySelectorAll('.sidebar, .card, .announcement-slide, .level-card').forEach(element => {
    element.style.background = `linear-gradient(to bottom, var(--primary-gradient-start), var(--primary-gradient-end))`;
  });

  // Save colors to localStorage
  localStorage.setItem('primaryColor', colors[0]);
  localStorage.setItem('primaryGradientStart', colors[0]);
  localStorage.setItem('primaryGradientEnd', colors[1]);
}

// Alert function for feedback
function showAlert(message, type) {
  const alertContainer = document.createElement('div');
  alertContainer.style.position = 'fixed';
  alertContainer.style.top = '20px';
  alertContainer.style.right = '20px';
  alertContainer.style.padding = '15px';
  alertContainer.style.borderRadius = '5px';
  alertContainer.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
  alertContainer.style.color = type === 'success' ? '#155724' : '#721c24';
  alertContainer.style.zIndex = '9999';
  alertContainer.textContent = message;

  document.body.appendChild(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, 3000);
}

// Ledger Page Script
function initializeLedgerPage() {
  // No additional functionality beyond notification bell
}

// Initialize Scripts Based on Page
document.addEventListener('DOMContentLoaded', function () {
  const pageTitle = document.title;

  if (pageTitle.includes('Dashboard')) initializeDashboardPage();
  if (pageTitle.includes('Enrollment Form')) initializeEnrollmentForm();
  if (pageTitle.includes('Curriculum')) initializeCurriculumPage();
  if (pageTitle.includes('Payment')) initializePaymentPage();
  if (pageTitle.includes('Schedule')) initializeSchedulePage();
  if (pageTitle.includes('Settings')) initializeSettingsPage();
  if (pageTitle.includes('Ledger')) initializeLedgerPage();
});
