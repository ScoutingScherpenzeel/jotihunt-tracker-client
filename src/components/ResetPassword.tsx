import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from './ui/dialog';
import PropTypes, { InferProps } from 'prop-types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/auth.hook';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { User } from '@/types/User';
import { useToast } from './ui/use-toast';

const resetPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Oude wachtwoord mag niet leeg zijn.'),
    newPassword: z.string().min(1, 'Nieuw wachtwoord mag niet leeg zijn.'),
    confirmPassword: z.string().min(1, 'Nieuw wachtwoord bevestigeing mag niet leeg zijn.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Wachtwoorden komen niet overeen',
    path: ['confirmPassword'],
  });

export default function ResetPassword({ open, setIsOpen, allowClose = true }: InferProps<typeof ResetPassword.propTypes>) {
  const auth = useAuth();
  const authUser = useAuthUser<User>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function handleUpdatePassword(data: z.infer<typeof resetPasswordSchema>) {
    const result = await auth.updatePassword(data.oldPassword, data.newPassword);

    if (!result) {
      form.setError('oldPassword', { message: 'Oud wachtwoord is onjuist.' });
      return;
    }

    if (!authUser) return;
    if (setIsOpen) setIsOpen(false);

    form.reset();

    const newUserState = { ...authUser, requiresPasswordChange: false };
    auth.updateUserState(newUserState);
    toast({
      variant: 'default',
      title: 'Wachtwoord bijgewerkt!',
      description: 'Je wachtwoord is succesvol aangepast.',
    });
  }

  function handleOpenChange(open: boolean) {
    if (!allowClose || !setIsOpen) return;
    setIsOpen(open);
    form.reset();
  }

  function handleInteractOutside(e: PointerDownOutsideEvent | FocusOutsideEvent) {
    if (!allowClose) e.preventDefault();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent onInteractOutside={handleInteractOutside} hideClose={!allowClose}>
          <DialogHeader>
            <DialogTitle>Wachtwoord wijzigen</DialogTitle>
            <DialogDescription>{allowClose ? 'Vul je oude en nieuw wachtwoord in.' : 'Je bent verplicht je wachtwoord te wijzigen. Vul je oude en een nieuw wachtwoord in.'}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdatePassword)}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Oude wachtwoord</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nieuw wachtwoord</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bevestig nieuw wachtwoord</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Wachtwoord wijzigen</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

ResetPassword.propTypes = {
  open: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func,
  allowClose: PropTypes.bool.isRequired,
};

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>;
type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>;
