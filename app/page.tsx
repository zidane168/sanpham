'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { fetchProducts } from './features/productSlice';
import { Product } from './types';

const VideoEmbed = ({ url }: { url: string }) => {
  const getVideoId = (link: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = link.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(url);

  if (!videoId) return <div>Invalid video URL</div>;

  return (
    <div className="aspect-video w-full">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="rounded-lg"
        allowFullScreen
      />
    </div>
  );
};


export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, pagination } = useSelector((state: RootState) => state.products);
  const [page, setPage] = useState(1);

  // Load more handler
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    dispatch(fetchProducts(nextPage));
  };

  // Initial load
  useEffect(() => {
    dispatch(fetchProducts(page));
  }, [dispatch, page]);

  // Fix the product mapping
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products ({pagination?.count || 0})</h1>
      
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <div>Error: {error}</div>}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((product: Product) => (
          <li key={product.id} className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            {/* <div 
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{ __html: product.description }}
            /> */}
            <div className="space-y-2">
              {product.videoLink && (

                <VideoEmbed url={ product.videoLink } />
                // <a
                //   href={product.videoLink}
                //   target="_blank"
                //   rel="noopener noreferrer"
                //   className="text-blue-600 block"
                // >
                //   Watch Video
                // </a>
              )}
              {product.affiliateLink && (
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 block"
                >
                  Mua Ngay (Buy Now)
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      {(pagination?.totalPage || 0) > page && (
        <button
          onClick={handleLoadMore}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}