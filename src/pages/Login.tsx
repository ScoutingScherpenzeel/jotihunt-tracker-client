import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import logo from '@/assets/images/logo.png';

import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../hooks/auth.hook';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import usePWA from 'react-pwa-install-prompt';

const FormSchema = z.object({
  email: z.string().email({ message: 'Vul een geldig e-mailadres in.' }),
  password: z.string(),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isStandalone, isInstallPromptSupported, promptInstall } = usePWA();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Handle the login, references the auth hook.
   * Navigates to the dashboard if successful.
   */
  async function handleLogin(data: z.infer<typeof FormSchema>) {
    const success = await login(data.email, data.password);
    if (!success) {
      form.setError('password', {
        message: 'Ongeldig e-mailadres of wachtwoord.',
      });
    }

    navigate('/');

    if (isInstallPromptSupported && !isStandalone) {
      promptInstall();
    }
  }

  return (
    <div className="w-full lg:grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-4 grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-3 lg:hidden mb-6">
              <img src={logo} alt="Jotihunt Tracker" className="w-20 h-20" />
            </div>
            <h1 className="text-3xl font-bold">Inloggen</h1>
            <p className=" text-muted-foreground">Vul je e-mailadres en wachtwoord in.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mailadres</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" required placeholder="jouwnaam@scoutingscherpenzeel.nl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wachtwoord</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Inloggen
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">Heb je geen account? Vraag een beheerder om een account aan te maken.</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute left-1/2 -translate-x-1/2 top-12">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="Jotihunt Tracker" className="w-12 h-12" />
                  <div>
                    <h1 className="text-xl font-bold">Jotihunt Tracker</h1>
                    <h2>Scouting Scherpenzeel e.o.</h2>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="login-background w-full h-full"></div>
      </div>
    </div>
  );
}
