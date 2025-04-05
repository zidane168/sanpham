'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { fetchProducts } from '@/app/features/productsSlice';

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, pagination } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading products...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* ... rest of the JSX remains the same ... */}
    </div>
  );
}