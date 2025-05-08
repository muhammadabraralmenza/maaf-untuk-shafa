// Animasi untuk efek ketik pada teks
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Animasi floating untuk elemen
function addFloatingAnimation(element, duration = 3) {
  element.style.animation = `float ${duration}s ease-in-out infinite`;
}

// Efek hover pada foto
function addPhotoHoverEffect() {
  const photo = document.querySelector('.foto-shafa');
  photo.addEventListener('mouseover', () => {
    photo.style.transform = 'scale(1.1) rotate(5deg)';
    photo.style.transition = 'all 0.3s ease';
  });
  
  photo.addEventListener('mouseout', () => {
    photo.style.transform = 'scale(1) rotate(0deg)';
  });
}

// Animasi teardrop yang lebih realistis
function createTearDrops() {
  const cryEmoji = document.querySelector('.cry-emoji');
  const container = document.querySelector('.container');
  
  setInterval(() => {
    const tear = document.createElement('div');
    tear.className = 'tear';
    tear.style.left = `${Math.random() * 100}%`;
    tear.style.animationDuration = `${1 + Math.random() * 2}s`;
    container.appendChild(tear);
    
    setTimeout(() => tear.remove(), 3000);
  }, 2000);
}

// Fungsi untuk memaksa autoplay musik
function forceAutoplay() {
  const music = document.getElementById('backgroundMusic');
  
  // Set volume ke level yang lebih rendah (5%)
  music.volume = 0.05;
  
  // Coba putar musik dengan berbagai metode
  function playMusic() {
    const playPromise = music.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Autoplay berhasil
        console.log('Autoplay started successfully');
      }).catch(error => {
        console.log('Autoplay failed:', error);
      });
    }
  }

  // Cek apakah datang dari landing page
  if (localStorage.getItem('letterOpened') === 'true') {
    // Tunggu sebentar untuk memastikan halaman sudah dimuat
    setTimeout(playMusic, 1000);
  }

  // Coba putar musik saat halaman mendapatkan fokus
  window.addEventListener('focus', playMusic);
  
  // Coba putar musik saat halaman terlihat
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      playMusic();
    }
  });
}

// Error handling wrapper
function safeExecute(fn) {
  return function(...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      console.error('Error executing function:', error);
    }
  };
}

// Optimize performance with requestAnimationFrame
function createFloatingHearts() {
  const container = document.querySelector('.floating-hearts');
  if (!container) return; // Guard clause
  
  const hearts = ['❤️', '💔', '💖', '💝', '💕'];
  let lastTime = 0;
  const interval = 300; // ms between hearts
  let animationFrameId;
  
  function animate(currentTime) {
    if (!lastTime) lastTime = currentTime;
    
    if (currentTime - lastTime >= interval) {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
      container.appendChild(heart);
      
      // Remove heart after animation
      setTimeout(() => {
        if (heart && heart.parentNode === container) {
          heart.remove();
        }
      }, 5000);
      
      lastTime = currentTime;
    }
    animationFrameId = requestAnimationFrame(animate);
  }
  
  animationFrameId = requestAnimationFrame(animate);
  
  // Cleanup function
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}

// Optimize touch events
function addTouchEffects() {
  const elements = document.querySelectorAll('.foto-shafa, .broken-heart, .cry-emoji');
  
  elements.forEach(element => {
    if (!element) return;
    
    const touchStart = (e) => {
      e.preventDefault();
      element.style.transform = 'scale(0.95)';
    };
    
    const touchEnd = () => {
      element.style.transform = 'scale(1)';
    };
    
    element.addEventListener('touchstart', touchStart, { passive: false });
    element.addEventListener('touchend', touchEnd);
    element.addEventListener('touchcancel', touchEnd);
    
    // Cleanup function
    return () => {
      element.removeEventListener('touchstart', touchStart);
      element.removeEventListener('touchend', touchEnd);
      element.removeEventListener('touchcancel', touchEnd);
    };
  });
}

// Optimize audio loading
function optimizeAudio() {
  const music = document.getElementById('backgroundMusic');
  if (!music) return { initAudio: () => {} };
  
  let audioContext;
  let isInitialized = false;
  
  // Preload audio
  music.load();
  
  // Set volume
  music.volume = 0.05;
  
  function initAudio() {
    if (isInitialized) return;
    
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      isInitialized = true;
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
  }
  
  // Resume audio context on user interaction
  const resumeAudio = () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(console.error);
    }
  };
  
  document.addEventListener('touchstart', resumeAudio, { once: true });
  
  return { initAudio };
}

// Optimize animations for mobile
function optimizeAnimations() {
  // Check if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => {
      if (heart) {
        heart.style.animationDuration = '6s';
      }
    });
  }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', safeExecute(() => {
  // Initialize audio
  const { initAudio } = optimizeAudio();
  
  // Start animations
  const cleanupHearts = createFloatingHearts();
  const cleanupTouch = addTouchEffects();
  optimizeAnimations();
  
  // Initialize audio context on first interaction
  document.addEventListener('touchstart', initAudio, { once: true });
  
  // Force autoplay
  forceAutoplay();
  
  // Cleanup on page unload
  window.addEventListener('unload', () => {
    if (cleanupHearts) cleanupHearts();
    if (cleanupTouch) cleanupTouch();
  });
  
  // Animasi ketik untuk pesan utama
  const mainText = document.querySelector('.main-text');
  const subText = document.querySelector('.sub-text');
  
  typeWriter(mainText, mainText.textContent, 70);
  setTimeout(() => {
    typeWriter(subText, subText.textContent, 50);
  }, 2000);
  
  // Tambahkan animasi floating
  addFloatingAnimation(document.querySelector('.broken-heart'), 4);
  addFloatingAnimation(document.querySelector('.cry-emoji'), 3);
  
  // Tambahkan efek hover pada foto
  addPhotoHoverEffect();
  
  // Tambahkan efek teardrop
  createTearDrops();
  
  // Add hover effects
  const elements = document.querySelectorAll('.foto-shafa, .broken-heart, .cry-emoji');
  elements.forEach(element => {
    element.addEventListener('mouseover', () => {
      element.style.transform = 'scale(1.1)';
    });
    element.addEventListener('mouseout', () => {
      element.style.transform = 'scale(1)';
    });
  });
})); 