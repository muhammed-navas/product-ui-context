
import React from 'react';
import { useProduct } from '../../context/ProductContext';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const Sidebar = ({ selectedCategory, onCategoryChange }: SidebarProps) => {
  const { categories } = useProduct();
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>(['Laptops']);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-4">Categories</h3>
        
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('All categories')}
            className={`w-full text-left px-3 py-2 rounded transition-colors ${
              selectedCategory === 'All categories'
                ? 'bg-blue-100 text-blue-800'
                : 'hover:bg-gray-100'
            }`}
          >
            All categories
          </button>

          {categories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.name)}
                className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center justify-between ${
                  selectedCategory === category.name
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span onClick={() => onCategoryChange(category.name)}>
                  {category.name}
                </span>
                {expandedCategories.includes(category.name) ? (
                  <FaChevronDown className="text-sm" />
                ) : (
                  <FaChevronRight className="text-sm" />
                )}
              </button>
              
              {expandedCategories.includes(category.name) && (
                <div className="ml-4 mt-1 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <button
                      key={subcategory}
                      onClick={() => onCategoryChange(subcategory)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedCategory === subcategory
                          ? 'bg-blue-100 text-blue-800'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {subcategory}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
