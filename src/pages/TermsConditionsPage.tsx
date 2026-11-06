import React from 'react';
import { LuxoraPage } from '../components/common/LuxoraPage';

export const TermsConditionsPage: React.FC = () => (
    <LuxoraPage title="Terms & Conditions" subtitle="Our Agreement">
        <div className="space-y-6 text-lg text-charcoal-700 dark:text-charcoal-300">
            <p>By using Luxora, you agree to these terms. They govern your use of our website and services.</p>
            <p>We reserve the right to update these terms at any time.</p>
        </div>
    </LuxoraPage>
);
