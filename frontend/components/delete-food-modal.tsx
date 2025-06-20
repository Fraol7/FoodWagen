"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { FoodItem } from "@/lib/api"

interface DeleteFoodModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  food: FoodItem | null
  onDeleteSuccess?: (deletedFoodId: string) => void
}

export function DeleteFoodModal({ open, onOpenChange, food, onDeleteSuccess }: DeleteFoodModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!food?._id) {
      setError("No food selected for deletion")
      return
    }

    try {
      setIsDeleting(true)
      setError(null)
      
      const response = await fetch(`http://localhost:3000/foods/${food._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to delete food item')
      }
      
      toast.success("Food item deleted successfully")
      onDeleteSuccess?.(food._id)
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting food item:", error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete food item'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setError(null)
      }
      onOpenChange(isOpen)
    }}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="bg-white rounded-lg">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-center text-orange-500">
              Delete Food Item
            </DialogTitle>
            {food?.name && (
              <DialogDescription className="text-center text-gray-600">
                {food.name}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="px-6 pb-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete this food item? This action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <Button 
                onClick={handleDelete} 
                variant="destructive"
                className="flex-1"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : 'Delete'}
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1"
                disabled={isDeleting}
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
