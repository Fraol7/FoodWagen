"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FoodItem } from "@/lib/api";

interface AddFoodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFood?: (food: FoodItem) => void;
}

export function AddFoodModal({ open, onOpenChange, onAddFood }: AddFoodModalProps) {
  const [formData, setFormData] = useState<Omit<FoodItem, 'logo' | 'status' | 'deliveryType' | 'category'>>({
    name: "",
    price: 0,
    rating: 0,
    image: "",
    restaurant: "",
  })
  const [status, setStatus] = useState<'Open' | 'Closed'>('Open')
  const [deliveryType, setDeliveryType] = useState<'Delivery' | 'Pickup' | 'Both'>('Delivery')
  const [category, setCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async () => {
    try {
      setIsSubmitting(true)
      setError(null)
      
      // Validate required fields
      if (!formData.name?.trim() || !formData.restaurant?.trim() || formData.price <= 0) {
        setError('Please fill in all required fields (name, restaurant, and price)')
        return
      }

      const newFood = {
        ...formData,
        status,
        deliveryType,
        category: category || undefined,
        logo: '🍽️', // Default logo
        image: formData.image || '/placeholder.svg',
      }

      console.log('Submitting new food:', newFood)
      
      const response = await fetch("http://localhost:5000/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFood),
      })

      const responseData = await response.json().catch(() => ({}))
      
      if (!response.ok) {
        console.error('Server error response:', response.status, response.statusText, responseData)
        throw new Error(responseData.message || `Failed to add food: ${response.status} ${response.statusText}`)
      }

      console.log('Successfully created food:', responseData)
      
      if (onAddFood) {
        onAddFood(responseData)
      }
      
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error adding food:", error)
      setError(error instanceof Error ? error.message : 'Failed to add food. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      rating: 0,
      image: "",
      restaurant: "",
    })
    setStatus('Open')
    setDeliveryType('Delivery')
    setCategory('')
    setError(null)
  }

  const handleCancel = () => {
    onOpenChange(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <div className="bg-white rounded-lg">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-center text-orange-500">Add New Food Item</DialogTitle>
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
                <Select value={status} onValueChange={(value: 'Open' | 'Closed') => setStatus(value)}>
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
                <Select value={deliveryType} onValueChange={(value: 'Delivery' | 'Pickup' | 'Both') => setDeliveryType(value)}>
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={handleAdd} 
                className="flex-1 bg-orange-400 hover:bg-orange-500 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Meal'}
              </Button>
              <Button
                onClick={handleCancel}
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
