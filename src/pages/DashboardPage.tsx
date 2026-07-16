import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import {Home, Info, Mail, Search} from "lucide-react";
import useAuth from "@/hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import FireAnimation from "@/components/FireAnimation.tsx";
import {useEffect, useState} from "react";
import type {House, Roommate} from "@/types";
import {getMyHouse} from "@/api/houseApi.ts";
import {getActiveRoommates} from "@/api/roommateApi.ts";
import {useTranslation} from "react-i18next";
import {Link} from "react-router";
import AiReportCard from "@/components/AiReportCard.tsx";
import {usePushNotifications} from "@/hooks/usePushNotifications.ts";

const DashboardPage = () => {
    const { houseId, refreshAuth } = useAuth();
    const { t} = useTranslation();
    const navigate = useNavigate();

    const [house, setHouse] = useState<House | null>(null);
    const [roommates, setRoommates] = useState<Roommate[]>([]);

    const { requestPushPermission } = usePushNotifications();

    // Always re-check houseId on mount. AuthContext can be stale if it was
    // updated elsewhere (e.g. accepting an invitation) before navigating away
    // and back to this page.
    useEffect(() => {
        refreshAuth();
    }, []);

    // Request push notification permission once after login.
    // The browser remembers the user's choice. if already granted or denied,
    // it won't show the prompt again. Only triggers on first visit.
    useEffect(() => {
        requestPushPermission();
    }, []);

    useEffect(() => {
        if (!houseId) return;
        Promise.all([getMyHouse(), getActiveRoommates()])
            .then(([h, r]) => { setHouse(h); setRoommates(r); })
            .catch(() => {});
    }, [houseId]);

    return (
        <>
            <Header />
            <div
                className ="relative h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{backgroundImage: "url('/room.jpg')" }}>

                {/* Flame overlay */}
                {/* mobile: tuned for narrow screens */}
                <div className="md:hidden">
                    <FireAnimation bottom="28%" left="35%" />
                </div>
                {/* desktop: original position */}
                <div className="hidden md:block">
                    <FireAnimation bottom="29%" left="49%" />
                </div>

                {/*Mirror info*/}
                {houseId !== null && house && (
                    <div
                        className="absolute text-center"
                        style={{ bottom: '72%', left: '50%', transform: 'translateX(-50%)' }}>
                        <div className="bg-transparent rounded-xl py-1 text-white min-w-[180px] text-center">
                            <p className="font-bold text-gray-600 text-xs">{house.address}</p>
                            <p className="text-xs text-gray-600">{house.areaName} - {house.cityName}</p>
                            <div className="  text-xs text-green-700/80 flex flex-col gap-0.5">
                                <div className="border-t border-blue-800/40 w-26 ml-8" />
                                {/*<div>Roommates :</div>*/}
                                {roommates.map(r => (
                                    <span key={r.id}>{r.firstname} {r.lastname},
                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/*AI Report*/}
                {houseId !== null && (
                    <div className="absolute text-center" style={{ top: '30.5%', left: '50%', transform: 'translateX(-50%)' }}>
                        <AiReportCard houseId={houseId} />
                    </div>
                )}

                {houseId === null && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center gap-4 min-w-[300px]">
                            <h2 className="text-blue-600 text-xl font-bold">{t('youAreNotInAHouseYet')}</h2>
                            <p className="text-blue-800/70 text-sm text-center">{t('createANewHouseOrWaitForAnInvitation')}</p>
                            <Button
                                id="create-house-btn"
                                onClick={() => navigate("/house/create")}
                                className="w-full"
                            >
                                <Home size={18} />
                                <p>{t('createHouse')}</p>
                            </Button>
                            <Button
                                id="search-houses-btn"
                                variant="outline"
                                onClick={() => navigate("/houses/search")}
                                className="w-full"
                            >
                                <Search size={18} />
                                {t('findAHouse')}
                            </Button>

                            <Button
                                id="invitations-btn"
                                variant="outline"
                                onClick={() => navigate("/invitations")}
                                className="w-full"
                            >
                                <Mail size={18} />
                                {t('viewInvitations')}
                            </Button>
                            {/* Onboarding guide - shown only while the user has no house */}
                            <div className="border-t border-white/30 pt-4 mt-1 w-full">
                                <p className="text-blue-800/80 text-xs font-semibold mb-2">{t('howItWorks')}</p>
                                <ul className="text-blue-800/70 text-xs flex flex-col gap-2">
                                    <li className="flex items-start gap-2">
                                        <Home size={14} className="mt-0.5 shrink-0" />
                                        <span>{t('guideCreateHouse')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Search size={14} className="mt-0.5 shrink-0" />
                                        <span>{t('guideFindHouse')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Mail size={14} className="mt-0.5 shrink-0" />
                                        <span>{t('guideInvitations')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Info size={14} className="mt-0.5 shrink-0"/>
                                        <Link to={"/instructions"} className="hover:text-gray-800">{t('instructions')}</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
};
export default DashboardPage;