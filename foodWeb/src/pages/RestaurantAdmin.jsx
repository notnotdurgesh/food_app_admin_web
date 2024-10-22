import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFoodManager } from '../hooks/useFoodManager';
import { LoginForm } from '../components/auth/LoginForm';
import { FoodTable } from '../components/food/FoodTable';
import { Header } from '../components/layout/Header';
import { AddFoodDialog } from '../components/food/AddFoodDialog';
import { EditFoodDialog } from '../components/food/EditFoodDialog';
import { DeleteFoodDialog } from '../components/food/DeleteFoodDialog';
import { ErrorAlert } from '../components/layout/ErrorAlert';
import { Button } from "../components/ui/button";
import { Plus } from 'lucide-react';

export default function RestaurantAdmin() {
  const { isLoggedIn, isLoading: authLoading, error: authError, handleLogin, handleLogout } = useAuth();
  const { foods, isLoading: foodLoading, error: foodError, addFood, updateFood, deleteFood } = useFoodManager();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [deletingFoodId, setDeletingFoodId] = useState(null);

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} isLoading={authLoading} error={authError} />;
  }

  const handleAddFood = async (foodData) => {
    try {
      await addFood(foodData);
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error is handled by useFoodManager
    }
  };

  const handleUpdateFood = async (id, foodData) => {
    try {
      await updateFood(id, foodData);
      setIsEditDialogOpen(false);
      setEditingFood(null);
    } catch (error) {
      // Error is handled by useFoodManager
    }
  };

  const handleDeleteFood = async () => {
    try {
      await deleteFood(deletingFoodId);
      setIsDeleteDialogOpen(false);
      setDeletingFoodId(null);
    } catch (error) {
      // Error is handled by useFoodManager
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Food
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <FoodTable
            foods={foods}
            onEdit={(food) => {
              setEditingFood(food);
              setIsEditDialogOpen(true);
            }}
            onDelete={(id) => {
              setDeletingFoodId(id);
              setIsDeleteDialogOpen(true);
            }}
          />
        </div>

        <AddFoodDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddFood}
          isLoading={foodLoading}
        />

        <EditFoodDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingFood(null);
          }}
          onSubmit={handleUpdateFood}
          food={editingFood}
          isLoading={foodLoading}
        />

        <DeleteFoodDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setDeletingFoodId(null);
          }}
          onConfirm={handleDeleteFood}
          isLoading={foodLoading}
        />
        <ErrorAlert
          message={foodError || authError}
          onClear={() => {
            // Clear error handling here
          }}
        />
      </div>
    </div>
  );
}
