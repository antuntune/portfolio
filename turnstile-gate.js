// Cloudflare Turnstile Gate - Protects the entire site

const TURNSTILE_STORAGE_KEY = 'turnstile_verified';
const TURNSTILE_TOKEN_KEY = 'turnstile_token';

// Check if user is already verified on page load
document.addEventListener('DOMContentLoaded', function () {
    const isVerified = sessionStorage.getItem(TURNSTILE_STORAGE_KEY);

    if (isVerified === 'true') {
        showMainContent();
    }
    // Otherwise, the challenge overlay remains visible
});

// Called when Turnstile verification is successful
function onTurnstileSuccess(token) {
    // Store verification state
    sessionStorage.setItem(TURNSTILE_STORAGE_KEY, 'true');
    sessionStorage.setItem(TURNSTILE_TOKEN_KEY, token);

    // Show the main content
    showMainContent();

    console.log('Turnstile verification successful');
}

// Called when Turnstile encounters an error
function onTurnstileError(error) {
    const errorDiv = document.getElementById('challengeError');
    errorDiv.textContent = 'Verification failed. Please try again.';
    console.error('Turnstile error:', error);
}

// Show main content and hide challenge overlay
function showMainContent() {
    const overlay = document.getElementById('challengeOverlay');
    const mainContent = document.getElementById('mainContent');

    if (overlay) {
        overlay.classList.add('hidden');
    }

    if (mainContent) {
        mainContent.classList.remove('hidden');
    }

    // Trigger a resize event to ensure canvas is properly sized
    window.dispatchEvent(new Event('resize'));
}

// Reset verification (useful for testing)
function resetVerification() {
    sessionStorage.removeItem(TURNSTILE_STORAGE_KEY);
    sessionStorage.removeItem(TURNSTILE_TOKEN_KEY);
    location.reload();
}

// Optional: Add keyboard shortcut to reset (Ctrl+Shift+R for testing)
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        resetVerification();
    }
});