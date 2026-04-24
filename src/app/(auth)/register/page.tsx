/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState }    from 'react';
import { useRouter }   from 'next/navigation';
import { useForm }     from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z }           from 'zod';
import { motion }      from 'framer-motion';
import {
  Loader2, Banknote, Eye, EyeOff,
  ArrowLeft, CheckCircle, User,
  Mail, Phone, CreditCard, Calendar, Lock,
} from 'lucide-react';
import Link  from 'next/link';
import { toast } from 'sonner';

import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Label }    from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { authService }   from '@/features/auth/services/auth.service';
import { cookieStorage } from '@/lib/cookies';
import { useAuthStore }  from '@/store/auth.store';
import Image from 'next/image';

const schema = z
  .object({
    firstName: z
      .string()
      .min(2, 'Mínimo 2 caracteres')
      .max(100)
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras'),
    lastName: z
      .string()
      .min(2, 'Mínimo 2 caracteres')
      .max(100)
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras'),
    dni: z
      .string()
      .regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos'),
    email: z
      .string()
      .email('Correo electrónico inválido')
      .max(255),
    phone: z
      .string()
      .min(7, 'Teléfono inválido')
      .max(20),
    dateOfBirth: z
      .string()
      .min(1, 'La fecha de nacimiento es requerida')
      .refine((d) => {
        const age = new Date().getFullYear() - new Date(d).getFullYear();
        return age >= 18;
      }, 'Debes tener al menos 18 años'),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'Debe tener mayúscula, minúscula y número',
      ),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message:  'Las contraseñas no coinciden',
    path:     ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof schema>;

// Pasos del formulario
const STEPS = [
  { id: 1, label: 'Datos personales' },
  { id: 2, label: 'Contacto'         },
  { id: 3, label: 'Seguridad'        },
];

export default function RegisterPage() {
  const router  = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [step,        setStep]        = useState(1);
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema) as any,
    mode:     'onChange',
  });

  // Avanzar paso con validación parcial
  const nextStep = async () => {
    let fields: (keyof RegisterForm)[] = [];

    if (step === 1) fields = ['firstName', 'lastName', 'dni', 'dateOfBirth'];
    if (step === 2) fields = ['email', 'phone'];

    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      // 1. PRIMERO: Registrar al usuario
      console.log('📝 Registrando usuario...');
      const registerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            dni: data.dni.trim(),
            email: data.email.toLowerCase().trim(),
            phone: data.phone.trim(),
            dateOfBirth: data.dateOfBirth,
            password: data.password,
          }),
        }
      );

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        // Manejar errores específicos del backend
        if (registerResponse.status === 409) {
          throw new Error('El correo o DNI ya está registrado');
        }
        throw new Error(errorData.message || 'Error al registrarse');
      }

      const registerData = await registerResponse.json();
      console.log('✅ Registro exitoso:', registerData);

      // 2. SEGUNDO: Iniciar sesión automáticamente
      console.log('🔐 Iniciando sesión...');
      const tokens = await authService.login({
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      // 3. Guardar tokens en cookies
      cookieStorage.setTokens(tokens.accessToken, tokens.refreshToken);

      // 4. Obtener perfil del usuario
      const user = await authService.me();
      setUser(user);
      cookieStorage.setRole(user.role);

      toast.success(`¡Bienvenido, ${user.firstName}! Tu cuenta fue creada.`);

      // 5. Redirigir al dashboard
      setTimeout(() => {
        router.push('/mis-prestamos');
        router.refresh();
      }, 100);
    } catch (error: any) {
      console.error('❌ Error detallado:', error);
      toast.error(error?.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <Card className="border border-border/50 shadow-xl rounded-2xl">
        <CardHeader className="space-y-4 pb-4">
          {/* Logo */}
          <div className="flex items-center justify-center py-2">
  <Image
    src="/logo.png"
    alt="Avante Microfinanzas"
    width={200}
    height={70}
    className="object-contain block dark:hidden"
    priority
  />
  <Image
    src="/logo-dark.png"
    alt="Avante Microfinanzas"
    width={200}
    height={70}
    className="object-contain hidden dark:block brightness-0 invert"
    priority
  />
</div>

          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold">
              Crear cuenta
            </CardTitle>
            <CardDescription>
              Solicita tu préstamo en minutos
            </CardDescription>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-all ${
                  step > s.id
                    ? 'bg-emerald-500 text-white'
                    : step === s.id
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step > s.id
                    ? <CheckCircle className="h-4 w-4" />
                    : s.id}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  step === s.id
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-6 transition-all ${
                    step > s.id ? 'bg-emerald-500' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* ─── PASO 1: Datos personales ─────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      Nombre(s)
                    </Label>
                    <Input
                      placeholder="Juan"
                      className="h-10 rounded-xl"
                      {...register('firstName')}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Apellidos</Label>
                    <Input
                      placeholder="Pérez García"
                      className="h-10 rounded-xl"
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                    DNI (8 dígitos)
                  </Label>
                  <Input
                    placeholder="12345678"
                    maxLength={8}
                    className="h-10 rounded-xl"
                    {...register('dni')}
                  />
                  {errors.dni && (
                    <p className="text-xs text-destructive">
                      {errors.dni.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Fecha de nacimiento
                  </Label>
                  <Input
                    type="date"
                    className="h-10 rounded-xl"
                    max={new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18),
                    )
                      .toISOString()
                      .split('T')[0]}
                    {...register('dateOfBirth')}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs text-destructive">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full h-11 rounded-xl font-semibold"
                >
                  Continuar →
                </Button>
              </motion.div>
            )}

            {/* ─── PASO 2: Contacto ─────────────────────────── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    Correo electrónico
                  </Label>
                  <Input
                    type="email"
                    placeholder="juan@email.com"
                    className="h-10 rounded-xl"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    Teléfono
                  </Label>
                  <Input
                    placeholder="+51987654321"
                    className="h-10 rounded-xl"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-11 rounded-xl"
                  >
                    ← Atrás
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 h-11 rounded-xl font-semibold"
                  >
                    Continuar →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ─── PASO 3: Seguridad ────────────────────────── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      className="h-10 rounded-xl pr-10"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPass
                        ? <EyeOff className="h-4 w-4" />
                        : <Eye    className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    Debe incluir mayúscula, minúscula y número
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repite tu contraseña"
                      className="h-10 rounded-xl pr-10"
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm
                        ? <EyeOff className="h-4 w-4" />
                        : <Eye    className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Términos */}
                <p className="text-[11px] text-muted-foreground text-center">
                  Al registrarte aceptas nuestros{' '}
                  <span className="text-primary font-medium">
                    Términos de servicio
                  </span>{' '}
                  y{' '}
                  <span className="text-primary font-medium">
                    Política de privacidad
                  </span>
                </p>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="flex-1 h-11 rounded-xl"
                  >
                    ← Atrás
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-11 rounded-xl font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      'Crear cuenta'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Enlace a login */}
          <div className="text-center mt-5">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
