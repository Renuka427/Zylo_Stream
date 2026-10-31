import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-champagne text-espresso flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-ivory border border-stone-warm shadow-luxury flex items-center justify-center text-cherry mb-6">
        <Compass className="w-8 h-8 animate-pulse" />
      </div>
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-champagne-gold">
        Error 404
      </span>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-espresso mt-1 mb-3">
        Page Outside the Ledger
      </h1>
      <p className="text-sm text-espresso-muted max-w-md mb-8 leading-relaxed">
        The requested routing endpoint does not exist or has been archived. You can safely return to the executive dashboard.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={ArrowLeft}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
