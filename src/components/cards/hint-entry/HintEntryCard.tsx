import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../../ui/card.tsx';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select.tsx';
import {Form, FormControl, FormField, FormItem, FormLabel} from '../../ui/form.tsx';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '../../ui/button.tsx';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '../../ui/input-otp.tsx';
import {REGEXP_ONLY_DIGITS} from 'input-otp';
import {Pin, TrashIcon} from 'lucide-react';
import {useMarkers} from '@/hooks/markers.hook.ts';
import {toast} from 'sonner';
import PropTypes, {InferProps} from 'prop-types';
import {MapRef} from '@/components/Map.tsx';
import proj4 from 'proj4';
import {MarkerType} from '@/types/MarkerType.ts';
import {Marker} from '@/types/Marker.ts';
import {areaOptions} from '@/lib/utils.ts';
import {useEffect} from "react";
import {useHintFormBridge} from "@/hooks/hint-bridge.hook.ts";

const FormSchema = z.object({
    area: z.enum([...areaOptions.map((option) => option.value)] as [string, ...string[]]),
    time: z.string(),
    x: z.string().length(6),
    y: z.string().length(6),
});

export default function HintEntryCard({mapRef}: InferProps<typeof HintEntryCard.propTypes>) {
    const {coords, clear} = useHintFormBridge();
    const {markers, createMarker} = useMarkers();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            area: '',
            time: '',
            x: '',
            y: '',
        },
    });

    // Handle hint bridge
    useEffect(() => {
        if (coords) {
            form.setValue("x", coords.x, { shouldValidate: true, shouldDirty: true });
            form.setValue("y", coords.y, { shouldValidate: true, shouldDirty: true });
            clear();
        }
    }, [coords, clear, form]);

    /**
     * Get all available time options for the current area.
     * Filters out hints that are already in the database.
     * @returns The available time options
     */
    function getTimeOptions(): { value: string; label: string }[] {
        const startTime = new Date(import.meta.env.HUNT_START_TIME);
        const endTime = new Date(import.meta.env.HUNT_END_TIME);
        const currentTime = new Date();
        const adjustedEndTime = currentTime > endTime ? endTime : currentTime;

        const timeOptions: { value: string; label: string }[] = [];
        for (let i = startTime; i < adjustedEndTime; i.setHours(i.getHours() + 1)) {
            const formatted = i.toLocaleString('nl-NL', {weekday: 'long', hour: 'numeric'}) + ':00';
            timeOptions.push({value: i.toISOString(), label: formatted});
        }

        markers
            ?.filter((marker) => marker.area === form.watch('area'))
            .filter((marker) => marker.type === MarkerType.Hint)
            .forEach((marker) => {
                const markerTime = new Date(marker.time);
                const index = timeOptions.findIndex((option) => {
                    const optionTime = new Date(option.value);
                    return markerTime.getHours() === optionTime.getHours() && markerTime.getDate() === optionTime.getDate();
                });
                if (index !== -1) timeOptions.splice(index, 1);
            });

        return timeOptions;
    }

    const timeOptions = getTimeOptions();

    /**
     * When submitted, create a new marker.
     * Checks if the coördinates are valid.
     */
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        // Convert RD coordinates to WGS84
        const x = Number(data.x);
        const y = Number(data.y);
        const converted = proj4('RD', 'WGS84', [x, y]);
        if (converted[0] === undefined || converted[1] === undefined || x < 0 || x > 290000 || y < 290000 || y > 630000) {
            form.setError('x', {message: 'Ongeldige coördinaten'});
            form.setError('y', {message: 'Ongeldige coördinaten'});
            toast.error('Ongeldige coördinaten', {description: "Deze coördinaten zijn ongeldig. Controleer of de ingevoerde waarden correct zijn."});
            return;
        }

        const marker: Marker = {
            area: data.area,
            time: new Date(data.time),
            location: {
                type: 'Point',
                coordinates: [converted[0]!, converted[1]!],
            },
            type: MarkerType.Hint,
        };

        const result = await createMarker(marker);
        if (result) {
            form.reset();
            toast.success('Hint geregistreerd!', {
                description: 'De hint is succesvol geregistreerd.'
            });
            mapRef.current?.flyTo({
                center: [converted[0]!, converted[1]!],
                duration: 2000,
                zoom: 12,
            });
        } else {
            toast.error('Fout bij registreren hint.', {
                description: 'Er is een fout opgetreden bij het registreren van de hint.'
            });
        }
    }

    /**
     * Clear a field in the form.
     * @param key The key of the field to clear
     */
    function clearField(key: keyof z.infer<typeof FormSchema>) {
        form.setValue(key, '');
    }

    const formComponent = () => (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 w-full">
                        <FormField
                            control={form.control}
                            name="area"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Deelgebied</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}
                                            value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Kies deelgebied..."/>
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
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="time"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Tijdstip</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}
                                            value={field.value}>
                                        <FormControl>
                                            <SelectTrigger disabled={!form.watch('area')}>
                                                <SelectValue placeholder="Kies tijdstip..."/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-[280px]">
                                            {timeOptions.length > 0 ? (
                                                timeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="disabled" disabled>
                                                    (Nog) geen tijdstip te kiezen
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 items-end">
                            <FormField
                                control={form.control}
                                name="x"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>X-coördinaat</FormLabel>
                                        <FormControl>
                                            <InputOTP autoComplete="off" maxLength={6}
                                                      pattern={REGEXP_ONLY_DIGITS} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0}/>
                                                    <InputOTPSlot index={1}/>
                                                    <InputOTPSlot index={2}/>
                                                    <InputOTPSlot index={3}/>
                                                    <InputOTPSlot index={4}/>
                                                    <InputOTPSlot index={5}/>
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                variant="outline"
                                tabIndex={-1}
                                onClick={(e) => {
                                    e.preventDefault();
                                    clearField('x');
                                }}
                            >
                                <TrashIcon/>
                            </Button>
                        </div>
                        <div className="flex gap-2 items-end">
                            <FormField
                                control={form.control}
                                name="y"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Y-coördinaat</FormLabel>
                                        <FormControl>
                                            <InputOTP autoComplete="off" maxLength={6}
                                                      pattern={REGEXP_ONLY_DIGITS} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0}/>
                                                    <InputOTPSlot index={1}/>
                                                    <InputOTPSlot index={2}/>
                                                    <InputOTPSlot index={3}/>
                                                    <InputOTPSlot index={4}/>
                                                    <InputOTPSlot index={5}/>
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                variant="outline"
                                tabIndex={-1}
                                onClick={(e) => {
                                    e.preventDefault();
                                    clearField('y');
                                }}
                            >
                                <TrashIcon/>
                            </Button>
                        </div>
                    </div>
                    <Button type="submit" disabled={!form.formState.isValid}>
                        <Pin/> Registreren
                    </Button>
                </div>
            </form>
        </Form>
    );

    return (
        <>
            <Card collapsible={true} defaultOpen={true}>
                <CardHeader>
                    <CardTitle>Hint registreren</CardTitle>
                    <CardDescription>Plaats een marker op de kaart op basis van RD-grid coördinaten.</CardDescription>
                </CardHeader>
                <CardContent>{formComponent()}</CardContent>
            </Card>
        </>
    );
}

HintEntryCard.propTypes = {
    mapRef: PropTypes.object.isRequired as PropTypes.Validator<React.RefObject<MapRef>>,
};
