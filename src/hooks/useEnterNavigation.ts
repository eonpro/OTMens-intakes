import { useEffect } from 'react';

/**
 * Custom hook to handle Enter key navigation
 * @param onEnter - Callback function to execute when Enter is pressed
 * @param disabled - Optional flag to disable the Enter key handler
 */
export function useEnterNavigation(onEnter: () => void, disabled = false) {
  useEffect(() => {
    if (disabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if Enter key is pressed
      if (event.key === 'Enter') {
        // Prevent default form submission if inside a form
        event.preventDefault();
        
        // Don't trigger if user is typing in a textarea or contenteditable
        const target = event.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();
        
        if (tagName === 'textarea' || target.contentEditable === 'true') {
          return;
        }
        
        // If it's an input field, check if it's a submit button
        if (tagName === 'input') {
          const inputType = (target as HTMLInputElement).type;
          // Allow Enter on submit buttons, but trigger our handler for other inputs
          if (inputType !== 'submit' && inputType !== 'button') {
            onEnter();
          }
        } else {
          // For any other element, trigger the navigation
          onEnter();
        }
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onEnter, disabled]);
}
