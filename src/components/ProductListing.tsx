import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FilterSidebar from './FilterSidebar';
import { Star } from 'lucide-react';

interface Image {
  id: number;
  url: string;
  primary: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  images: Image[];
  rating: number;
  category: { id: number; name: string };
  colors: { id: number; name: string; hexCode: string | null }[];
  sizes: { id: number; name: string }[];
  style: { id: number; name: string };
}

interface FilterOptions {
  category: string | null;
  color: string | null;
  size: string | null;
  minPrice: number;
  maxPrice: number;
  style: string | null;
}

const ProductListing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: null,
    color: null,
    size: null,
    minPrice: 0,
    maxPrice: 100,
    style: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(8);
  const [isShowingAll, setIsShowingAll] = useState(false);
  const [sortOption, setSortOption] = useState<string>('');
  useEffect(() => {
    setIsLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/products?page=0&size=100`)
      .then(response => {
        const productsData = response.data.result.content;
        setProducts(productsData);
        setFilteredProducts(productsData);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      return (
        (filterOptions.category === null || product.category.name === filterOptions.category) &&
        (filterOptions.color === null || product.colors.some(c => c.name === filterOptions.color)) &&
        (filterOptions.size === null || product.sizes.some(s => s.name === filterOptions.size)) &&
        product.price >= filterOptions.minPrice &&
        product.price <= filterOptions.maxPrice &&
        (filterOptions.style === null || product.style.name === filterOptions.style)
      );
    });

    if (sortOption === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, filterOptions, sortOption]);

  const handleFilterChange = useCallback((name: string, value: string | number | null) => {
    setFilterOptions(prev => ({ ...prev, [name]: value }));
    setDisplayCount(8);
    setIsShowingAll(false);
  }, []);

  const handleSort = useCallback((option: string) => {
    setSortOption(option);
  }, []);

  const handleLoadMoreLess = useCallback(() => {
    if (isShowingAll) {
      setDisplayCount(8);
      setIsShowingAll(false);
    } else {
      setDisplayCount(filteredAndSortedProducts.length);
      setIsShowingAll(true);
    }
  }, [isShowingAll, filteredAndSortedProducts.length]);

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col md:flex-row">
        <FilterSidebar onFilterChange={handleFilterChange} />

        <div className="w-full md:w-3/4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <p>{filteredProducts.length} products</p>
                <select
                  className="border rounded px-2 py-1"
                  onChange={(e) => handleSort(e.target.value)}
                  value={sortOption}
                >
                  <option value="">Sort by</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAndSortedProducts.slice(0, displayCount).map((product) => (
                  <div key={product.id} className="border rounded-lg overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <img src={product.images[0].url} alt={product.name} className="w-full h-64 object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 mt-1">
                          <span className="font-bold">${product.price.toFixed(2)}</span>
                          {product.originalPrice > product.price && (
                            <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                          )}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                {!isShowingAll && displayCount < filteredProducts.length && (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleLoadMoreLess}
                  >
                    Load more
                  </button>
                )}
                {isShowingAll && (
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={handleLoadMoreLess}
                  >
                    Load less
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;