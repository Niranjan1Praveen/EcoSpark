import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
function Rewards(props) {
  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
            <p className="text-[var(--primary-text)]">Rewards</p>
        </DrawerTrigger>
        <DrawerContent className="bg-[var(--secondary-background)]">
          <div className="mx-auto w-full max-w-xs sm:max-w-sm ">
            <DrawerHeader>
              <DrawerTitle className="text-center">
                Unlocked Rewards
              </DrawerTitle>
              <DrawerDescription className="text-center">
                Check the benefits you’ve unlocked based on your sustainability
                level.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="w-auto">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default Rewards;
