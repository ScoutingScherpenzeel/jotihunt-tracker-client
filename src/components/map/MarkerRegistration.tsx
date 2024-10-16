import { GlassesIcon, LocateFixedIcon, PinIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { MarkerType } from '@/types/MarkerType';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { areaOptions } from '@/lib/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Marker } from '@/types/Marker';
import { useMarkers } from '@/hooks/markers.hook';
import { useToast } from '../ui/use-toast';

const HUNT_START_TIME = new Date(import.meta.env.HUNT_START_TIME);
const HUNT_END_TIME = new Date(import.meta.env.HUNT_END_TIME);

const FormSchema = z.object({
  area: z.enum([...areaOptions.map((option) => option.value)] as [string, ...string[]], { message: 'Geen geldig deelgebied.' }),
  day: z.date(),
  time: z.date(),
});

export default function MarkerRegistration({ lat, lng }: { lat: number; lng: number }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [markerType, setMarkerType] = useState<MarkerType>();
  const { createMarker } = useMarkers();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      area: '',
      day: getCurrentOrFirstDate(),
      time: getCurrentOrFirstDate(),
    },
  });

  function getDays() {
    const days = [];
    let currentDate = new Date(HUNT_START_TIME);
    while (currentDate <= HUNT_END_TIME) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  }

  function getCurrentOrFirstDate() {
    const currentDay = new Date();
    if (currentDay < HUNT_START_TIME || currentDay > HUNT_END_TIME) {
      return HUNT_START_TIME;
    }
    return currentDay;
  }

  function openDialog(markerType: MarkerType) {
    setMarkerType(markerType);
    setDialogOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setDialogOpen(open);
    form.reset();
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const day = new Date(data.day);
    const time = new Date(data.time);
    const newDate = new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.getHours(), time.getMinutes());

    if (markerType === undefined) return;

    // Check if within the hunt time
    if (newDate < HUNT_START_TIME || newDate > HUNT_END_TIME) {
      form.setError('time', { message: 'Tijd valt buiten de hunt periode.' });
      return;
    }

    const marker: Marker = {
      area: data.area,
      time: newDate,
      type: markerType,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
    };

    const result = await createMarker(marker);
    if (result) {
      handleOpenChange(false);
      toast({ variant: 'default', title: 'Marker geplaatst!', description: 'De marker is succesvol geplaatst.' });
    } else {
      toast({ variant: 'destructive', title: 'Er is iets misgegaan.', description: 'Er is een fout opgetreden bij het plaatsen van de marker, probeer het later opnieuw.' });
    }
  }

  const renderForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 w-full">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Deelgebied</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kies deelgebied..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areaOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Select with all days */}
          </div>
          <div className="flex gap-4 w-full">
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => {
                const dateValue = field.value instanceof Date ? field.value : new Date(field.value); // Ensure it's a Date
                return (
                  <FormItem className="w-full">
                    <FormLabel>Dag</FormLabel>
                    <Select onValueChange={(value) => field.onChange(new Date(value))} defaultValue={dateValue.toDateString()} value={dateValue.toDateString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kies dag..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getDays().map((day) => (
                          <SelectItem key={day.toDateString()} value={day.toDateString()}>
                            {day.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {/* Time select input */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => {
                const timeValue =
                  field.value instanceof Date
                    ? field.value.toTimeString().substring(0, 5) // Convert Date to HH:MM format
                    : ''; // Ensure it's a time string in HH:MM

                return (
                  <FormItem className="w-full">
                    <FormLabel>Tijd</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        value={timeValue}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const updatedDate = new Date(field.value);
                          updatedDate.setHours(parseInt(hours, 10));
                          updatedDate.setMinutes(parseInt(minutes, 10));
                          field.onChange(updatedDate); // Update the form field value with the selected time
                        }}
                        className="border p-2 rounded w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={() => handleOpenChange(false)}>
              Annuleren
            </Button>
            <Button variant="default" type="submit" disabled={!form.formState.isValid}>
              <PinIcon className="mr-2 h-4 w-4" />
              Opslaan
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  );

  const dialog = () => (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {markerType?.toString()[0].toUpperCase()}
            {markerType?.toString().slice(1)} registreren
          </DialogTitle>
          <DialogDescription>Plaats een marker op de kaart.</DialogDescription>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {dialog()}
      <div className="flex gap-2 w-full">
        <Button variant="default" size="sm" className="w-full" onClick={() => openDialog(MarkerType.Hunt)}>
          <LocateFixedIcon className="mr-2 h-4 w-4" /> Vos hunt
        </Button>
        <Button variant="default" size="sm" className="w-full" onClick={() => openDialog(MarkerType.Spot)}>
          <GlassesIcon className="mr-2 h-4 w-4" /> Vos spot
        </Button>
      </div>
    </>
  );
}
