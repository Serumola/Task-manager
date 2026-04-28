import { useEffect, useCallback } from 'react';

// Keyboard shortcuts hook for TaskMaster
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if typing in input/textarea
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = event.key.toLowerCase();
      const shortcut = shortcuts[key];

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Common keyboard shortcuts for TaskMaster
export const taskMasterShortcuts = {
  // Navigation
  'g': { action: () => {}, description: 'Go to (use with d, t, c, r, s)' },
  'd': { action: () => {}, description: 'Go to Dashboard' },
  't': { action: () => {}, description: 'Go to My Tasks' },
  'c': { action: () => {}, description: 'Go to Calendar' },
  'r': { action: () => {}, description: 'Go to Reports' },
  's': { action: () => {}, description: 'Go to Settings' },
  
  // Actions
  'n': { action: () => {}, description: 'New task' },
  '/': { action: () => {}, description: 'Focus search' },
  '?': { action: () => {}, description: 'Show keyboard shortcuts' },
  'escape': { action: () => {}, description: 'Close modal/menu' },
};

export default useKeyboardShortcuts;
