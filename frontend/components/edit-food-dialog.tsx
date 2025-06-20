"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { FoodItem } from "@/lib/api"

interface EditFoodDialogProps {
  food: FoodItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (food: FoodItem) => void
}

export function EditFoodDialog({ food, open, onOpenChange, onSave }: EditFoodDialogProps) {
  const [formData, setFormData] = useState<Omit<FoodItem, '_id' | 'logo' | 'createdAt' | 'updatedAt'>>({
    name: "",
    price: 0,
    rating: 0,
    image: "",
    restaurant: "",
    status: "Open",
    deliveryType: "Delivery",
    category: "",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name || "",
        price: food.price || 0,
        rating: food.rating || 0,
        image: food.image || "",
        restaurant: food.restaurant || "",
        status: food.status || "Open",
        deliveryType: food.deliveryType || "Delivery",
        category: food.category || "",
      })
    }
  }, [food])

  const handleSave = async () => {
    if (!food?._id) {
      setError("No food item selected for update")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      
      // Validate required fields
      if (!formData.name || !formData.restaurant || formData.price <= 0) {
        setError('Please fill in all required fields')
        return
      }

      const response = await fetch(`http://localhost:3000/foods/${food._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to update meal')
      }

      const updatedFood = await response.json()
      toast.success("Food item updated successfully")
      onSave(updatedFood)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating food item:", error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update food item'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setError(null)
      }
      onOpenChange(isOpen)
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Food Item</DialogTitle>
          <DialogDescription>Make changes to the food item details here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md mb-4">
            {error}
          </div>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Food Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter food name"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || ''}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                placeholder="4.5"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="restaurant">
              Restaurant Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="restaurant"
              value={formData.restaurant}
              onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
              placeholder="Enter restaurant name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Food Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="text-xs"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'Open' | 'Closed') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deliveryType">Delivery Type</Label>
              <Select
                value={formData.deliveryType}
                onValueChange={(value: 'Delivery' | 'Pickup' | 'Both') => setFormData({ ...formData, deliveryType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delivery">Delivery</SelectItem>
                  <SelectItem value="Pickup">Pickup</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Input
              id="category"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Italian, Chinese, etc."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
      </DialogContent>
    </Dialog>
  )
}
