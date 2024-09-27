import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../config/axiosInstance';
import { Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    images: { id: number; url: string; primary: boolean }[];
    rating: number;
    views: number;
    colors: { id: number; name: string; hexCode: string }[];
    sizes: { id: number; name: string }[];
}

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState('');
    const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 11, minutes: 23, seconds: 2 });
    const navigate = useNavigate();
    const getColorHexCode = useMemo(() => {
        return (colorName: string): string => {
            switch (colorName.toLowerCase()) {
                case 'green':
                    return '#23C69A';
                case 'purple':
                    return '#AE83F7';
                case 'red':
                    return '#E25663';
                case 'black':
                    return '#121212';
                default:
                    return colorName;
            }
        };
    }, []);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(`/products/${id}`);
                console.log(response.data);
                setProduct(response.data.result);
                setMainImage(response.data.result.images[0].url);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime.seconds > 0) {
                    return { ...prevTime, seconds: prevTime.seconds - 1 };
                } else if (prevTime.minutes > 0) {
                    return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
                } else if (prevTime.hours > 0) {
                    return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
                } else if (prevTime.days > 0) {
                    return { ...prevTime, days: prevTime.days - 1, hours: 23, minutes: 59, seconds: 59 };
                } else {
                    clearInterval(timer);
                    return prevTime;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/')}
                className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-300"
            >
                ← Back to Products
            </button>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
                    <div className="aspect-w-3 aspect-h-4 mb-4">
                        <img src={mainImage} alt={product.name} className="w-full h-[800px] object-cover rounded-lg" />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {product.images.map((image, index) => (
                            <img
                                key={image.id}
                                src={image.url}
                                alt={`${product.name} ${index + 1}`}
                                className={`w-full h-48 object-cover rounded cursor-pointer ${mainImage === image.url ? 'ring-2 ring-blue-500' : ''}`}
                                onClick={() => setMainImage(image.url)}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-1/2 px-4">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                            />
                        ))}
                        <span className="ml-2 text-gray-600">{product.views} Reviews</span>
                    </div>
                    <p className="text-2xl font-bold mb-4">${product.price} <span className="text-gray-500 line-through text-lg">${product.originalPrice}</span></p>
                    <p className="text-gray-600 mb-4">32 people are looking at this product</p>
                    <div className="mb-4">
                        <p className="font-bold mb-2">Hurry up, offer expired in:</p>
                        <div className="flex space-x-4">
                            <div className="text-center">
                                <span className="text-2xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</span>
                                <p className="text-sm">Days</p>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
                                <p className="text-sm">Hours</p>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                                <p className="text-sm">Minutes</p>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                                <p className="text-sm">Seconds</p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="font-bold mb-2">Color:</p>
                        <div className="flex space-x-2">
                            {product.colors.map(color => (
                                <button
                                    key={color.id}
                                    className={`w-8 h-8 rounded-full ${selectedColor === color.name ? 'ring-2 ring-black' : ''}`}
                                    style={{ backgroundColor: getColorHexCode(color.name) }}
                                    onClick={() => setSelectedColor(color.name)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="font-bold mb-2">Size:</p>
                        <div className="flex space-x-2">
                            {product.sizes.map(size => (
                                <button
                                    key={size.id}
                                    className={`px-3 py-1 border rounded ${selectedSize === size.name ? 'bg-black text-white' : ''}`}
                                    onClick={() => setSelectedSize(size.name)}
                                >
                                    {size.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center mb-4">
                        <button
                            className="px-3 py-1 border rounded-l"
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            className="w-16 text-center border-t border-b"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button
                            className="px-3 py-1 border rounded-r"
                            onClick={() => setQuantity(prev => prev + 1)}
                        >
                            +
                        </button>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded mb-2">Add to Cart</button>
                    <button className="w-full bg-black text-white py-2 rounded mb-4">Buy Now</button>
                    <div className="flex justify-between">
                        <button className="text-gray-600">❤ Wishlist</button>
                        <button className="text-gray-600">🔔 Ask question</button>
                        <button className="text-gray-600">↗ Share</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;