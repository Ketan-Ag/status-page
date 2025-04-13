"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ExamplePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Click me</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Example Popover</h4>
            <p className="text-sm text-muted-foreground">
              This is an example of how to use the Popover component.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 