import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';

interface Image {
  id: number;
  url: string;
  primary: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: Image[];
  rating: number;
}

const ProductListing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  //call api to get products
  useEffect(() => {
    axios.get('http://localhost:8888/api/v1/products?page=0&size=100')
      .then(response => {
        console.log(response.data);
        setProducts(response.data.result.content);
        
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 pr-4">
          <h2 className="text-lg font-semibold mb-4">Filter</h2>
          <div className="mb-4">
            <h3 className="font-medium mb-2">CATEGORIES</h3>
            <ul>
              <li>Home & Decor</li>
              <li>Clothing</li>
              <li>Accessories</li>
              <li>Outdoor</li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">COLOR</h3>
            <div className="flex space-x-2">
              <div className="w-6 h-6 rounded-full bg-green-500"></div>
              <div className="w-6 h-6 rounded-full bg-purple-500"></div>
              <div className="w-6 h-6 rounded-full bg-red-500"></div>
              <div className="w-6 h-6 rounded-full bg-black"></div>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">SIZE</h3>
            <div className="flex space-x-2">
              <button className="px-2 py-1 border rounded">S</button>
              <button className="px-2 py-1 border rounded">M</button>
              <button className="px-2 py-1 border rounded">L</button>
              <button className="px-2 py-1 border rounded">XL</button>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">PRICE</h3>
            <input type="range" min="0" max="1000" className="w-full" />
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">STYLE</h3>
            <ul>
              <li>Modern</li>
              <li>Streetwear</li>
              <li>Classic</li>
              <li>Patchwork</li>
              <li>Bohemian</li>
              <li>Vintage</li>
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <p>{products.length} products</p>
            <select className="border rounded px-2 py-1">
              <option>Sort by</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden">
                <img src={product.images[0].url} alt={product.name} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < product.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-2 bg-gray-200 text-gray-800 rounded">
            Load more
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;