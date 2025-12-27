/**
 * Static Export Entry Point
 * 
 * This is a read-only, deterministic publication mode.
 * Renders ONLY the course view with mockCourse.
 * No steps, no navigation, no AI, no state machine.
 * 
 * Ready for static deployment (e.g., Vercel).
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { CourseView } from './components/CourseView';
import { mockCourse } from './mockCourse';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Render only the course view - read-only publication
root.render(
  <React.StrictMode>
    <div className="min-h-screen bg-slate-50">
      <CourseView 
        course={mockCourse} 
        onBack={() => {
          // In static mode, back does nothing
          // This is intentional - it's a read-only publication
        }} 
      />
    </div>
  </React.StrictMode>
);

