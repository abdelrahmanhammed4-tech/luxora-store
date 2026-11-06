import React from 'react';
import { LuxoraPage } from '../components/common/LuxoraPage';

export const FAQPage: React.FC = () => (
    <LuxoraPage title="FAQ" subtitle="Common Questions">
        <div className="space-y-6 text-lg text-charcoal-700 dark:text-charcoal-300">
            <h3 className="font-serif text-xl">Do you ship worldwide?</h3>
            <p>Yes, we ship to most countries internationally.</p>
            <h3 className="font-serif text-xl">Can I track my order?</h3>
            <p>Absolutely, you will receive a tracking link via email once your order ships.</p>
        </div>
    </LuxoraPage>
);
