import React from 'react';
import { LuxoraPage } from '../components/common/LuxoraPage';

export const ReturnPolicyPage: React.FC = () => (
    <LuxoraPage title="Return Policy" subtitle="Hassle-Free Returns">
        <div className="space-y-6 text-lg text-charcoal-700 dark:text-charcoal-300">
            <p>If you are not completely satisfied, we accept returns within 14 days of purchase.</p>
            <p>Items must be in original condition and packaging.</p>
        </div>
    </LuxoraPage>
);
