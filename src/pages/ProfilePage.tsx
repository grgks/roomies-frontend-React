import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { syncCreateUser } from '@/api/userApi';
import { createCurrentRoommate } from '@/api/roommateApi';
import { Gender } from '@/types/enums';
import useAuth from "@/hooks/useAuth.ts";
import FormField from "@/components/FormField.tsx";
import {useTranslation} from "react-i18next";
import usePageTitle from "@/hooks/usePageTitle.ts";
import keycloak from "@/services/keycloakService.ts";

const createCompleteProfileSchema = (t: (key: string) => string) => z.object({
    phoneNumber: z.string().regex(/^[0-9]{10}$/, t('phoneNumberMustBe10Digits')),
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    gender: z.enum(Object.values(Gender) as [string, ...string[]], { error: t('selectGender') }),});

type CompleteProfileForm = z.infer<ReturnType<typeof createCompleteProfileSchema>>;

const ProfilePage = () => {

    const{ t } = useTranslation();
    const navigate = useNavigate();

    const CompleteProfileSchema = createCompleteProfileSchema(t);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CompleteProfileForm>({
        resolver: zodResolver(CompleteProfileSchema),
        defaultValues: {
            firstname: keycloak.tokenParsed?.given_name ?? '',
            lastname: keycloak.tokenParsed?.family_name ?? '',
        },
    });

    const { refreshAuth } = useAuth();

    const onSubmit = async (data: CompleteProfileForm) => {
        try {
            // 1. Create User in DB. ignore 409 (already exists)
            try{
                await syncCreateUser({phoneNumber: data.phoneNumber});
            } catch {
                // 409 = user already exists.  continue
            }

            // 2. Create Roommate
            await createCurrentRoommate({
                firstname: data.firstname,
                lastname: data.lastname,
                gender: data.gender,
            });

            // 3. Redirect to dashboard
            await refreshAuth();    // update hasRoommate -> true
            navigate('/setup-search-profile');
        } catch (error) {
            //console.error('Profile setup failed:', error);
        }
    };

    usePageTitle(t('completeProfile'))

    return (
        <div
            className="h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: "url('/room.jpg')" }}
        >
            <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-10 flex flex-col gap-6 min-w-[380px]">
                <h1 className="text-violet-500 text-2xl font-bold text-center">{t('completeYourProfile')}</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* Phone Number */}
                    <FormField label={t('phoneNumber')} error={errors.phoneNumber?.message} labelClassName="text-violet-500 text-sm">
                        <input {...register('phoneNumber')} placeholder="6912345678"
                               className="bg-white/30 text-violet-500 placeholder-violet/50 rounded-lg px-4 py-2 outline-none border border-white/30 focus:border-white" />
                    </FormField>

                    {/* First Name; read-only, from Keycloak */}
                    <FormField label={t('firstname')} labelClassName="text-violet-500 text-sm">
                        <input {...register('firstname')} disabled
                               className="bg-white/10 text-violet-500 rounded-lg px-4 py-2 outline-none border border-white/30 cursor-not-allowed opacity-70" />
                    </FormField>

                    {/* Last Name; read-only, from Keycloak */}
                    <FormField label={t('lastname')} labelClassName="text-violet-500 text-sm">
                        <input {...register('lastname')} disabled
                               className="bg-white/10 text-violet-500 rounded-lg px-4 py-2 outline-none border border-white/30 cursor-not-allowed opacity-70" />
                    </FormField>

                    {/* Gender */}
                    <FormField label={t('gender')} error={errors.gender?.message} labelClassName="text-violet-500 text-sm">
                        <select {...register('gender')}
                                className="bg-white/20 text-violet/50 rounded-lg px-4 py-2 outline-none border border-white/30 focus:border-white">
                            <option value="" className="text-black">{t('selectGender')}</option>
                            {Object.values(Gender).map(g => (
                                <option key={g} value={g} className="text-black">{t(g)}</option>
                            ))}
                        </select>
                    </FormField>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                    >
                        {isSubmitting ? t('saving') : t('completeProfile')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;