import { X } from 'lucide-react';
import './KeyboardShortcutsModal.css';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { category: 'Navigation', items: [
      { key: 'g + d', description: 'Go to Dashboard' },
      { key: 'g + t', description: 'Go to My Tasks' },
      { key: 'g + c', description: 'Go to Calendar' },
      { key: 'g + r', description: 'Go to Reports' },
      { key: 'g + s', description: 'Go to Settings' },
    ]},
    { category: 'Actions', items: [
      { key: 'n', description: 'Create new task' },
      { key: '/', description: 'Focus search' },
      { key: 'Escape', description: 'Close modal/menu' },
    ]},
    { category: 'Task Management', items: [
      { key: 'Enter', description: 'Save task' },
      { key: 'Delete', description: 'Delete selected task' },
      { key: 'Space', description: 'Toggle task complete' },
    ]},
    { category: 'Help', items: [
      { key: '?', description: 'Show this help' },
    ]},
  ];

  return (
    <div className="keyboard-modal-overlay" onClick={onClose}>
      <div className="keyboard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="keyboard-modal-header">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button className="keyboard-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="keyboard-modal-content">
          {shortcuts.map((section, idx) => (
            <div key={idx} className="keyboard-section">
              <h3>{section.category}</h3>
              <div className="keyboard-list">
                {section.items.map((item, i) => (
                  <div key={i} className="keyboard-item">
                    <div className="keyboard-keys">
                      {item.key.split(' + ').map((key, k) => (
                        <kbd key={k}>{key}</kbd>
                      ))}
                    </div>
                    <span className="keyboard-description">{item.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="keyboard-modal-footer">
          <p>Press <kbd>?</kbd> to open this help anytime</p>
        </div>
      </div>
    </div>
  );
}
