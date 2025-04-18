import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavoritesStore } from '../store/favorites-store';
import { Loading } from '../components/ui/loading';
import { ErrorBoundary } from '../components/error-boundary';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { Star } from 'lucide-react';
import { fadeIn, slideIn, staggerContainer } from '../lib/animations';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, isLoading, error, fetchFavorites, removeFavorite } = useFavoritesStore();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  if (isLoading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Loading size="lg" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={fetchFavorites}>Try Again</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div
        className="container mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div
          className="flex justify-between items-center mb-8"
          variants={slideIn}
        >
          <h1 className="text-3xl font-bold text-slate-900">Favorites</h1>
        </motion.div>

        <AnimatePresence mode="wait">
          {favorites.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Star className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-medium text-slate-600">
                No favorites yet
              </h3>
              <p className="text-slate-500 mt-2">
                Start by browsing medicines and adding them to your favorites
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="mt-4"
                  onClick={() => navigate('/medicines')}
                >
                  Browse Medicines
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {favorites.map((medicine) => (
                  <motion.div
                    key={medicine.id}
                    variants={slideIn}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                  >
                    <Card className="p-6">
                      <motion.div className="space-y-4">
                        <motion.div
                          className="aspect-w-16 aspect-h-9"
                          whileHover={{ scale: 1.02 }}
                        >
                          <img
                            src={medicine.image_url}
                            alt={medicine.name}
                            className="object-cover rounded-lg"
                          />
                        </motion.div>
                        <motion.div variants={fadeIn}>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {medicine.name}
                          </h3>
                          <p className="text-slate-600 mt-1 line-clamp-2">
                            {medicine.description}
                          </p>
                        </motion.div>
                        <motion.div
                          className="flex justify-between items-center"
                          variants={fadeIn}
                        >
                          <span className="text-sm text-slate-500">
                            Expires: {format(new Date(medicine.expiry_date), 'MMM d, yyyy')}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              medicine.status === 'available'
                                ? 'bg-green-100 text-green-800'
                                : medicine.status === 'claimed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {medicine.status}
                          </span>
                        </motion.div>
                        <motion.div
                          className="flex gap-2"
                          variants={fadeIn}
                        >
                          <Button
                            className="flex-1"
                            onClick={() => navigate(`/medicines/${medicine.id}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => removeFavorite(medicine.id)}
                          >
                            Remove
                          </Button>
                        </motion.div>
                      </motion.div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ErrorBoundary>
  );
}; 