import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import logo from "./assets/images/logo.png";

import { Card, CardContent } from "./components/ui/card";

const backgroundImage = import.meta.env.VITE_BACKGROUND_IMAGE;

export default function Login() {
  return (
    <div className="w-full lg:grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Inloggen</h1>
            <p className=" text-muted-foreground">
              Vul je e-mailadres en wachtwoord in.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                placeholder="jouwnaam@scoutingscherpenzeel.nl"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Wachtwoord</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Inloggen
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Heb je geen account? Vraag een beheerder om een account aan te
            maken.
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute left-1/2 -translate-x-1/2 top-12">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <img src={logo} alt="Jotihunt Tracker" className="w-12" />
                  <div>
                    <h1 className="text-xl font-bold">Jotihunt Tracker</h1>
                    <h2>Scouting Scherpenzeel e.o.</h2>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <img
          src={backgroundImage}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
