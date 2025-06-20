"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DeleteMealModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meal: any
}

export function DeleteMealModal({ open, onOpenChange, meal }: DeleteMealModalProps) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/meals/${meal?.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        console.log("Meal deleted successfully")
        onOpenChange(false)
        // TODO: Refresh the meals list or remove from state
      }
    } catch (error) {
      console.error("Error deleting meal:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <div className="bg-white rounded-lg">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-center text-orange-500">Delete Meal</DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6">
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete this meal? This action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <Button onClick={handleDelete} className="flex-1 bg-orange-400 hover:bg-orange-500 text-white">
                Delete
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
