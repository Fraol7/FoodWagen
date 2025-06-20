"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditMealModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meal: any
}

export function EditMealModal({ open, onOpenChange, meal }: EditMealModalProps) {
  const [formData, setFormData] = useState({
    foodCategory: "",
    foodName: "",
    price: "",
    foodImageLink: "",
    deliveryType: "Delivery",
    restaurantImageLink: "",
    status: "Open",
  })

  useEffect(() => {
    if (meal) {
      setFormData({
        foodCategory: meal.category || "",
        foodName: meal.name || "",
        price: meal.price?.toString() || "",
        foodImageLink: meal.image || "",
        deliveryType: "Delivery",
        restaurantImageLink: meal.restaurantImage || "",
        status: meal.status || "Open",
      })
    }
  }, [meal])

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/meals/${meal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log("Meal updated successfully")
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error updating meal:", error)
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
            <div>
              <Label htmlFor="foodCategory" className="text-sm text-gray-600 mb-1 block">
                Food category
              </Label>
              <Select
                value={formData.foodCategory}
                onValueChange={(value) => setFormData({ ...formData, foodCategory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appetizer">Appetizer</SelectItem>
                  <SelectItem value="main">Main Course</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                  <SelectItem value="beverage">Beverage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="foodName" className="text-sm text-gray-600 mb-1 block">
                Food name
              </Label>
              <Input
                id="foodName"
                value={formData.foodName}
                onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="price" className="text-sm text-gray-600 mb-1 block">
                Price
              </Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="foodImageLink" className="text-sm text-gray-600 mb-1 block">
                Food image link
              </Label>
              <Input
                id="foodImageLink"
                value={formData.foodImageLink}
                onChange={(e) => setFormData({ ...formData, foodImageLink: e.target.value })}
                className="w-full text-xs"
                placeholder="https://via.placeholder.com/300x200"
              />
            </div>

            <div>
              <Label htmlFor="deliveryType" className="text-sm text-gray-600 mb-1 block">
                Delivery type
              </Label>
              <Select
                value={formData.deliveryType}
                onValueChange={(value) => setFormData({ ...formData, deliveryType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delivery">Delivery</SelectItem>
                  <SelectItem value="Pickup">Pickup</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="restaurantImageLink" className="text-sm text-gray-600 mb-1 block">
                Restaurant image link
              </Label>
              <Input
                id="restaurantImageLink"
                value={formData.restaurantImageLink}
                onChange={(e) => setFormData({ ...formData, restaurantImageLink: e.target.value })}
                className="w-full text-xs"
                placeholder="https://via.placeholder.com/50x50"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-sm text-gray-600 mb-1 block">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button onClick={handleSave} className="flex-1 bg-orange-400 hover:bg-orange-500 text-white">
                Save
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
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
