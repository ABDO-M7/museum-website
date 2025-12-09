// ===================================
// Configuration
// ===================================
const API_BASE_URL = 'http://localhost:5000/api'; // Change to Railway URL in production

// ===================================
// Navigation
// ===================================
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// Scroll effect for navbar
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking a link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// ===================================
// Filter Functionality
// ===================================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const exhibitionCards = document.querySelectorAll('[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    // Filter gallery items
    if (galleryItems.length > 0) {
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.5s ease';
        } else {
          item.style.display = 'none';
        }
      });
    }

    // Filter exhibition cards
    if (exhibitionCards.length > 0) {
      exhibitionCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.5s ease';
        } else {
          card.style.display = 'none';
        }
      });
    }
  });
});

// ===================================
// Booking Form
// ===================================
const bookingForm = document.getElementById('bookingForm');
const successMessage = document.getElementById('successMessage');
const bookingDetails = document.getElementById('bookingDetails');

if (bookingForm) {
  // Set minimum date to today
  const visitDateInput = document.getElementById('visitDate');
  if (visitDateInput) {
    const today = new Date().toISOString().split('T')[0];
    visitDateInput.setAttribute('min', today);
  }

  // Character count for special requests
  const specialRequests = document.getElementById('specialRequests');
  const charCount = document.getElementById('charCount');
  
  if (specialRequests && charCount) {
    specialRequests.addEventListener('input', () => {
      charCount.textContent = specialRequests.value.length;
    });
  }

  // Form submission
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Get form data
    const formData = {
      visitorName: document.getElementById('visitorName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      visitDate: document.getElementById('visitDate').value,
      numberOfVisitors: parseInt(document.getElementById('numberOfVisitors').value),
      tourType: document.querySelector('input[name="tourType"]:checked')?.value,
      specialRequests: document.getElementById('specialRequests').value.trim()
    };

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    submitBtn.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        // Show success message
        bookingForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Display booking details
        const booking = result.data;
        bookingDetails.innerHTML = `
          <p><strong>Name:</strong> ${booking.visitorName}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Visit Date:</strong> ${new Date(booking.visitDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p><strong>Visitors:</strong> ${booking.numberOfVisitors}</p>
          <p><strong>Tour Type:</strong> ${booking.tourType.charAt(0).toUpperCase() + booking.tourType.slice(1)}</p>
          <p><strong>Booking ID:</strong> ${booking._id}</p>
        `;

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        showError('form', result.message || 'Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      showError('form', 'Unable to connect to server. Please check your connection and try again.');
    } finally {
      // Reset button state
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
}

// ===================================
// Form Validation
// ===================================
function validateForm() {
  let isValid = true;

  // Visitor Name
  const visitorName = document.getElementById('visitorName');
  if (!visitorName.value.trim()) {
    showError('visitorName', 'Please enter your name');
    isValid = false;
  } else if (visitorName.value.trim().length < 2) {
    showError('visitorName', 'Name must be at least 2 characters');
    isValid = false;
  }

  // Email
  const email = document.getElementById('email');
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email.value.trim()) {
    showError('email', 'Please enter your email');
    isValid = false;
  } else if (!emailRegex.test(email.value.trim())) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }

  // Phone
  const phone = document.getElementById('phone');
  if (!phone.value.trim()) {
    showError('phone', 'Please enter your phone number');
    isValid = false;
  }

  // Visit Date
  const visitDate = document.getElementById('visitDate');
  if (!visitDate.value) {
    showError('visitDate', 'Please select a visit date');
    isValid = false;
  } else {
    const selectedDate = new Date(visitDate.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      showError('visitDate', 'Visit date must be in the future');
      isValid = false;
    }
  }

  // Number of Visitors
  const numberOfVisitors = document.getElementById('numberOfVisitors');
  if (!numberOfVisitors.value) {
    showError('numberOfVisitors', 'Please select number of visitors');
    isValid = false;
  }

  // Tour Type
  const tourType = document.querySelector('input[name="tourType"]:checked');
  if (!tourType) {
    showError('tourType', 'Please select a tour type');
    isValid = false;
  }

  return isValid;
}

function showError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}Error`);
  const inputElement = document.getElementById(fieldId);
  
  if (errorElement) {
    errorElement.textContent = message;
  }
  
  if (inputElement) {
    inputElement.classList.add('error');
  }
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
  });
  
  document.querySelectorAll('.error').forEach(el => {
    el.classList.remove('error');
  });
}

// ===================================
// Load More Gallery Items (Demo)
// ===================================
const loadMoreBtn = document.getElementById('loadMoreBtn');

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    // In a real app, this would fetch more items from the API
    loadMoreBtn.textContent = 'Loading...';
    
    setTimeout(() => {
      loadMoreBtn.textContent = 'No More Items';
      loadMoreBtn.disabled = true;
    }, 1000);
  });
}

// ===================================
// Newsletter Form
// ===================================
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const submitBtn = newsletterForm.querySelector('button');
    
    if (emailInput.value) {
      submitBtn.textContent = 'Subscribed!';
      submitBtn.disabled = true;
      emailInput.disabled = true;
      
      setTimeout(() => {
        emailInput.value = '';
        emailInput.disabled = false;
        submitBtn.textContent = 'Subscribe';
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===================================
// Animation on Scroll (Simple)
// ===================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.exhibition-card, .gallery-item, .info-card, .stat-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===================================
// Console Welcome Message
// ===================================
console.log('%c🏛️ Artisan Museum', 'font-size: 24px; font-weight: bold; color: #c9a227;');
console.log('%cWelcome to Artisan Museum website!', 'font-size: 14px; color: #666;');
