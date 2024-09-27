import { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosInstance';

interface Category {
  id: number;
  name: string;
}

interface Color {
  id: number;
  name: string;
  hexCode: string | null;
}

interface Size {
  id: number;
  name: string;
}

interface Style {
  id: number;
  name: string;
}

const FilterSidebar = ({ onFilterChange }: { onFilterChange: (filterType: string, filterValue: string | number | null) => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesResponse, colorsResponse, sizesResponse, stylesResponse] = await Promise.all([
          axiosInstance.get('/categories?page=0&size=10'),
          axiosInstance.get('/colors?page=0&size=10'),
          axiosInstance.get('/sizes?page=0&size=10'),
          axiosInstance.get('/styles?page=0&size=10')
        ]);
        setCategories(categoriesResponse.data.result.content);
        setColors(colorsResponse.data.result.content);
        setSizes(sizesResponse.data.result.content);
        setStyles(stylesResponse.data.result.content);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
      onFilterChange('category', null);
    } else {
      setSelectedCategory(categoryName);
      onFilterChange('category', categoryName);
    }
  };

  const handleColorChange = (colorName: string) => {
    if (selectedColor === colorName) {
      setSelectedColor(null);
      onFilterChange('color', null);
    } else {
      setSelectedColor(colorName);
      onFilterChange('color', colorName);
    }
  };

  const handleSizeChange = (sizeName: string) => {
    if (selectedSize === sizeName) {
      setSelectedSize(null);
      onFilterChange('size', null);
    } else {
      setSelectedSize(sizeName);
      onFilterChange('size', sizeName);
    }
  };

  const handleStyleChange = (styleName: string) => {
    if (selectedStyle === styleName) {
      setSelectedStyle(null);
      onFilterChange('style', null);
    } else {
      setSelectedStyle(styleName);
      onFilterChange('style', styleName);
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseInt(event.target.value);
    setPriceRange([0, newPrice]);
    onFilterChange('maxPrice', newPrice);
  };

  return (
    <div className="w-full md:w-1/4 pr-4">
      <h2 className="text-lg font-semibold mb-4">Filter</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="font-medium mb-2">CATEGORIES</h3>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryChange(category.name)}
                    className={`${selectedCategory === category.name ? 'font-bold underline' : ''}`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">COLOR</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className={`w-6 h-6 rounded-full cursor-pointer ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                  style={{ backgroundColor: color.hexCode || color.name }}
                  title={color.name}
                  onClick={() => handleColorChange(color.name)}
                ></div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">SIZE</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  className={`px-2 py-1 border rounded ${selectedSize === size.name ? 'bg-gray-200 font-bold' : ''}`}
                  onClick={() => handleSizeChange(size.name)}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">PRICE</h3>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full"
            />
            <div>Max Price: ${priceRange[1]}</div>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">STYLE</h3>
            <ul>
              {styles.map((style) => (
                <li key={style.id}>
                  <button
                    onClick={() => handleStyleChange(style.name)}
                    className={`${selectedStyle === style.name ? 'font-bold underline' : ''}`}
                  >
                    {style.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterSidebar;