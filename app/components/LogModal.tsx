'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Modal from './ui/Modal';

type LogModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LogModal({ isOpen, onClose }: LogModalProps) {
  const [notes, setNotes] = useState('');
  const [useLocation, setUseLocation] = useState(false);
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationToggle = async () => {
    if (!useLocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setLocation(position.coords);
        setUseLocation(true);
      } catch (err) {
        setError('Failed to get location. Please try again.');
        setUseLocation(false);
      }
    } else {
      setLocation(null);
      setUseLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      onClose();
      // TODO: Show success toast
    } catch (err) {
      setError('Failed to log your shit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Your Shit">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Session Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your shit? 💩"
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 
                     bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-amber-500 
                     dark:focus:ring-amber-400 outline-none transition-all"
            rows={4}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLocationToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
              ${useLocation 
                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' 
                : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
              }`}
          >
            <FaMapMarkerAlt className={useLocation ? 'text-amber-600' : ''} />
            <span className="text-sm">
              {useLocation ? 'Location Added' : 'Add Location'}
            </span>
          </button>
          {location && (
            <span className="text-xs text-zinc-500">
              {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
            </span>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-zinc-100 
                     dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg 
                     text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          >
            {isLoading ? 'Logging...' : 'Log It'}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
} 