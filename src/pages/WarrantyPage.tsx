import React from 'react';
import { LuxoraPage } from '../components/common/LuxoraPage';

export const WarrantyPage: React.FC = () => (
    <LuxoraPage title="Warranty" subtitle="Quality Guaranteed">
        <div className="space-y-6 text-lg text-charcoal-700 dark:text-charcoal-300">
            <p>All Luxora watches come with a 2-year international warranty.</p>
            <p>Our commitment to quality ensures your timepiece is protected against manufacturing defects.</p>
        </div>
    </LuxoraPage>
);
