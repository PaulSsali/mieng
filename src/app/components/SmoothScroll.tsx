'use client';

import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    // Get all anchor links with hash
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    // Function to handle anchor click
    const handleAnchorClick = (e: Event) => {
      e.preventDefault();
      
      // Get the target element
      const link = e.currentTarget as HTMLAnchorElement;
      const targetId = link.getAttribute('href');
      
      if (targetId) {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Smooth scroll to the target
          targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' 
          });
          
          // Update URL hash without jumping
          window.history.pushState(null, '', targetId);
        }
      }
    };
    
    // Add click event listener to each anchor link
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });
    
    // Cleanup event listeners on component unmount
    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);
  
  return null; // This component doesn't render anything
} 