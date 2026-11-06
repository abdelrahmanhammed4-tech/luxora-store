import React from 'react';
import { LuxoraPage } from '../components/common/LuxoraPage';

export const ShippingPolicyPage: React.FC = () => (
    <LuxoraPage title="Shipping Policy" subtitle="Fast and Secure">
        <div className="space-y-6 text-lg text-charcoal-700 dark:text-charcoal-300">
            <p>We provide worldwide shipping with the utmost care for your items.</p>
            <p>Orders are processed within 24-48 hours and shipped via premium courier services.</p>
        </div>
    </LuxoraPage>
);
