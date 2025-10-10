import {Outlet, useNavigate, useOutletContext} from 'react-router-dom';
import {toast} from "sonner"
import {RefObject, useEffect, useRef, useState} from 'react';
import {SWRConfig} from 'swr';
import Map, {MapRef} from './components/Map';
import PWAPrompt from 'react-ios-pwa-prompt';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import {User} from './types/User';
import ResetPassword from './components/ResetPassword';
import useSettingsStore from './stores/settings.store';

type ContextType = {
    mapRef: RefObject<MapRef>;
};

export default function Layout() {
    const navigate = useNavigate();
    const [errorShown, setErrorShown] = useState(false);
    const auth = useAuthUser<User>();
    const mapRef = useRef<MapRef>(null);
    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
    const {darkMode} = useSettingsStore();

    /**
     * Update the body class based on darkMode or system preference
     */
    useEffect(() => {
        const updateDarkMode = () => {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (darkMode === true || (darkMode === undefined && systemPrefersDark)) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        };

        // Update immediately
        updateDarkMode();

        // Listen for system preference changes when darkMode is null
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (darkMode === undefined) {
                updateDarkMode();
            }
        };

        if (darkMode === undefined) {
            mediaQuery.addEventListener('change', handleChange);
        }

        // Cleanup the event listener on unmount
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [darkMode]);

    /**
     * If reset password is required, open the dialog.
     */
    useEffect(() => {
        if (auth?.requiresPasswordChange) {
            setResetPasswordOpen(true);
        }
    }, [auth?.requiresPasswordChange]);

    function onSWRError(error: any) {
        if (error.response?.status === 401) {
            toast.info("Je sessie is verlopen.", {
                description: "Log opnieuw in om verder te gaan.",
                duration: Infinity
            })
            navigate('/login');
            return;
        }
        if (errorShown) return;
        setErrorShown(true);
        toast.error("Oeps! Er is iets misgegaan.", {
            duration: Infinity,
            description: 'Er is een fout opgetreden bij het ophalen van de data, probeer het later opnieuw. (Foutmelding: ' + error.message + ')'
        })
    }

    return (
        <SWRConfig value={{onError: onSWRError}}>
            <ResetPassword open={resetPasswordOpen} setIsOpen={setResetPasswordOpen} allowClose={false}/>
            <Outlet context={{mapRef} satisfies ContextType}/>
            <Map ref={mapRef}/>
            <PWAPrompt
                promptOnVisit={1}
                appIconPath="/icon_maskable.png"
                copyTitle="Installeer als app"
                copySubtitle="Jotihunt Tracker"
                copyDescription="Deze website kan als app geïnstalleerd worden. Volg de onderstaande instructies om deze app te installeren."
                copyShareStep='Druk op de "Deel" knop in de menubalk'
                copyAddToHomeScreenStep='Druk op "Zet op beginscherm"'
            />
        </SWRConfig>
    );
}

export function useOutlet() {
    return useOutletContext<ContextType>();
}
