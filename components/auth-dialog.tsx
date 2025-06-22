import { Auth } from './auth'
import Logo from './logo'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export function AuthDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Sign in to Fragments</DialogTitle>
          <DialogDescription>
            Sign in or create an account to access Fragments
          </DialogDescription>
        </VisuallyHidden>
        <div className="flex justify-center items-center flex-col">
          <h1 className="flex items-center gap-4 text-xl font-bold mb-6 w-full">
            <div className="flex items-center justify-center rounded-md shadow-md bg-black p-2">
              <Logo className="text-white w-6 h-6" />
            </div>
            Sign in to Fragments
          </h1>
          <div className="w-full">
            <Auth onClose={() => setOpen(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}