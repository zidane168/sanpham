'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { fetchProducts } from './features/productSlice';
import { Product } from './types';
import Image from 'next/image';


// YouTube embed component
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
  
  const initialLoadDone = useRef(false);

  // Modified fetch function with limit
  const loadProducts = useCallback( (pageNumber: number, limit: number = 3) => {
       
    dispatch(fetchProducts({ page: pageNumber, limit })); 
      
    },
    [dispatch]
  );

  // Initial load for first 3 items
  useEffect(() => {
    if (!initialLoadDone.current) {
      loadProducts(1, 9);
      initialLoadDone.current = true;
    }
  }, [loadProducts]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      status !== 'loading' &&
      pagination?.totalPage &&
      page < pagination.totalPage
    ) {
      // console.log( 'load tiep 3 san pham nè ')
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage, 3); // Load 3 more items
    }
  }, [page, status, pagination, loadProducts]);

  // Scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="container mx-auto p-4">
      
      <div className="relative h-[600px] mb-8">
          <Image
            src="/images/background.webp"
            alt="Background"
            fill
            className="object-cover"
            quality={75}
            priority
          /> 
      </div>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Products ({pagination?.count || 0})</h1>
    
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {
          items.map((product: Product, index: number) => (
            <li key={ index } className="border p-4 rounded-lg shadow-sm">
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
                    className="text-white bg-red-500 p-2 rounded-md"
                  >
                    Mua Ngay (Buy Now)
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        {status === 'loading' && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"> </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-red-500 text-center my-4">Error: {error}</div>
        )}

        {pagination?.totalPage === page && items.length > 0 && (
          <div className="text-center text-gray-500 mt-8">          
            Đã hiển thị sản phẩm cuối cùng!
          </div>
        )}
      </div>
    </div>
  );
}