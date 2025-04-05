import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';

interface Product {
  id: number;
  categoryId: number;
  videoLink?: string;
  affiliateLink?: string;
  title: string;
  description: string;
}

interface Pagination {
  count: number;
  totalPage: number;
}

interface ProductsResponse {
  _pagination: Pagination;
  data: Product[];
}

interface ProductsState {
  items: Product[];
  pagination: Pagination | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  pagination: null,
  status: 'idle',
  error: null,
};

 

export const fetchProducts = createAsyncThunk<ProductsResponse, { page: number, limit: number }>(
  'products/fetchProducts',
  async ( arg ) => {
    const { page, limit } = arg; 

    const response = await fetch(`http://localhost:3000/products?page=${page}&limit=${limit}`);
    
    console.log ('------------------------ ')
    console.log (response)
    console.log ('------------------------ ')
    if (!response.ok) {
      throw new Error('Failed to fetch products xD');
    }
    return await response.json() as ProductsResponse;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductsResponse>) => {
        state.status = 'succeeded';
        state.items = [ ...state.items,  ...action.payload.data ];

        // replace data when recall the fetchs, (no load more )
        // state.items = action.payload.data; 
        // state.pagination = action.payload._pagination;

        state.pagination = {
          count: state.items.length,
          totalPage: action.payload._pagination.totalPage
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch xx products';
      });
  },
});

export default productsSlice.reducer;