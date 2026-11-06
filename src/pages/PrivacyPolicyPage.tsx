import React from 'react';
import { LuxoraPage } from '../components/common/LuxoraPage';

export const PrivacyPolicyPage: React.FC = () => (
    <LuxoraPage title="Privacy Policy" subtitle="Protecting Your Data">
        <div className="space-y-6 text-lg text-charcoal-700 dark:text-charcoal-300">
            <p>At Luxora, we value your privacy above all else. We collect only what is necessary to enhance your shopping experience.</p>
            <p>Your data is securely stored and never shared without your explicit consent.</p>
        </div>
    </LuxoraPage>
);
