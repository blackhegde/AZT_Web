import { Icon } from "@iconify/react";
import { Button } from "../@/components/ui/button";
import { Badge } from "../@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../@/components/ui/card";
import { useTranslation } from "src/hooks/useTranslation";
import { useState, useEffect } from "react";
import { productAPI, categoryAPI, contactAPI } from "../services/api";

interface Category {
  _id: string;
  name: {
    en: string;
    vi: string;
  };
  description: {
    en: string;
    vi: string;
  };
  imageUrl: string;
  status: string;
}

interface Product {
  _id: string;
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
  status: string;
  images: string[];
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.filter((cat: Category) => cat.status === 'active'));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data.filter((prod: Product) => prod.status === 'active'));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    
    try {
      await contactAPI.submit(contactForm);
      setContactSuccess(true);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setContactLoading(false);
    }
  };

  const handleContactChange = (field: keyof ContactForm, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => product.category === categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section với Background Overlay */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          /**backgroundImage: /src/bg.jpg.webp */
          style={{ backgroundImage: "url('/bg.jpg.webp')" }}
        />
        <div className="absolute inset-0 bg-black/60" /> {/* Lớp phủ tối */}
        <div className="relative container mx-auto max-w-6xl text-center text-white z-10">
          <div className="mb-12">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              {t('body.shortTitle')}
            </Badge>
            <h1 className="font-heading text-5xl md:text-6xl font-semibold tracking-tight mb-6">
              {t('body.slogan1')}
              <br />
              {t('body.slogan2')}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              {t('body.welcomeMessage')}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-white/90 hover:scale-105 transform transition-all duration-300">
                <Icon icon="solar:rocket-bold" className="size-5" />
                {t('body.contactBtn')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-gray-900">
                <Icon icon="solar:play-bold" className="size-5" />
                {t('body.playBtn')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-semibold tracking-tight mb-4">
              {t('body.categoriesTitle')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('body.categoriesDesc')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card 
                key={category._id}
                className="hover:border-primary transition-colors pt-0 hover:scale-105 hover:shadow-xl transform transition-all duration-300"
              >
                <img
                  alt={category.name.en}
                  src={category.imageUrl}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon icon="mingcute:radar-2-fill" className="size-6 text-primary" />
                    {category.name.en}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line text-muted-foreground mb-4">
                    {category.description.en}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions by Category Section */}
      <section id="solutions" className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-semibold tracking-tight mb-4">
              Our Solutions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive range of technology solutions tailored for your business needs
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg">Loading solutions...</div>
            </div>
          ) : (
            categories.map((category) => {
              const categoryProducts = getProductsByCategory(category._id);
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category._id} className="mb-16">
                  <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                    <Icon icon="mingcute:folder-fill" className="size-6 text-primary" />
                    {category.name.en}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.map((product) => (
                      <Card 
                        key={product._id}
                        className="hover:border-primary transition-colors hover:shadow-lg transform transition-all duration-300"
                      >
                        {product.images && product.images.length > 0 && (
                          <img
                            alt={product.name.en}
                            src={`http://localhost:5001${product.images[0]}`} // THÊM BASE URL
                            className="w-full h-48 object-cover rounded-t-xl"
                            onError={(e) => {
                              // Fallback nếu ảnh không load được
                              e.currentTarget.src = 'https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/generation-assets/placeholder/landscape.png';
                            }}
                          />
                        )}
                        <CardHeader>
                          <CardTitle className="text-lg">{product.name.en}</CardTitle>
                          <CardDescription>
                            ${product.price}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {product.short_description?.en || product.description.en}
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            Learn More
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-semibold tracking-tight mb-4">
              Get In Touch
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ready to transform your business? Contact us today and let's discuss how we can help you achieve your goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon icon="solar:phone-bold" className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon icon="solar:letter-bold" className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">info@techsolve.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon icon="solar:map-point-bold" className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">123 Business Ave, Suite 100<br />San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => handleContactChange('name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => handleContactChange('subject', e.target.value)}
                      placeholder="What's this about?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => handleContactChange('message', e.target.value)}
                    placeholder="Tell us about your project or inquiry..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>

                {contactSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full bg-gradient-to-br from-primary to-primary/90 hover:border-primary transition-colors hover:scale-105 transform transition-all duration-300"
                >
                  {contactLoading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;