import React from 'react';
import { EMAIL } from '../config.js';

export default function Footer() {
  return (
    <footer className="footerline">
      <span>RG. · RUBÉN GUTIÉRREZ</span>
      <a href={`mailto:${EMAIL}`}>{EMAIL.toUpperCase()}</a>
      <span>© {new Date().getFullYear()} · DESARROLLO WEB FREELANCE</span>
    </footer>
  );
}
