"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FoodItem } from "./add-meal-modal"

interface EditMealModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meal: FoodItem | null
  onUpdateMeal?: (meal: FoodItem) => void
}

export function EditMealModal({ open, onOpenChange, meal: propMeal, onUpdateMeal }: EditMealModalProps) {
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
    if (propMeal) {
      setFormData({
        name: propMeal.name || "",
        price: propMeal.price || 0,
        rating: propMeal.rating || 0,
        image: propMeal.image || "",
        restaurant: propMeal.restaurant || "",
        status: propMeal.status || "Open",
        deliveryType: propMeal.deliveryType || "Delivery",
        category: propMeal.category || "",
      })
    }
  }, [propMeal])

  const handleSave = async () => {
    if (!propMeal?._id) {
      setError("No meal selected for update")
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

      const response = await fetch(`http://localhost:3000/foods/${propMeal._id}`, {
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

      const updatedMeal = await response.json()
      
      if (onUpdateMeal) {
        onUpdateMeal(updatedMeal)
      }
      
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating meal:", error)
      setError(error instanceof Error ? error.message : 'Failed to update meal')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <div className="bg-white rounded-lg">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-center text-orange-500">Edit Meal</DialogTitle>
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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
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
