import React from 'react';
import { LuxoraPage } from '../components/common/LuxoraPage';

export const AboutUsPage: React.FC = () => (
    <LuxoraPage title="About Us" subtitle="The Legacy of Luxora">
        <div className="space-y-6 text-lg text-charcoal-700 dark:text-charcoal-300">
            <p>Welcome to Luxora, a sanctuary of timeless elegance and unparalleled craftsmanship.</p>
            <p>We specialize in the curation of luxury watches and exquisite perfumes, designed for those who appreciate the finer things in life.</p>
        </div>
    </LuxoraPage>
);
