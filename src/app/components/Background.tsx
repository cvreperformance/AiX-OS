import React from 'react';

interface BackgroundProps {
  className?: string;
}

/**
 * Background component that renders the layered dark gradient and grid overlay.
 * Styles are defined in globals.css using CSS variables.
 */
export default function Background({ className = '' }: BackgroundProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}> {/* Full-screen layer */}
      {/* Dark gradient base – uses the CSS variable --bg-gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--bg-gradient)' }}
      />
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern" />
    </div>
  );
}
