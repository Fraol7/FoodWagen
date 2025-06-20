"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddMealModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMealModal({ open, onOpenChange }: AddMealModalProps) {
  const [formData, setFormData] = useState({
    foodName: "",
    foodCategory: "",
    price: "",
    foodImageLink: "",
    restaurantName: "",
    restaurantImageLink: "",
  })

  const handleAdd = async () => {
    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log("Meal added successfully")
        onOpenChange(false)
        setFormData({
          foodName: "",
          foodCategory: "",
          price: "",
          foodImageLink: "",
          restaurantName: "",
          restaurantImageLink: "",
        })
      }
    } catch (error) {
      console.error("Error adding meal:", error)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFormData({
      foodName: "",
      foodCategory: "",
      price: "",
      foodImageLink: "",
      restaurantName: "",
      restaurantImageLink: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <div className="bg-white rounded-lg">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-center text-orange-500">Add a meal</DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-4">
            <div>
              <Label htmlFor="foodName" className="text-sm text-gray-600 mb-1 block">
                Food name
              </Label>
              <Input
                id="foodName"
                placeholder="Enter food name"
                value={formData.foodName}
                onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="foodCategory" className="text-sm text-gray-600 mb-1 block">
                Food category
              </Label>
              <Input
                id="foodCategory"
                placeholder="Enter food category"
                value={formData.foodCategory}
                onChange={(e) => setFormData({ ...formData, foodCategory: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="price" className="text-sm text-gray-600 mb-1 block">
                Price
              </Label>
              <Input
                id="price"
                placeholder="Enter price"
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
                placeholder="Enter food image URL"
                value={formData.foodImageLink}
                onChange={(e) => setFormData({ ...formData, foodImageLink: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="restaurantName" className="text-sm text-gray-600 mb-1 block">
                Restaurant name
              </Label>
              <Input
                id="restaurantName"
                placeholder="Enter restaurant name"
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="restaurantImageLink" className="text-sm text-gray-600 mb-1 block">
                Restaurant image link
              </Label>
              <Input
                id="restaurantImageLink"
                placeholder="Enter restaurant image URL"
                value={formData.restaurantImageLink}
                onChange={(e) => setFormData({ ...formData, restaurantImageLink: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button onClick={handleAdd} className="flex-1 bg-orange-400 hover:bg-orange-500 text-white">
                Add
              </Button>
              <Button
                onClick={handleCancel}
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
