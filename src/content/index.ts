// Content script for potential future enhancements
// Currently not used but can be extended for features like:
// - Reading progress indicators
// - Auto-save on scroll
// - Page content analysis

console.log('Learning Tracker content script loaded')

// Example: Listen for scroll events to track reading progress
document.addEventListener('scroll', () => {
  // Future enhancement: Track reading progress
  // const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
  // chrome.runtime.sendMessage({ type: 'UPDATE_READING_PROGRESS', progress: scrollPercentage })
})
