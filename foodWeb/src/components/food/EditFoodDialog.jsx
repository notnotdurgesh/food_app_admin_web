import React, { useState, useEffect } from 'react';
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
import { Loader2, ImagePlus, Leaf, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export const EditFoodDialog = ({ isOpen, onClose, onSubmit, food, isLoading }) => {
  const [editedFood, setEditedFood] = useState(food);
  const [error, setError] = useState('');

  useEffect(() => {
    if (food) {
      setEditedFood({
        ...food,
        price: food.price.toString(),
        category: food.category || 'non-veg'
      });
    }
  }, [food]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const fileList = Array.from(files);
      setEditedFood(prev => ({
        ...prev,
        newImages: fileList,
        previewUrls: fileList.map(file => URL.createObjectURL(file))
      }));
    } else {
      setEditedFood(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    if (!editedFood.name.trim()) {
      setError('Name is required');
      return false;
    }

    const price = parseFloat(editedFood.price);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', editedFood.name.trim());
    formData.append('price', parseFloat(editedFood.price));
    formData.append('description', editedFood.description?.trim() || '');
    formData.append('category', editedFood.category);
    
    if (editedFood.images) {
      formData.append('images', JSON.stringify(editedFood.images));
    }
    
    if (editedFood.newImages) {
      editedFood.newImages.forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      await onSubmit(editedFood._id, formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update food item');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle>Edit Food Item</DialogTitle>
          <DialogDescription>
            Modify the details of your food item below.
          </DialogDescription>
        </DialogHeader>
        {editedFood && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Food Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={editedFood.category === 'veg' ? 'default' : 'outline'}
                  className={`flex items-center gap-2 h-12 ${
                    editedFood.category === 'veg' 
                      ? 'border-2 border-green-500 bg-green-50 hover:bg-green-100' 
                      : ''
                  }`}
                  onClick={() => setEditedFood({ ...editedFood, category: 'veg' })}
                  disabled={isLoading}
                >
                  <Leaf className={`h-4 w-4 ${editedFood.category === 'veg' ? 'text-green-600' : 'text-gray-500'}`} />
                  <span className="font-semibold">Vegetarian</span>
                </Button>
                
                <Button
                  type="button"
                  variant={editedFood.category === 'non-veg' ? 'default' : 'outline'}
                  className={`flex items-center gap-2 h-12 ${
                    editedFood.category === 'non-veg' 
                      ? 'border-2 border-red-500 bg-red-50 hover:bg-red-100' 
                      : ''
                  }`}
                  onClick={() => setEditedFood({ ...editedFood, category: 'non-veg' })}
                  disabled={isLoading}
                >
                  <span className="text-lg">🍖</span>
                  <span className="font-semibold">Non-Veg</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editedFood.name}
                  onChange={handleChange}
                  placeholder="Enter food name"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={editedFood.price}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={editedFood.description || ''}
                onChange={handleChange}
                placeholder="Describe the food item..."
                disabled={isLoading}
                className="h-20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Images</Label>
              
              <Alert variant="destructive" className="bg-red-50 text-red-800 border border-red-200 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2 text-xs">
                  New images will replace existing ones
                </AlertDescription>
              </Alert>

              <div className="grid gap-2">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center py-2">
                    <ImagePlus className="w-6 h-6 mb-1 text-gray-500" />
                    <p className="text-xs text-gray-500">Click to upload</p>
                  </div>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </label>
                
                <div className="flex gap-2 overflow-x-auto py-1">
                  {editedFood.previewUrls ? (
                    editedFood.previewUrls.map((url, index) => (
                      <img
                        key={`new-${index}`}
                        src={url}
                        alt={`New preview ${index + 1}`}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                    ))
                  ) : (
                    editedFood.images?.map((url, index) => (
                      <img
                        key={`existing-${index}`}
                        src={url}
                        alt={`Existing ${index + 1}`}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-500 p-2 bg-red-50 rounded">
                {error}
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
                className="px-4"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className={`px-4 ${
                  editedFood.category === 'veg' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Food'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditFoodDialog;