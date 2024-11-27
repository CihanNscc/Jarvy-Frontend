import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import NoteTaker from "@/components/note_taker";

const SidebarSlider = () => {
  return (
    <Sheet>
      <SheetTrigger className="h-[40px] text-primary">
        <img
          src="/edit_note.svg"
          alt="notes icon"
          className="min-w-[42px] min-h-[42px] cursor-pointer"
        />
      </SheetTrigger>
      <SheetContent>
        <div className="hidden">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <SheetDescription>Menu</SheetDescription>
        </div>
        <NoteTaker />
      </SheetContent>
    </Sheet>
  );
};

export default SidebarSlider;
