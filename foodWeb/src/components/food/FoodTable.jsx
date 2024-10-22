import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Leaf, UtensilsCrossed, Star, MessageSquare } from 'lucide-react';

const ReviewCard = ({ review }) => (
  <Card className="mb-4">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-medium">{review.name}</CardTitle>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{review.rating}</span>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription>{review.description}</CardDescription>
    </CardContent>
  </Card>
);

export const FoodTable = ({ foods, onEdit, onDelete }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const getVegStatusColor = (category) => {
    return category === 'veg' ? 'text-green-600' : 'text-red-600';
  };

  const VegIndicator = ({ category }) => (
    <div className="flex items-center gap-1">
      {category === 'veg' ? (
        <Leaf className="h-4 w-4 text-green-600" />
      ) : (
        <UtensilsCrossed className="h-4 w-4 text-red-600" />
      )}
      <span className={`text-sm font-medium ${getVegStatusColor(category)}`}>
        {category === 'veg' ? 'Veg' : 'Non-veg'}
      </span>
    </div>
  );

  const handleReviewsClick = (food) => {
    setSelectedFood(food);
    setReviewsOpen(true);
  };

  const getAverageRating = (food) => {
    if (!food.reviews || food.reviews.length === 0) return null;
    const total = food.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / food.reviews.length).toFixed(1);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Images</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Reviews</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foods.map((food) => (
            <TableRow key={food._id}>
              <TableCell>
                <div className="flex gap-2">
                  {food.images && food.images.slice(0, 3).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${food.name} - ${index + 1}`}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell>{food.name}</TableCell>
              <TableCell>
                <VegIndicator category={food.category} />
              </TableCell>
              <TableCell>${parseFloat(food.price).toFixed(2)}</TableCell>
              <TableCell className="max-w-xs truncate">
                {food.description}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => handleReviewsClick(food)}
                >
                  <MessageSquare className="h-4 w-4" />
                  {food.reviews?.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {food.reviews.length} {food.reviews.length === 1 ? 'review' : 'reviews'}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {getAverageRating(food)}
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline">No reviews yet</Badge>
                  )}
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(food)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(food._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={reviewsOpen} onOpenChange={setReviewsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Reviews for {selectedFood?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedFood?.reviews?.length > 0 ? (
              selectedFood.reviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                No reviews yet for this item
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FoodTable;