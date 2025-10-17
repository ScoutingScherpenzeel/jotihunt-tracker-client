import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from "@/components/ui/input-group.tsx";
import PropTypes, {InferProps} from "prop-types";
import * as React from "react";
import {MapRef} from "@/components/Map.tsx";
import proj4 from "proj4";
import {useState} from "react";
import {toast} from "sonner";
import {LngLat} from "mapbox-gl";
import {cn} from "@/lib/utils.ts";

type Parsed = { lng: number; lat: number };

export default function CoordinatesCard({ mapRef }: InferProps<typeof CoordinatesCard.propTypes>) {

    const [inputValue, setInputValue] = useState("");
    const [hasError, setHasError] = useState(false);

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    /**
     * Parse a single DMS token like:
     * - "52°22'30\"N"
     * - "4 53 0 E"
     * - "52.5N"
     * - "4°53'E"
     * Returns decimal degrees (signed) or null.
     */
    function parseDMS(token: string, isLatGuess?: boolean): number | null {
        const s = token
            .trim()
            .replace(/[^\d.,NSEW\-+°'″" ]/gi, " ") // strip weird chars, keep N/E/S/W and DMS marks
            .replace(/[″"]/g, '"')
            .replace(/[’']/g, "'")
            .replace(/\s+/g, " ");

        const hemiMatch = s.match(/[NSEW]/i);
        const hemi = hemiMatch ? hemiMatch[0].toUpperCase() : undefined;

        // Replace decimal comma with dot only when no dot exists
        const norm = s
            .replace(/(\d),(\d)/g, (_m, a, b) => `${a}.${b}`);

        // Extract numbers (deg, min, sec) in order
        const nums = (norm.match(/[-+]?\d+(?:\.\d+)?/g) || []).map(Number);
        if (nums.length === 0) return null;

        const deg = nums[0];
        const min = nums.length > 1 ? nums[1] : 0;
        const sec = nums.length > 2 ? nums[2] : 0;

        // If it's already decimal degrees (only 1 number), accept it
        let dec = Math.abs(deg) + Math.abs(min) / 60 + Math.abs(sec) / 3600;

        // Sign by hemisphere or original sign
        if (hemi === "S" || hemi === "W") dec = -dec;
        if (!hemi && deg < 0) dec = -dec;

        // Basic sanity clamp
        const maxAbs = isLatGuess ? 90 : 180;
        if (Math.abs(dec) > maxAbs) return null;

        return dec;
    }

    /**
     * Try to parse two DMS-ish tokens into lat/lng (order-agnostic via hemisphere).
     * If hemisphere letters exist, uses them; otherwise falls back to guess order: lat first, then lon.
     */
    function tryParseDMSPair(a: string, b: string): Parsed | null {
        const hasHemiA = /[NSEW]/i.test(a);
        const hasHemiB = /[NSEW]/i.test(b);

        const candAasLat = parseDMS(a, true);
        const candBasLng = parseDMS(b, false);
        const candAasLng = parseDMS(a, false);
        const candBasLat = parseDMS(b, true);

        // If hemispheres guide the order, prefer that
        if (hasHemiA || hasHemiB) {
            const aLat = /[NS]/i.test(a);
            const bLat = /[NS]/i.test(b);
            if (aLat && candAasLat != null && candBasLng != null) return { lat: candAasLat, lng: candBasLng };
            if (bLat && candBasLat != null && candAasLng != null) return { lat: candBasLat, lng: candAasLng };
        }

        // Fallback: assume a=lat, b=lng
        if (candAasLat != null && candBasLng != null) return { lat: candAasLat, lng: candBasLng };
        // Or a=lng, b=lat
        if (candAasLng != null && candBasLat != null) return { lat: candBasLat, lng: candAasLng };

        return null;
    }

    /**
     * Heuristic to detect RD (Rijksdriehoek) pair.
     * Typical NL ranges (rough, inclusive):
     *   X (Easting):  0 .. 300000 (common: ~50k..280k)
     *   Y (Northing): 300000 .. 620000 (common: ~300k..620k)
     * We’ll be lenient but still avoid false positives with lon/lat.
     */
    function looksLikeRD(x: number, y: number): boolean {
        if (!Number.isFinite(x) || !Number.isFinite(y)) return false;

        // Very rough guard: both are meters (no decimals is common, but allow decimals)
        const bothLarge = Math.abs(x) > 10000 && Math.abs(y) > 10000;

        // Typical box with some slack
        const xInRange = x >= -5000 && x <= 400000;
        const yInRange = y >= 250000 && y <= 700000;

        return bothLarge && xInRange && yInRange;
    }

    /**
     * Normalize a free-text coordinate string into two tokens that we can parse.
     * - Handles decimal commas
     * - Accepts separators: space, comma, semicolon, slash, pipe
     * - Keeps N/E/S/W and DMS marks
     */
    function tokenizePair(input: string): string[] {
        // First, convert decimal commas inside numbers to dots
        let s = input.replace(/(\d),(\d)/g, (_m, a, b) => `${a}.${b}`);

        // Replace the remaining separators with spaces
        s = s.replace(/[;|/]+/g, " ");
        // Keep commas as separators now
        s = s.replace(/,/g, " ");

        // Squash repeated whitespace
        s = s.replace(/\s+/g, " ").trim();

        // Try to split into two main tokens (best effort): split on first big gap
        // For DMS with spaces, we’ll try to find a split near the middle by E/W/N/S presence
        const parts = s.split(" ");

        // Heuristic: if we can detect two sides by presence of N/E/S/W, split there
        const idx = parts.findIndex(p => /[NSEW]$/i.test(p) || /^[NSEW]/i.test(p));
        if (idx > 0 && idx < parts.length - 1) {
            const left = parts.slice(0, idx + 1).join(" ");
            const right = parts.slice(idx + 1).join(" ");
            return [left, right];
        }

        // Otherwise, split into two halves by count
        if (parts.length >= 2) {
            const mid = Math.floor(parts.length / 2);
            return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
        }

        return [s]; // single token (bad), but we’ll handle later
    }

    /**
     * Parse a user input string into WGS84 {lng, lat}.
     * Supports:
     * - WGS84 decimal: "52.123 4.321", "52,123; 4,321", "N52.1 E4.3", "4.3, 52.1" (auto order)
     * - WGS84 DMS: "52°22'30\"N 4°53'0\"E", "52 22 30 N, 4 53 0 E"
     * - RD: "155000 463000", "155000,463000", etc.
     */
    function parseToWGS84(input: string): { lng: number; lat: number } | null {
        if (!input || !input.trim()) return null;

        const tokens = tokenizePair(input);

        // 1) DMS attempt
        if (tokens.length >= 2 && /[°'″"NSEW]/i.test(input)) {
            const dms = tryParseDMSPair(tokens[0], tokens[1]);
            if (dms) return { lng: dms.lng, lat: dms.lat };
        }

        // 2) Decimal / RD attempt
        const numeric = input
            .replace(/(\d),(\d)/g, (_m, a, b) => `${a}.${b}`)
            .replace(/[^\d.\-+ ,;|/]/g, " ");

        const nums = (numeric.match(/[-+]?\d+(?:\.\d+)?/g) || []).map(Number);
        if (nums.length < 2) return null;

        const a = nums[0];
        const b = nums[1];

        const isLatLonAB = Math.abs(a) <= 90 && Math.abs(b) <= 180;
        const isLonLatAB = Math.abs(a) <= 180 && Math.abs(b) <= 90;

        // --- Prefer typical user order: lat lon ---
        if (isLatLonAB && !isLonLatAB) return { lng: b, lat: a };
        if (!isLatLonAB && isLonLatAB) return { lng: a, lat: b };

        if (isLatLonAB && isLonLatAB) {
            // NL-friendly hint: if a looks like NL latitude (~50..54) and b like NL longitude (~3..7)
            const looksNL = a >= 48 && a <= 55 && b >= -8 && b <= 15;
            if (looksNL) return { lng: b, lat: a }; // lat lon

            // Generic default when both could be true: assume lat lon
            return { lng: b, lat: a };
        }

        // RD detection: [x, y] in meters
        if (looksLikeRD(a, b)) {
            try {
                const [lng, lat] = proj4("RD", "WGS84", [a, b]);
                return { lng: clamp(lng, -180, 180), lat: clamp(lat, -90, 90) };
            } catch { /* ignore */ }
        }

        if ((Number.isFinite(a) && Number.isFinite(b)) && (Math.abs(a) > 10000 && Math.abs(b) > 10000)) {
            try {
                const [lng, lat] = proj4("RD", "WGS84", [a, b]);
                return { lng: clamp(lng, -180, 180), lat: clamp(lat, -90, 90) };
            } catch { /* ignore */ }
        }

        // Last-chance sanity
        if (Math.abs(a) <= 90 && Math.abs(b) <= 180) return { lng: b, lat: a }; // lat lon
        if (Math.abs(a) <= 180 && Math.abs(b) <= 90) return { lng: a, lat: b }; // lon lat

        return null;
    }

    /**
     * Check of een WGS84-coördinaat binnen Nederland ligt
     * */
    function isInNetherlands(lat: number, lng: number): boolean {
        // Ruime bounding box om heel NL inclusief Waddeneilanden te dekken
        return lat >= 50.6 && lat <= 53.7 && lng >= 3.2 && lng <= 7.3;
    }

    function goToInput( raw: string) {
        if(raw == "") return;

        const result = parseToWGS84(raw);
        if (!result) {
            toast.error("Kon de coördinaat niet herkennen. Probeer een ander formaat.");
            setHasError(true);
            return;
        }

        const { lng, lat } = result;
        if (!isInNetherlands(lat, lng))  {
            toast.error("De opgegeven coördinaat ligt buiten Nederland.");
            setHasError(true);
            return;
        }

        mapRef.current?.flyTo({
            center: [lng, lat],
            zoom: 14,
            essential: true,
        });

        mapRef.current?.markPoint({ lng, lat } as LngLat);
        setHasError(false);
    }

    function onInput(event: React.FormEvent<HTMLInputElement>) {
        const value = event.currentTarget.value;
        if(value == "") setHasError(false);
        setInputValue(value);
    }

    return (<>
        <div className={"bg-background rounded-lg"}>
            <InputGroup className={cn("h-10", hasError && "border-red-500")}>
                <InputGroupInput placeholder="Zoek op coördinaat..."  onInput={onInput} value={inputValue} />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton variant="secondary" onClick={() => goToInput(inputValue)}>Bekijk</InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    </>);
}

CoordinatesCard.propTypes = {
    mapRef: PropTypes.object.isRequired as PropTypes.Validator<React.RefObject<MapRef>>,
};
