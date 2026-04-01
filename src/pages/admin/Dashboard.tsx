import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, Package, Image as ImageIcon, Trash2, Edit3, Grid, Link as LinkIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import toast from "react-hot-toast";
import type { Product } from "../../types";

const ADMIN_EMAIL = "abubackerraiyan@gmail.com";

export const AdminDashboard = () => {
  const [, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "men",
    tags: "",
    trending: false,
    newArrival: false,
    discount: "",
    images: [] as string[]
  });

  const resetForm = () => {
    setFormData({
      name: "", price: "", description: "", category: "men", 
      tags: "", trending: false, newArrival: false, discount: "",
      images: []
    });
    setEditingId(null);
    setIsAdding(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/admin/login");
      } else if (currentUser.email !== ADMIN_EMAIL) {
        toast.error("You do not have administrative clearance.");
        navigate("/");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    });

    return () => {
      unsubscribe();
      unsubProducts();
    };
  }, [navigate]);


  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const openCloudinaryWidget = () => {
    // @ts-ignore
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsfms55as",
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "arabtimes_products",
        multiple: true,
        clientAllowedFormats: ["webp", "png", "jpg", "jpeg"],
        maxFiles: 5,
        styles: {
          palette: {
              window: "#111111",
              windowBorder: "#FFD70033",
              tabIcon: "#FFD700",
              menuIcons: "#FFFFFF",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#FFD700",
              action: "#FFD700",
              inactiveTabIcon: "#888888",
              error: "#F44235",
              inProgress: "#FFD700",
              complete: "#20B832",
              sourceBg: "#111111"
          },
          fonts: {
              default: null,
              "sans-serif": {
                  url: "https://fonts.googleapis.com/css?family=Inter",
                  active: true
              }
          }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const newUrl = result.info.secure_url;
          setFormData(prev => ({ ...prev, images: [...prev.images, newUrl] }));
          toast.success("Image added to gallery");
        }
      }
    );
    myWidget.open();
  };

  const clearImages = () => setFormData(prev => ({ ...prev, images: [] }));

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || (formData.images.length === 0 && !editingId)) {
      toast.error("Please fill Name, Price, and add at least one Image.");
      return;
    }

    try {
      const productConfig: any = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        trending: formData.trending,
        newArrival: formData.newArrival,
        discount: formData.discount ? Number(formData.discount) : 0,
        createdAt: new Date().toISOString()
      };

      if (formData.images.length > 0) {
        productConfig.images = formData.images;
      }

      if (editingId) {
        // Remove createdAt to avoid overriding it
        delete productConfig.createdAt;
        await updateDoc(doc(db, "products", editingId), productConfig);
        toast.success("Product updated successfully");
      } else {
        await addDoc(collection(db, "products"), productConfig);
        toast.success("Product added successfully");
      }
      
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    }
  };

  const startEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      tags: product.tags?.join(", ") || "",
      trending: product.trending || false,
      newArrival: product.newArrival || false,
      discount: product.discount?.toString() || "",
      images: product.images || []
    });
    setEditingId(product.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        toast.success("Product deleted");
      } catch (error: any) {
        toast.error("Failed to delete product");
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white"><div className="animate-pulse tracking-widest uppercase">Verifying Identity...</div></div>;

  return (
    <div className="min-h-screen bg-dark-950 p-6 md:p-12 font-sans text-white">
      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center bg-[#111] p-8 rounded-3xl border border-white/10 mb-12 shadow-[0_0_30px_rgba(255,215,0,0.03)]">
        <div>
          <h1 className="text-3xl font-light tracking-widest uppercase text-white mb-2">Boutique Management</h1>
          <p className="text-white/40 text-sm tracking-wide">Manage inventory and collections for Arab Times.</p>
        </div>
        <div className="flex items-center gap-6 mt-6 md:mt-0">
          <Button onClick={() => isAdding ? resetForm() : setIsAdding(true)} className="rounded-xl px-6 py-4 uppercase tracking-widest font-bold">
            <Plus className="w-5 h-5 mr-2" /> {isAdding ? 'Cancel' : 'New Listing'}
          </Button>
          <button onClick={handleLogout} className="text-white/40 hover:text-red-500 transition-colors p-3 bg-white/5 rounded-xl hover:bg-red-500/10" aria-label="Log Out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ADD / EDIT PRODUCT FORM */}
        {isAdding && (
          <form onSubmit={handleSaveProduct} className="bg-[#111] border border-gold-500/30 rounded-3xl p-8 md:p-12 mb-12 animate-fade-in shadow-[0_0_50px_rgba(255,215,0,0.05)]">
            <h2 className="text-2xl font-light tracking-wide text-gold-500 mb-8 border-b border-white/10 pb-4">
              {editingId ? "Update Timepiece" : "Create New Timepiece"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <input required type="text" placeholder="Model Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none" />
                <input required type="number" placeholder="Price (INR)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none" />
                
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none appearance-none">
                  <option value="men">Mens Collection</option>
                  <option value="women">Womens Collection</option>
                  <option value="unisex">Unisex Collection</option>
                </select>

                <input type="text" placeholder="Tags (comma separated e.g. luxury, silver)" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none" />
                <input type="number" placeholder="Discount % (Optional)" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none" />
              </div>

              <div className="space-y-4 flex flex-col">
                <textarea required placeholder="Product Description..." rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full flex-grow bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none resize-none" />
                
                <div className="flex items-center gap-6 bg-black p-4 rounded-xl border border-white/10">
                  <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                    <input type="checkbox" checked={formData.trending} onChange={e => setFormData({...formData, trending: e.target.checked})} className="accent-gold-500 w-4 h-4" /> Trending
                  </label>
                  <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                    <input type="checkbox" checked={formData.newArrival} onChange={e => setFormData({...formData, newArrival: e.target.checked})} className="accent-gold-500 w-4 h-4" /> New Arrival
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-black p-4 rounded-xl border border-white/10 hover:border-gold-500/50 transition-all cursor-pointer group" onClick={openCloudinaryWidget}>
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-gold-500" />
                      <span className="text-sm font-medium tracking-wide">Configure Media Assets</span>
                    </div>
                    <span className="text-xs text-white/40 group-hover:text-gold-500 uppercase tracking-widest">{formData.images.length} Selected</span>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                       {formData.images.map((url, i) => (
                         <div key={i} className="aspect-square bg-dark-900 rounded-lg border border-white/5 overflow-hidden group/img relative">
                            <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-red-600/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer transition-opacity" onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
                            }}>
                              <Trash2 className="w-4 h-4 text-white" />
                            </div>
                         </div>
                       ))}
                       <button type="button" onClick={(e) => { e.stopPropagation(); clearImages(); }} className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-400 mt-2 block w-full text-left font-bold opacity-60 hover:opacity-100">Clear All</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full py-6 text-lg tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              {editingId ? "Save Changes" : "Publish to Boutique"}
            </Button>
          </form>
        )}

        {/* INVENTORY LIST */}
        <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/10 flex items-center justify-between bg-dark-900">
            <h3 className="text-xl font-light tracking-widest uppercase flex items-center gap-3">
              <Grid className="w-5 h-5 text-gold-500" /> Current Inventory
            </h3>
            <span className="bg-gold-500/10 text-gold-500 font-bold px-4 py-1 rounded-full text-xs tracking-widest uppercase border border-gold-500/20">{products.length} Items</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#1a1a1a] text-xs uppercase tracking-widest text-white/40 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Timepiece</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-white/40 tracking-widest uppercase text-sm">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-20" /> No products available in the database.
                    </td>
                  </tr>
                )}
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-black border border-white/10 overflow-hidden flex-shrink-0 relative group-hover:border-gold-500/50 transition-colors">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover p-1" />
                        </div>
                        <div>
                          <div className="text-white font-medium tracking-wide flex items-center gap-2">
                            {product.name} 
                            <a href={`/product/${product.id}`} target="_blank" className="opacity-0 group-hover:opacity-100 transition-opacity text-gold-500"><LinkIcon className="w-3 h-3" /></a>
                          </div>
                          <div className="text-white/40 text-xs tracking-widest mt-1 uppercase">ID: {product.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/60 text-sm tracking-widest uppercase">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium tracking-wider">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.trending && <span className="w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(255,215,0,0.8)]" title="Trending" />}
                        {product.newArrival && <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" title="New" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => startEdit(product)} title="Edit" className="p-2 text-white/40 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} title="Delete" className="p-2 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
