import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, authAPI, uploadAPI, categoryAPI } from '../services/api';
import ImageUpload from '../@/components/ui/imageUpload';

interface Solution {
  _id?: string;
  name: {
    en: string;
    vi: string;
  };
  description: {
    en: string;
    vi: string;
  };
  short_description?: {
    en: string;
    vi: string;
  };
  price: number;
  category: string;
  status: 'active' | 'inactive';
  images?: string[];
}

interface Category {
  _id?: string;
  name: {
    en: string;
    vi: string;
  };
  description: {
    en: string;
    vi: string;
  };
  imageUrl?: string;
  status: 'active' | 'inactive';
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState('');
  const [activeLang, setActiveLang] = useState<'en' | 'vi'>('en');
  const [activeTab, setActiveTab] = useState<'solutions' | 'categories'>('solutions');
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: { en: '', vi: '' },
    description: { en: '', vi: '' },
    short_description: { en: '', vi: '' },
    price: 0,
    category: '',
    status: 'active' as 'active' | 'inactive',
    images: [] as string[],
  });

  // Category form state
  const [categoryFormData, setCategoryFormData] = useState({
    name: { en: '', vi: '' },
    description: { en: '', vi: '' },
    imageUrl: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      fetchSolutions();
      fetchCategories();
    }
  }, [navigate]);

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getAll();
      setSolutions(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch solutions');
      console.error('Error fetching solutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch categories');
      console.error('Error fetching categories:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Upload ảnh
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    
    setUploadingImages(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await uploadAPI.uploadImages(formData);
      return response.data.images;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  // Solution handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price.toString()) || 0,
        images: formData.images
      };

      if (editingSolution && editingSolution._id) {
        await productAPI.update(editingSolution._id, submitData);
      } else {
        await productAPI.create(submitData);
      }
      
      resetForm();
      fetchSolutions();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to save solution');
      console.error('Error saving solution:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = async (images: string[], files?: File[]) => {
    try {
      let newImageUrls = [...images];
      
      if (files && files.length > 0) {
        const uploadedUrls = await uploadImages(files);
        newImageUrls = [...images, ...uploadedUrls];
      }
      
      setFormData(prev => ({
        ...prev,
        images: newImageUrls
      }));
    } catch (error: any) {
      setError(error.message || 'Failed to upload images');
    }
  };

  const handleEdit = (solution: Solution) => {
    setFormData({
      name: solution.name || { en: '', vi: '' },
      description: solution.description || { en: '', vi: '' },
      short_description: solution.short_description || { en: '', vi: '' },
      price: solution.price || 0,
      category: solution.category || '',
      status: solution.status || 'active',
      images: solution.images || [],
    });
    setEditingSolution(solution);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this solution?')) {
      try {
        await productAPI.delete(id);
        fetchSolutions();
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete solution');
        console.error('Error deleting solution:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: { en: '', vi: '' },
      description: { en: '', vi: '' },
      short_description: { en: '', vi: '' },
      price: 0,
      category: '',
      status: 'active',
      images: [],
    });
    setEditingSolution(null);
    setShowForm(false);
    setError('');
    setActiveLang('en');
  };

  // Category handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingCategory && editingCategory._id) {
        await categoryAPI.update(editingCategory._id, categoryFormData);
      } else {
        await categoryAPI.create(categoryFormData);
      }
      
      resetCategoryForm();
      fetchCategories();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to save category');
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryEdit = (category: Category) => {
    setCategoryFormData({
      name: category.name || { en: '', vi: '' },
      description: category.description || { en: '', vi: '' },
      imageUrl: category.imageUrl || '',
      status: category.status || 'active',
    });
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleCategoryDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(id);
        fetchCategories();
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete category');
        console.error('Error deleting category:', error);
      }
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: { en: '', vi: '' },
      description: { en: '', vi: '' },
      imageUrl: '',
      status: 'active',
    });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: any,
    lang?: 'en' | 'vi'
  ) => {
    setFormData(prev => {
      if (lang && typeof prev[field] === 'object' && field !== 'images') {
        const currentField = prev[field] as any;
        return {
          ...prev,
          [field]: {
            ...currentField,
            [lang]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleCategoryInputChange = (
    field: keyof typeof categoryFormData,
    value: any,
    lang?: 'en' | 'vi'
  ) => {
    setCategoryFormData(prev => {
      if (lang && typeof prev[field] === 'object' && field !== 'imageUrl') {
        const currentField = prev[field] as any;
        return {
          ...prev,
          [field]: {
            ...currentField,
            [lang]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  if (loading && solutions.length === 0 && categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow fixed top-0 left-0 right-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 text-sm">Manage your content</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('solutions')}
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === 'solutions' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Solutions
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === 'categories' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Categories
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto py-6 px-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Solutions Tab */}
          {activeTab === 'solutions' && (
            <>
              {/* Solution Form */}
              {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {editingSolution ? 'Edit Solution' : 'Create New Solution'}
                  </h2>
                  
                  {/* Language Tabs */}
                  <div className="flex gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => setActiveLang('en')}
                      className={`px-4 py-2 rounded-md ${
                        activeLang === 'en' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLang('vi')}
                      className={`px-4 py-2 rounded-md ${
                        activeLang === 'vi' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Tiếng Việt
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name ({activeLang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name[activeLang]}
                          onChange={(e) => handleInputChange('name', e.target.value, activeLang)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Enter name in ${activeLang === 'en' ? 'English' : 'Vietnamese'}`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description ({activeLang.toUpperCase()})
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.description[activeLang]}
                        onChange={(e) => handleInputChange('description', e.target.value, activeLang)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter description in ${activeLang === 'en' ? 'English' : 'Vietnamese'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description ({activeLang.toUpperCase()})
                      </label>
                      <textarea
                        rows={2}
                        value={formData.short_description[activeLang]}
                        onChange={(e) => handleInputChange('short_description', e.target.value, activeLang)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter short description in ${activeLang === 'en' ? 'English' : 'Vietnamese'}`}
                      />
                    </div>

                    {/* Category and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name?.en || 'Unnamed Category'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Images
                        {uploadingImages && (
                          <span className="ml-2 text-blue-600 text-sm">Uploading images...</span>
                        )}
                      </label>
                      <ImageUpload
                        onImagesChange={handleImagesChange}
                        existingImages={formData.images}
                        multiple={true}
                      />
                      
                      {formData.images.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Selected images:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.images.map((image, index) => (
                              <div key={index} className="relative">
                                <img 
                                  src={image} 
                                  alt={`Preview ${index}`}
                                  className="w-20 h-20 object-cover rounded border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading || uploadingImages}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : (editingSolution ? 'Update Solution' : 'Create Solution')}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Solutions List */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Solutions ({solutions.length})
                    </h3>
                    <button
                      onClick={() => setShowForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                    >
                      Add New Solution
                    </button>
                  </div>
                </div>
                
                {solutions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No solutions found.</p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Create Your First Solution
                    </button>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {solutions.map((solution) => (
                      <li key={solution._id}>
                        <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {solution.name?.en || 'No name'}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  solution.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {solution.status}
                                </span>
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              {solution.description?.en || 'No description'}
                            </p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <span className="mr-4">
                                <strong>Category:</strong> {categories.find(c => c._id === solution.category)?.name?.en || 'Unknown'}
                              </span>
                              <span>
                                <strong>Price:</strong> ${solution.price}
                              </span>
                              <span className="ml-4">
                                <strong>Images:</strong> {solution.images?.length || 0}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex gap-2">
                            <button
                              onClick={() => handleEdit(solution)}
                              className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => solution._id && handleDelete(solution._id)}
                              className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <>
              {/* Category Form */}
              {showCategoryForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </h2>
                  
                  <form onSubmit={handleCategorySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name (English)
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryFormData.name.en}
                          onChange={(e) => handleCategoryInputChange('name', e.target.value, 'en')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter category name in English"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name (Vietnamese)
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryFormData.name.vi}
                          onChange={(e) => handleCategoryInputChange('name', e.target.value, 'vi')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter category name in Vietnamese"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description (English)
                        </label>
                        <textarea
                          rows={3}
                          value={categoryFormData.description.en}
                          onChange={(e) => handleCategoryInputChange('description', e.target.value, 'en')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter description in English"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description (Vietnamese)
                        </label>
                        <textarea
                          rows={3}
                          value={categoryFormData.description.vi}
                          onChange={(e) => handleCategoryInputChange('description', e.target.value, 'vi')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter description in Vietnamese"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={categoryFormData.imageUrl}
                        onChange={(e) => handleCategoryInputChange('imageUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter image URL"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={categoryFormData.status}
                        onChange={(e) => handleCategoryInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                      </button>
                      <button
                        type="button"
                        onClick={resetCategoryForm}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Categories List */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Categories ({categories.length})
                    </h3>
                    <button
                      onClick={() => setShowCategoryForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                    >
                      Add New Category
                    </button>
                  </div>
                </div>
                
                {categories.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No categories found.</p>
                    <button
                      onClick={() => setShowCategoryForm(true)}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Create Your First Category
                    </button>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {categories.map((category) => (
                      <li key={category._id}>
                        <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {category.name?.en || 'No name'}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  category.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {category.status}
                                </span>
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              EN: {category.name?.en} | VI: {category.name?.vi}
                            </p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <span>
                                <strong>Description:</strong> {category.description?.en || 'No description'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex gap-2">
                            <button
                              onClick={() => handleCategoryEdit(category)}
                              className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => category._id && handleCategoryDelete(category._id)}
                              className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;