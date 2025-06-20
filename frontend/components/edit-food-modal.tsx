"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FoodItem } from "@/lib/api"

interface EditFoodModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  food: FoodItem | null
  onUpdateFood?: (food: FoodItem) => void
}

export function EditFoodModal({ open, onOpenChange, food: propFood, onUpdateFood }: EditFoodModalProps) {
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
    if (propFood) {
      setFormData({
        name: propFood.name || "",
        price: propFood.price || 0,
        rating: propFood.rating || 0,
        image: propFood.image || "",
        restaurant: propFood.restaurant || "",
        status: propFood.status || "Open",
        deliveryType: propFood.deliveryType || "Delivery",
        category: propFood.category || "",
      })
    }
  }, [propFood])

  const handleSave = async () => {
    if (!propFood?._id) {
      setError("No food item selected for update")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      
      // Validate required fields
      if (!formData.name?.trim() || !formData.restaurant?.trim() || formData.price <= 0) {
        setError('Please fill in all required fields (name, restaurant, and price)')
        return
      }

      const updatedFood = {
        ...formData,
        logo: '🍽️', // Ensure logo is included
        image: formData.image || '/placeholder.svg',
      }

      console.log('Updating food item:', { id: propFood._id, ...updatedFood })
      
      const response = await fetch(`http://localhost:5000/api/foods/${propFood._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFood),
      })

      const responseData = await response.json().catch(() => ({}))
      
      if (!response.ok) {
        console.error('Server error response:', response.status, response.statusText, responseData)
        throw new Error(responseData.message || `Failed to update food: ${response.status} ${response.statusText}`)
      }

      console.log('Successfully updated food:', responseData)
      
      if (onUpdateFood) {
        onUpdateFood(responseData)
      }
      
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating food item:", error)
      setError(error instanceof Error ? error.message : 'Failed to update food item. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <div className="bg-white rounded-lg">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-center text-orange-500">Edit Food Item</DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            
            <div>
              <Label htmlFor="name" className="text-sm text-gray-600 mb-1 block">
                Food name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter food name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-sm text-gray-600 mb-1 block">
                  Price ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="rating" className="text-sm text-gray-600 mb-1 block">
                  Rating (0-5)
                </Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="4.5"
                  value={formData.rating || ''}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image" className="text-sm text-gray-600 mb-1 block">
                Food image URL
              </Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full text-xs"
              />
            </div>

            <div>
              <Label htmlFor="restaurant" className="text-sm text-gray-600 mb-1 block">
                Restaurant name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="restaurant"
                placeholder="Enter restaurant name"
                value={formData.restaurant}
                onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                className="w-full"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status" className="text-sm text-gray-600 mb-1 block">
                  Status
                </Label>
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
              
              <div>
                <Label htmlFor="deliveryType" className="text-sm text-gray-600 mb-1 block">
                  Delivery Type
                </Label>
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
            
            <div>
              <Label htmlFor="category" className="text-sm text-gray-600 mb-1 block">
                Category (optional)
              </Label>
              <Input
                id="category"
                placeholder="e.g., Italian, Chinese, etc."
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={handleSave} 
                className="flex-1 bg-orange-400 hover:bg-orange-500 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Update Food Item'}
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
