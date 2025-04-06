'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { fetchProducts } from './features/productSlice';
import { Product } from './types';
import Image from 'next/image';
import ParallaxBackground from './components/ParallaxBackground';
 
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
      loadProducts(1, 8);
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
      loadProducts(nextPage, 4); // Load 4 more items
    }
  }, [page, status, pagination, loadProducts]);

  // Scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
   
    <div className="container mx-auto p-4 shadow-lg">
      <ParallaxBackground />
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
        <div className='bg-pink-700 rounded-lg  border p-2  text-white '>
          <strong className="text-2xl font-bold mb-4  uppercase">Tiện ích gia đình - Tiện Ích Không Ngờ ({pagination?.count || 0})</strong>
        </div>
    
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 shadow-lg">
          {
          items.map((product: Product, index: number) => (
            <li key={ index } className=" p-4 rounded-lg ">
              <div className='p-2 bg-blue-700 text-white mb-2 rounded-md shadow-xl/30'>
                <strong className="text-xl font-semibold mb-2 uppercase">{product.title}</strong>
              </div>
              {/* <div 
                className="text-gray-600 mb-4"
                dangerouslySetInnerHTML={{ __html: product.description }}
              /> */}
              <div className="space-y-2 space-x-2">
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
                  className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white uppercase transition-all duration-300 transform bg-gradient-to-r from-amber-500 to-red-500 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl hover:shadow-amber-100 hover:bg-gradient-to-br group"
                >
                  {/* Animated border */}
                  <span className="absolute inset-0 rounded-xl -z-10 bg-gradient-to-r from-amber-500 to-red-500 blur-sm group-hover:blur-md group-hover:opacity-75 transition-all duration-300"></span>
                  
                  {/* Button content */}
                  <span className="relative tracking-wider">
                    MUA NGAY - Limited Offer
                  </span>
                  
                  {/* Animated arrow icon */}
                  <svg
                    className="relative w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                  </svg>
                </a>
                )} 

              {product.voucherLink && (
                   <a
                   href={product.voucherLink}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white uppercase transition-all duration-300 transform bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl hover:shadow-amber-100 hover:bg-gradient-to-br group"
                 >
                   {/* Animated border */}
                   <span className="absolute inset-0 rounded-xl -z-10 bg-gradient-to-r from-green-500 to-blue-500 blur-sm group-hover:blur-md group-hover:opacity-75 transition-all duration-300"></span>
                   
                   {/* Button content */}
                   <span className="relative tracking-wider">
                     Lấy Voucher - Get Free Voucher
                   </span>
                   
                   {/* Animated arrow icon */}
                   <svg
                     className="relative w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth="2"
                       d="M17 8l4 4m0 0l-4 4m4-4H3"
                     ></path>
                   </svg>
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

      <div className="relative h-[600px] mb-8 mt-8">
        <Image
          src="/images/footer.jpg"
          alt="Tien ich khong ngo"
          fill
          className="object-cover"
          quality={75}
          priority
        /> 
       </div>
    </div>
  );
}