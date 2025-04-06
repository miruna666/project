'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


const navItems = [
    { label: '🐝 Identificare', href: '/joc1' },
    { label: '🐝 Ordonare', href: '/joc2' },
    { label: '🐝 Ruleta', href: '/joc3' },
  ];

export default function Navbar() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // evită saltul vizual

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '12px 28px',
      borderRadius: '999px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
      display: 'flex',
      gap: '32px',
      alignItems: 'center',
      border: '2px solid #facc15',
      backdropFilter: 'blur(12px)',
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} style={{ position: 'relative', textDecoration: 'none' }}>
            <span style={{
              fontWeight: 'bold',
              color: isActive ? '#d97706' : '#444',
              fontSize: '16px',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 6,
                    height: 6,
                    borderRadius: '999px',
                    background: '#facc15',
                  }}
                />
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
