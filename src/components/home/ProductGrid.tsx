import React from 'react';
import { Product } from '../../types';
import { ProductCard } from '../products/ProductCard';

interface ProductGridProps {
  title: string;
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ title, products }) => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h3 className="text-3xl font-serif text-charcoal-900 dark:text-white mb-12 tracking-wide text-center">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
