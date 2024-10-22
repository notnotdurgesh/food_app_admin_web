import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ImagePlus, Leaf } from 'lucide-react';

export const AddFoodDialog = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const initialState = {
    name: '',
    price: '',
    description: '',
    category: 'non-veg',
    images: null
  };

  const [newFood, setNewFood] = useState(initialState);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      setNewFood({ ...newFood, images: files });
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newFood.name.trim());
    formData.append('price', parseFloat(newFood.price));
    formData.append('description', newFood.description.trim());
    formData.append('category', newFood.category);
    
    if (newFood.images) {
      Array.from(newFood.images).forEach((file) => {
        formData.append('images', file);
      });
    }

    await onSubmit(formData);
    setNewFood(initialState);
    setPreviewUrls([]);
    onClose();
  };

  const handleClose = () => {
    setNewFood(initialState);
    setPreviewUrls([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Food Item</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new food item to the menu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Food Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={newFood.category === 'veg' ? 'default' : 'outline'}
                className={`flex items-center justify-center gap-2 h-14 ${
                  newFood.category === 'veg' 
                    ? 'border-2 border-green-500 bg-green-50 hover:bg-green-100' 
                    : ''
                }`}
                onClick={() => setNewFood({ ...newFood, category: 'veg' })}
                disabled={isLoading}
              >
                <Leaf className={`h-5 w-5 ${newFood.category === 'veg' ? 'text-green-600' : 'text-gray-500'}`} />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Vegetarian</span>
                  <span className="text-xs text-gray-500">No meat or fish</span>
                </div>
              </Button>
              
              <Button
                type="button"
                variant={newFood.category === 'non-veg' ? 'default' : 'outline'}
                className={`flex items-center justify-center gap-2 h-14 ${
                  newFood.category === 'non-veg' 
                    ? 'border-2 border-red-500 bg-red-50 hover:bg-red-100' 
                    : ''
                }`}
                onClick={() => setNewFood({ ...newFood, category: 'non-veg' })}
                disabled={isLoading}
              >
                <span className="text-xl">🍖</span>
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Non-Vegetarian</span>
                  <span className="text-xs text-gray-500">Contains meat/fish</span>
                </div>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter food name"
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newFood.price}
                onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the food item..."
              value={newFood.description}
              onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
              disabled={isLoading}
              className="h-20"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="image">Images</Label>
            <div className="grid gap-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImagePlus className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="text-sm text-gray-500">Click to upload images</p>
                  </div>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                </label>
              </div>
              
              {previewUrls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {previewUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className={`${
                newFood.category === 'veg' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Food'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodDialog;